import { useEffect, useState, useMemo } from 'react';
import { Header } from '@/components/board/Header';
import { NewsSlider } from '@/components/board/NewsSlider';
import { DutySectionFlip } from '@/components/board/DutySectionFlip';
import { BirthdaySectionFlip } from '@/components/board/BirthdaySectionFlip';
import { CountdownBarFlip } from '@/components/board/CountdownBarFlip';
import { MarqueeBar } from '@/components/board/MarqueeBar';
import { QuoteSection } from '@/components/board/QuoteSection';
import { BoardData } from '@/types/board';
import { loadBoardData } from '@/lib/storage';

const Board = () => {
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadBoardData();
        setBoardData(data);
      } catch (error) {
        console.error('Board data yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Her 5 saniyede bir verileri yenile
    const interval = setInterval(loadData, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Chrome benzeri zoom seviyeleri
  const zoomLevels = useMemo(() => [0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3], []);

  // Zoom kontrolü için klavye kısayolları
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl (Windows/Linux) veya Cmd (Mac) kontrolü
      const isModifierPressed = e.ctrlKey || e.metaKey;
      
      if (!isModifierPressed) return;

      // Zoom In: Ctrl/Cmd + ö
      if (e.key === 'ö' || e.key === 'Ö') {
        e.preventDefault();
        setZoom(prev => {
          const currentIndex = zoomLevels.indexOf(prev);
          if (currentIndex === -1) return 1; // Eğer mevcut zoom seviyesi listede yoksa 1'e dön
          return zoomLevels[Math.min(currentIndex + 1, zoomLevels.length - 1)];
        });
      }
      
      // Zoom Out: Ctrl/Cmd + ç
      if (e.key === 'ç' || e.key === 'Ç') {
        e.preventDefault();
        setZoom(prev => {
          const currentIndex = zoomLevels.indexOf(prev);
          if (currentIndex === -1) return 1; // Eğer mevcut zoom seviyesi listede yoksa 1'e dön
          return zoomLevels[Math.max(currentIndex - 1, 0)];
        });
      }
      
      // Reset: Ctrl/Cmd + 0
      if (e.key === '0') {
        e.preventDefault();
        setZoom(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [zoomLevels]);

  if (loading || !boardData) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex items-center justify-center overflow-hidden p-4">
      <div 
        className="h-full w-full flex flex-col transition-all duration-300 ease-in-out"
        style={{ 
          zoom: zoom
        }}
      >
        <div className="h-full flex flex-col overflow-hidden bg-background rounded-lg shadow-xl">
          <Header config={boardData.config} />
          
          <main className="flex-1 overflow-hidden flex gap-3 p-3">
            {/* Sol ve Orta Sütunlar Grubu */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex-1 flex gap-3 overflow-hidden">
                {/* Sol Sütun */}
                <aside className="w-60 flex-shrink-0 flex flex-col overflow-y-auto">
                  <CountdownBarFlip countdowns={boardData.countdowns} />
                </aside>
                
                {/* Orta Sütun - En Geniş */}
                <div className="flex-1 overflow-hidden min-w-0">
                  <NewsSlider slides={boardData.slides} />
                </div>
              </div>
              
              {/* Kayan Yazı - Sol ve Orta Sütun Altında */}
              <MarqueeBar texts={boardData.marqueeTexts} />
            </div>
            
            {/* Sağ Sütun - Sol ile aynı genişlikte */}
            <aside className="w-60 flex-shrink-0 flex flex-col gap-2 overflow-hidden min-h-0">
              {(() => {
                const today = new Date();
                const hasBirthdayToday = boardData.birthdays.some(b => {
                  const parts = b.date.split('-');
                  if (parts.length !== 3) return false;
                  const y = parseInt(parts[0], 10);
                  const m = parseInt(parts[1], 10);
                  const d = parseInt(parts[2], 10);
                  if (Number.isNaN(m) || Number.isNaN(d)) return false;
                  const bd = new Date(y, m - 1, d);
                  return today.getMonth() === bd.getMonth() && today.getDate() === bd.getDate();
                });
                return (
                  <>
                    <DutySectionFlip duty={boardData.duty} />
                    <BirthdaySectionFlip birthdays={boardData.birthdays} />
                    <div className="flex-1 min-h-0">
                      <QuoteSection quotes={boardData.quotes} compact={hasBirthdayToday} />
                    </div>
                  </>
                );
              })()}
            </aside>
          </main>
        </div>
        
        {/* Zoom Göstergesi */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 hover:opacity-100 transition-opacity">
          Zoom: {(zoom * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

export default Board;
