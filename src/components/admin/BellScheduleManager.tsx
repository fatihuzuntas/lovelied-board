import { useState } from 'react';
import { BellSchedule, DaySchedule } from '@/types/board';
import { loadBoardData, updateDaySchedules } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Plus, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

const daysMap = {
  all: 'Tüm Günler',
  monday: 'Pazartesi',
  tuesday: 'Salı',
  wednesday: 'Çarşamba',
  thursday: 'Perşembe',
  friday: 'Cuma',
};

export const BellScheduleManager = () => {
  const data = loadBoardData();
  const [daySchedules, setDaySchedules] = useState<DaySchedule[]>(
    data.daySchedules || [
      {
        id: 'ds1',
        day: 'all',
        schedule: [
          { id: 'b1', type: 'lesson', name: '1. Ders', startTime: '08:30', endTime: '09:15', order: 1 },
          { id: 'b2', type: 'lesson', name: '2. Ders', startTime: '09:25', endTime: '10:10', order: 2 },
          { id: 'b3', type: 'lesson', name: '3. Ders', startTime: '10:20', endTime: '11:05', order: 3 },
          { id: 'b4', type: 'lesson', name: '4. Ders', startTime: '11:15', endTime: '12:00', order: 4 },
          { id: 'b5', type: 'lesson', name: '5. Ders', startTime: '13:00', endTime: '13:45', order: 5 },
          { id: 'b6', type: 'lesson', name: '6. Ders', startTime: '13:55', endTime: '14:40', order: 6 },
          { id: 'b7', type: 'lesson', name: '7. Ders', startTime: '14:50', endTime: '15:35', order: 7 },
          { id: 'b8', type: 'lesson', name: '8. Ders', startTime: '15:45', endTime: '16:30', order: 8 },
        ],
      },
    ]
  );
  const [currentDay, setCurrentDay] = useState<'all' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'>('all');

  const getCurrentSchedule = () => {
    return daySchedules.find((ds) => ds.day === currentDay) || {
      id: `ds${Date.now()}`,
      day: currentDay,
      schedule: [],
    };
  };

  const updateCurrentSchedule = (schedule: BellSchedule[]) => {
    const updated = daySchedules.filter((ds) => ds.day !== currentDay);
    updated.push({ ...getCurrentSchedule(), schedule });
    setDaySchedules(updated);
  };

  const handleSave = () => {
    updateDaySchedules(daySchedules);
    toast.success('Ders saatleri kaydedildi');
  };

  const handleAddLesson = () => {
    const current = getCurrentSchedule();
    const lessons = current.schedule.filter((s) => s.type === 'lesson');
    const nextOrder = lessons.length + 1;
    const newLesson: BellSchedule = {
      id: `b${Date.now()}`,
      type: 'lesson',
      name: `${nextOrder}. Ders`,
      startTime: '08:30',
      endTime: '09:15',
      order: nextOrder,
    };
    updateCurrentSchedule([...current.schedule, newLesson].sort((a, b) => a.order - b.order));
    toast.success('Ders eklendi');
  };

  const handleDeleteLesson = (id: string) => {
    const current = getCurrentSchedule();
    updateCurrentSchedule(current.schedule.filter((s) => s.id !== id));
    toast.success('Ders silindi');
  };

  const handleUpdateLesson = (id: string, field: keyof BellSchedule, value: any) => {
    const current = getCurrentSchedule();
    updateCurrentSchedule(
      current.schedule.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const currentSchedule = getCurrentSchedule();
  const lessons = currentSchedule.schedule.filter((s) => s.type === 'lesson').sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ders Saatleri Yönetimi</h2>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Kaydet
        </Button>
      </div>

      <Tabs value={currentDay} onValueChange={(v) => setCurrentDay(v as any)}>
        <TabsList className="grid w-full grid-cols-6">
          {Object.entries(daysMap).map(([key, label]) => (
            <TabsTrigger key={key} value={key}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(daysMap).map((day) => (
          <TabsContent key={day} value={day} className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {day === 'all' ? 'Tüm günler için geçerli ders programı' : `${daysMap[day as keyof typeof daysMap]} günü ders programı`}
              </p>
              <Button onClick={handleAddLesson} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Ders Ekle
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base">{lesson.name}</CardTitle>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteLesson(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">Ders Adı</Label>
                      <Input
                        value={lesson.name}
                        onChange={(e) => handleUpdateLesson(lesson.id, 'name', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Başlangıç</Label>
                        <Input
                          type="time"
                          value={lesson.startTime}
                          onChange={(e) => handleUpdateLesson(lesson.id, 'startTime', e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Bitiş</Label>
                        <Input
                          type="time"
                          value={lesson.endTime}
                          onChange={(e) => handleUpdateLesson(lesson.id, 'endTime', e.target.value)}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {lessons.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Henüz ders eklenmemiş. Yukarıdaki "Ders Ekle" butonuna tıklayarak başlayın.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
