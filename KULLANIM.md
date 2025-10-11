# 🚀 Hızlı Başlangıç Kılavuzu

## İlk Kurulum (Sadece Bir Kez)

### 1. Paketleri Yükleyin

Terminal'i açın ve proje klasöründe şu komutu çalıştırın:

```bash
npm install
```

Bu işlem 1-2 dakika sürebilir. İnternet bağlantısı gereklidir (sadece ilk kurulumda).

## Her Gün Kullanım

### Uygulamayı Başlatma

#### Windows Kullanıcıları:
- `start.bat` dosyasına çift tıklayın
- VEYA terminal'de: `start.bat`

#### Mac/Linux Kullanıcıları:
Terminal'de şu komutu çalıştırın:
```bash
./start.sh
```

### Uygulamayı Açma

Tarayıcınızda şu adresi açın:
```
http://localhost:8080
```

> 💡 **İpucu**: Bu adresi tarayıcınızın sık kullanılanlarına ekleyin!

## Ekranlar

### 📺 Ana Pano
- Adres: `http://localhost:8080`
- Öğrencilere gösterilecek ana ekran
- Slayt gösterimi, nöbetçi bilgileri, doğum günleri vb.
- Tam ekran modunda kullanın (F11 tuşu)

### ⚙️ Admin Paneli
- Adres: `http://localhost:8080/admin`
- İçerik düzenleme ve yönetim
- Sadece yöneticiler tarafından kullanılır

## Admin Paneli Kullanımı

### 1. Slayt Yönetimi
- **Slayt Ekle**: Yeni duyuru veya haber ekleyin
- **Görsel Yükle**: Bilgisayarınızdan görsel seçin (otomatik kaydedilir)
- **Animasyon**: Slayt geçiş efekti seçin
- **Süre**: Slayt gösterim süresini ayarlayın (saniye)

### 2. Nöbetçi Bilgileri
- Tarih seçin
- Öğretmen nöbetçileri ekleyin
- Öğrenci nöbetçileri ekleyin
- Alan bilgilerini girin (Kat 1, Bahçe, vb.)

### 3. Doğum Günleri
- Öğrenci/Personel seçin
- İsim, doğum tarihi ve sınıf bilgilerini girin
- Bugün doğum günü olanlar otomatik görünür

### 4. Geri Sayım
- Önemli tarih ekleyin (sınav, tatil, etkinlik)
- İkon seçin
- Kalan gün otomatik hesaplanır

### 5. Kayan Yazı
- Önemli duyuruları yazın
- Öncelik seviyesi belirleyin
- Ekranın alt kısmında sürekli akar

### 6. Ayet/Hadis/Söz
- Tip seçin (Ayet, Hadis, Söz)
- Metni ve kaynağı yazın
- Her gün farklı biri gösterilir

### 7. Zil Programı
- Ders ve teneffüs saatlerini ayarlayın
- Başlangıç ve bitiş saatlerini girin
- Günlere göre farklı programlar oluşturun

### 8. Genel Ayarlar
- Okul adı
- Renk teması
- Saat dilimi

## Veri Yönetimi

### Veriler Nerede?

Tüm veriler şu klasördedir:
```
public/user-data/
├── board.json       # Tüm içerik
└── media/          # Yüklenen görseller
```

### Yedekleme

**Önemli!** Düzenli yedek alın:

1. `public/user-data` klasörünü kopyalayın
2. USB belleğe veya başka bir diske kaydedin
3. Tarih ile adlandırın (örn: `yedek-2025-10-07`)

### Geri Yükleme

Yedekten geri yüklemek için:

1. Yedek klasörünü açın
2. İçindekileri `public/user-data/` klasörüne kopyalayın
3. Uygulamayı yeniden başlatın

## Git Güncellemeleri

Yeni özellikler eklendiğinde:

```bash
# 1. Güncellemeleri çek
git pull

# 2. Paketleri güncelle  
npm install

# 3. Uygulamayı yeniden başlat
./start.sh    # veya start.bat
```

> ✅ **Verileriniz korunur!** Git pull yaptığınızda `user-data/` klasörü değişmez.

## Çoklu Lokasyon Kullanımı

Farklı okullarda veya binalarda kullanmak için:

1. Kodu her lokasyona kopyalayın (git clone)
2. Her lokasyon kendi `npm install` yapacak
3. Her lokasyon kendi verilerini oluşturacak
4. Kod güncellemeleri tüm lokasyonlara `git pull` ile gelecek
5. Veriler lokasyona özel kalacak

**Örnek:**
```
Okul A: public/user-data/board.json (kendi verileri)
Okul B: public/user-data/board.json (kendi verileri)
Okul C: public/user-data/board.json (kendi verileri)
```

## Sık Sorulan Sorular

### ❓ İnternet gerekli mi?

**Hayır!** İlk kurulumdan sonra tamamen offline çalışır.

### ❓ Başka bir bilgisayardan erişebilir miyim?

Evet, aynı ağdaysa:
```
http://[SUNUCU-IP]:8080
```

Sunucu IP'sini bulmak için:
- Windows: `ipconfig`
- Mac/Linux: `ifconfig` veya `ip addr`

### ❓ Hangi tarayıcıyı kullanmalıyım?

Chrome, Firefox, Edge - hepsi çalışır. Chrome önerilir.

### ❓ Tam ekran nasıl yaparım?

- **Windows/Linux**: F11 tuşu
- **Mac**: Cmd + Ctrl + F

### ❓ Veriler silinir mi?

**Hayır!** Tüm veriler `public/user-data/` klasöründe güvenle saklanır. Git pull yapınca değişmez.

### ❓ Kaç tane slayt ekleyebilirim?

Sınır yok! Ancak 10-15 slayt optimum görünüm için yeterlidir.

### ❓ Görsel boyutu ne olmalı?

Önerilen: 1920x1080 veya 16:9 oran. Maksimum dosya boyutu önemli değil, otomatik işlenir.

## Performans İpuçları

1. **Görsel Optimizasyonu**: Büyük görselleri yüklemeden önce sıkıştırın
2. **Slayt Sayısı**: 15-20 slayt ideal
3. **Animasyonlar**: Ağır animasyonlar yavaş bilgisayarlarda sorun olabilir
4. **Tarayıcı Cache**: Ara sıra tarayıcı cache'ini temizleyin (Ctrl+Shift+Del)

## Teknik Destek

Sorun yaşarsanız:

1. Server'ı yeniden başlatın
2. Tarayıcı cache'ini temizleyin
3. `public/user-data/board.json` dosyasının var olduğunu kontrol edin
4. Terminal/Konsol'da hata mesajlarına bakın

## Güvenlik

- Admin paneline şifre eklemek için başka araçlar kullanabilirsiniz
- Yerel ağ dışından erişimi kapatın
- Düzenli yedek alın

---

**İyi Kullanımlar! 🎓**

