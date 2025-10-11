import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Dosya tabanlı mini API ve statik görüntü servisi
    configureServer(server) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const root = __dirname;
      const userDataDir = path.join(root, "user-data");
      const imagesDir = path.join(userDataDir, "images");
      const boardJsonPath = path.join(userDataDir, "board.json");

      const ensureDirs = () => {
        if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });
        if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
      };

      ensureDirs();

      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();

        // Statik: /user-data/images/* dosyalarını sun
        if (req.method === "GET" && req.url.startsWith("/user-data/images/")) {
          const rel = req.url.replace("/user-data/images/", "");
          const filePath = path.join(imagesDir, rel);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            fs.createReadStream(filePath).pipe(res);
            return;
          }
          res.statusCode = 404;
          res.end("Not found");
          return;
        }

        // API: GET /api/board -> board.json oku (yoksa boş şablon oluştur)
        if (req.method === "GET" && req.url === "/api/board") {
          try {
            ensureDirs();
            if (!fs.existsSync(boardJsonPath)) {
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
            const json = fs.readFileSync(boardJsonPath, "utf-8");
            res.setHeader("Content-Type", "application/json");
            res.end(json);
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to read board.json" }));
          }
          return;
        }

        // API: PUT /api/board -> board.json yaz
        if (req.method === "PUT" && req.url === "/api/board") {
          try {
            ensureDirs();
            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", () => {
              try {
                JSON.parse(body);
              } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                return;
              }
              fs.writeFileSync(boardJsonPath, body, "utf-8");
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            });
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to write board.json" }));
          }
          return;
        }

        // API: POST /api/upload -> { dataUrl, suggestedName } al, dosyaya yaz, url döndür
        if (req.method === "POST" && req.url === "/api/upload") {
          try {
            ensureDirs();
            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", () => {
              try {
                const parsed = JSON.parse(body || "{}");
                const dataUrl: string = parsed.dataUrl;
                const suggestedName: string | undefined = parsed.suggestedName;
                if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: "Missing or invalid dataUrl" }));
                  return;
                }
                const match = /^data:(.*?);base64,(.*)$/.exec(dataUrl);
                if (!match) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: "Invalid dataUrl" }));
                  return;
                }
                const mime = match[1];
                const base64 = match[2];
                const buffer = Buffer.from(base64, "base64");
                const ext = mime.split("/")[1] || "bin";
                const safeNameBase = (suggestedName || `media_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, "_");
                const filename = `${safeNameBase}.${ext}`;
                const filePath = path.join(imagesDir, filename);
                fs.writeFileSync(filePath, buffer);
                const url = `/user-data/images/${filename}`;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ url }));
              } catch (err) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Invalid request body" }));
              }
            });
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to upload file" }));
          }
          return;
        }

        return next();
      });
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
