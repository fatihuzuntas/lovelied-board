import { useState, useEffect } from 'react';
import { Slide } from '@/types/board';
import { Card, CardContent } from '@/components/ui/card';

interface NewsSliderProps {
  slides: Slide[];
}

export const NewsSlider = ({ slides }: NewsSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');

  const activeSlides = slides
    .filter(slide => {
      if (!slide.schedule) return true;
      const now = new Date();
      const start = new Date(slide.schedule.start);
      const end = new Date(slide.schedule.end);
      return now >= start && now <= end;
    })
    .sort((a, b) => (a.priority || 999) - (b.priority || 999));

  useEffect(() => {
    if (activeSlides.length === 0) return;

    const currentSlide = activeSlides[currentIndex];
    setAnimationClass(`animate-${currentSlide.animation}`);

    const timer = setTimeout(() => {
      setAnimationClass('');
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
      }, 300);
    }, currentSlide.duration * 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, activeSlides]);

  if (activeSlides.length === 0) {
    return (
      <Card className="bg-muted">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Gösterilecek duyuru bulunmuyor</p>
        </CardContent>
      </Card>
    );
  }

  const currentSlide = activeSlides[currentIndex];

  return (
    <Card className={`overflow-hidden shadow-xl border-2 h-full ${animationClass}`}>
      <CardContent className="p-0 h-full relative flex flex-col">
        {/* Background Image */}
        {currentSlide.media && (
          <img
            src={currentSlide.media}
            alt={currentSlide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        
        {/* Content on top */}
        <div className="relative z-10 flex-1 p-8 flex flex-col justify-center max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-4 py-1.5 rounded-full text-base font-semibold ${
              currentSlide.type === 'news' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}>
              {currentSlide.type === 'news' ? '📰 HABER' : '📢 DUYURU'}
            </span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
            {currentSlide.title}
          </h2>
          <p className="text-xl text-white/90 leading-relaxed drop-shadow-md">
            {currentSlide.body}
          </p>
        </div>
        
        {/* Progress indicator at bottom */}
        <div className="relative z-10 px-8 pb-6">
          <div className="flex gap-2">
            {activeSlides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full flex-1 transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
