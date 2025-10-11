import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Yollar
const distDir = path.join(__dirname, "dist");
const publicDir = path.join(__dirname, "public");

// OS'e göre kalıcı veri dizini
function getDefaultDataRoot() {
  if (process.env.LB_DATA_DIR && process.env.LB_DATA_DIR.trim()) {
    return process.env.LB_DATA_DIR;
  }
  const home = os.homedir();
  if (process.platform === "darwin") {
    return path.join(home, "Library", "Application Support", "LoveliedBoard");
  }
  if (process.platform === "win32") {
    const appData = process.env.APPDATA || path.join(home, "AppData", "Roaming");
    return path.join(appData, "LoveliedBoard");
  }
  const xdg = process.env.XDG_DATA_HOME || path.join(home, ".local", "share");
  return path.join(xdg, "lovelied-board");
}

const dataRoot = getDefaultDataRoot();
const userDataDir = path.join(dataRoot, "user-data");
const mediaDir = path.join(userDataDir, "media");
const boardJsonPath = path.join(userDataDir, "board.json");

// Klasörleri oluştur
const ensureDirs = () => {
  if (!fs.existsSync(dataRoot)) fs.mkdirSync(dataRoot, { recursive: true });
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });
};

// Eski konumdan (repo içi) verileri bir defaya mahsus taşı
const migrateLegacyDataIfNeeded = () => {
  try {
    const legacyDir = path.join(publicDir, "user-data");
    if (!fs.existsSync(legacyDir)) return;
    const legacyBoard = path.join(legacyDir, "board.json");
    const legacyMedia = path.join(legacyDir, "media");

    ensureDirs();

    // board.json taşı (hedef yoksa)
    if (fs.existsSync(legacyBoard) && !fs.existsSync(boardJsonPath)) {
      const json = fs.readFileSync(legacyBoard, "utf-8");
      fs.writeFileSync(boardJsonPath, json, "utf-8");
    }

    // media klasörünü kopyala (yalnızca yeni dosyalar)
    if (fs.existsSync(legacyMedia)) {
      const files = fs.readdirSync(legacyMedia);
      for (const f of files) {
        const src = path.join(legacyMedia, f);
        const dst = path.join(mediaDir, f);
        try {
          if (fs.statSync(src).isFile() && !fs.existsSync(dst)) {
            fs.copyFileSync(src, dst);
          }
        } catch {}
      }
    }
  } catch (e) {
    console.warn("Legacy user-data migration failed", e);
  }
};

ensureDirs();
migrateLegacyDataIfNeeded();

// API: GET /api/board -> board.json oku
app.get("/api/board", (req, res) => {
  try {
    ensureDirs();
    if (!fs.existsSync(boardJsonPath)) {
      // default-board.json'dan tohumla; yoksa boş şablon kullan
      const seedPath = path.join(__dirname, "default-board.json");
      if (fs.existsSync(seedPath)) {
        const seed = fs.readFileSync(seedPath, "utf-8");
        fs.writeFileSync(boardJsonPath, seed, "utf-8");
      } else {
        const initial = {
          slides: [],
          duty: { date: new Date().toISOString().split("T")[0], teachers: [], students: [] },
          birthdays: [],
          countdowns: [],
          marqueeTexts: [],
          config: { schoolName: "", timezone: "Europe/Istanbul", primaryColor: "", secondaryColor: "" },
          quotes: [],
          bellSchedule: [],
          daySchedules: []
        };
        fs.writeFileSync(boardJsonPath, JSON.stringify(initial, null, 2), "utf-8");
      }
    }
    const json = fs.readFileSync(boardJsonPath, "utf-8");
    res.setHeader("Content-Type", "application/json");
    res.send(json);
  } catch (e) {
    console.error("Error reading board.json:", e);
    res.status(500).json({ error: "Failed to read board.json" });
  }
});

// API: PUT /api/board -> board.json yaz
app.put("/api/board", (req, res) => {
  try {
    ensureDirs();
    const body = JSON.stringify(req.body, null, 2);
    fs.writeFileSync(boardJsonPath, body, "utf-8");
    res.json({ ok: true });
  } catch (e) {
    console.error("Error writing board.json:", e);
    res.status(500).json({ error: "Failed to write board.json" });
  }
});

// API: POST /api/upload -> medya dosyası yükle
app.post("/api/upload", (req, res) => {
  try {
    ensureDirs();
    const { dataUrl, suggestedName } = req.body;
    
    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
      return res.status(400).json({ error: "Missing or invalid dataUrl" });
    }
    
    const match = /^data:(.*?);base64,(.*)$/.exec(dataUrl);
    if (!match) {
      return res.status(400).json({ error: "Invalid dataUrl format" });
    }
    
    const mime = match[1];
    const base64 = match[2];
    const buffer = Buffer.from(base64, "base64");
    const ext = mime.split("/")[1] || "bin";
    const safeNameBase = (suggestedName || `media_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${safeNameBase}.${ext}`;
    const filePath = path.join(mediaDir, filename);
    
    fs.writeFileSync(filePath, buffer);
    const url = `/user-data/media/${filename}`;
    
    res.json({ url });
  } catch (e) {
    console.error("Error uploading file:", e);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// Statik dosyalar: /user-data/media/*
app.use("/user-data/media", express.static(mediaDir));

// Production build dosyalarını sun
app.use(express.static(distDir));

// SPA için tüm route'ları index.html'e yönlendir
// API route'ları hariç tüm GET istekleri için fallback
app.use((req, res, next) => {
  // API istekleri için next
  if (req.path.startsWith("/api/")) {
    return next();
  }
  // SPA routing için index.html'i gönder
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server çalışıyor: http://localhost:${PORT}`);
  console.log(`📁 Kullanıcı verileri: ${userDataDir}`);
  console.log(`🖼️  Medya klasörü: ${mediaDir}`);
});

