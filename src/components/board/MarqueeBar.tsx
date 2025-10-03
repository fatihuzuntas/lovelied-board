import { useState, useEffect } from 'react';
import { MarqueeItem } from '@/types/board';

interface MarqueeBarProps {
  texts: MarqueeItem[];
}

export const MarqueeBar = ({ texts }: MarqueeBarProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(timer);
  }, [texts.length]);

  const currentMarquee = texts[currentIndex] || texts[0];
  if (!currentMarquee) return null;

  const getColorClass = () => {
    switch (currentMarquee.priority) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'urgent':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getIcon = () => {
    switch (currentMarquee.priority) {
      case 'critical':
        return '🚨';
      case 'urgent':
        return '⚠️';
      default:
        return '📢';
    }
  };

  return (
    <div className={`${getColorClass()} py-2 overflow-hidden shadow-lg flex-shrink-0 transition-colors duration-500`}>
      <div className="flex items-center">
        <span className="text-lg px-4 flex-shrink-0">{getIcon()}</span>
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-base font-semibold">
            {currentMarquee.text}
          </div>
        </div>
      </div>
    </div>
  );
};
