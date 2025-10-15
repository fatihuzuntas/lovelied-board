import { BoardData, Slide, DutyInfo, Birthday, Countdown, Quote, BellSchedule, SchoolConfig, DaySchedule, MarqueeItem } from '@/types/board';

// Default data fallback
const defaultData: BoardData = {
  slides: [
    {
      id: 's1',
      type: 'announcement',
      title: 'Hoş Geldiniz! 🎉',
      body: 'Dijital okul panosuna hoş geldiniz. Bu sistemle tüm duyurular, etkinlikler ve önemli bilgiler burada paylaşılacak.',
      media: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
      animation: 'slide-left',
      duration: 10,
      priority: 1,
    },
    {
      id: 's2',
      type: 'news',
      title: 'Kütüphane Açılış Saatleri',
      body: 'Okul kütüphanemiz hafta içi 08:00-17:00 saatleri arasında öğrencilerimize hizmet vermektedir.',
      media: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
      animation: 'slide-right',
      duration: 8,
      priority: 2,
    },
    {
      id: 's3',
      type: 'announcement',
      title: 'Spor Kulübü Kayıtları',
      body: 'Basketbol, voleybol ve futbol kulüplerimize kayıtlar başlamıştır. Müdür yardımcılığına başvurabilirsiniz.',
      media: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
      animation: 'zoom-in',
      duration: 10,
      priority: 3,
    },
  ],
  duty: {
    date: new Date().toISOString().split('T')[0],
    teachers: [
      { name: 'Ahmet Yılmaz', area: 'Kat 1' },
      { name: 'Fatma Demir', area: 'Kat 2' },
      { name: 'Mehmet Kaya', area: 'Bahçe' },
    ],
    students: [
      { name: 'Ali Demir - 10A', area: 'Kat 1' },
      { name: 'Ayşe Kaya - 10B', area: 'Kat 2' },
      { name: 'Mehmet Şahin - 10C', area: 'Bahçe' }
    ],
  },
  birthdays: [
    {
      name: 'Zeynep Arslan',
      date: '2008-10-15',
      class: '9A',
      type: 'student',
    },
    {
      name: 'Burak Yıldız',
      date: '2007-10-15',
      class: '10B',
      type: 'student',
    },
  ],
  countdowns: [
    {
      id: 'c1',
      name: 'Ara Tatil',
      date: '2025-11-15',
      type: 'holiday',
      icon: '🏖️',
    },
    {
      id: 'c2',
      name: 'Final Sınavları',
      date: '2025-12-20',
      type: 'exam',
      icon: '📚',
    },
  ],
  marqueeTexts: [
    {
      id: 'm1',
      text: 'Lütfen koridorlarda sessiz olalım. Temizlik kurallarına uyalım.',
      priority: 'normal',
    },
    {
      id: 'm2',
      text: 'Öğle yemeği 12:00-13:00 saatleri arasındadır.',
      priority: 'normal',
    },
  ],
  config: {
    schoolName: 'Atatürk Anadolu Lisesi',
    timezone: 'Europe/Istanbul',
    primaryColor: 'hsl(214, 88%, 48%)',
    secondaryColor: 'hsl(24, 95%, 53%)',
  },
  quotes: [
    {
      id: 'q1',
      type: 'verse',
      text: 'Okuyan insanlar, düşünen insanlardır.',
      source: 'Bakara Suresi 2:44',
    },
    {
      id: 'q2',
      type: 'hadith',
      text: 'İlim Çin\'de de olsa gidiniz.',
      source: 'Hz. Muhammed (S.A.V)',
    },
    {
      id: 'q3',
      type: 'quote',
      text: 'Hayatta en hakiki mürşit ilimdir.',
      source: 'Mustafa Kemal Atatürk',
    },
  ],
  bellSchedule: [
    { id: 'b1', type: 'lesson', name: '1. Ders', startTime: '08:30', endTime: '09:15', order: 1 },
    { id: 'b2', type: 'break', name: '1. Teneffüs', startTime: '09:15', endTime: '09:25', order: 2 },
    { id: 'b3', type: 'lesson', name: '2. Ders', startTime: '09:25', endTime: '10:10', order: 3 },
    { id: 'b4', type: 'break', name: '2. Teneffüs', startTime: '10:10', endTime: '10:20', order: 4 },
    { id: 'b5', type: 'lesson', name: '3. Ders', startTime: '10:20', endTime: '11:05', order: 5 },
    { id: 'b6', type: 'break', name: '3. Teneffüs', startTime: '11:05', endTime: '11:15', order: 6 },
    { id: 'b7', type: 'lesson', name: '4. Ders', startTime: '11:15', endTime: '12:00', order: 7 },
    { id: 'b8', type: 'break', name: 'Öğle Arası', startTime: '12:00', endTime: '13:00', order: 8 },
    { id: 'b9', type: 'lesson', name: '5. Ders', startTime: '13:00', endTime: '13:45', order: 9 },
    { id: 'b10', type: 'break', name: '4. Teneffüs', startTime: '13:45', endTime: '13:55', order: 10 },
    { id: 'b11', type: 'lesson', name: '6. Ders', startTime: '13:55', endTime: '14:40', order: 11 },
    { id: 'b12', type: 'break', name: '5. Teneffüs', startTime: '14:40', endTime: '14:50', order: 12 },
    { id: 'b13', type: 'lesson', name: '7. Ders', startTime: '14:50', endTime: '15:35', order: 13 },
    { id: 'b14', type: 'break', name: '6. Teneffüs', startTime: '15:35', endTime: '15:45', order: 14 },
    { id: 'b15', type: 'lesson', name: '8. Ders', startTime: '15:45', endTime: '16:30', order: 15 },
  ],
  daySchedules: [
    {
      id: 'ds1',
      day: 'all',
      schedule: [
        { id: 'b1', type: 'lesson', name: '1. Ders', startTime: '08:30', endTime: '09:15', order: 1 },
        { id: 'b2', type: 'break', name: '1. Teneffüs', startTime: '09:15', endTime: '09:25', order: 2 },
        { id: 'b3', type: 'lesson', name: '2. Ders', startTime: '09:25', endTime: '10:10', order: 3 },
        { id: 'b4', type: 'break', name: '2. Teneffüs', startTime: '10:10', endTime: '10:20', order: 4 },
        { id: 'b5', type: 'lesson', name: '3. Ders', startTime: '10:20', endTime: '11:05', order: 5 },
        { id: 'b6', type: 'break', name: '3. Teneffüs', startTime: '11:05', endTime: '11:15', order: 6 },
        { id: 'b7', type: 'lesson', name: '4. Ders', startTime: '11:15', endTime: '12:00', order: 7 },
        { id: 'b8', type: 'break', name: 'Öğle Arası', startTime: '12:00', endTime: '13:00', order: 8 },
        { id: 'b9', type: 'lesson', name: '5. Ders', startTime: '13:00', endTime: '13:45', order: 9 },
        { id: 'b10', type: 'break', name: '4. Teneffüs', startTime: '13:45', endTime: '13:55', order: 10 },
        { id: 'b11', type: 'lesson', name: '6. Ders', startTime: '13:55', endTime: '14:40', order: 11 },
        { id: 'b12', type: 'break', name: '5. Teneffüs', startTime: '14:40', endTime: '14:50', order: 12 },
        { id: 'b13', type: 'lesson', name: '7. Ders', startTime: '14:50', endTime: '15:35', order: 13 },
        { id: 'b14', type: 'break', name: '6. Teneffüs', startTime: '15:35', endTime: '15:45', order: 14 },
        { id: 'b15', type: 'lesson', name: '8. Ders', startTime: '15:45', endTime: '16:30', order: 15 },
      ],
    },
  ],
};

