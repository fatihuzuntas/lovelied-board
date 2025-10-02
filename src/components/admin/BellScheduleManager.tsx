import { useState } from 'react';
import { BellSchedule, DaySchedule } from '@/types/board';
import { loadBoardData, updateDaySchedules } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Plus, Trash2, Clock, BookOpen, Coffee } from 'lucide-react';
import { toast } from 'sonner';

const dayLabels = {
  all: 'Tüm Günler',
  monday: 'Pazartesi',
  tuesday: 'Salı',
  wednesday: 'Çarşamba',
  thursday: 'Perşembe',
  friday: 'Cuma',
};

export const BellScheduleManager = () => {
  const boardData = loadBoardData();
  const [daySchedules, setDaySchedules] = useState<DaySchedule[]>(
    boardData.daySchedules || [
      {
        id: 'ds1',
        day: 'all',
        schedule: boardData.bellSchedule || [],
      },
    ]
  );
  const [selectedDay, setSelectedDay] = useState<string>('ds1');
  const [newItem, setNewItem] = useState<Partial<BellSchedule>>({
    type: 'lesson',
    name: '',
    startTime: '',
    endTime: '',
  });

  const currentSchedule = daySchedules.find((ds) => ds.id === selectedDay);

  const handleSave = () => {
    updateDaySchedules(daySchedules);
    toast.success('Ders saatleri kaydedildi');
  };

  const handleAdd = () => {
    if (!newItem.name?.trim() || !newItem.startTime || !newItem.endTime) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    const item: BellSchedule = {
      id: `b${Date.now()}`,
      type: newItem.type as 'lesson' | 'break',
      name: newItem.name,
      startTime: newItem.startTime,
      endTime: newItem.endTime,
      order: (currentSchedule?.schedule.length || 0) + 1,
    };

    const updatedSchedules = daySchedules.map((ds) =>
      ds.id === selectedDay
        ? { ...ds, schedule: [...ds.schedule, item] }
        : ds
    );

    setDaySchedules(updatedSchedules);
    setNewItem({ type: 'lesson', name: '', startTime: '', endTime: '' });
    toast.success('Zaman dilimi eklendi');
  };

  const handleDelete = (id: string) => {
    const updatedSchedules = daySchedules.map((ds) => {
      if (ds.id === selectedDay) {
        const newSchedule = ds.schedule.filter((s) => s.id !== id);
        newSchedule.forEach((item, index) => {
          item.order = index + 1;
        });
        return { ...ds, schedule: newSchedule };
      }
      return ds;
    });
    setDaySchedules(updatedSchedules);
    toast.success('Zaman dilimi silindi');
  };

  const addNewDay = (day: DaySchedule['day']) => {
    const existingDay = daySchedules.find((ds) => ds.day === day);
    if (existingDay) {
      setSelectedDay(existingDay.id);
      return;
    }

    const allSchedule = daySchedules.find((ds) => ds.day === 'all');
    const newDaySchedule: DaySchedule = {
      id: `ds${Date.now()}`,
      day,
      schedule: allSchedule ? [...allSchedule.schedule] : [],
    };

    setDaySchedules([...daySchedules, newDaySchedule]);
    setSelectedDay(newDaySchedule.id);
    toast.success(`${dayLabels[day]} programı oluşturuldu`);
  };

  const deleteDay = (id: string) => {
    const daySchedule = daySchedules.find((ds) => ds.id === id);
    if (daySchedule?.day === 'all') {
      toast.error('Genel program silinemez');
      return;
    }
    setDaySchedules(daySchedules.filter((ds) => ds.id !== id));
    setSelectedDay('ds1');
    toast.success('Program silindi');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Ders ve Teneffüs Saatleri</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Günlere göre farklı ders programları oluşturabilirsiniz
          </p>
        </div>
        <Button onClick={handleSave} size="lg">
          <Save className="mr-2 h-4 w-4" />
          Kaydet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Program Seçimi</CardTitle>
            <Select onValueChange={(value) => addNewDay(value as DaySchedule['day'])}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Yeni Gün Ekle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Pazartesi</SelectItem>
                <SelectItem value="tuesday">Salı</SelectItem>
                <SelectItem value="wednesday">Çarşamba</SelectItem>
                <SelectItem value="thursday">Perşembe</SelectItem>
                <SelectItem value="friday">Cuma</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedDay} onValueChange={setSelectedDay}>
            <TabsList className="grid w-full grid-cols-6 mb-6">
              {daySchedules.map((ds) => (
                <TabsTrigger key={ds.id} value={ds.id} className="relative">
                  {dayLabels[ds.day]}
                  {ds.day !== 'all' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDay(ds.id);
                      }}
                    >
                      ×
                    </Button>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {daySchedules.map((ds) => (
              <TabsContent key={ds.id} value={ds.id} className="space-y-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Yeni Zaman Dilimi Ekle</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label>Tür</Label>
                        <Select
                          value={newItem.type}
                          onValueChange={(value) =>
                            setNewItem({ ...newItem, type: value as BellSchedule['type'] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lesson">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Ders
                              </div>
                            </SelectItem>
                            <SelectItem value="break">
                              <div className="flex items-center gap-2">
                                <Coffee className="h-4 w-4" />
                                Teneffüs
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>İsim</Label>
                        <Input
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          placeholder="örn: 1. Ders"
                        />
                      </div>

                      <div>
                        <Label>Başlangıç</Label>
                        <Input
                          type="time"
                          value={newItem.startTime}
                          onChange={(e) => setNewItem({ ...newItem, startTime: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>Bitiş</Label>
                        <Input
                          type="time"
                          value={newItem.endTime}
                          onChange={(e) => setNewItem({ ...newItem, endTime: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button onClick={handleAdd} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Ekle
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {dayLabels[ds.day]} Programı
                  </h3>
                  {ds.schedule.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center text-muted-foreground">
                        Henüz zaman dilimi eklenmemiş
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-2">
                      {ds.schedule.map((item) => (
                        <Card
                          key={item.id}
                          className={`transition-all hover:shadow-md ${
                            item.type === 'lesson'
                              ? 'border-l-4 border-l-primary'
                              : 'border-l-4 border-l-secondary'
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div
                                className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                                  item.type === 'lesson'
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-secondary/10 text-secondary'
                                }`}
                              >
                                {item.type === 'lesson' ? (
                                  <BookOpen className="h-6 w-6" />
                                ) : (
                                  <Coffee className="h-6 w-6" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-lg">{item.name}</span>
                                  <span
                                    className={`text-xs font-medium px-2 py-1 rounded ${
                                      item.type === 'lesson'
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-secondary/10 text-secondary'
                                    }`}
                                  >
                                    {item.type === 'lesson' ? 'Ders' : 'Teneffüs'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {item.startTime} - {item.endTime}
                                  </span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
