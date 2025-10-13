# 🚀 Lovelied Board - Başka Bilgisayarda Kullanım Kılavuzu

Bu kılavuz, Lovelied Board uygulamasını başka bir bilgisayarda kullanmanız için hazırlanmıştır.

## 📋 **Hangi Seçeneği Seçmeliyim?**

| Seçenek | Zorluk | Hız | Önerilen Durum |
|---------|--------|-----|----------------|
| **Hazır Uygulama** | ⭐ | ⚡⚡⚡ | Hızlı test, tek kullanım |
| **Web Uygulaması** | ⭐⭐ | ⚡⚡ | Sürekli kullanım, çoklu erişim |
| **Taşınabilir Versiyon** | ⭐ | ⚡⚡ | Kolay kurulum, otomatik setup |

---

## 🎯 **Seçenek 1: Hazır Uygulama Dosyalarını Kullanma**

### ✅ **Avantajlar:**
- Hiçbir kurulum gerektirmez
- Sadece çalıştırılır
- En hızlı yöntem
- İnternet bağlantısı gerekmez

### 📦 **Windows için:**
1. `release/Lovelied Board 0.0.0.exe` dosyasını kopyalayın
2. Bu dosyayı Windows bilgisayarına götürün
3. Dosyaya çift tıklayarak çalıştırın
4. İlk açılışta veri dosyaları otomatik oluşturulur

### 🍎 **Mac için:**
1. `release/mac-arm64/Lovelied Board.app/` klasörünü kopyalayın
2. Bu klasörü Mac bilgisayarına götürün
3. `.app` dosyasına çift tıklayarak çalıştırın

### ⚠️ **Notlar:**
- İlk çalıştırmada biraz yavaş olabilir
- Veriler uygulama klasöründe saklanır
- Her bilgisayar kendi verilerini tutar

---

## 🌐 **Seçenek 2: Web Uygulaması Olarak Çalıştırma (Önerilen)**

### ✅ **Avantajlar:**
- Herhangi bir işletim sisteminde çalışır
- Tarayıcıdan erişilebilir
- Birden fazla kişi aynı anda kullanabilir
- Veriler paylaşılabilir

### 📋 **Gereksinimler:**
- **Node.js** (v16 veya üzeri) - [nodejs.org](https://nodejs.org) adresinden indirin
- **İnternet bağlantısı** (sadece ilk kurulum için)

### 🔧 **Adımlar:**

#### 1. Projeyi Kopyalama:
```bash
# Tüm proje klasörünü kopyalayın
cp -r lovelied-board /yeni/bilgisayar/yolu/
```

#### 2. Kurulum:
```bash
# Proje klasörüne gidin
cd /yeni/bilgisayar/yolu/lovelied-board

# Bağımlılıkları yükleyin
npm install

# Uygulamayı build edin
npm run build

# Sunucuyu başlatın
npm start
```

#### 3. Kullanım:
- **Ana Pano:** http://localhost:8080
- **Admin Panel:** http://localhost:8080/admin

### 🔄 **Otomatik Başlatma:**
```bash
# Mac/Linux için
./start.sh

# Windows için
start.bat
```

---

## 📱 **Seçenek 3: Taşınabilir Versiyon (YENİ!)**

### ✅ **Avantajlar:**
- Otomatik kurulum
- Hata kontrolü
- Kolay kullanım
- Tüm işlemler otomatik

### 🚀 **Kullanım:**

#### Mac/Linux için:
```bash
# Proje klasörüne gidin
cd lovelied-board

# Taşınabilir scripti çalıştırın
./portable-start.sh
```

#### Windows için:
```cmd
# Proje klasörüne gidin
cd lovelied-board

# Taşınabilir scripti çalıştırın
portable-start.bat
```

### 🎯 **Bu Script Ne Yapar?**
1. ✅ Node.js ve npm kontrolü
2. 📁 Gerekli klasörleri oluşturur
3. 📦 Bağımlılıkları otomatik yükler
4. 🔨 Uygulamayı build eder
5. 🚀 Sunucuyu başlatır
6. 🌐 Tarayıcı linklerini gösterir

---

## 📊 **Veri Yönetimi**

### 📁 **Veriler Nerede Saklanır?**
```
public/user-data/
├── board.json          # Ana veri dosyası
└── media/             # Yüklenen görseller
    ├── image1.jpg
    ├── image2.png
    └── ...
```

### 💾 **Veri Yedekleme:**
```bash
# Yedek oluştur
cp -r public/user-data public/user-data-backup-$(date +%Y%m%d)

# Yedekten geri yükle
cp -r public/user-data-backup-20250107/* public/user-data/
```

### 🔄 **Veri Taşıma:**
1. `public/user-data/` klasörünü kopyalayın
2. Yeni bilgisayarda aynı konuma yapıştırın
3. Uygulamayı başlatın

---

## 🛠️ **Sorun Giderme**

### ❌ **"Node.js bulunamadı" Hatası:**
1. [nodejs.org](https://nodejs.org) adresinden Node.js'i indirin
2. Kurulumu tamamlayın
3. Bilgisayarı yeniden başlatın
4. Terminal/CMD'de `node --version` yazarak kontrol edin

### ❌ **"Port zaten kullanımda" Hatası:**
```bash
# Farklı port kullanın
PORT=3000 npm start
```

### ❌ **"Bağımlılık yükleme hatası":**
```bash
# npm cache temizle
npm cache clean --force

# node_modules sil ve tekrar yükle
rm -rf node_modules
npm install
```

### ❌ **"Build hatası":**
```bash
# Bağımlılıkları güncelle
npm update

# Tekrar build et
npm run build
```

---

## 🔧 **Gelişmiş Ayarlar**

### 🌐 **Port Değiştirme:**
```bash
# Geçici olarak
PORT=3000 npm start

# Kalıcı olarak (server.js dosyasını düzenleyin)
```

### 🕐 **Otomatik Başlatma:**
```bash
# Windows için (Başlangıç klasörüne kısayol ekleyin)
# Mac için (Login Items'a ekleyin)
# Linux için (systemd service oluşturun)
```

---

## 📞 **Destek**

### 🆘 **Yardım Gerekiyorsa:**
1. Bu kılavuzu tekrar okuyun
2. Hata mesajını not edin
3. İşletim sisteminizi belirtin
4. Node.js versiyonunuzu kontrol edin: `node --version`

### 📝 **Başarılı Kurulum Kontrolü:**
- ✅ Node.js yüklü: `node --version`
- ✅ npm yüklü: `npm --version`
- ✅ Proje klasörü mevcut
- ✅ Bağımlılıklar yüklü: `node_modules` klasörü var
- ✅ Build başarılı: `dist` klasörü var
- ✅ Sunucu çalışıyor: http://localhost:8080 açılıyor

---

**🎉 Artık Lovelied Board'u herhangi bir bilgisayarda kullanabilirsiniz!**

*Son güncelleme: 2025-01-07*
