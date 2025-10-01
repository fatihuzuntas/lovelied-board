interface MarqueeBarProps {
  text: string;
  priority?: 'normal' | 'urgent' | 'critical';
}

export const MarqueeBar = ({ text, priority = 'normal' }: MarqueeBarProps) => {
  const getColorClass = () => {
    switch (priority) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'urgent':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getIcon = () => {
    switch (priority) {
      case 'critical':
        return '🚨';
      case 'urgent':
        return '⚠️';
      default:
        return '📢';
    }
  };

  return (
    <div className={`${getColorClass()} py-4 overflow-hidden shadow-lg`}>
      <div className="flex items-center">
        <span className="text-2xl px-6 flex-shrink-0">{getIcon()}</span>
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-xl font-semibold">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};
