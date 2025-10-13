@echo off
chcp 65001 >nul
title Lovelied Board - Taşınabilir Başlatıcı

echo.
echo 🎯 Lovelied Board - Taşınabilir Başlatıcı
echo ========================================
echo.

REM Node.js kontrolü
echo 🔍 Node.js kontrol ediliyor...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js bulunamadı!
    echo Lütfen https://nodejs.org adresinden Node.js'i indirin ve kurun.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js bulundu: %NODE_VERSION%

REM npm kontrolü
echo 🔍 npm kontrol ediliyor...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm bulunamadı!
    echo npm, Node.js ile birlikte gelir. Node.js'i yeniden kurun.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm bulundu: %NPM_VERSION%
echo.

REM Gerekli klasörleri oluştur
echo 📁 Gerekli klasörler oluşturuluyor...
if not exist "public\user-data" (
    mkdir "public\user-data" 2>nul
    mkdir "public\user-data\media" 2>nul
    echo ✅ public\user-data\ klasörü oluşturuldu
) else (
    echo ✅ public\user-data\ klasörü zaten mevcut
)

REM Varsayılan veri dosyası
if not exist "public\user-data\board.json" (
    if exist "default-board.json" (
        copy "default-board.json" "public\user-data\board.json" >nul
        echo ✅ Varsayılan veri dosyası oluşturuldu
    )
)
echo.

REM Bağımlılıkları kontrol et ve yükle
if not exist "node_modules" (
    echo 📦 Bağımlılıklar yükleniyor... Bu biraz zaman alabilir.
    echo.
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Bağımlılık yükleme hatası!
        echo.
        pause
        exit /b 1
    )
    echo ✅ Bağımlılıklar başarıyla yüklendi
) else (
    echo ✅ Bağımlılıklar zaten yüklü
)
echo.

REM Uygulamayı build et
echo 🔨 Uygulama build ediliyor...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build hatası!
    echo.
    pause
    exit /b 1
)
echo ✅ Build başarılı
echo.

REM Sunucuyu başlat
echo 🚀 Sunucu başlatılıyor...
echo ========================================
echo 🎉 Lovelied Board başarıyla başlatıldı!
echo ========================================
echo 📱 Ana Pano: http://localhost:8080
echo ⚙️  Admin Panel: http://localhost:8080/admin
echo 💡 Sunucuyu durdurmak için Ctrl+C tuşlarına basın
echo ========================================
echo.

REM Port kontrolü
if defined PORT (
    echo 🌐 Port: %PORT%
) else (
    echo 🌐 Port: 8080
)
echo.

npm start

echo.
echo 🛑 Sunucu durduruldu.
echo 💡 Tekrar başlatmak için bu scripti çalıştırın.
echo.
pause
