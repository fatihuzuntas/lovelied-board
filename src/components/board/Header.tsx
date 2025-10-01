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
    <header className="bg-primary text-primary-foreground px-8 py-6 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-6">
        {config.logoUrl && (
          <img 
            src={config.logoUrl} 
            alt="Okul Logosu" 
            className="h-16 w-16 object-contain"
          />
        )}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{config.schoolName}</h1>
          <p className="text-lg text-primary-foreground/80 mt-1">{formatDate(currentTime)}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-5xl font-bold tabular-nums">{formatTime(currentTime)}</div>
        <p className="text-sm text-primary-foreground/80 mt-1">Anlık Saat</p>
      </div>
    </header>
  );
};
