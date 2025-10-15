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
      console.log('HTML dosya yolu:', indexPath);
      console.log('App path:', app.getAppPath());
      
      // file:// protokolü ile yükle (HashRouter için gerekli)
      const fileUrl = `file://${indexPath}`;
      console.log('File URL:', fileUrl);
      mainWindow.loadURL(fileUrl);
    } catch (error) {
      console.error('HTML yükleme hatası:', error);
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
      console.log('Admin HTML dosya yolu:', indexPath);
      
      // file:// protokolü ile yükle (HashRouter için gerekli)
      const fileUrl = `file://${indexPath}#/admin`;
      console.log('Admin File URL:', fileUrl);
      adminWindow.loadURL(fileUrl);
    } catch (error) {
      console.error('Admin HTML yükleme hatası:', error);
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
      console.error('Medya data URL oluşturma hatası:', error);
      throw error;
    }
  });

  // Güncelleme işlemleri
  ipcMain.handle('updater:check-for-updates', async () => {
    try {
      // Geliştirme modunda güncelleme kontrolünü devre dışı bırak
      if (process.env.NODE_ENV === 'development') {
        console.log('Geliştirme modunda güncelleme kontrolü devre dışı');
        return { 
          success: false, 
          error: 'Geliştirme modunda güncelleme kontrolü mevcut değil',
          updateInfo: null 
        };
      }
      
      // app-update.yml dosyasının varlığını kontrol et
      // Windows'ta resources klasöründe, macOS'ta üst dizinde
      let updateConfigPath;
      if (process.platform === 'win32') {
        updateConfigPath = path.join(app.getAppPath(), 'resources', 'app-update.yml');
      } else {
        updateConfigPath = path.join(app.getAppPath(), '..', 'app-update.yml');
      }
      
      if (!fs.existsSync(updateConfigPath)) {
        console.log('app-update.yml bulunamadı, güncelleme kontrolü devre dışı');
        console.log('Aranan konum:', updateConfigPath);
        return {
          success: false,
          error: 'Güncelleme yapılandırması bulunamadı',
          updateInfo: null
        };
      }
      
      const result = await autoUpdater.checkForUpdates();
      return { success: true, updateInfo: result.updateInfo };
    } catch (error) {
      console.error('Güncelleme kontrol hatası:', error);
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

  // Dialog handler'ları
  ipcMain.handle('dialog:show-save-dialog', async (event, options) => {
    try {
      const result = await dialog.showSaveDialog(mainWindow, options);
      return result;
    } catch (error) {
      console.error('Dialog hatası:', error);
      return { canceled: true };
    }
  });

  ipcMain.handle('dialog:show-open-dialog', async (event, options) => {
    try {
      const result = await dialog.showOpenDialog(mainWindow, options);
      return result;
    } catch (error) {
      console.error('Dialog hatası:', error);
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
      console.error('Yedekleme hatası:', error);
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

      console.log('Data root:', dataRoot);
      console.log('Media path:', mediaPath);
      console.log('Media exists:', fs.existsSync(mediaPath));
      console.log('Backup media path:', backupMediaPath);

      if (fs.existsSync(mediaPath)) {
        // Media klasörünü recursive olarak kopyala
        copyFolderRecursive(mediaPath, backupMediaPath);
        console.log('Media folder copied successfully');
      } else {
        console.log('Media folder not found, skipping copy');
      }

      return { success: true, path: folderPath };
    } catch (error) {
      console.error('Klasör yedekleme hatası:', error);
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
        console.log('Media klasörü geri yüklendi:', targetMediaPath);
      }
      
      return { success: true, path: folderPath };
    } catch (error) {
      console.error('Klasör geri yükleme hatası:', error);
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