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
    <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between shadow-lg flex-shrink-0">
      <div className="flex items-center gap-4">
        {config.logoUrl && (
          <img 
            src={config.logoUrl} 
            alt="Okul Logosu" 
            className="h-12 w-12 object-contain"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{config.schoolName}</h1>
          <p className="text-sm text-primary-foreground/80">{formatDate(currentTime)}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-4xl font-bold tabular-nums">{formatTime(currentTime)}</div>
        <p className="text-xs text-primary-foreground/80">Anlık Saat</p>
      </div>
    </header>
  );
};
