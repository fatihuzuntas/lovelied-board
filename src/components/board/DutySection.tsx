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
      <CardHeader className="bg-primary/5 py-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Nöbetçiler
        </CardTitle>
        <p className="text-xs text-muted-foreground">{formatDate(duty.date)}</p>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="p-3 bg-secondary/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-secondary" />
            <p className="text-xs text-muted-foreground font-medium">Öğretmenler</p>
          </div>
          {duty.teachers.map((teacher, idx) => (
            <div key={idx} className="mb-1">
              <p className="text-sm font-bold text-foreground">{teacher.name}</p>
              {teacher.area && (
                <p className="text-xs text-muted-foreground">{teacher.area}</p>
              )}
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs text-muted-foreground font-medium mb-2">Öğrenciler</p>
          <div className="space-y-1.5">
            {duty.students.map((student, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 bg-accent/10 rounded text-xs"
              >
                <div className="h-6 w-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-xs flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{student.name}</p>
                  {student.area && <p className="text-xs text-muted-foreground">{student.area}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
