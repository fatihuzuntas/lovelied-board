import fs from 'fs';
import path from 'path';
import os from 'os';
import DatabaseManager from './database.js';

class MigrationManager {
  constructor() {
    this.dbManager = null;
  }

  async init(dbManager) {
    this.dbManager = dbManager;
    await this.checkAndRunMigrations();
  }

  async checkAndRunMigrations() {
    try {
      // Migrasyon geçmişini kontrol et
      const migrationVersion = await this.dbManager.getAppMetadata('migration_version');
      const currentVersion = '1.0.0';

      if (!migrationVersion || migrationVersion !== currentVersion) {
        console.log('🔄 Veri migrasyonu başlatılıyor...');
        
        // JSON'dan SQLite'a migrasyon
        await this.migrateFromJSON();
        
        // Migrasyon versiyonunu kaydet
        await this.dbManager.setAppMetadata('migration_version', currentVersion);
        
        console.log('✅ Veri migrasyonu tamamlandı');
      } else {
        console.log('✅ Veri migrasyonu zaten yapılmış');
      }
    } catch (error) {
      console.error('❌ Migrasyon hatası:', error);
      throw error;
    }
  }

  async migrateFromJSON() {
    try {
      // Eski JSON dosyalarını ara
      const possibleJsonPaths = [
        // Mevcut dizindeki user-data
        path.join(process.cwd(), 'user-data', 'board.json'),
        path.join(process.cwd(), 'dist', 'user-data', 'board.json'),
        // Legacy public klasörü
        path.join(process.cwd(), 'public', 'user-data', 'board.json'),
        // macOS Application Support
        path.join(os.homedir(), 'Library', 'Application Support', 'LoveliedBoard', 'user-data', 'board.json'),
        // Windows AppData
        path.join(os.homedir(), 'AppData', 'Roaming', 'LoveliedBoard', 'user-data', 'board.json'),
        // Linux .local/share
        path.join(os.homedir(), '.local', 'share', 'lovelied-board', 'user-data', 'board.json')
      ];

      let jsonData = null;
      let sourcePath = null;

      // İlk bulunan JSON dosyasını kullan
      for (const jsonPath of possibleJsonPaths) {
        if (fs.existsSync(jsonPath)) {
          try {
            const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
            jsonData = JSON.parse(jsonContent);
            sourcePath = jsonPath;
            console.log(`📁 JSON dosyası bulundu: ${jsonPath}`);
            break;
          } catch (error) {
            console.warn(`⚠️ JSON dosyası okunamadı: ${jsonPath}`, error.message);
            continue;
          }
        }
      }

      if (!jsonData) {
        console.log('ℹ️ JSON dosyası bulunamadı, varsayılan veriler kullanılacak');
        await this.createDefaultData();
        return;
      }

      // JSON verilerini SQLite'a taşı
      console.log('📦 JSON verilerini SQLite\'a taşıyor...');
      await this.dbManager.saveBoardData(jsonData);

      // Medya dosyalarını taşı
      await this.migrateMediaFiles(sourcePath);

      console.log(`✅ JSON'dan SQLite'a migrasyon tamamlandı: ${sourcePath}`);
    } catch (error) {
      console.error('❌ JSON migrasyon hatası:', error);
      throw error;
    }
  }

  async migrateMediaFiles(sourceJsonPath) {
    try {
      const sourceDir = path.dirname(sourceJsonPath);
      const sourceMediaDir = path.join(sourceDir, 'media');
      const targetMediaDir = path.join(path.dirname(this.dbManager.dbPath), 'media');

      if (!fs.existsSync(sourceMediaDir)) {
        console.log('ℹ️ Kaynak medya klasörü bulunamadı');
        return;
      }

      // Hedef medya klasörünü oluştur
      if (!fs.existsSync(targetMediaDir)) {
        fs.mkdirSync(targetMediaDir, { recursive: true });
      }

      // Medya dosyalarını kopyala
      const mediaFiles = fs.readdirSync(sourceMediaDir);
      let copiedCount = 0;

      for (const file of mediaFiles) {
        const sourceFile = path.join(sourceMediaDir, file);
        const targetFile = path.join(targetMediaDir, file);

        if (fs.statSync(sourceFile).isFile()) {
          // Dosya zaten varsa üzerine yazma
          if (!fs.existsSync(targetFile)) {
            fs.copyFileSync(sourceFile, targetFile);
            copiedCount++;
          }
        }
      }

      console.log(`📁 ${copiedCount} medya dosyası taşındı`);
    } catch (error) {
      console.error('❌ Medya dosyaları migrasyon hatası:', error);
      // Bu hata kritik değil, devam et
    }
  }

  async createDefaultData() {
    try {
      const defaultData = {
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

      await this.dbManager.saveBoardData(defaultData);
      console.log('✅ Varsayılan veriler oluşturuldu');
    } catch (error) {
      console.error('❌ Varsayılan veri oluşturma hatası:', error);
      throw error;
    }
  }

  // Medya dosyası yükleme
  async uploadMedia(dataUrl, suggestedName) {
    try {
      const match = /^data:(.*?);base64,(.*)$/.exec(dataUrl);
      if (!match) {
        throw new Error('Geçersiz dataUrl formatı');
      }

      const mime = match[1];
      const base64 = match[2];
      const buffer = Buffer.from(base64, 'base64');
      const ext = mime.split('/')[1] || 'bin';
      const safeNameBase = (suggestedName || `media_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${safeNameBase}.${ext}`;
      
      const mediaDir = path.join(path.dirname(this.dbManager.dbPath), 'media');
      if (!fs.existsSync(mediaDir)) {
        fs.mkdirSync(mediaDir, { recursive: true });
      }
      
      const filePath = path.join(mediaDir, filename);
      fs.writeFileSync(filePath, buffer);
      
      return `/user-data/media/${filename}`;
    } catch (error) {
      console.error('Medya yükleme hatası:', error);
      throw error;
    }
  }

  // Kullanılmayan medya dosyalarını temizle
  async cleanupUnusedMedia() {
    try {
      const mediaDir = path.join(path.dirname(this.dbManager.dbPath), 'media');
      if (!fs.existsSync(mediaDir)) {
        return;
      }

      // Tüm medya dosyalarını al
      const mediaFiles = fs.readdirSync(mediaDir);
      
      // Veritabanındaki medya referanslarını al
      const boardData = await this.dbManager.getBoardData();
      const usedMediaFiles = new Set();

      // Slides'lardaki medya dosyalarını topla
      boardData.slides.forEach(slide => {
        if (slide.media && slide.media.includes('/user-data/media/')) {
          const filename = path.basename(slide.media);
          usedMediaFiles.add(filename);
        }
      });

      // Kullanılmayan dosyaları sil
      let deletedCount = 0;
      for (const file of mediaFiles) {
        if (!usedMediaFiles.has(file)) {
          const filePath = path.join(mediaDir, file);
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      }

      console.log(`🧹 ${deletedCount} kullanılmayan medya dosyası silindi`);
    } catch (error) {
      console.error('Medya temizleme hatası:', error);
      // Bu hata kritik değil
    }
  }
}

export default MigrationManager;
