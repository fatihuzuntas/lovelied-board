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
    <Card className="shadow-lg animate-slide-up border-l-4 border-l-primary">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Users className="h-7 w-7 text-primary" />
          Bugünün Nöbetçileri
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{formatDate(duty.date)}</p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-secondary/10 rounded-lg">
            <div className="h-14 w-14 bg-secondary rounded-full flex items-center justify-center">
              <User className="h-7 w-7 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Nöbetçi Öğretmen</p>
              <p className="text-xl font-bold text-foreground">{duty.teacher}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground font-medium mb-3">Nöbetçi Öğrenciler</p>
            <div className="space-y-2">
              {duty.students.map((student, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
                >
                  <div className="h-10 w-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-lg font-medium">{student}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
