import { useEffect, useState } from 'react';
import { Header } from '@/components/board/Header';
import { NewsSlider } from '@/components/board/NewsSlider';
import { DutySectionFlip } from '@/components/board/DutySectionFlip';
import { BirthdaySectionFlip } from '@/components/board/BirthdaySectionFlip';
import { CountdownBarFlip } from '@/components/board/CountdownBarFlip';
import { MarqueeBar } from '@/components/board/MarqueeBar';
import { BoardData } from '@/types/board';
import { loadBoardData } from '@/lib/storage';

const Board = () => {
  const [boardData, setBoardData] = useState<BoardData>(loadBoardData());

  useEffect(() => {
    const handleStorageChange = () => {
      setBoardData(loadBoardData());
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Poll for changes every 2 seconds (for same-window updates)
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
            {/* Sol Sütun - Dar */}
            <aside className="w-56 flex flex-col overflow-y-auto">
              <CountdownBarFlip countdowns={boardData.countdowns} />
            </aside>
            
            {/* Orta Sütun - Çok Geniş */}
            <div className="flex-1 overflow-hidden">
              <NewsSlider slides={boardData.slides} />
            </div>
          </div>
          
          {/* Kayan Yazı - Sol ve Orta Sütun Altında */}
          <MarqueeBar text={boardData.marqueeText} priority={boardData.marqueePriority} />
        </div>
        
        {/* Sağ Sütun - En aşağıya kadar */}
        <aside className="w-80 flex flex-col gap-3 overflow-y-auto">
          <DutySectionFlip duty={boardData.duty} />
          <BirthdaySectionFlip birthdays={boardData.birthdays} />
        </aside>
      </main>
    </div>
  );
};

export default Board;
