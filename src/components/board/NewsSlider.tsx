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
    <Card className={`overflow-hidden shadow-xl border-2 ${animationClass}`}>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {currentSlide.media && (
            <div className="md:w-2/5 h-64 md:h-auto overflow-hidden">
              <img
                src={currentSlide.media}
                alt={currentSlide.title}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
              />
            </div>
          )}
          <div className={`${currentSlide.media ? 'md:w-3/5' : 'w-full'} p-8 flex flex-col justify-center`}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                currentSlide.type === 'news' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {currentSlide.type === 'news' ? '📰 HABER' : '📢 DUYURU'}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">{currentSlide.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{currentSlide.body}</p>
            
            {/* Progress indicator */}
            <div className="flex gap-2 mt-6">
              {activeSlides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full flex-1 transition-colors ${
                    idx === currentIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
