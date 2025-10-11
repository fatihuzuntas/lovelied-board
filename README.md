# 🎯 Lovelied Board - Offline Okul Panosu

Modern, offline çalışan dijital okul panosu sistemi. Tamamen internet bağlantısı olmadan çalışır ve tüm veriler yerel olarak saklanır.

## ✨ Özellikler

- 📢 **Duyuru Slaytları**: Görselli duyurular ve haberler
- 👥 **Nöbetçi Bilgileri**: Öğretmen ve öğrenci nöbetçileri
- 🎂 **Doğum Günleri**: Öğrenci ve personel doğum günü kutlamaları
- ⏰ **Geri Sayım**: Önemli etkinlik ve tarihler
- 📜 **Kayan Yazı**: Önemli duyurular
- 💭 **Ayet & Hadis & Söz**: Günlük öğüt ve sözler
- 🔔 **Zil Programı**: Ders ve teneffüs saatleri
- 🌐 **Tamamen Offline**: İnternet bağlantısı gerektirmez
- 💾 **Yerel Veri Saklama**: Tüm veriler `public/user-data/` klasöründe saklanır
- 🖼️ **Medya Yönetimi**: Görseller yerel olarak kaydedilir

## 🚀 Kurulum

### Gereksinimler

- Node.js (v16 veya üzeri) - [İndirmek için](https://nodejs.org)
- npm (Node.js ile birlikte gelir)

### Adım 1: Paketleri Yükleyin

```bash
npm install
```

## 📖 Kullanım

### Development Modu (Geliştirme)

Geliştirme yaparken bu modu kullanın:

```bash
npm run dev
```

Tarayıcıda `http://localhost:8080` adresini açın.

### Production Modu (Canlı Kullanım)

Okulda kullanmak için production modunu kullanın:

#### Otomatik Başlatma (Önerilen)

**Mac/Linux:**
```bash
./start.sh
```

**Windows:**
```
start.bat
```

#### Manuel Başlatma

```bash
# 1. Build
npm run build

# 2. Server'ı başlat
npm start
```

Tarayıcıda `http://localhost:8080` adresini açın.

## 🎨 Admin Paneli

Admin paneline erişmek için:
```
http://localhost:8080/admin
```

Admin panelinden:
- Slayt ekle/düzenle/sil
- Nöbetçi bilgilerini güncelle
- Doğum günü ekle
- Geri sayım oluştur
- Kayan yazı yönet
- Ayet/Hadis/Söz ekle
- Zil programı ayarla
- Okul ayarlarını düzenle

## 💾 Veri Yönetimi

### Veriler Nerede Saklanır?

Tüm veriler `public/user-data/` klasöründe saklanır:

```
public/user-data/
├── board.json          # Ana veri dosyası
└── media/             # Yüklenen görseller
    ├── image1.jpg
    ├── image2.png
    └── ...
```

### Git ile Çalışma

`.gitignore` dosyasında `user-data/` klasörü zaten eklenmiştir. Bu sayede:

✅ `git pull` yaptığınızda verileriniz değişmez
✅ Her okul kendi verilerini korur
✅ Kod güncellemeleri verilerinizi etkilemez

### Yedekleme

Verilerinizi yedeklemek için `public/user-data/` klasörünü kopyalayın:

```bash
# Yedek oluştur
cp -r public/user-data public/user-data-backup-$(date +%Y%m%d)

# Yedekten geri yükle
cp -r public/user-data-backup-20250107/* public/user-data/
```

## 🔧 Yapılandırma

### Port Değiştirme

Varsayılan port `8080`. Değiştirmek için:

```bash
PORT=3000 npm start
```

veya `server.js` dosyasında düzenleyin.

### Saat Dilimi

Admin panelinden "Ayarlar" bölümünden saat dilimini ayarlayabilirsiniz.

## 📂 Proje Yapısı

```
lovelied-board/
├── public/
│   └── user-data/          # Kullanıcı verileri (Git'te takip edilmez)
│       ├── board.json
│       └── media/
├── src/
│   ├── components/
│   │   ├── admin/          # Admin panel bileşenleri
│   │   └── board/          # Pano bileşenleri
│   ├── pages/
│   │   ├── Board.tsx       # Ana pano sayfası
│   │   └── Admin.tsx       # Admin sayfası
│   └── lib/
│       └── storage.ts      # Veri yönetimi
├── server.js               # Production server
├── start.sh               # Unix/Mac başlatma script'i
├── start.bat              # Windows başlatma script'i
└── vite.config.ts         # Vite yapılandırması
```

## 🛠️ Teknolojiler

- **React** - UI framework
- **TypeScript** - Tip güvenliği
- **Vite** - Build tool
- **Express** - Production server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI bileşenleri
- **Lucide React** - İkonlar

## 🔄 Güncelleme

Kod güncellemelerini almak için:

```bash
# Değişiklikleri al (veriler korunur)
git pull

# Paketleri güncelle
npm install

# Yeniden build et
npm run build

# Server'ı yeniden başlat
npm start
```

## 📝 Notlar

- **Offline Çalışma**: Sistem tamamen offline çalışır, internet bağlantısı gerekmez
- **Çoklu Lokasyon**: Her lokasyon kendi verilerini korur
- **Veri Güvenliği**: Veriler local'de saklanır, dışarıya gönderilmez
- **Kolay Yedekleme**: `user-data` klasörünü kopyalayarak yedek alabilirsiniz

## 🐛 Sorun Giderme

### Port zaten kullanımda hatası

Başka bir port kullanın:
```bash
PORT=3000 npm start
```

### Veriler görünmüyor

1. `public/user-data/board.json` dosyasının varlığını kontrol edin
2. Dosya izinlerini kontrol edin
3. Server'ı yeniden başlatın

### Görseller yüklenmiyor

1. `public/user-data/media/` klasörünün varlığını kontrol edin
2. Klasör yazma izinlerini kontrol edin

## 📄 Lisans

MIT License

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.

---

**Developed with ❤️ for education**
