Set objShell = CreateObject("WScript.Shell")
Set objExec = objShell.Exec("cmd /c """ & Replace(WScript.ScriptFullName, ".vbs", ".bat") & """")
Do While objExec.Status = 0
  WScript.Sleep 100
Loop

## Windows'ta Build Alma (Electron)

Önkoşullar
- Node.js LTS ve npm kurulu olmalı
- Visual Studio Build Tools (C++ Desktop workload)
- Python 3.x (PATH'te olması önerilir)

1) Bağımlılıkları kur
```bat
npm install
```

2) Web uygulamasını üretim için derle (Vite)
```bat
npm run build
```

3) Windows installer/portable oluştur (electron-builder)
- NSIS installer ve portable exe:
```bat
npm run electron:build:win
```

- Tüm platform hedefleri yerine sadece Windows için paket almak isterseniz yukarıdaki komut yeterlidir. Çıktılar `release/` klasörüne düşer:
  - `Lovelied Board Setup x.y.z.exe` (installer)
  - `Lovelied Board x.y.z.exe` (portable)

İsteğe bağlı komutlar
- Sadece dizin paketlemesi (hızlı test):
```bat
npm run electron:pack
```

- Tüm platformlar (mac/linux/windows) — sadece ilgili OS'ta imza/bağımlılık mevcutsa:
```bat
npm run electron:dist:all
```

Geliştirme Modu (tek tıkla)
- Konsollu başlatma: `windows-electron-dev.bat`
- Konsolsuz başlatma: `windows-electron-dev.vbs`

Notlar
- `better-sqlite3` gibi native modüller prod build sırasında electron-builder tarafından hedef Electron sürümüne göre yeniden derlenir.
- Geliştirme sırasında ABI uyumsuzluğu görürseniz Windows'ta şu komutlardan biriyle yeniden derleyin:
```bat
npx electron-rebuild -v 38.2.1 -f -w better-sqlite3
:: veya
npm rebuild better-sqlite3 --runtime=electron --target=38.2.1 --dist-url=https://electronjs.org/headers
```

## Windows İçin Uygulama (Installer/Portable) Oluşturma ve Kurma

1) Sürümü güncelle (opsiyonel ama önerilir)
- `package.json` içindeki `version` alanını artırın (örn. `1.0.1` → `1.0.2`).

2) Üretim build'i al
```bat
npm run build
```

3) Windows kurulum dosyası ve portable exe oluştur
```bat
npm run electron:build:win
```
- Çıktılar `release/` klasöründedir:
  - Installer: `Lovelied Board Setup x.y.z.exe`
  - Portable: `Lovelied Board x.y.z.exe`

4) Kurulum ve çalıştırma
- Installer'ı çift tıklayın, kurulum sihirbazını tamamlayın.
- Başlat menüsünden veya masaüstü kısayolundan "Lovelied Board"'u çalıştırın.
- Portable istiyorsanız installer yerine `Lovelied Board x.y.z.exe` dosyasını tek başına çalıştırabilirsiniz (kurulum gerekmez).

İmza ve güncelleme notları
- Kod imzası yoksa installer uyarı gösterebilir; yerel/okul içi kullanımda sorun değildir.
- Otomatik güncelleme için GitHub yayınları kullanılır; yayınlamadan yerel installer çalışır ama auto-update devre dışı kalır.

Sık karşılaşılan sorunlar
- Native modül/ABI hatası: Yukarıdaki rebuild komutlarını kullanın ve yeniden paketleyin.
- Antivirüs/SmartScreen uyarıları: İmzalanmamış kurulumlarda normaldir; "More info → Run anyway" ile geçilebilir.