// Cache for offline operation
let boardDataCache: BoardData | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

// Helper function to check if we're in Electron
export const isElectron = (): boolean => {
  return !!(window.electron && window.electron.ipcRenderer);
};

// Helper function to get cached data if available and fresh
const getCachedData = (): BoardData | null => {
  const now = Date.now();
  if (boardDataCache && (now - lastCacheTime) < CACHE_DURATION) {
    return boardDataCache;
  }
  return null;
};

// Helper function to cache data
const cacheData = (data: BoardData): void => {
  boardDataCache = data;
  lastCacheTime = Date.now();
};

// Helper function to safely use localStorage in web environment
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('localStorage getItem hatası:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('localStorage setItem hatası:', error);
      throw error;
    }
  }
};

// IndexedDB helpers for web environment to avoid localStorage quota limits
// Simple key-value store and media store
type IdbStores = 'kv' | 'media';
let idbPromise: Promise<IDBDatabase> | null = null;

const getIdb = (): Promise<IDBDatabase> => {
  if (!idbPromise) {
    idbPromise = new Promise((resolve, reject) => {
      try {
        const openReq = indexedDB.open('lovelied-board', 1);
        openReq.onupgradeneeded = () => {
          const db = openReq.result;
          if (!db.objectStoreNames.contains('kv')) {
            db.createObjectStore('kv', { keyPath: 'key' });
          }
          if (!db.objectStoreNames.contains('media')) {
            db.createObjectStore('media', { keyPath: 'id' });
          }
        };
        openReq.onsuccess = () => resolve(openReq.result);
        openReq.onerror = () => reject(openReq.error);
      } catch (e) {
        reject(e);
      }
    });
  }
  return idbPromise;
};

