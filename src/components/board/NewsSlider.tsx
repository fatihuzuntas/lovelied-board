import { useState, useEffect, useMemo } from 'react';
import { Slide } from '@/types/board';
import { Card, CardContent } from '@/components/ui/card';

interface NewsSliderProps {
  slides: Slide[];
}

export const NewsSlider = ({ slides }: NewsSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeSlides = useMemo(() => {
    return slides
      .filter(slide => {
        if (!slide.schedule) return true;
        const now = new Date();
        const start = new Date(slide.schedule.start);
        const end = new Date(slide.schedule.end);
        return now >= start && now <= end;
      })
      .sort((a, b) => (a.priority || 999) - (b.priority || 999));
  }, [slides]);

  useEffect(() => {
    if (activeSlides.length === 0) return;

    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
        setIsFlipping(false);
      }, 300);
    }, 5000); // 5 saniyede bir

    return () => clearInterval(interval);
  }, [activeSlides.length]);

  // Slide listesi değiştiğinde taşmayı önle ve baştan başla
  useEffect(() => {
    if (currentIndex >= activeSlides.length) {
      setCurrentIndex(0);
    }
  }, [activeSlides.length, currentIndex]);

  // Escape ile kapat
  useEffect(() => {
    if (!isExpanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isExpanded]);

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

  const isVideo = currentSlide.media && (
    currentSlide.media.endsWith('.mp4') || 
    currentSlide.media.endsWith('.webm') || 
    currentSlide.media.endsWith('.ogg')
  );

  const sliderBody = (
    <Card onClick={() => setIsExpanded(true)} className={`overflow-hidden shadow-xl border-2 h-full ${isFlipping ? 'animate-flip' : ''} cursor-zoom-in`}>
      <CardContent className="p-0 h-full relative flex flex-col">
        {/* Background Media */}
        {currentSlide.media && (
          isVideo ? (
            <video
              src={currentSlide.media}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted={!isExpanded}
              playsInline
            />
          ) : (
            <img
              src={currentSlide.media}
              alt={currentSlide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Content at bottom */}
        <div className="relative z-10 mt-auto p-8 pb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              currentSlide.type === 'news' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}>
              {currentSlide.type === 'news' ? '📰 HABER' : '📢 DUYURU'}
            </span>
          </div>
          <h2 className="text-5xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
            {currentSlide.title}
          </h2>
          <p className="text-2xl text-white/95 leading-relaxed drop-shadow-md max-w-4xl">
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

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setIsExpanded(false)}>
        <div className="relative w-[92vw] h-[92vh] max-w-[1600px]">
          <button
            aria-label="Kapat"
            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
            className="absolute top-3 right-3 z-[60] bg-white/10 hover:bg-white/20 text-white rounded px-3 py-1 text-sm"
          >
            Kapat
          </button>
          <div className="absolute inset-0 cursor-zoom-out">
            <Card className={`overflow-hidden shadow-2xl border-2 h-full ${isFlipping ? 'animate-flip' : ''}`}>
              <CardContent className="p-0 h-full relative flex flex-col">
                {currentSlide.media && (
                  isVideo ? (
                    <video
                      src={currentSlide.media}
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={currentSlide.media}
                      alt={currentSlide.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="relative z-10 mt-auto p-10 pb-20">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      currentSlide.type === 'news'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {currentSlide.type === 'news' ? '📰 HABER' : '📢 DUYURU'}
                    </span>
                  </div>
                  <h2 className="text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">{currentSlide.title}</h2>
                  <p className="text-3xl text-white/95 leading-relaxed drop-shadow-md max-w-5xl">{currentSlide.body}</p>
                </div>
                <div className="relative z-10 px-10 pb-8">
                  <div className="flex gap-2">
                    {activeSlides.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 rounded-full flex-1 transition-colors ${
                          idx === currentIndex ? 'bg-white' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return sliderBody;
};
