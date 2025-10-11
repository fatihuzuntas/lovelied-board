import { useState, useEffect } from 'react';
import { Quote } from '@/types/board';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Heart, Sparkles } from 'lucide-react';

interface QuoteSectionProps {
  quotes: Quote[];
  compact?: boolean;
}

export const QuoteSection = ({ quotes, compact = false }: QuoteSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (quotes.length === 0) return;

    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
        setIsFlipping(false);
      }, 300);
    }, 7500); // 7.5 seconds (yarıya düşürüldü)

    return () => clearInterval(interval);
  }, [quotes.length]);

  if (quotes.length === 0) {
    return null;
  }

  const currentQuote = quotes[currentIndex];
  
  const getIcon = () => {
    switch (currentQuote.type) {
      case 'verse':
        return <BookOpen className="w-5 h-5" />;
      case 'hadith':
        return <Heart className="w-5 h-5" />;
      case 'quote':
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (currentQuote.type) {
      case 'verse':
        return 'Ayet';
      case 'hadith':
        return 'Hadis';
      case 'quote':
        return 'Özlü Söz';
    }
  };

  return (
    <Card className={`bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 transition-transform duration-300 ${isFlipping ? 'animate-flip' : ''} h-full flex flex-col ${compact ? 'max-h-40 overflow-hidden' : ''}`}>
      <CardContent className={`flex-1 min-h-0 flex flex-col ${compact ? 'p-4' : 'p-6'}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="text-primary">
            {getIcon()}
          </div>
          <span className="text-sm font-semibold text-primary">
            {getTypeLabel()}
          </span>
        </div>
        <p className={`leading-relaxed text-foreground/90 italic line-clamp-5 ${compact ? 'text-base' : 'text-lg'}`}>
          "{currentQuote.text}"
        </p>
        {currentQuote.source && (
          <p className="text-sm text-muted-foreground mt-3 text-right">
            — {currentQuote.source}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
