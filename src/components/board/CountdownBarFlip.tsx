import { useState, useEffect, useMemo } from 'react';
import { Countdown } from '@/types/board';
import { Card } from '@/components/ui/card';
import { loadBoardData } from '@/lib/storage';
import { Clock, Bell } from 'lucide-react';

interface CountdownBarFlipProps {
  countdowns: Countdown[];
}

export const CountdownBarFlip = ({ countdowns }: CountdownBarFlipProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [bellInfo, setBellInfo] = useState<{ label: string; minutes: number } | null>(null);
  const [daySchedulesState, setDaySchedulesState] = useState<import('@/types/board').DaySchedule[] | undefined>(undefined);
  const [bellScheduleState, setBellScheduleState] = useState<import('@/types/board').BellSchedule[] | undefined>(undefined);

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

  const calculateBellTimeFrom = (
    daySchedules?: import('@/types/board').DaySchedule[],
    bellSchedule?: import('@/types/board').BellSchedule[],
  ) => {
    if ((!daySchedules || daySchedules.length === 0) && (!bellSchedule || bellSchedule.length === 0)) {
      return null;
    }
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const dayIndex = now.getDay(); // 0: Pazar ... 6: Cumartesi
    const dayKey = (
      dayIndex === 1 ? 'monday' :
      dayIndex === 2 ? 'tuesday' :
      dayIndex === 3 ? 'wednesday' :
      dayIndex === 4 ? 'thursday' :
      dayIndex === 5 ? 'friday' : 'all'
    ) as 'all' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

    // Günlük programı belirle (daySchedules yoksa bellSchedule yedeğini kullan)
    let scheduleItems: Array<{ type: 'lesson' | 'break'; startTime: string; endTime: string; order: number }> = [];
    const scheduleForDay = daySchedules?.find(d => d.day === dayKey) || daySchedules?.find(d => d.day === 'all');
    if (scheduleForDay && scheduleForDay.schedule && scheduleForDay.schedule.length > 0) {
      scheduleItems = scheduleForDay.schedule;
    } else if (bellSchedule && bellSchedule.length > 0) {
      scheduleItems = bellSchedule;
    } else {
      return null;
    }

    const toMinutes = (t: string) => {
      const [h, m] = t.split(':').map(n => parseInt(n, 10));
      return h * 60 + m;
    };

    const lessons = scheduleItems
      .filter(s => s.type === 'lesson')
      .sort((a, b) => a.order - b.order)
      .map(s => ({ start: toMinutes(s.startTime), end: toMinutes(s.endTime) }));

    if (lessons.length === 0) return null;

    // Önce ders içinde miyiz kontrol et
    for (const l of lessons) {
      if (currentMinutes >= l.start && currentMinutes < l.end) {
        const diff = l.end - currentMinutes;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        // Dersteyiz: teneffüs Ziline kalan süre
        return { label: 'Teneffüs Ziline', minutes: diff };
      }
    }

    // Değilsek, sıradaki dersin başlangıcına kadar süre
    const upcoming = lessons.find(l => currentMinutes < l.start);
    if (upcoming) {
      const diff = upcoming.start - currentMinutes;
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      return { label: 'Ders Ziline', minutes: diff };
    }

    return { label: 'Ders Ziline', minutes: 0 };
  };

  const calculateBellTime = () => calculateBellTimeFrom(daySchedulesState, bellScheduleState);

  useEffect(() => {
    let isMounted = true;
    
    const load = async () => {
      try {
        const data = await loadBoardData();
        if (!isMounted) return;
        setDaySchedulesState(data.daySchedules);
        setBellScheduleState(data.bellSchedule);
        // Yeni gelen veriye göre anında hesapla (state'e bağımlı olmadan)
        setBellInfo(calculateBellTimeFrom(data.daySchedules, data.bellSchedule));
      } catch (e) {
        // ignore
      }
    };

    // İlk yükleme
    load();

    // Zil bilgisini her 5 sn'de bir güncelle (daha akıcı)
    const bellTimer = setInterval(() => {
      if (!isMounted) return;
      // Güncel state değerlerini kullanarak hesapla
      setBellInfo(prevInfo => {
        const newInfo = calculateBellTimeFrom(daySchedulesState, bellScheduleState);
        return newInfo || prevInfo; // null gelirse eski değeri koru
      });
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(bellTimer);
    };
  }, [daySchedulesState, bellScheduleState]);

  const activeCountdowns = useMemo(() => (
    countdowns
      .filter(c => calculateDaysLeft(c.date) >= 0)
  ), [countdowns]);

  useEffect(() => {
    if (activeCountdowns.length === 0) return;
    if (currentIndex >= activeCountdowns.length) setCurrentIndex(0);

    const timer = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activeCountdowns.length);
        setIsFlipping(false);
      }, 300);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeCountdowns.length, currentIndex]);

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
          <p className="font-bold text-base text-orange-900 mb-1">{bellInfo?.label || 'Zil'}</p>
          <div className="bg-white/80 rounded-lg p-2.5">
            <span className="text-xl font-bold text-orange-700">{bellInfo ? `${bellInfo.minutes} dk` : '—'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
