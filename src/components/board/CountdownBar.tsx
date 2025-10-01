import { Countdown } from '@/types/board';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface CountdownBarProps {
  countdowns: Countdown[];
}

export const CountdownBar = ({ countdowns }: CountdownBarProps) => {
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

  if (countdowns.length === 0) return null;

  return (
    <div className="space-y-3">
      {countdowns.map((countdown) => {
        const daysLeft = calculateDaysLeft(countdown.date);
        if (daysLeft < 0) return null;

        return (
          <Card
            key={countdown.id}
            className={`p-4 border-l-4 shadow-md hover:shadow-lg transition-shadow ${getColorClass(countdown.type)}`}
          >
            <div className="text-center">
              <span className="text-4xl block mb-2">{countdown.icon || '📅'}</span>
              <p className="font-bold text-lg mb-1">{countdown.name}</p>
              <p className="text-xs opacity-80 mb-3">
                {new Date(countdown.date).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Kalan Süre</p>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-2xl font-bold tabular-nums">
                    {formatCountdown(daysLeft)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
