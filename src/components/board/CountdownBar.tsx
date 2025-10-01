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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {countdowns.map((countdown) => {
        const daysLeft = calculateDaysLeft(countdown.date);
        if (daysLeft < 0) return null;

        return (
          <Card
            key={countdown.id}
            className={`p-3 border-l-4 shadow-md hover:shadow-lg transition-shadow ${getColorClass(countdown.type)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{countdown.icon || '📅'}</span>
                <div>
                  <p className="font-bold text-base">{countdown.name}</p>
                  <p className="text-xs opacity-80">
                    {new Date(countdown.date).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xl font-bold tabular-nums">
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
