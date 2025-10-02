import { useState } from 'react';
import { BellSchedule } from '@/types/board';
import { loadBoardData, updateBellSchedule } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { toast } from 'sonner';

export const BellScheduleManager = () => {
  const [schedule, setSchedule] = useState<BellSchedule[]>(
    loadBoardData().bellSchedule?.sort((a, b) => a.order - b.order) || []
  );
  const [newItem, setNewItem] = useState<Partial<BellSchedule>>({
    type: 'lesson',
    name: '',
    startTime: '',
    endTime: '',
  });

  const handleSave = () => {
    updateBellSchedule(schedule);
    toast.success('Zil saatleri kaydedildi');
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
      order: schedule.length + 1,
    };

    setSchedule([...schedule, item]);
    setNewItem({ type: 'lesson', name: '', startTime: '', endTime: '' });
    toast.success('Zaman dilimi eklendi');
  };

  const handleDelete = (id: string) => {
    const newSchedule = schedule.filter(s => s.id !== id);
    // Re-order
    newSchedule.forEach((item, index) => {
      item.order = index + 1;
    });
    setSchedule(newSchedule);
    toast.success('Zaman dilimi silindi');
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSchedule = [...schedule];
    [newSchedule[index], newSchedule[index - 1]] = [newSchedule[index - 1], newSchedule[index]];
    newSchedule.forEach((item, idx) => {
      item.order = idx + 1;
    });
    setSchedule(newSchedule);
  };

  const moveDown = (index: number) => {
    if (index === schedule.length - 1) return;
    const newSchedule = [...schedule];
    [newSchedule[index], newSchedule[index + 1]] = [newSchedule[index + 1], newSchedule[index]];
    newSchedule.forEach((item, idx) => {
      item.order = idx + 1;
    });
    setSchedule(newSchedule);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ders ve Teneffüs Saatleri</h2>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Kaydet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yeni Zaman Dilimi Ekle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tür</Label>
            <Select 
              value={newItem.type} 
              onValueChange={(value) => setNewItem({ ...newItem, type: value as BellSchedule['type'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lesson">Ders</SelectItem>
                <SelectItem value="break">Teneffüs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>İsim</Label>
            <Input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="örn: 1. Ders, Öğle Arası"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Başlangıç Saati</Label>
              <Input
                type="time"
                value={newItem.startTime}
                onChange={(e) => setNewItem({ ...newItem, startTime: e.target.value })}
              />
            </div>
            <div>
              <Label>Bitiş Saati</Label>
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

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Günlük Program</h3>
        {schedule.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Henüz zaman dilimi eklenmemiş
            </CardContent>
          </Card>
        ) : (
          schedule.map((item, index) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveDown(index)}
                      disabled={index === schedule.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        item.type === 'lesson' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-secondary/10 text-secondary'
                      }`}>
                        {item.type === 'lesson' ? '📚 Ders' : '☕ Teneffüs'}
                      </span>
                      <span className="font-semibold">{item.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.startTime} - {item.endTime}
                    </p>
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
          ))
        )}
      </div>
    </div>
  );
};
