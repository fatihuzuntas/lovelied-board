@echo off
REM Lovelied Board Başlatma Script'i (Windows)
REM Bu script uygulamayı production modunda başlatır

echo.
echo ========================================
echo   Lovelied Board - Offline Okul Panosu
echo ========================================
echo.

REM Node.js kontrolü
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js bulunamadi! Lutfen Node.js yukleyin: https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js bulundu
node --version

REM npm paketlerini kontrol et
if not exist "node_modules" (
    echo.
    echo [*] Paketler yukleniyor...
    call npm install
)

REM Build klasörünü kontrol et
if not exist "dist" (
    echo.
    echo [*] Uygulama build ediliyor...
    call npm run build
)

echo.
echo [*] Server baslatiliyor...
echo.

REM Server'ı başlat
call npm start

