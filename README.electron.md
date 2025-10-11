# Lovelied Board - Electron Desktop Uygulaması

## Kurulum ve Geliştirme

### Gereksinimler
- Node.js (v18 veya üzeri)
- npm

### Kurulum
```bash
npm install
```

### Geliştirme Modunda Çalıştırma

**1. Web Geliştirme (Tarayıcıda)**
```bash
npm run dev
```
Tarayıcıda `http://localhost:8080` adresini açın.

**2. Electron Geliştirme (Desktop App)**
```bash
npm run electron:dev
```
Bu komut otomatik olarak Vite dev server'ı başlatır ve **iki ayrı Electron penceresi** açar:
- **Pano Görünümü** - Ana board ekranı
- **Admin Paneli** - İçerik yönetimi ekranı

### Production Build

**Tüm Platformlar İçin**
```bash
npm run electron:build
```

**Platform-Özel Build'ler**
```bash
# macOS için
npm run electron:build:mac

# Windows için
npm run electron:build:win

# Linux için
npm run electron:build:linux
```

Build edilen uygulama `release/` klasöründe oluşturulur.

## Özellikler

### 🖥️ Çift Pencere Sistemi
- **Pano Görünümü** - Ana board ekranı (1400x900)
- **Admin Paneli** - İçerik yönetimi (1200x800)
- Her iki pencere aynı anda açık kalabilir
- Klavye kısayolları: `Ctrl+1` (Pano), `Ctrl+2` (Admin)

### 🔄 Canlı Güncelleme
- Admin panelinde yapılan değişiklikler anında pano görünümünde görünür
- Gerçek zamanlı senkronizasyon
- Aynı veri kaynağını paylaşır

### Tam Offline Çalışma
- Tüm veriler kullanıcının bilgisayarında `user-data/` klasöründe saklanır
- İnternet bağlantısı gerektirmez
- Git pull/push işlemlerinde kullanıcı verileri korunur

### Veri Saklama Konumu

**Geliştirme Modunda:**
- Proje klasöründe: `./user-data/`

**Production Modunda (Kurulu Uygulamada):**
- macOS: `~/Library/Application Support/Lovelied Board/user-data/`
- Windows: `%APPDATA%/Lovelied Board/user-data/`
- Linux: `~/.config/Lovelied Board/user-data/`

### Veri Yapısı
```
user-data/
├── board.json          # Tüm uygulama verileri
└── images/             # Yüklenen medya dosyaları
    ├── logo.png
    ├── slide1.jpg
    └── ...
```

## Kullanım

1. **Admin Paneli:** `/admin` sayfasından içerik yönetimi yapın
2. **Board Görünümü:** Ana sayfa `/` üzerinden panonuzu görüntüleyin
3. **Verileriniz Güvende:** Tüm değişiklikler otomatik olarak lokal dosyalara kaydedilir

## Teknik Detaylar

### API Endpoints (Lokal)
- `GET /api/board` - Tüm verileri getir
- `PUT /api/board` - Verileri güncelle
- `POST /api/upload` - Medya dosyası yükle
- `GET /user-data/images/:filename` - Görsel/video dosyası getir

### Teknolojiler
- **Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Desktop:** Electron
- **Lokal API:** Express.js (Production) / Vite Middleware (Development)
- **Veri Depolama:** Lokal JSON dosyası + dosya sistemi

## Sorun Giderme

### "Veriler kayboldu" durumunda
Verileriniz kaybolmadı! İlgili platforma göre veri klasörünü kontrol edin (yukarıdaki "Veri Saklama Konumu" bölümüne bakın).

### Build hatası alıyorsanız
```bash
# Önce temizlik yapın
rm -rf node_modules dist release
npm install
npm run build
npm run electron:build
```

### Geliştirme modunda hot-reload çalışmıyorsa
`npm run electron:dev` yerine iki terminal kullanın:
1. Terminal 1: `npm run dev`
2. Terminal 2: `cross-env NODE_ENV=development electron .`

## Lisans
MIT