const idbGet = async <T = any>(storeName: IdbStores, key: string): Promise<T | undefined> => {
  const db = await getIdb();
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => {
      const result = req.result;
      if (!result) return resolve(undefined);
      if (storeName === 'kv') resolve(result.value as T);
      else resolve(result.dataUrl as T);
    };
    req.onerror = () => reject(req.error);
  });
};

const idbSet = async (storeName: IdbStores, key: string, value: any): Promise<void> => {
  const db = await getIdb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const data = storeName === 'kv' ? { key, value } : { id: key, dataUrl: value };
    const req = store.put(data);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const loadBoardData = async (): Promise<BoardData> => {
  try {
    // Electron ortamında IPC kullan
    if (isElectron()) {
      const data = await window.electron!.ipcRenderer.invoke('db:get-board-data');
      cacheData(data);
      return data;
    }
    
    // Web ortamında öncelikle IndexedDB'den yükle, yoksa localStorage fallback
    try {
      const idbData = await idbGet<string>('kv', 'lovelied-board-data');
      if (idbData) {
        const parsedData = JSON.parse(idbData);
        cacheData(parsedData);
        return parsedData;
      }
    } catch (e) {
      console.warn('IndexedDB okuma hatası, localStorage deneniyor:', e);
    }

    const storedData = safeLocalStorage.getItem('lovelied-board-data');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        cacheData(parsedData);
        return parsedData;
      } catch (parseError) {
        console.error('Stored data parse hatası:', parseError);
      }
    }
    
    // Cache'den döndür
    const cached = getCachedData();
    if (cached) {
      return cached;
    }
    
    // Cache yoksa default data döndür ve kaydet (IndexedDB)
    try {
      await idbSet('kv', 'lovelied-board-data', JSON.stringify(defaultData));
    } catch (e) {
      console.warn('IndexedDB yazma hatası, localStorage deneniyor:', e);
      safeLocalStorage.setItem('lovelied-board-data', JSON.stringify(defaultData));
    }
    return defaultData;
  } catch (error) {
    console.error('Board data yükleme hatası:', error);
    
    // Hata durumunda cache'i dene
    const cached = getCachedData();
    if (cached) {
      return cached;
    }
    
    // Son çare olarak default data
    return defaultData;
  }
};

export const saveBoardData = async (data: BoardData): Promise<void> => {
  try {
    // Electron ortamında IPC kullan
    if (isElectron()) {
      await window.electron!.ipcRenderer.invoke('db:save-board-data', data);
      cacheData(data);
      return;
    }
    
    // Web ortamında IndexedDB'ye kaydet (quota aşımı olmaması için)
    try {
      await idbSet('kv', 'lovelied-board-data', JSON.stringify(data));
      cacheData(data);
      console.log('Web ortamında veriler IndexedDB\'ye kaydedildi');
    } catch (e) {
      console.warn('IndexedDB yazma hatası, localStorage fallback denenecek:', e);
      safeLocalStorage.setItem('lovelied-board-data', JSON.stringify(data));
      cacheData(data);
      console.log('Web ortamında veriler localStorage\'a kaydedildi (fallback)');
    }
  } catch (error) {
    console.error('Board data kaydetme hatası:', error);
    
    // Hata durumunda yine de cache'e kaydet
    cacheData(data);
    throw error;
  }
};

