import { useEffect, useState } from 'react';
import { Header } from '@/components/board/Header';
import { NewsSlider } from '@/components/board/NewsSlider';
import { DutySectionFlip } from '@/components/board/DutySectionFlip';
import { BirthdaySectionFlip } from '@/components/board/BirthdaySectionFlip';
import { CountdownBarFlip } from '@/components/board/CountdownBarFlip';
import { MarqueeBar } from '@/components/board/MarqueeBar';
import { QuoteSection } from '@/components/board/QuoteSection';
import { BoardData } from '@/types/board';
import { loadBoardData, refreshBoardDataFromApi } from '@/lib/storage';

const Board = () => {
  const [boardData, setBoardData] = useState<BoardData>(loadBoardData());

  useEffect(() => {
    const handleStorageChange = () => {
      setBoardData(loadBoardData());
    };

    window.addEventListener('storage', handleStorageChange);
    
    // İlk yüklemede API'den tazele ve her 2 sn'de bir cache'i oku
    refreshBoardDataFromApi().then((data) => {
      if (data) setBoardData(data);
    });
    const interval = setInterval(() => {
      setBoardData(loadBoardData());
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
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
  );
};

export default Board;
