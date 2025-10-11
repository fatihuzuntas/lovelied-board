import { useEffect, useState } from 'react';
import { DutyInfo } from '@/types/board';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface DutySectionFlipProps {
  duty: DutyInfo;
  compact?: boolean;
}

export const DutySectionFlip = ({ duty, compact = false }: DutySectionFlipProps) => {
  const [showStudents, setShowStudents] = useState(true);
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
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setShowStudents((prev) => !prev);
        setIsFlipping(false);
      }, 250);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`shadow-lg border-l-4 border-l-primary transition-all duration-300 ${isFlipping ? 'animate-flip' : ''} ${compact ? 'max-h-44 overflow-hidden' : ''}`}> 
      <CardHeader className={`bg-primary/5 ${compact ? 'py-2' : 'py-3'}`}>
        <CardTitle className={`flex items-center gap-2 ${compact ? 'text-base' : 'text-lg'}`}>
          <Users className="h-5 w-5 text-primary" />
          Nöbetçiler
        </CardTitle>
        <p className="text-xs text-muted-foreground">{formatDate(duty.date)}</p>
      </CardHeader>
      <CardContent className={`${compact ? 'pt-2' : 'pt-3'} ${compact ? 'min-h-[120px]' : ''}`}>
        {showStudents ? (
          <div>
            <p className="text-[11px] text-muted-foreground font-medium mb-1.5">Nöbetçi Öğrenciler</p>
            <div className="space-y-1">
              {duty.students.map((student, idx) => (
                <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-accent/10 rounded">
                  <div className="h-5 w-5 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-[10px] flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{student.name}</p>
                    {student.area && <p className="text-[11px] text-muted-foreground truncate">{student.area}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[11px] text-muted-foreground font-medium mb-1.5">Nöbetçi Öğretmenler</p>
            <div className="space-y-1">
              {duty.teachers.map((teacher, idx) => (
                <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-secondary/10 rounded">
                  <div className="h-5 w-5 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-[10px] flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{teacher.name}</p>
                    {teacher.area && <p className="text-[11px] text-muted-foreground truncate">{teacher.area}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