export const uploadMedia = async (dataUrl: string, suggestedName?: string): Promise<string> => {
  try {
    // Electron ortamında IPC kullan
    if (isElectron()) {
      const result = await window.electron!.ipcRenderer.invoke('upload:media', dataUrl, suggestedName);
      return result.url;
    }
    
    // Web ortamında dataUrl'i IndexedDB'ye kaydet ve referans döndür
    const mediaId = `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    try {
      await idbSet('media', mediaId, dataUrl);
      return `idb-media://${mediaId}`;
    } catch (e) {
      console.warn('IndexedDB medya yazma hatası, localStorage fallback denenecek:', e);
      const mediaKey = `lovelied-board-media-${mediaId}`;
      safeLocalStorage.setItem(mediaKey, dataUrl);
      return `web-media://${mediaId}`;
    }
  } catch (error) {
    console.error('Medya yükleme hatası:', error);
    // Fallback olarak dataUrl'i döndür
    return dataUrl;
  }
};

// Medya URL normalize: Electron'da /user-data/media/... yolunu data URL'e çevir
export const resolveMediaUrl = async (url?: string): Promise<string | undefined> => {
  if (!url) return undefined;
  try {
    if (isElectron() && url.startsWith('/user-data/media/')) {
      const result = await window.electron!.ipcRenderer.invoke('media:get-data-url', url);
      if (result && result.dataUrl) return result.dataUrl as string;
    }
    
    // Web ortamında idb-media:// ve web-media:// referanslarını çözümle
    if (url.startsWith('idb-media://')) {
      const mediaId = url.replace('idb-media://', '');
      const dataUrl = await idbGet<string>('media', mediaId);
      if (dataUrl) return dataUrl;
    }
    if (url.startsWith('web-media://')) {
      const mediaId = url.replace('web-media://', '');
      const mediaKey = `lovelied-board-media-${mediaId}`;
      const dataUrl = safeLocalStorage.getItem(mediaKey);
      if (dataUrl) return dataUrl;
    }
    
    return url;
  } catch (error) {
    console.error('Medya URL çözümleme hatası:', error);
    return url;
  }
};

// Backup ve Restore işlemleri
export const backupDatabase = async (): Promise<string> => {
  if (!isElectron()) {
    // Web ortamında localStorage'dan backup oluştur
    try {
      const data = safeLocalStorage.getItem('lovelied-board-data');
      if (!data) {
        throw new Error('Kaydedilmiş veri bulunamadı');
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupKey = `lovelied-board-backup-${timestamp}`;
      safeLocalStorage.setItem(backupKey, data);
      
      return backupKey; // Web ortamında key döndür
    } catch (error) {
      console.error('Web backup hatası:', error);
      throw error;
    }
  }
  
  try {
    const result = await window.electron!.ipcRenderer.invoke('db:backup');
    return result.path;
  } catch (error) {
    console.error('Backup hatası:', error);
    throw error;
  }
};

export const restoreDatabase = async (backupPath: string): Promise<string> => {
  if (!isElectron()) {
    // Web ortamında localStorage'dan restore yap
    try {
      const backupData = safeLocalStorage.getItem(backupPath);
      if (!backupData) {
        throw new Error('Backup verisi bulunamadı');
      }
      
      // Mevcut veriyi yedekle
      const currentData = safeLocalStorage.getItem('lovelied-board-data');
      let oldBackupPath = '';
      if (currentData) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        oldBackupPath = `lovelied-board-backup-before-restore-${timestamp}`;
        safeLocalStorage.setItem(oldBackupPath, currentData);
      }
      
      // Backup'ı geri yükle
      safeLocalStorage.setItem('lovelied-board-data', backupData);
      
      // Cache'i temizle
      boardDataCache = null;
      lastCacheTime = 0;
      
      return oldBackupPath;
    } catch (error) {
      console.error('Web restore hatası:', error);
      throw error;
    }
  }
  
  try {
    const result = await window.electron!.ipcRenderer.invoke('db:restore', backupPath);
    // Cache'i temizle
    boardDataCache = null;
    lastCacheTime = 0;
    return result.oldBackupPath;
  } catch (error) {
    console.error('Restore hatası:', error);
    throw error;
  }
};

// Güncelleme işlemleri
export const checkForUpdates = async () => {
  if (!isElectron()) {
    throw new Error('Güncelleme işlemi sadece Electron ortamında çalışır');
  }
  
  try {
    const result = await window.electron!.ipcRenderer.invoke('updater:check-for-updates');
    
    // Geliştirme modunda güncelleme kontrolü devre dışı
    if (!result.success && result.error) {
      throw new Error(result.error);
    }
    
    return result.updateInfo;
  } catch (error) {
    console.error('Güncelleme kontrol hatası:', error);
    throw error;
  }
};

