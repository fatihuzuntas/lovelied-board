const { contextBridge, ipcRenderer } = require('electron');

// Electron API'sini güvenli bir şekilde renderer process'e expose et
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    // Veritabanı işlemleri
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    
    // Event listeners
    on: (channel, func) => {
      // Güvenli kanalları kontrol et
      const validChannels = [
        'updater:checking-for-update',
        'updater:update-available',
        'updater:update-not-available',
        'updater:error',
        'updater:download-progress',
        'updater:update-downloaded'
      ];
      
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    
    removeListener: (channel, func) => {
      ipcRenderer.removeListener(channel, func);
    },
    
    removeAllListeners: (channel) => {
      ipcRenderer.removeAllListeners(channel);
    }
  }
});

// Process bilgilerini de expose et (Electron tespiti için)
contextBridge.exposeInMainWorld('process', {
  versions: {
    electron: process.versions.electron
  }
});

// Console'da debug bilgisi
console.log('🔌 Preload script yüklendi');
