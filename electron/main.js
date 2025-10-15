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

// Klasör kopyalama fonksiyonu
function copyFolderRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyFolderRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

let mainWindow; // Board görünümü
let adminWindow; // Admin paneli
let dbManager;
let migrationManager;

// Güncelleme ayarları
autoUpdater.checkForUpdatesAndNotify = false; // Otomatik güncelleme kapalı
autoUpdater.autoDownload = false; // Manuel indirme

// GitHub provider ayarları (package.json'dan otomatik alınır)
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'fatihuzuntas',
  repo: 'lovelied-board'
});

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
    autoHideMenuBar: true,
    fullscreenable: true
  });

  // Load the board view
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173/');
  } else {
    // Üretim modunda HTML dosyasının doğru yolunu bul
    try {
      // app.asar içindeki dist klasörüne erişim
      const indexPath = path.join(app.getAppPath(), 'dist', 'index.html');
      // file:// protokolü ile yükle (HashRouter için gerekli)
      const fileUrl = `file://${indexPath}`;
      mainWindow.loadURL(fileUrl);
    } catch (error) {
      mainWindow.loadURL('data:text/html,<h1>Hata:</h1><p>' + error.message + '</p>');
    }
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.setMenuBarVisibility(false);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createAdminWindow() {
  const isDev = process.env.NODE_ENV === 'development';
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
  if (isDev) {
    adminWindow.loadURL('http://localhost:5173/admin');
    // Geliştirmede devtools'u artık otomatik açmıyoruz
  } else {
    // Üretim modunda HTML dosyasının doğru yolunu bul
    try {
      // app.asar içindeki dist klasörüne erişim
      const indexPath = path.join(app.getAppPath(), 'dist', 'index.html');
      
      // file:// protokolü ile yükle (HashRouter için gerekli)
      const fileUrl = `file://${indexPath}#/admin`;
      adminWindow.loadURL(fileUrl);
    } catch (error) {
      adminWindow.loadURL('data:text/html,<h1>Admin Hata:</h1><p>' + error.message + '</p>');
    }
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
          label: 'Tam Ekranı Aç/Kapat',
          accelerator: 'F11',
          click: () => {
            if (mainWindow) {
              const isFull = mainWindow.isFullScreen();
              mainWindow.setFullScreen(!isFull);
            }
          }
        },
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
      throw error;
    }
  });

  ipcMain.handle('db:save-board-data', async (event, data) => {
    try {
      await dbManager.saveBoardData(data);
      return { success: true };
    } catch (error) {
      throw error;
    }
  });

  // Backup ve Restore
  ipcMain.handle('db:backup', async () => {
    try {
      const backupPath = await dbManager.backup();
      return { success: true, path: backupPath };
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle('db:restore', async (event, backupPath) => {
    try {
      const oldBackupPath = await dbManager.restore(backupPath);
      return { success: true, oldBackupPath };
    } catch (error) {
      throw error;
    }
  });

  // Medya yükleme
  ipcMain.handle('upload:media', async (event, dataUrl, suggestedName) => {
    try {
      const url = await migrationManager.uploadMedia(dataUrl, suggestedName);
      return { success: true, url };
    } catch (error) {
      throw error;
    }
  });

  // Medya dosyasını data URL olarak çözümle (önizleme için)
  ipcMain.handle('media:get-data-url', async (event, relativeUrl) => {
    try {
      const pathModule = path; // isim çakışmalarını önlemek için alias
      const fsModule = fs;
      const filename = pathModule.basename(relativeUrl);
      const mediaDir = pathModule.join(pathModule.dirname(dbManager.dbPath), 'media');
      const filePath = pathModule.join(mediaDir, filename);

      const buffer = fsModule.readFileSync(filePath);
      const ext = pathModule.extname(filename).toLowerCase().replace('.', '');
      const mimeMap = {
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        webp: 'image/webp',
        gif: 'image/gif',
        svg: 'image/svg+xml',
        mp4: 'video/mp4',
        webm: 'video/webm',
        ogg: 'video/ogg'
      };
      const mime = mimeMap[ext] || 'application/octet-stream';
      const base64 = buffer.toString('base64');
      return { success: true, dataUrl: `data:${mime};base64,${base64}` };
    } catch (error) {
      throw error;
    }
  });

  // Güncelleme işlemleri
  ipcMain.handle('updater:check-for-updates', async () => {
    try {
      // Geliştirme modunda güncelleme kontrolünü devre dışı bırak
      if (process.env.NODE_ENV === 'development') {
        return { 
          success: false, 
          error: 'Geliştirme modunda güncelleme kontrolü mevcut değil',
          updateInfo: null 
        };
      }
      
      // electron-updater otomatik olarak latest.yml/latest-mac.yml kullanır
      const result = await autoUpdater.checkForUpdates();
      return { success: true, updateInfo: result.updateInfo };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Güncelleme kontrolü başarısız',
        updateInfo: null
      };
    }
  });

  ipcMain.handle('updater:download-update', async () => {
    try {
      await autoUpdater.downloadUpdate();
      return { success: true };
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle('updater:install-update', async () => {
    try {
      autoUpdater.quitAndInstall();
      return { success: true };
    } catch (error) {
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
      throw error;
    }
  });

  ipcMain.handle('app:set-metadata', async (event, key, value) => {
    try {
      await dbManager.setAppMetadata(key, value);
      return { success: true };
    } catch (error) {
      throw error;
    }
  });

  // Dialog handler'ları
  ipcMain.handle('dialog:show-save-dialog', async (event, options) => {
    try {
      const result = await dialog.showSaveDialog(mainWindow, options);
      return result;
    } catch (error) {
      return { canceled: true };
    }
  });

  ipcMain.handle('dialog:show-open-dialog', async (event, options) => {
    try {
      const result = await dialog.showOpenDialog(mainWindow, options);
      return result;
    } catch (error) {
      return { canceled: true };
    }
  });

  // Belirli bir yola yedekleme
  ipcMain.handle('db:backup-to-path', async (event, filePath) => {
    try {
      const data = await dbManager.getBoardData();
      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: data
      };
      
      fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));
      return { success: true, path: filePath };
    } catch (error) {
      throw error;
    }
  });

  // Klasöre yedekleme (veriler + resimler)
  ipcMain.handle('db:backup-to-folder', async (event, folderPath) => {
    try {
      // Klasör oluştur
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Verileri JSON olarak kaydet
      const data = await dbManager.getBoardData();
      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: data
      };
      
      const dataFilePath = path.join(folderPath, 'board-data.json');
      fs.writeFileSync(dataFilePath, JSON.stringify(backupData, null, 2));

      // Medya klasörünü kopyala - Database manager'dan doğru yolu al
      const dataRoot = dbManager.getDefaultDataRoot();
      const mediaPath = path.join(dataRoot, 'user-data', 'media');
      const backupMediaPath = path.join(folderPath, 'media');


      if (fs.existsSync(mediaPath)) {
        // Media klasörünü recursive olarak kopyala
        copyFolderRecursive(mediaPath, backupMediaPath);
      }

      return { success: true, path: folderPath };
    } catch (error) {
      throw error;
    }
  });

  // Klasörden geri yükleme
  ipcMain.handle('db:restore-from-folder', async (event, folderPath) => {
    try {
      const dataFilePath = path.join(folderPath, 'board-data.json');
      const mediaPath = path.join(folderPath, 'media');
      
      // JSON dosyasını oku
      if (!fs.existsSync(dataFilePath)) {
        throw new Error('board-data.json dosyası bulunamadı');
      }
      
      const backupData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
      
      // Verileri geri yükle
      await dbManager.saveBoardData(backupData.data);
      
      // Media klasörünü kopyala (varsa)
      if (fs.existsSync(mediaPath)) {
        const dataRoot = dbManager.getDefaultDataRoot();
        const targetMediaPath = path.join(dataRoot, 'user-data', 'media');
        
        // Hedef media klasörünü temizle ve yeniden kopyala
        if (fs.existsSync(targetMediaPath)) {
          fs.rmSync(targetMediaPath, { recursive: true, force: true });
        }
        
        copyFolderRecursive(mediaPath, targetMediaPath);
      }
      
      return { success: true, path: folderPath };
    } catch (error) {
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
  // macOS'ta kurulumun güvenli tetiklenmesi
  try {
    // quitAndInstall(isSilent, isForceRunAfter)
    // isSilent: false (kullanıcıya bildirim göster)
    // isForceRunAfter: true (kurulum sonrası otomatik başlat)
    autoUpdater.quitAndInstall(false, true);
  } catch (e) {
    // Geriye dönük uyumluluk için parametresiz çağrı
    autoUpdater.quitAndInstall();
  }
}

// Güncelleme event handlers
autoUpdater.on('checking-for-update', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:checking-for-update');
  }
  if (adminWindow && !adminWindow.isDestroyed()) {
    adminWindow.webContents.send('updater:checking-for-update');
  }
});

autoUpdater.on('update-available', (info) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:update-available', info);
  }
  if (adminWindow && !adminWindow.isDestroyed()) {
    adminWindow.webContents.send('updater:update-available', info);
  }
});

autoUpdater.on('update-not-available', (info) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:update-not-available', info);
  }
  if (adminWindow && !adminWindow.isDestroyed()) {
    adminWindow.webContents.send('updater:update-not-available', info);
  }
});

autoUpdater.on('error', (err) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:error', err);
  }
  if (adminWindow && !adminWindow.isDestroyed()) {
    adminWindow.webContents.send('updater:error', err);
  }
});

autoUpdater.on('download-progress', (progressObj) => {('İndirme ilerlemesi:', progressObj);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:download-progress', progressObj);
  }
  if (adminWindow && !adminWindow.isDestroyed()) {
    adminWindow.webContents.send('updater:download-progress', progressObj);
  }
});

autoUpdater.on('update-downloaded', (info) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:update-downloaded', info);
  }
  if (adminWindow && !adminWindow.isDestroyed()) {
    adminWindow.webContents.send('updater:update-downloaded', info);
  }
});

// Uygulama başlatma
app.whenReady().then(async () => {
  try {
    
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
    
    
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createBoardWindow();
        createAdminWindow();
      }
    });
  } catch (error) {
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