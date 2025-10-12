import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;
import { fileURLToPath } from 'url';

// SQLite ve Migration modüllerini import et
import DatabaseManager from './database.js';
import MigrationManager from './migration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow; // Board görünümü
let adminWindow; // Admin paneli
let dbManager;
let migrationManager;

// Güncelleme ayarları
autoUpdater.checkForUpdatesAndNotify = false; // Otomatik güncelleme kapalı
autoUpdater.autoDownload = false; // Manuel indirme

function createBoardWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'Lovelied Board - Pano',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    // icon: path.join(__dirname, '../public/favicon.ico'),
    show: false, // İlk yükleme tamamlanana kadar gizle
  });

  // Load the board view
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5174/');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

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
      preload: path.join(__dirname, 'preload.js'),
    },
    // icon: path.join(__dirname, '../public/favicon.ico'),
    show: false, // İlk yükleme tamamlanana kadar gizle
  });

  // Load the admin panel
  if (process.env.NODE_ENV === 'development') {
    adminWindow.loadURL('http://localhost:5174/admin');
    adminWindow.webContents.openDevTools();
  } else {
    adminWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: 'admin' });
  }

  adminWindow.once('ready-to-show', () => {
    adminWindow.show();
  });

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
      label: 'Güncelleme',
      submenu: [
        {
          label: 'Güncelleme Kontrol Et',
          click: () => {
            checkForUpdates();
          }
        },
        {
          label: 'Güncellemeyi İndir',
          click: () => {
            downloadUpdate();
          }
        },
        {
          label: 'Güncellemeyi Kur',
          click: () => {
            installUpdate();
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

// IPC Handlers - Veritabanı İşlemleri
function setupIpcHandlers() {
  // Board data işlemleri
  ipcMain.handle('db:get-board-data', async () => {
    try {
      return await dbManager.getBoardData();
    } catch (error) {
      console.error('Board data okuma hatası:', error);
      throw error;
    }
  });

  ipcMain.handle('db:save-board-data', async (event, data) => {
    try {
      await dbManager.saveBoardData(data);
      return { success: true };
    } catch (error) {
      console.error('Board data kaydetme hatası:', error);
      throw error;
    }
  });

  // Backup ve Restore
  ipcMain.handle('db:backup', async () => {
    try {
      const backupPath = await dbManager.backup();
      return { success: true, path: backupPath };
    } catch (error) {
      console.error('Backup hatası:', error);
      throw error;
    }
  });

  ipcMain.handle('db:restore', async (event, backupPath) => {
    try {
      const oldBackupPath = await dbManager.restore(backupPath);
      return { success: true, oldBackupPath };
    } catch (error) {
      console.error('Restore hatası:', error);
      throw error;
    }
  });

  // Medya yükleme
  ipcMain.handle('upload:media', async (event, dataUrl, suggestedName) => {
    try {
      const url = await migrationManager.uploadMedia(dataUrl, suggestedName);
      return { success: true, url };
    } catch (error) {
      console.error('Medya yükleme hatası:', error);
      throw error;
    }
  });

  // Güncelleme işlemleri
  ipcMain.handle('updater:check-for-updates', async () => {
    try {
      const result = await autoUpdater.checkForUpdates();
      return { success: true, updateInfo: result.updateInfo };
    } catch (error) {
      console.error('Güncelleme kontrol hatası:', error);
      throw error;
    }
  });

  ipcMain.handle('updater:download-update', async () => {
    try {
      await autoUpdater.downloadUpdate();
      return { success: true };
    } catch (error) {
      console.error('Güncelleme indirme hatası:', error);
      throw error;
    }
  });

  ipcMain.handle('updater:install-update', async () => {
    try {
      autoUpdater.quitAndInstall();
      return { success: true };
    } catch (error) {
      console.error('Güncelleme kurulum hatası:', error);
      throw error;
    }
  });

  // App metadata
  ipcMain.handle('app:get-version', () => {
    return app.getVersion();
  });

  ipcMain.handle('app:get-metadata', async (event, key) => {
    try {
      const value = await dbManager.getAppMetadata(key);
      return { success: true, value };
    } catch (error) {
      console.error('Metadata okuma hatası:', error);
      throw error;
    }
  });

  ipcMain.handle('app:set-metadata', async (event, key, value) => {
    try {
      await dbManager.setAppMetadata(key, value);
      return { success: true };
    } catch (error) {
      console.error('Metadata kaydetme hatası:', error);
      throw error;
    }
  });
}

// Güncelleme fonksiyonları
function checkForUpdates() {
  autoUpdater.checkForUpdates().then(result => {
    if (result && result.updateInfo) {
      dialog.showMessageBox({
        type: 'info',
        title: 'Güncelleme Mevcut',
        message: `Yeni versiyon mevcut: ${result.updateInfo.version}`,
        detail: result.updateInfo.releaseNotes || 'Güncelleme notları bulunamadı'
      });
    } else {
      dialog.showMessageBox({
        type: 'info',
        title: 'Güncelleme Yok',
        message: 'Uygulamanız güncel durumda'
      });
    }
  }).catch(error => {
    dialog.showErrorBox('Güncelleme Hatası', error.message);
  });
}

function downloadUpdate() {
  autoUpdater.downloadUpdate().then(() => {
    dialog.showMessageBox({
      type: 'info',
      title: 'İndirme Tamamlandı',
      message: 'Güncelleme başarıyla indirildi. Şimdi kurabilirsiniz.'
    });
  }).catch(error => {
    dialog.showErrorBox('İndirme Hatası', error.message);
  });
}

function installUpdate() {
  autoUpdater.quitAndInstall();
}

// Güncelleme event handlers
autoUpdater.on('checking-for-update', () => {
  console.log('Güncelleme kontrol ediliyor...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Güncelleme mevcut:', info);
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Güncelleme yok:', info);
});

autoUpdater.on('error', (err) => {
  console.error('Güncelleme hatası:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  console.log('İndirme ilerlemesi:', progressObj);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Güncelleme indirildi:', info);
});

// Uygulama başlatma
app.whenReady().then(async () => {
  try {
    console.log('🚀 Lovelied Board başlatılıyor...');
    
    // Veritabanını başlat
    dbManager = new DatabaseManager();
    migrationManager = new MigrationManager();
    
    // Migrasyonu çalıştır
    await migrationManager.init(dbManager);
    
    // IPC handlers'ı kur
    setupIpcHandlers();
    
    // Pencereyi oluştur
    createBoardWindow();
    createAdminWindow();
    
    // Menüyü oluştur
    createMenu();
    
    console.log('✅ Lovelied Board başlatıldı');
    
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createBoardWindow();
        createAdminWindow();
      }
    });
  } catch (error) {
    console.error('❌ Uygulama başlatma hatası:', error);
    dialog.showErrorBox('Başlatma Hatası', 'Uygulama başlatılamadı: ' + error.message);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (dbManager) {
    dbManager.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (dbManager) {
    dbManager.close();
  }
});