@echo off
chcp 65001 >nul
REM Proje dizinine geç
cd /d "%~dp0"

echo 🚀 Lovelied Board (Electron - Development) başlatılıyor...
echo.

REM Tarayıcı açılmasın
set BROWSER=none

REM Bağımlılıklar eksikse yükleyin (opsiyonel hızlandırma)
if not exist "node_modules" (
  echo 📦 Bağımlılıklar yükleniyor...
  call npm install || goto :error
)

REM Electron development başlat
call npm run electron:dev
goto :eof

:error
echo ❌ Başlatma sırasında hata oluştu.
pause


