import { useState, useEffect } from 'react';
import { DutyInfo } from '@/types/board';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User } from 'lucide-react';

interface DutySectionFlipProps {
  duty: DutyInfo;
}

export const DutySectionFlip = ({ duty }: DutySectionFlipProps) => {
  const [showTeacher, setShowTeacher] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setShowTeacher((prev) => !prev);
        setIsFlipping(false);
      }, 300);
    }, 6000); // Her 6 saniyede değiş

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className={`shadow-lg border-l-4 border-l-primary transition-all duration-300 ${isFlipping ? 'animate-flip' : ''}`}>
      <CardHeader className="bg-primary/5 py-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Nöbetçiler
        </CardTitle>
        <p className="text-xs text-muted-foreground">{formatDate(duty.date)}</p>
      </CardHeader>
      <CardContent className="pt-4">
        {showTeacher ? (
          <div className="p-4 bg-secondary/10 rounded-lg text-center min-h-[120px] flex flex-col justify-center">
            <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="h-6 w-6 text-secondary-foreground" />
            </div>
            <p className="text-xs text-muted-foreground font-medium mb-1">Nöbetçi Öğretmen</p>
            <p className="text-lg font-bold text-foreground">{duty.teacher}</p>
          </div>
        ) : (
          <div className="min-h-[120px]">
            <p className="text-xs text-muted-foreground font-medium mb-2 text-center">Nöbetçi Öğrenciler</p>
            <div className="space-y-1.5">
              {duty.students.slice(0, 3).map((student, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-accent/10 rounded text-xs"
                >
                  <div className="h-6 w-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-xs flex-shrink-0">
                    {idx + 1}
                  </div>
                  <p className="font-medium">{student}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
