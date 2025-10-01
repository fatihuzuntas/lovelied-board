import { useState, useEffect } from 'react';
import { Countdown } from '@/types/board';
import { Card } from '@/components/ui/card';
import { Clock, Bell } from 'lucide-react';

interface CountdownBarFlipProps {
  countdowns: Countdown[];
}

export const CountdownBarFlip = ({ countdowns }: CountdownBarFlipProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [bellTime, setBellTime] = useState<string>('');

  const calculateDaysLeft = (dateString: string): number => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatCountdown = (days: number): string => {
    if (days < 0) return 'Geçti';
    if (days === 0) return 'Bugün!';
    if (days === 1) return '1 gün';
    return `${days} gün`;
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-destructive/10 text-destructive border-l-destructive';
      case 'holiday':
        return 'bg-accent/10 text-accent border-l-accent';
      case 'event':
        return 'bg-primary/10 text-primary border-l-primary';
      default:
        return 'bg-muted text-muted-foreground border-l-muted';
    }
  };

  const calculateBellTime = () => {
    const now = new Date();
    const currentMinute = now.getHours() * 60 + now.getMinutes();
    
    // Ders zili saatleri (dakika cinsinden)
    const bellTimes = [
      8 * 60 + 30,   // 08:30
      9 * 60 + 20,   // 09:20
      10 * 60 + 10,  // 10:10
      11 * 60,       // 11:00
      11 * 60 + 50,  // 11:50
      12 * 60 + 40,  // 12:40
      13 * 60 + 30,  // 13:30
      14 * 60 + 20,  // 14:20
      15 * 60 + 10,  // 15:10
      16 * 60,       // 16:00
    ];

    for (const bellTime of bellTimes) {
      if (currentMinute < bellTime) {
        const diff = bellTime - currentMinute;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        
        if (hours > 0) {
          return `${hours} saat ${mins} dakika`;
        }
        return `${mins} dakika`;
      }
    }
    
    return 'Dersler bitti';
  };

  useEffect(() => {
    const bellTimer = setInterval(() => {
      setBellTime(calculateBellTime());
    }, 30000); // Her 30 saniyede bir güncelle

    setBellTime(calculateBellTime());

    return () => clearInterval(bellTimer);
  }, []);

  useEffect(() => {
    const activeCountdowns = countdowns.filter(c => calculateDaysLeft(c.date) >= 0);
    if (activeCountdowns.length === 0) return;

    const timer = setInterval(() => {
      setIsFlipping(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activeCountdowns.length);
        setIsFlipping(false);
      }, 300);
    }, 5000); // Her 5 saniyede değiş

    return () => clearInterval(timer);
  }, [countdowns]);

  const activeCountdowns = countdowns.filter(c => calculateDaysLeft(c.date) >= 0);
  if (activeCountdowns.length === 0) return null;

  const currentCountdown = activeCountdowns[currentIndex];
  const daysLeft = calculateDaysLeft(currentCountdown.date);

  return (
    <div className="space-y-3">
      <Card
        className={`p-4 border-l-4 shadow-md transition-all duration-300 ${getColorClass(
          currentCountdown.type
        )} ${isFlipping ? 'animate-flip' : ''}`}
      >
        <div className="text-center">
          <span className="text-4xl block mb-2">{currentCountdown.icon || '📅'}</span>
          <p className="font-bold text-lg mb-1">{currentCountdown.name}</p>
          <p className="text-xs opacity-80 mb-3">
            {new Date(currentCountdown.date).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
            })}
          </p>
          <div className="bg-background/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Kalan Süre</p>
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-2xl font-bold tabular-nums">{formatCountdown(daysLeft)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Zil Sayacı */}
      <Card className="p-4 border-l-4 border-l-orange-500 shadow-md bg-orange-50">
        <div className="text-center">
          <Bell className="h-8 w-8 mx-auto mb-2 text-orange-600" />
          <p className="font-bold text-base text-orange-900 mb-1">Sonraki Zile</p>
          <div className="bg-white/80 rounded-lg p-2.5">
            <span className="text-xl font-bold text-orange-700">{bellTime}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
