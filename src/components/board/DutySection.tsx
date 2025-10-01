import { DutyInfo } from '@/types/board';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User } from 'lucide-react';

interface DutySectionProps {
  duty: DutyInfo;
}

export const DutySection = ({ duty }: DutySectionProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <Card className="shadow-lg animate-slide-up border-l-4 border-l-primary h-full flex flex-col">
      <CardHeader className="bg-primary/5 py-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="h-5 w-5 text-primary" />
          Bugünün Nöbetçileri
        </CardTitle>
        <p className="text-xs text-muted-foreground">{formatDate(duty.date)}</p>
      </CardHeader>
      <CardContent className="pt-4 flex-1 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
            <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Nöbetçi Öğretmen</p>
              <p className="text-base font-bold text-foreground">{duty.teacher}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground font-medium mb-2">Nöbetçi Öğrenciler</p>
            <div className="space-y-2">
              {duty.students.map((student, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
                >
                  <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-sm flex-shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-sm font-medium">{student}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
