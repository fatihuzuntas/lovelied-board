import { useEffect, useState } from 'react';
import { Header } from '@/components/board/Header';
import { NewsSlider } from '@/components/board/NewsSlider';
import { DutySection } from '@/components/board/DutySection';
import { BirthdaySection } from '@/components/board/BirthdaySection';
import { CountdownBar } from '@/components/board/CountdownBar';
import { MarqueeBar } from '@/components/board/MarqueeBar';
import { Footer } from '@/components/board/Footer';
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
        {/* Sol Sütun - Dar */}
        <aside className="w-72 flex flex-col gap-3 overflow-y-auto">
          <CountdownBar countdowns={boardData.countdowns} />
        </aside>
        
        {/* Orta Sütun - Geniş */}
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <NewsSlider slides={boardData.slides} />
          </div>
        </div>
        
        {/* Sağ Sütun */}
        <aside className="w-80 flex flex-col gap-3 overflow-y-auto">
          <DutySection duty={boardData.duty} />
          <BirthdaySection birthdays={boardData.birthdays} />
        </aside>
      </main>

      <MarqueeBar text={boardData.marqueeText} priority={boardData.marqueePriority} />
      
      <Footer />
    </div>
  );
};

export default Board;
