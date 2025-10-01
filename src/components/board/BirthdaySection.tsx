import { Birthday } from '@/types/board';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cake } from 'lucide-react';

interface BirthdaySectionProps {
  birthdays: Birthday[];
}

export const BirthdaySection = ({ birthdays }: BirthdaySectionProps) => {
  const today = new Date().toISOString().split('T')[0];
  const todayBirthdays = birthdays.filter(b => {
    const bDay = new Date(b.date);
    const todayDate = new Date(today);
    return bDay.getMonth() === todayDate.getMonth() && bDay.getDate() === todayDate.getDate();
  });

  const upcomingBirthdays = birthdays.filter(b => {
    const bDay = new Date(b.date);
    const todayDate = new Date(today);
    const daysDiff = Math.ceil((bDay.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > 0 && daysDiff <= 7;
  }).slice(0, 5);

  return (
    <Card className="shadow-lg animate-slide-up border-l-4 border-l-secondary">
      <CardHeader className="bg-secondary/5">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Cake className="h-7 w-7 text-secondary" />
          Doğum Günleri
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {todayBirthdays.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-secondary mb-3 flex items-center gap-2">
              🎉 Bugün Doğum Günü Olanlar
            </p>
            <div className="space-y-2">
              {todayBirthdays.map((birthday, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-lg animate-glow"
                >
                  <p className="text-lg font-bold text-foreground">{birthday.name}</p>
                  <p className="text-sm text-muted-foreground">{birthday.class}</p>
                  <div className="mt-2 text-2xl">🎂 🎈 🎁</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {upcomingBirthdays.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-3">
              📅 Bu Hafta Doğum Günü Olanlar
            </p>
            <div className="space-y-2">
              {upcomingBirthdays.map((birthday, idx) => (
                <div key={idx} className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <p className="font-medium text-foreground">{birthday.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {birthday.class} • {new Date(birthday.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {todayBirthdays.length === 0 && upcomingBirthdays.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            Bu hafta doğum günü kutlanacak kimse yok
          </p>
        )}
      </CardContent>
    </Card>
  );
};