export const downloadUpdate = async () => {
  if (!isElectron()) {
    throw new Error('Güncelleme işlemi sadece Electron ortamında çalışır');
  }
  
  try {
    await window.electron!.ipcRenderer.invoke('updater:download-update');
  } catch (error) {
    console.error('Güncelleme indirme hatası:', error);
    throw error;
  }
};

export const installUpdate = async () => {
  if (!isElectron()) {
    throw new Error('Güncelleme işlemi sadece Electron ortamında çalışır');
  }
  
  try {
    await window.electron!.ipcRenderer.invoke('updater:install-update');
  } catch (error) {
    console.error('Güncelleme kurulum hatası:', error);
    throw error;
  }
};

// App metadata işlemleri
export const getAppVersion = async (): Promise<string> => {
  if (!isElectron()) {
    return '1.0.0'; // Web versiyonu için varsayılan
  }
  
  try {
    return await window.electron!.ipcRenderer.invoke('app:get-version');
  } catch (error) {
    console.error('Versiyon bilgisi alma hatası:', error);
    return '1.0.0';
  }
};

export const getAppMetadata = async (key: string): Promise<string | null> => {
  if (!isElectron()) {
    return null;
  }
  
  try {
    const result = await window.electron!.ipcRenderer.invoke('app:get-metadata', key);
    return result.value;
  } catch (error) {
    console.error('Metadata alma hatası:', error);
    return null;
  }
};

export const setAppMetadata = async (key: string, value: string): Promise<void> => {
  if (!isElectron()) {
    return;
  }
  
  try {
    await window.electron!.ipcRenderer.invoke('app:set-metadata', key, value);
  } catch (error) {
    console.error('Metadata kaydetme hatası:', error);
    throw error;
  }
};

// Güncelleme event listeners
export const onUpdateAvailable = (callback: (info: any) => void) => {
  if (isElectron()) {
    window.electron!.ipcRenderer.on('updater:update-available', callback);
  }
};

export const onUpdateDownloadProgress = (callback: (progress: any) => void) => {
  if (isElectron()) {
    window.electron!.ipcRenderer.on('updater:download-progress', callback);
  }
};

export const onUpdateDownloaded = (callback: (info: any) => void) => {
  if (isElectron()) {
    window.electron!.ipcRenderer.on('updater:update-downloaded', callback);
  }
};

export const removeUpdateListeners = () => {
  if (isElectron()) {
    window.electron!.ipcRenderer.removeAllListeners('updater:update-available');
    window.electron!.ipcRenderer.removeAllListeners('updater:download-progress');
    window.electron!.ipcRenderer.removeAllListeners('updater:update-downloaded');
  }
};

// Convenience functions (backward compatibility)
export const updateSlides = async (slides: Slide[]): Promise<void> => {
  const data = await loadBoardData();
  data.slides = slides;
  await saveBoardData(data);
};

export const updateDuty = async (duty: DutyInfo): Promise<void> => {
  const data = await loadBoardData();
  data.duty = duty;
  await saveBoardData(data);
};

export const updateBirthdays = async (birthdays: Birthday[]): Promise<void> => {
  const data = await loadBoardData();
  data.birthdays = birthdays;
  await saveBoardData(data);
};

export const updateCountdowns = async (countdowns: Countdown[]): Promise<void> => {
  const data = await loadBoardData();
  data.countdowns = countdowns;
  await saveBoardData(data);
};

export const updateMarqueeTexts = async (marqueeTexts: MarqueeItem[]): Promise<void> => {
  const data = await loadBoardData();
  data.marqueeTexts = marqueeTexts;
  await saveBoardData(data);
};

export const updateQuotes = async (quotes: Quote[]): Promise<void> => {
  const data = await loadBoardData();
  data.quotes = quotes;
  await saveBoardData(data);
};

export const updateBellSchedule = async (bellSchedule: BellSchedule[]): Promise<void> => {
  const data = await loadBoardData();
  data.bellSchedule = bellSchedule;
  await saveBoardData(data);
};

export const updateConfig = async (config: SchoolConfig): Promise<void> => {
  const data = await loadBoardData();
  data.config = config;
  await saveBoardData(data);
};

export const updateDaySchedules = async (daySchedules: DaySchedule[]): Promise<void> => {
  const data = await loadBoardData();
  data.daySchedules = daySchedules;
  await saveBoardData(data);
};