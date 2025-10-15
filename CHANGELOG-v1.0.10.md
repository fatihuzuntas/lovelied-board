# Digital Board v1.0.10 - Kritik Düzeltmeler

Bu sürüm, macOS kurulum sorunu ve güncelleme notları görüntüleme sorununu çözer.

## 🐛 Kritik Düzeltmeler

### 🍎 macOS Kurulum Sorunu
- **"Kur ve Yeniden Başlat" butonu düzeltildi:** macOS'ta kurulum butonu artık çalışıyor
- **quitAndInstall parametreleri düzeltildi:** `quitAndInstall(false, true)` ile kullanıcıya bildirim gösterilip otomatik başlatma sağlanıyor
- **Kurulum sonrası otomatik başlatma:** Güncelleme kurulumundan sonra uygulama otomatik olarak yeniden başlayacak

### 📝 Güncelleme Notları Temizleme İyileştirmesi
- **Debug logları eklendi:** Güncelleme notları temizleme işlemi artık console'da görülebilir
- **Geliştirilmiş temizleme:** HTML etiketleri ve markdown formatlaması daha etkili şekilde temizleniyor
- **Fazla boşluk temizleme:** Gereksiz satır aralıkları otomatik olarak düzenleniyor

## 🔧 Teknik Detaylar

- **macOS kurulum:** `autoUpdater.quitAndInstall(false, true)` parametreleri ile düzgün çalışıyor
- **Console debugging:** `cleanMarkdownContent` fonksiyonu artık console'da işlem sonuçlarını gösteriyor
- **HTML temizleme:** Regex pattern'leri iyileştirildi

## 📋 Kurulum

**Windows:** Digital-Board-Setup-1.0.10.exe  
**macOS:** Digital-Board-1.0.10-arm64.dmg

## 🔄 Test Senaryosu

1. **macOS kullanıcıları için:**
   - Güncelleme indir
   - "Kur ve Yeniden Başlat" butonuna tıkla
   - Uygulama artık düzgün şekilde kurulacak ve yeniden başlayacak

2. **Güncelleme notları için:**
   - "Güncelleme Kontrol Et" butonuna tıkla
   - Console'da temizleme işlemini gözlemle
   - HTML etiketleri olmadan temiz içerik göreceksin

## 🍎 macOS Kullanıcıları için

İlk açılışta "hasar görmüş" uyarısı alırsanız:
1. System Preferences → Security & Privacy → General
2. "Digital Board" için "Allow anyway" seçeneğine tıklayın
3. Veya Terminal: `sudo xattr -rd com.apple.quarantine "/Applications/Digital Board.app"`

---

**Not:** Bu sürüm, macOS kurulum sorununu tamamen çözer ve güncelleme notlarının düzgün görüntülenmesini sağlar.
