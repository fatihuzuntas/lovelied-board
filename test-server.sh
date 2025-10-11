#!/bin/bash

echo "🧪 Server Test Başlıyor..."
echo ""

# Server'ı arka planda başlat
npm start &
SERVER_PID=$!

echo "⏳ Server başlatılıyor (PID: $SERVER_PID)..."
sleep 3

# Server'ın çalıştığını kontrol et
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server başarıyla başlatıldı!"
    echo ""
    echo "📡 Test ediliyor: http://localhost:8080/api/board"
    
    # API'yi test et
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/board)
    
    if [ "$RESPONSE" = "200" ]; then
        echo "✅ API çalışıyor! (HTTP $RESPONSE)"
    else
        echo "❌ API hatası! (HTTP $RESPONSE)"
    fi
    
    echo ""
    echo "🛑 Server kapatılıyor..."
    kill $SERVER_PID
    wait $SERVER_PID 2>/dev/null
    echo "✅ Test tamamlandı!"
else
    echo "❌ Server başlatılamadı!"
    exit 1
fi

