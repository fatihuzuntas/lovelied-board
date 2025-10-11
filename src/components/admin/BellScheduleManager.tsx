import { useEffect, useState } from 'react';
import { BellSchedule, DaySchedule } from '@/types/board';
import { loadBoardData, updateDaySchedules } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
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
        id: 'ds_all',
        day: 'all',
        schedule: [
          { id: 'b_1', type: 'lesson', name: '1. Ders', startTime: '08:20', endTime: '09:00', order: 1 },
          { id: 'b_2', type: 'lesson', name: '2. Ders', startTime: '09:10', endTime: '09:50', order: 2 },
          { id: 'b_3', type: 'lesson', name: '3. Ders', startTime: '10:00', endTime: '10:40', order: 3 },
          { id: 'b_4', type: 'lesson', name: '4. Ders', startTime: '10:50', endTime: '11:30', order: 4 },
          { id: 'b_5', type: 'lesson', name: '5. Ders', startTime: '11:40', endTime: '12:20', order: 5 },
          { id: 'b_6', type: 'lesson', name: '6. Ders', startTime: '13:00', endTime: '13:40', order: 6 },
          { id: 'b_7', type: 'lesson', name: '7. Ders', startTime: '14:00', endTime: '14:40', order: 7 },
          { id: 'b_8', type: 'lesson', name: '8. Ders', startTime: '14:45', endTime: '15:25', order: 8 },
        ],
      },
    ]
  );
  const [currentDay, setCurrentDay] = useState<'all' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'>('all');
  const [sameForAll, setSameForAll] = useState<boolean>(true);

  const getDefaultLessons = (): BellSchedule[] => {
    const times: Array<[string, string]> = [
      ['08:20', '09:00'],
      ['09:10', '09:50'],
      ['10:00', '10:40'],
      ['10:50', '11:30'],
      ['11:40', '12:20'],
      ['13:00', '13:40'],
      ['14:00', '14:40'],
      ['14:45', '15:25'],
    ];
    return times.map((t, idx) => ({
      id: `b_${idx + 1}`,
      type: 'lesson',
      name: `${idx + 1}. Ders`,
      startTime: t[0],
      endTime: t[1],
      order: idx + 1,
    }));
  };

  // Eksik günleri varsayılan saatlerle doldur (mevcut dolu günleri bozma)
  useEffect(() => {
    const days: Array<'all' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'> = [
      'all',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
    ];
    const existing = new Map(daySchedules.map((d) => [d.day, d] as const));
    let changed = false;
    const ensured: DaySchedule[] = [];
    for (const d of days) {
      const found = existing.get(d as any);
      if (!found) {
        ensured.push({ id: `ds_${d}`, day: d as any, schedule: getDefaultLessons() });
        changed = true;
      } else if (!found.schedule || found.schedule.length === 0) {
        ensured.push({ ...found, schedule: getDefaultLessons() });
        changed = true;
      } else {
        ensured.push(found);
      }
    }
    if (changed) {
      setDaySchedules(ensured);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // "Tüm günler aynı" kapalıyken, aktif sekme "all" ise Pazartesi'ye taşı
  useEffect(() => {
    if (!sameForAll && currentDay === 'all') {
      setCurrentDay('monday');
    }
  }, [sameForAll, currentDay]);

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
    if (sameForAll) {
      const all = daySchedules.find((d) => d.day === 'all') || { id: 'ds_all', day: 'all', schedule: getDefaultLessons() };
      const schedule = all.schedule;
      const ensured: DaySchedule[] = [
        { id: all.id, day: 'all', schedule },
        { id: 'ds_mon', day: 'monday', schedule },
        { id: 'ds_tue', day: 'tuesday', schedule },
        { id: 'ds_wed', day: 'wednesday', schedule },
        { id: 'ds_thu', day: 'thursday', schedule },
        { id: 'ds_fri', day: 'friday', schedule },
      ];
      updateDaySchedules(ensured);
      setDaySchedules(ensured);
    } else {
      updateDaySchedules(daySchedules);
    }
    toast.success('Ders saatleri kaydedildi');
  };

  const handleAddLesson = () => {
    const current = getCurrentSchedule();
    const lessons = current.schedule.filter((s) => s.type === 'lesson').sort((a, b) => a.order - b.order);
    const nextOrder = lessons.length + 1;

    const addMinutes = (time: string, minutes: number): string => {
      const [h, m] = time.split(':').map((v) => parseInt(v, 10));
      const date = new Date();
      date.setHours(h, m, 0, 0);
      date.setMinutes(date.getMinutes() + minutes);
      const hh = String(date.getHours()).padStart(2, '0');
      const mm = String(date.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    };

    // Başlangıç: önceki dersin bitişi + 10 dk, yoksa 08:20
    const previousEnd = lessons.length > 0 ? lessons[lessons.length - 1].endTime : '08:20';
    const startTime = addMinutes(previousEnd, lessons.length > 0 ? 10 : 0);
    // Bitiş: başlangıç + 40 dk
    const endTime = addMinutes(startTime, 40);

    const newLesson: BellSchedule = {
      id: `b${Date.now()}`,
      type: 'lesson',
      name: `${nextOrder}. Ders`,
      startTime,
      endTime,
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Switch checked={sameForAll} onCheckedChange={setSameForAll} id="sameForAll" />
          <Label htmlFor="sameForAll" className="cursor-pointer">Tüm günler aynı</Label>
        </div>
      </div>

      {sameForAll ? (
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Tüm günler için geçerli ders programı</p>
            <Button onClick={handleAddLesson} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Ders Ekle
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <CardTitle className="text-base">{lesson.name}</CardTitle>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteLesson(lesson.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Ders Adı</Label>
                    <Input value={lesson.name} onChange={(e) => handleUpdateLesson(lesson.id, 'name', e.target.value)} className="h-8" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Başlangıç</Label>
                      <Input type="time" value={lesson.startTime} onChange={(e) => handleUpdateLesson(lesson.id, 'startTime', e.target.value)} className="h-8" />
                    </div>
                    <div>
                      <Label className="text-xs">Bitiş</Label>
                      <Input type="time" value={lesson.endTime} onChange={(e) => handleUpdateLesson(lesson.id, 'endTime', e.target.value)} className="h-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Tabs value={currentDay} onValueChange={(v) => setCurrentDay(v as any)}>
          <TabsList className="grid w-full grid-cols-5">
            {Object.entries(daysMap).filter(([key]) => key !== 'all').map(([key, label]) => (
              <TabsTrigger key={key} value={key}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

        {Object.keys(daysMap).filter((d) => d !== 'all').map((day) => (
          <TabsContent key={day} value={day} className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {`${daysMap[day as keyof typeof daysMap]} günü ders programı`}
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
      )}
    </div>
  );
};
