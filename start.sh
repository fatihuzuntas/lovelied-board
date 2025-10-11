#!/bin/bash

# Lovelied Board Başlatma Script'i
# Bu script uygulamayı production modunda başlatır

echo "🎯 Lovelied Board - Offline Okul Panosu"
echo "========================================"
echo ""

# Renk kodları
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Node.js kontrolü
if ! command -v node &> /dev/null
then
    echo -e "${RED}❌ Node.js bulunamadı! Lütfen Node.js yükleyin: https://nodejs.org${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js bulundu: $(node --version)"

# npm paketlerini kontrol et
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Paketler yükleniyor...${NC}"
    npm install
fi

# Build klasörünü kontrol et
if [ ! -d "dist" ]; then
    echo -e "${BLUE}🔨 Uygulama build ediliyor...${NC}"
    npm run build
fi

echo ""
echo -e "${GREEN}🚀 Server başlatılıyor...${NC}"
echo ""

# Server'ı başlat
npm start

