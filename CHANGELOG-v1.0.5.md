# Digital Board v1.0.5

Bu sürüm, kullanım kolaylığını artıran yeni klavye kısayolları, önemli mantıksal iyileştirmeler ve arayüz güncellemeleri içeriyor.

## 🚀 Yeni Özellikler

- **Board sayfasına pratik zoom kısayolları eklendi:**
  - Görünümü Büyüt: `Ctrl/Cmd` + `ö`
  - Görünümü Küçült: `Ctrl/Cmd` + `ç`
  - Varsayılan Boyuta Dön: `Ctrl/Cmd` + `0`

## ✨ İyileştirmeler ve Arayüz

- **Zil saati mantığı geliştirildi:** Günün son dersi bittikten sonra, sayaç artık bir sonraki iş gününün ilk ders saatini gösteriyor (Örn: Cuma akşamından Pazartesi 08:20'ye kadar).
- **Güncelleme durumu bildirimleri iyileştirildi:** Artık uygulama güncel olduğunda sağ altta "Uygulama Güncel!" yazan animasyonlu bir bildirim gösteriliyor ve masaüstü kontrol uyarısı daha anlaşılır hale getirildi.
- **Daha ferah arayüz:** Admin panelindeki menünün altına uygulamanın mevcut sürüm bilgisi eklendi ve genel yerleşime daha geniş `padding` değerleri uygulanarak ferah bir görünüm sağlandı.

## 🏷️ Marka

- Uygulamanın adı resmi olarak **"Digital Board"** olarak güncellendi.

## 🛠️ Düzeltmeler ve Performans

- Uygulama genelinde çeşitli minör hata düzeltmeleri yapıldı ve performans artırıcı optimizasyonlar entegre edildi.

## 📋 Kurulum Notları

⚠️ **ÖNEMLİ:** Bu sürümde uygulama adı "Digital Board" olarak değişti. Manuel kurulum gerekli. Sonraki güncellemeler otomatik olacak.

### macOS Kullanıcıları için:
Uygulama ilk açılışta "hasar görmüş" uyarısı verebilir. Bu normaldir, çünkü Apple Developer sertifikası ile imzalanmamıştır.

**Çözüm:**
1. System Preferences → Security & Privacy → General
2. "Digital Board" açılmaya çalışıldığında "Allow anyway" butonuna tıklayın
3. Veya Terminal'den: `sudo xattr -rd com.apple.quarantine "/Applications/Digital Board.app"`
