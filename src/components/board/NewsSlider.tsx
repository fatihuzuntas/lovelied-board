import { useState, useEffect, useMemo, useRef } from 'react';
import { resolveMediaUrl } from '@/lib/storage';
import { Slide } from '@/types/board';
import { Card, CardContent } from '@/components/ui/card';

interface NewsSliderProps {
  slides: Slide[];
}

export const NewsSlider = ({ slides }: NewsSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

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

  const videoRef = useRef<HTMLVideoElement | null>(null);

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
  
  // Medya çözümleme ve video tespiti (kullanmadan önce tanımlı olmalı)
  const [resolvedMedia, setResolvedMedia] = useState<string | undefined>(undefined);
  const isVideo = useMemo(() => {
    if (!resolvedMedia) return false;
    // Data URL veya uzantı üzerinden video kontrolü
    if (resolvedMedia.startsWith('data:video')) return true;
    return resolvedMedia.endsWith('.mp4') || resolvedMedia.endsWith('.webm') || resolvedMedia.endsWith('.ogg');
  }, [resolvedMedia]);

  // Video değiştiğinde süreyi sıfırla
  useEffect(() => {
    if (!isVideo) {
      setVideoDuration(null);
    }
  }, [currentIndex, isVideo]);

  // Slayt otomatik geçişi
  useEffect(() => {
    if (activeSlides.length === 0 || activeSlides.length === 1) return;

    const goToNext = () => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const next = (prev + 1) % activeSlides.length;
          return next;
        });
        setIsFlipping(false);
      }, 300);
    };

    // Video varsa video süresi kadar bekle, yoksa 6 saniye
    const slideDuration = isVideo && videoDuration ? videoDuration * 1000 : 6000;
    
    const timer = setTimeout(() => {
      goToNext();
    }, slideDuration);

    return () => {
      clearTimeout(timer);
    };
  }, [activeSlides.length, currentIndex, isVideo, videoDuration]);

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

  // Video otomatik oynatma için kullanıcı etkileşimi
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
        // Tüm videoları oynatmaya çalış
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
          video.play().catch(() => {
            // Oynatma hatası görmezden gel
          });
        });
      }
    };

    // İlk tıklamada video oynatma yetkisi al
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [hasUserInteracted]);

  useEffect(() => {
    if (!currentSlide?.media) {
      setResolvedMedia(undefined);
      return;
    }
    
    (async () => {
      try {
        const r = await resolveMediaUrl(currentSlide.media);
        setResolvedMedia(r);
      } catch (error) {
        console.error('Media resolve error:', error);
        setResolvedMedia(undefined);
      }
    })();
  }, [currentSlide?.media]);

  const sliderBody = (
    <Card onClick={() => setIsExpanded(true)} className={`overflow-hidden shadow-xl border-2 h-full ${isFlipping ? 'animate-flip' : ''} cursor-zoom-in`}>
      <CardContent className="p-0 h-full relative flex flex-col">
        {/* Background Media */}
        <div className="absolute inset-0 bg-white flex items-center justify-center">
          {resolvedMedia && (
            isVideo ? (
              <video
                key={resolvedMedia}
                src={resolvedMedia}
                className="w-full h-full object-contain"
                autoPlay={hasUserInteracted}
                controls={false}
                ref={videoRef}
                playsInline
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setVideoDuration(videoRef.current.duration);
                    // Kullanıcı etkileşimi varsa hemen oynat
                    if (hasUserInteracted) {
                      videoRef.current.play().catch(() => {});
                    }
                  }
                }}
              />
            ) : (
              <img
                src={resolvedMedia}
                alt={currentSlide?.title || 'Slayt görseli'}
                className="w-full h-full object-contain"
              />
            )
          )}
        </div>
        
        {/* Overlay gradient */}
        {currentSlide && !currentSlide.mediaOnly && currentSlide.title && currentSlide.title !== '' && currentSlide.title !== 'Başlıksız' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        )}
        
       {/* Content at bottom */}
       {currentSlide && !currentSlide.mediaOnly && currentSlide.title && currentSlide.title !== '' && currentSlide.title !== 'Başlıksız' && (
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
       )}
        
        {/* Progress indicator at bottom */}
        {currentSlide && !currentSlide.mediaOnly && currentSlide.title && currentSlide.title !== '' && currentSlide.title !== 'Başlıksız' && (
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
        )}
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
                <div className="absolute inset-0 bg-white flex items-center justify-center">
                  {resolvedMedia && (
                    isVideo ? (
                      <video
                        src={resolvedMedia}
                        className="w-full h-full object-contain"
                        autoPlay={hasUserInteracted}
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={resolvedMedia}
                        alt={currentSlide?.title || 'Slayt görseli'}
                        className="w-full h-full object-contain"
                      />
                    )
                  )}
                </div>
                {currentSlide && currentSlide.title && currentSlide.title !== '' && currentSlide.title !== 'Başlıksız' && (
                  <>
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
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return sliderBody;
};