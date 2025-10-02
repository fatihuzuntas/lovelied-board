import { useState, useEffect } from 'react';
import { Birthday } from '@/types/board';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  // If no birthdays, don't render anything
  if (allBirthdays.length === 0) {
    return null;
  }

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

  const currentBirthday = allBirthdays[currentIndex];
  const isToday = todayBirthdays.includes(currentBirthday);

  return (
    <Card className={`shadow-lg border-l-4 border-l-secondary transition-all duration-300 ${isFlipping ? 'animate-flip' : ''}`}>
      <CardHeader className="bg-secondary/5 py-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cake className="h-5 w-5 text-secondary" />
          Doğum Günleri
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div
          className={`p-4 rounded-lg text-center min-h-[120px] flex flex-col justify-center ${
            isToday ? 'bg-gradient-to-r from-secondary/20 to-secondary/10 animate-glow' : 'bg-muted/50'
          }`}
        >
          {isToday && <p className="text-xs font-semibold text-secondary mb-2">🎉 Bugün</p>}
          {!isToday && <p className="text-xs font-semibold text-muted-foreground mb-2">📅 Bu Hafta</p>}
          
          <p className="text-lg font-bold text-foreground mb-1">{currentBirthday.name}</p>
          <p className="text-xs text-muted-foreground mb-2">{currentBirthday.class}</p>
          
          {isToday && <div className="text-2xl">🎂 🎈 🎁</div>}
          {!isToday && (
            <p className="text-xs text-muted-foreground">
              {new Date(currentBirthday.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
