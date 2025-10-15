# Digital Board v1.0.9 - Markdown Güncelleme Notları Düzeltmesi

Bu sürüm, GitHub'dan çekilen güncelleme notlarının temiz ve okunabilir şekilde gösterilmesi için önemli bir düzeltme içeriyor.

## 🎯 Ana Özellik

### 📝 Güncelleme Notları Temizleme
- **Markdown içeriği düzeltmesi:** GitHub'dan çekilen güncelleme notları artık HTML etiketleri olmadan gösteriliyor
- **Temiz görünüm:** `<h2>`, `<p>`, `<ul>`, `<li>` gibi HTML etiketleri otomatik olarak kaldırılıyor
- **Okunabilir format:** Markdown başlıkları, kalın/italik metinler ve liste işaretleri düzgün şekilde gösteriliyor
- **HTML entities çözümleme:** `&lt;`, `&gt;`, `&amp;` gibi HTML karakterleri düzgün şekilde decode ediliyor

## 🔧 Teknik Detaylar

- **cleanMarkdownContent fonksiyonu:** Güncelleme notlarını temizleyen yeni helper fonksiyon eklendi
- **HTML etiket temizleme:** Tüm HTML etiketleri regex ile kaldırılıyor
- **Markdown format düzenleme:** Başlıklar, kalın/italik metinler, kod blokları ve linkler düzgün şekilde işleniyor
- **Liste formatı:** Numaralı ve madde işaretli listeler bullet point'lere dönüştürülüyor

## 📋 Kurulum

**Windows:** Digital-Board-Setup-1.0.9.exe  
**macOS:** Digital-Board-1.0.9-arm64.dmg

## 🔄 Güncelleme Deneyimi

Bu sürümden sonra kullanıcılar:
- "Güncelleme Kontrol Et" butonuna tıkladığında GitHub'dan çekilen güncelleme notlarını temiz ve okunabilir şekilde görecek
- HTML etiketleri olmadan düzgün formatlanmış metin görecek
- Markdown başlıkları ve formatlaması düzgün şekilde işlenecek

## 🎨 Görsel İyileştirme

- **Önceki durum:** `<h2>Digital Board v1.0.8</h2><p>Bu sürüm...</p>`
- **Yeni durum:** `Digital Board v1.0.8\n\nBu sürüm...`

Artık güncelleme notları tamamen temiz ve kullanıcı dostu şekilde görüntüleniyor!

---

**Not:** Bu sürüm, güncelleme deneyimini önemli ölçüde iyileştirir ve kullanıcıların güncelleme notlarını daha rahat okumasını sağlar.
