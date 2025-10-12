import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import os from 'os';

class DatabaseManager {
  constructor() {
    this.db = null;
    this.dbPath = null;
    this.init();
  }

  init() {
    try {
      // OS'e göre kalıcı veri dizini
      const dataRoot = this.getDefaultDataRoot();
      const userDataDir = path.join(dataRoot, 'user-data');
      const mediaDir = path.join(userDataDir, 'media');

      // Klasörleri oluştur
      if (!fs.existsSync(dataRoot)) fs.mkdirSync(dataRoot, { recursive: true });
      if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });
      if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

      this.dbPath = path.join(userDataDir, 'board.db');
      
      // Veritabanını başlat
      this.db = new Database(this.dbPath);
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('synchronous = NORMAL');
      this.db.pragma('cache_size = 1000');
      this.db.pragma('temp_store = MEMORY');

      this.createTables();
      console.log('✅ Veritabanı başlatıldı:', this.dbPath);
    } catch (error) {
      console.error('❌ Veritabanı başlatma hatası:', error);
      throw error;
    }
  }

  getDefaultDataRoot() {
    if (process.env.LB_DATA_DIR && process.env.LB_DATA_DIR.trim()) {
      return process.env.LB_DATA_DIR;
    }
    const home = os.homedir();
    if (process.platform === 'darwin') {
      return path.join(home, 'Library', 'Application Support', 'LoveliedBoard');
    }
    if (process.platform === 'win32') {
      const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
      return path.join(appData, 'LoveliedBoard');
    }
    const xdg = process.env.XDG_DATA_HOME || path.join(home, '.local', 'share');
    return path.join(xdg, 'lovelied-board');
  }

  createTables() {
    const tables = [
      // Slides tablosu
      `CREATE TABLE IF NOT EXISTS slides (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT,
        media TEXT,
        animation TEXT,
        duration INTEGER DEFAULT 10,
        priority INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Duty tablosu
      `CREATE TABLE IF NOT EXISTS duty (
        id INTEGER PRIMARY KEY,
        date TEXT NOT NULL,
        teachers_json TEXT,
        students_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Birthdays tablosu
      `CREATE TABLE IF NOT EXISTS birthdays (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        class TEXT,
        type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Countdowns tablosu
      `CREATE TABLE IF NOT EXISTS countdowns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        type TEXT NOT NULL,
        icon TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Marquee texts tablosu
      `CREATE TABLE IF NOT EXISTS marquee_texts (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        priority TEXT DEFAULT 'normal',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Quotes tablosu
      `CREATE TABLE IF NOT EXISTS quotes (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        text TEXT NOT NULL,
        source TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Bell schedule tablosu
      `CREATE TABLE IF NOT EXISTS bell_schedule (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        order_num INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Day schedules tablosu
      `CREATE TABLE IF NOT EXISTS day_schedules (
        id TEXT PRIMARY KEY,
        day TEXT NOT NULL,
        schedule_json TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Config tablosu
      `CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // App metadata tablosu
      `CREATE TABLE IF NOT EXISTS app_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    tables.forEach(table => {
      this.db.exec(table);
    });

    // Trigger'lar oluştur (updated_at otomatik güncelleme için)
    const triggers = [
      `CREATE TRIGGER IF NOT EXISTS update_slides_timestamp 
       AFTER UPDATE ON slides 
       BEGIN 
         UPDATE slides SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
       END`,
      
      `CREATE TRIGGER IF NOT EXISTS update_duty_timestamp 
       AFTER UPDATE ON duty 
       BEGIN 
         UPDATE duty SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
       END`,
      
      `CREATE TRIGGER IF NOT EXISTS update_day_schedules_timestamp 
       AFTER UPDATE ON day_schedules 
       BEGIN 
         UPDATE day_schedules SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
       END`
    ];

    triggers.forEach(trigger => {
      this.db.exec(trigger);
    });
  }

  // Board Data CRUD Operations
  async getBoardData() {
    try {
      const slides = this.db.prepare('SELECT * FROM slides ORDER BY priority ASC').all();
      const duty = this.db.prepare('SELECT * FROM duty ORDER BY date DESC LIMIT 1').get();
      const birthdays = this.db.prepare('SELECT * FROM birthdays ORDER BY date ASC').all();
      const countdowns = this.db.prepare('SELECT * FROM countdowns ORDER BY date ASC').all();
      const marqueeTexts = this.db.prepare('SELECT * FROM marquee_texts ORDER BY created_at ASC').all();
      const quotes = this.db.prepare('SELECT * FROM quotes ORDER BY created_at ASC').all();
      const bellSchedule = this.db.prepare('SELECT * FROM bell_schedule ORDER BY order_num ASC').all();
      const daySchedules = this.db.prepare('SELECT * FROM day_schedules ORDER BY created_at ASC').all();
      const config = this.db.prepare('SELECT * FROM config').all();

      // Config'i key-value objesi haline getir
      const configObj = {};
      config.forEach(item => {
        configObj[item.key] = item.value;
      });

      // Duty'yi parse et
      let dutyObj = null;
      if (duty) {
        dutyObj = {
          date: duty.date,
          teachers: duty.teachers_json ? JSON.parse(duty.teachers_json) : [],
          students: duty.students_json ? JSON.parse(duty.students_json) : []
        };
      }

      // Day schedules'ı parse et
      const daySchedulesObj = daySchedules.map(ds => ({
        id: ds.id,
        day: ds.day,
        schedule: ds.schedule_json ? JSON.parse(ds.schedule_json) : []
      }));

      return {
        slides,
        duty: dutyObj || { date: new Date().toISOString().split('T')[0], teachers: [], students: [] },
        birthdays,
        countdowns,
        marqueeTexts,
        config: configObj,
        quotes,
        bellSchedule,
        daySchedules: daySchedulesObj
      };
    } catch (error) {
      console.error('Board data okuma hatası:', error);
      throw error;
    }
  }

  async saveBoardData(data) {
    const transaction = this.db.transaction(() => {
      // Slides
      this.db.prepare('DELETE FROM slides').run();
      if (data.slides && data.slides.length > 0) {
        const insertSlide = this.db.prepare(`
          INSERT INTO slides (id, type, title, body, media, animation, duration, priority)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        data.slides.forEach(slide => {
          insertSlide.run(
            slide.id || `slide_${Date.now()}`,
            slide.type || 'announcement',
            slide.title || 'Başlıksız',
            slide.body || '',
            slide.media || '',
            slide.animation || 'slide-left',
            slide.duration || 10,
            slide.priority || 1
          );
        });
      }

      // Duty
      this.db.prepare('DELETE FROM duty').run();
      if (data.duty) {
        const insertDuty = this.db.prepare(`
          INSERT INTO duty (date, teachers_json, students_json)
          VALUES (?, ?, ?)
        `);
        insertDuty.run(
          data.duty.date || new Date().toISOString().split('T')[0],
          JSON.stringify(data.duty.teachers || []),
          JSON.stringify(data.duty.students || [])
        );
      }

      // Birthdays
      this.db.prepare('DELETE FROM birthdays').run();
      if (data.birthdays && data.birthdays.length > 0) {
        const insertBirthday = this.db.prepare(`
          INSERT INTO birthdays (name, date, class, type)
          VALUES (?, ?, ?, ?)
        `);
        data.birthdays.forEach(birthday => {
          insertBirthday.run(
            birthday.name || 'İsimsiz',
            birthday.date || new Date().toISOString().split('T')[0],
            birthday.class || '',
            birthday.type || 'student'
          );
        });
      }

      // Countdowns
      this.db.prepare('DELETE FROM countdowns').run();
      if (data.countdowns && data.countdowns.length > 0) {
        const insertCountdown = this.db.prepare(`
          INSERT INTO countdowns (id, name, date, type, icon)
          VALUES (?, ?, ?, ?, ?)
        `);
        data.countdowns.forEach(countdown => {
          insertCountdown.run(
            countdown.id || `countdown_${Date.now()}`,
            countdown.name || 'Etkinlik',
            countdown.date || new Date().toISOString().split('T')[0],
            countdown.type || 'event',
            countdown.icon || ''
          );
        });
      }

      // Marquee texts
      this.db.prepare('DELETE FROM marquee_texts').run();
      if (data.marqueeTexts && data.marqueeTexts.length > 0) {
        const insertMarquee = this.db.prepare(`
          INSERT INTO marquee_texts (id, text, priority)
          VALUES (?, ?, ?)
        `);
        data.marqueeTexts.forEach(marquee => {
          insertMarquee.run(
            marquee.id || `marquee_${Date.now()}`,
            marquee.text || 'Kayan yazı',
            marquee.priority || 'normal'
          );
        });
      }

      // Quotes
      this.db.prepare('DELETE FROM quotes').run();
      if (data.quotes && data.quotes.length > 0) {
        const insertQuote = this.db.prepare(`
          INSERT INTO quotes (id, type, text, source)
          VALUES (?, ?, ?, ?)
        `);
        data.quotes.forEach(quote => {
          insertQuote.run(
            quote.id || `quote_${Date.now()}`,
            quote.type || 'quote',
            quote.text || 'Alıntı',
            quote.source || ''
          );
        });
      }

      // Bell schedule
      this.db.prepare('DELETE FROM bell_schedule').run();
      if (data.bellSchedule && data.bellSchedule.length > 0) {
        const insertBell = this.db.prepare(`
          INSERT INTO bell_schedule (id, type, name, start_time, end_time, order_num)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        data.bellSchedule.forEach(bell => {
          insertBell.run(
            bell.id || `bell_${Date.now()}`,
            bell.type || 'lesson',
            bell.name || 'Ders',
            bell.startTime || '08:00',
            bell.endTime || '08:45',
            bell.order || 1
          );
        });
      }

      // Day schedules
      this.db.prepare('DELETE FROM day_schedules').run();
      if (data.daySchedules && data.daySchedules.length > 0) {
        const insertDaySchedule = this.db.prepare(`
          INSERT INTO day_schedules (id, day, schedule_json)
          VALUES (?, ?, ?)
        `);
        data.daySchedules.forEach(daySchedule => {
          insertDaySchedule.run(
            daySchedule.id || `dayschedule_${Date.now()}`,
            daySchedule.day || 'all',
            JSON.stringify(daySchedule.schedule || [])
          );
        });
      }

      // Config
      this.db.prepare('DELETE FROM config').run();
      if (data.config) {
        const insertConfig = this.db.prepare(`
          INSERT INTO config (key, value)
          VALUES (?, ?)
        `);
        Object.entries(data.config).forEach(([key, value]) => {
          insertConfig.run(key, value || '');
        });
      }
    });

    transaction();
  }

  // Backup ve Restore
  async backup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(
        path.dirname(this.dbPath),
        `backup-${timestamp}.db`
      );
      
      fs.copyFileSync(this.dbPath, backupPath);
      return backupPath;
    } catch (error) {
      console.error('Backup hatası:', error);
      throw error;
    }
  }

  async restore(backupPath) {
    try {
      if (!fs.existsSync(backupPath)) {
        throw new Error('Backup dosyası bulunamadı');
      }

      // Mevcut veritabanını yedekle
      const currentBackup = await this.backup();
      
      // Backup'ı geri yükle
      fs.copyFileSync(backupPath, this.dbPath);
      
      // Veritabanını yeniden başlat
      this.db.close();
      this.init();
      
      return currentBackup;
    } catch (error) {
      console.error('Restore hatası:', error);
      throw error;
    }
  }

  // App metadata
  async setAppMetadata(key, value) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO app_metadata (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `);
    stmt.run(key, value);
  }

  async getAppMetadata(key) {
    const stmt = this.db.prepare('SELECT value FROM app_metadata WHERE key = ?');
    const result = stmt.get(key);
    return result ? result.value : null;
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

export default DatabaseManager;
