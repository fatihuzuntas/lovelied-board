import { useState, useEffect } from 'react';
import { Birthday } from '@/types/board';
import { Card, CardContent } from '@/components/ui/card';
import { Cake } from 'lucide-react';

interface BirthdaySectionFlipProps {
  birthdays: Birthday[];
}

export const BirthdaySectionFlip = ({ birthdays }: BirthdaySectionFlipProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const isBirthdayToday = (birthday: Birthday) => {
    const bDay = new Date(birthday.date);
    const todayDate = new Date();
    return bDay.getMonth() === todayDate.getMonth() && bDay.getDate() === todayDate.getDate();
  };

  const isBirthdayUpcoming = (birthday: Birthday) => {
    const bDay = new Date(birthday.date);
    const todayDate = new Date();
    const nextWeek = new Date(todayDate);
    nextWeek.setDate(todayDate.getDate() + 7);
    return bDay > todayDate && bDay <= nextWeek;
  };

  const getDaysUntilBirthday = (dateString: string) => {
    const bDay = new Date(dateString);
    const today = new Date();
    const diff = bDay.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const todayBirthdays = birthdays.filter(isBirthdayToday);
  const upcomingBirthdays = birthdays
    .filter(b => !isBirthdayToday(b) && isBirthdayUpcoming(b))
    .sort((a, b) => {
      const daysA = getDaysUntilBirthday(a.date);
      const daysB = getDaysUntilBirthday(b.date);
      return daysA - daysB;
    });

  const allBirthdays = [...todayBirthdays, ...upcomingBirthdays];

  useEffect(() => {
    if (allBirthdays.length <= 1) return;

    const timer = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % allBirthdays.length);
        setIsFlipping(false);
      }, 300);
    }, 5000); // Her 5 saniyede değiş

    return () => clearInterval(timer);
  }, [allBirthdays.length]);
  if (allBirthdays.length === 0) {
    return null;
  }

  const currentBirthday = allBirthdays[currentIndex];
  const isToday = todayBirthdays.includes(currentBirthday);

  return (
    <Card className={`shadow border-l-4 border-l-secondary transition-all duration-300 ${isFlipping ? 'animate-flip' : ''} flex-none`}>
      <CardContent className="p-2">
        <div className={`rounded-md px-3 py-2 ${isToday ? 'bg-secondary/10' : 'bg-muted/50'}`}>
          {/* Üst satır: Sol "Doğum Günü", sağda rozet */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground">Doğum Günü</span>
            </div>
            {isToday ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">Bugün</span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-foreground/70">
                {new Date(currentBirthday.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
              </span>
            )}
          </div>

          {/* Alt satır: Sol büyük pasta ikonu, sağda isim ve altında sınıf/branş */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 rounded bg-secondary/15 flex-shrink-0">
              <Cake className="h-7 w-7 text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground text-right truncate">{currentBirthday.name}</p>
              <p className="text-[11px] text-muted-foreground text-right truncate">{currentBirthday.class}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
