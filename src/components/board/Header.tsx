import { useEffect, useState } from 'react';
import { SchoolConfig } from '@/types/board';

interface HeaderProps {
  config: SchoolConfig;
}

export const Header = ({ config }: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: config.timezone,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: config.timezone,
    });
  };

  return (
    <header className="relative bg-primary text-primary-foreground px-6 py-2 grid grid-cols-[1fr_auto_1fr] items-center shadow-lg flex-shrink-0">
      {config.logoUrl && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
          <div className="h-28 w-28 rounded-full bg-white shadow-md overflow-hidden flex items-center justify-center">
            <img
              src={config.logoUrl}
              alt="Okul Logosu"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{config.schoolName}</h1>
          <p className="text-xs text-primary-foreground/80">{formatDate(currentTime)}</p>
        </div>
      </div>
      <div />
      <div className="text-right">
        <div className="text-3xl font-bold tabular-nums">{formatTime(currentTime)}</div>
        <p className="text-[10px] text-primary-foreground/80">Anlık Saat</p>
      </div>
    </header>
  );
};
