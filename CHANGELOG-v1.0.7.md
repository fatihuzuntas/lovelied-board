# Digital Board v1.0.7 - Otomatik Güncelleme Düzeltmeleri

Bu sürüm, otomatik güncelleme sistemindeki kritik hataları düzeltir ve tüm kullanıcılar için sorunsuz güncelleme deneyimi sağlar.

## 🐛 Kritik Düzeltmeler

- **"Güncelleme yapılandırması bulunamadı" hatası düzeltildi:** Gereksiz dosya kontrolü kaldırıldı, electron-updater artık GitHub'dan doğrudan güncelleme bilgilerini alıyor
- **Mac otomatik güncelleme sorunu çözüldü:** İndirme takılması ve event iletimi sorunları giderildi
- **Windows 404 hatası düzeltildi:** Dosya adlandırma standardize edildi, URL uyuşmazlıkları çözüldü
- **Sürüm karşılaştırma mantığı iyileştirildi:** Aynı sürümde "güncelleme mevcut" hatası artık gösterilmiyor

## ✨ İyileştirmeler

- GitHub provider yapılandırması eklendi (fatihuzuntas/lovelied-board)
- Tüm güncelleme event'leri renderer process'e iletiliyor (indirme ilerlemesi, hata bildirimleri)
- Dosya adlandırma standardize edildi (boşluk yerine tire kullanımı)

## 📋 Kurulum

**Windows:** Digital-Board-Setup-1.0.7.exe  
**macOS:** Digital-Board-1.0.7-arm64.dmg

## 🔄 Otomatik Güncelleme

Bu sürümden sonra tüm kullanıcılar:
- Admin panelinden "Güncelleme Kontrol Et" butonuna tıklayarak yeni sürümleri görebilecek
- "İndir" butonuyla güncellemeleri otomatik indirebilecek  
- "Kur ve Yeniden Başlat" ile uygulamayı güncelleyebilecek

⚠️ **ÖNEMLİ:** Bu sürüm, önceki sürümlerdeki (1.0.5, 1.0.6) tüm güncelleme sorunlarını çözer. Otomatik güncelleme sistemini kullanmak için bu sürüme geçiş gereklidir.

## 🍎 macOS Kullanıcıları için

İlk açılışta "hasar görmüş" uyarısı alırsanız:
1. System Preferences → Security & Privacy → General
2. "Digital Board" için "Allow anyway" seçeneğine tıklayın
3. Veya Terminal: `sudo xattr -rd com.apple.quarantine "/Applications/Digital Board.app"`

Bu normal bir durumdur ve Apple Developer sertifikasının bulunmamasından kaynaklanır.
