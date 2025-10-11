import { app, BrowserWindow, Menu, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import express from 'express';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow; // Board görünümü
let adminWindow; // Admin paneli
let serverApp;
let server;

const userDataDir = path.join(app.getPath('userData'), 'user-data');
const imagesDir = path.join(userDataDir, 'images');
const boardJsonPath = path.join(userDataDir, 'board.json');

function ensureDirs() {
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
}

function createBoardWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'Lovelied Board - Pano',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
  });

  // Load the board view
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8083/');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createAdminWindow() {
  adminWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Lovelied Board - Admin Panel',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
  });

  // Load the admin panel
  if (process.env.NODE_ENV === 'development') {
    adminWindow.loadURL('http://localhost:8083/admin');
    adminWindow.webContents.openDevTools();
  } else {
    adminWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: 'admin' });
  }

  adminWindow.on('closed', () => {
    adminWindow = null;
  });
}

function createMenu() {
  const template = [
    {
      label: 'Pencere',
      submenu: [
        {
          label: 'Pano Görünümü',
          accelerator: 'CmdOrCtrl+1',
          click: () => {
            if (mainWindow) {
              mainWindow.focus();
            } else {
              createBoardWindow();
            }
          }
        },
        {
          label: 'Admin Paneli',
          accelerator: 'CmdOrCtrl+2',
          click: () => {
            if (adminWindow) {
              adminWindow.focus();
            } else {
              createAdminWindow();
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Yenile',
          accelerator: 'CmdOrCtrl+R',
          click: (item, focusedWindow) => {
            if (focusedWindow) focusedWindow.reload();
          }
        },
        {
          label: 'Geliştirici Araçları',
          accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
          click: (item, focusedWindow) => {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools();
          }
        }
      ]
    },
    {
      label: 'Yardım',
      submenu: [
        {
          label: 'Hakkında',
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: 'Lovelied Board',
              message: 'Lovelied Board v1.0.0',
              detail: 'Dijital okul panosu uygulaması'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function startLocalServer() {
  ensureDirs();

  serverApp = express();
  serverApp.use(express.json({ limit: '50mb' }));
  serverApp.use(express.static(path.join(__dirname, '../dist')));

  // Serve images
  serverApp.use('/user-data/images', express.static(imagesDir));

  // GET /api/board
  serverApp.get('/api/board', (req, res) => {
    try {
      if (!fs.existsSync(boardJsonPath)) {
        const initial = {
          slides: [],
          duty: { date: new Date().toISOString().split('T')[0], teachers: [], students: [] },
          birthdays: [],
          countdowns: [],
          marqueeTexts: [],
          config: { schoolName: '', timezone: 'Europe/Istanbul', primaryColor: '', secondaryColor: '' },
          quotes: [],
          bellSchedule: [],
          daySchedules: [],
        };
        fs.writeFileSync(boardJsonPath, JSON.stringify(initial, null, 2), 'utf-8');
      }
      const json = fs.readFileSync(boardJsonPath, 'utf-8');
      res.setHeader('Content-Type', 'application/json');
      res.send(json);
    } catch (e) {
      res.status(500).json({ error: 'Failed to read board.json' });
    }
  });

  // PUT /api/board
  serverApp.put('/api/board', (req, res) => {
    try {
      const body = JSON.stringify(req.body, null, 2);
      fs.writeFileSync(boardJsonPath, body, 'utf-8');
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to write board.json' });
    }
  });

  // POST /api/upload
  serverApp.post('/api/upload', (req, res) => {
    try {
      const { dataUrl, suggestedName } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
        return res.status(400).json({ error: 'Missing or invalid dataUrl' });
      }
      const match = /^data:(.*?);base64,(.*)$/.exec(dataUrl);
      if (!match) return res.status(400).json({ error: 'Invalid dataUrl' });
      const mime = match[1];
      const base64 = match[2];
      const buffer = Buffer.from(base64, 'base64');
      const ext = mime.split('/')[1] || 'bin';
      const safeNameBase = (suggestedName || `media_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${safeNameBase}.${ext}`;
      const filePath = path.join(imagesDir, filename);
      fs.writeFileSync(filePath, buffer);
      const url = `/user-data/images/${filename}`;
      res.json({ url });
    } catch (e) {
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });

  server = serverApp.listen(0, 'localhost', () => {
    const port = server.address().port;
    console.log(`Local API server running on http://localhost:${port}`);
    if (mainWindow) {
      mainWindow.loadURL(`http://localhost:${port}`);
    }
  });
}

app.whenReady().then(() => {
  if (process.env.NODE_ENV !== 'development') {
    startLocalServer();
  }
  
  // Her iki pencereyi de oluştur
  createBoardWindow();
  createAdminWindow();
  
  // Menüyü oluştur
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createBoardWindow();
      createAdminWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (server) server.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});