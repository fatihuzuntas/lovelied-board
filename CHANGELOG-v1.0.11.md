# Digital Board v1.0.11

Bu sürüm, zoom işlevselliğini Chrome benzeri davranışa güncelleyen önemli bir iyileştirme içeriyor.

## 🚀 Yeni Özellikler ve İyileştirmeler

- **Chrome benzeri zoom davranışı:**
  - Zoom işlemi artık `transform: scale()` yerine CSS `zoom` property kullanıyor
  - Layout'u yeniden hesaplıyor, sadece görsel zoom yapmıyor
  - Chrome'daki yakınlaştırma/uzaklaştırma gibi doğal görünüm

- **Geliştirilmiş zoom seviyeleri:**
  - Önceki: 0.1'er artış/azalış (0.5x - 3x arası)
  - Yeni: Sabit Chrome benzeri seviyeler: 50%, 75%, 90%, 100%, 110%, 125%, 150%, 175%, 200%, 250%, 300%
  - Zoom seviyeleri arasında adım adım geçiş

- **Aynı klavye kısayolları korundu:**
  - Görünümü Büyüt: `Ctrl/Cmd` + `ö`
  - Görünümü Küçült: `Ctrl/Cmd` + `ç`
  - Varsayılan Boyuta Dön: `Ctrl/Cmd` + `0`

## 🛠️ Teknik İyileştirmeler

- CSS `zoom` property implementasyonu
- React `useMemo` optimizasyonu zoom seviyeleri için
- Daha smooth zoom geçişleri
- Linter uyarılarının giderilmesi

## 📋 Kurulum Notları

Bu sürüm önceki sürümlerle uyumludur. Manuel kurulum gerekmez, otomatik güncelleme yapılabilir.

### macOS Kullanıcıları için:
Uygulama ilk açılışta "hasar görmüş" uyarısı verebilir. Bu normaldir, çünkü Apple Developer sertifikası ile imzalanmamıştır.

**Çözüm:**
1. System Preferences → Security & Privacy → General
2. "Digital Board" açılmaya çalışıldığında "Allow anyway" butonuna tıklayın
3. Veya Terminal'den: `sudo xattr -rd com.apple.quarantine "/Applications/Digital Board.app"`

## 🎯 Kullanıcı Deneyimi

- Zoom işlemi artık Chrome'daki gibi doğal ve beklenen şekilde çalışıyor
- Layout bozulmadan zoom yapılıyor
- Sabit zoom seviyeleri ile daha kontrollü yakınlaştırma/uzaklaştırma
- Mevcut klavye kısayolları korundu

---

**Sürüm:** 1.0.11  
**Tarih:** 2024  
**Geliştirici:** Fatih Uzuntaş
