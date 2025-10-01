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
    <div className="min-h-screen bg-background flex flex-col">
      <Header config={boardData.config} />
      
      <main className="flex-1 p-6 space-y-6">
        <NewsSlider slides={boardData.slides} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DutySection duty={boardData.duty} />
          <BirthdaySection birthdays={boardData.birthdays} />
        </div>
        
        <CountdownBar countdowns={boardData.countdowns} />
      </main>

      <MarqueeBar text={boardData.marqueeText} priority={boardData.marqueePriority} />
      
      <Footer />
    </div>
  );
};

export default Board;
