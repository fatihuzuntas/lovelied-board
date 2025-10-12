import { useState, useEffect } from 'react';
import { Countdown } from '@/types/board';
import { loadBoardData, updateCountdowns } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const colorfulIcons = [
  '🎉', '🎊', '🎈', '🎁', '🎂', '🎓', '📚', '📝', '📖', '✏️',
  '🏆', '🥇', '🥈', '🥉', '⭐', '✨', '💫', '🌟', '🌈', '🔥',
  '❤️', '💙', '💚', '💛', '🧡', '💜', '🏖️', '🌴', '☀️', '🌙',
  '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎯', '🎪', '🎭', '🎨',
  '🎵', '🎶', '🎸', '🎹', '🎤', '🎧', '📅', '⏰', '⏳', '⌛',
];

export const CountdownManager = () => {
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [newCountdown, setNewCountdown] = useState<Partial<Countdown>>({
    name: '',
    date: '',
    type: 'event',
    icon: '📅',
  });
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleSave = () => {
    updateCountdowns(countdowns);
    toast.success('Geri sayımlar kaydedildi');
  };

  // Açılışta güncel veriyi çek
  useEffect(() => {
    (async () => {
      const data = await loadBoardData();
      setCountdowns(data.countdowns || []);
    })();
  }, []);

  const handleAdd = () => {
    if (!newCountdown.name || !newCountdown.date) {
      toast.error('Lütfen isim ve tarih alanlarını doldurun');
      return;
    }
    const countdown: Countdown = {
      id: `c${Date.now()}`,
      name: newCountdown.name,
      date: newCountdown.date,
      type: newCountdown.type as 'exam' | 'event' | 'holiday',
      icon: newCountdown.icon,
    };
    setCountdowns([...countdowns, countdown]);
    setNewCountdown({ name: '', date: '', type: 'event', icon: '📅' });
    toast.success('Geri sayım eklendi');
  };

  const handleDelete = (id: string) => {
    setCountdowns(countdowns.filter(c => c.id !== id));
    toast.success('Geri sayım silindi');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Geri Sayım Yönetimi</h2>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Kaydet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yeni Geri Sayım Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <Label>Başlık</Label>
              <Input
                value={newCountdown.name}
                onChange={(e) => setNewCountdown({ ...newCountdown, name: e.target.value })}
                placeholder="Örn: Final Sınavları"
              />
            </div>
            <div>
              <Label>Tarih</Label>
              <Input
                type="date"
                value={newCountdown.date}
                onChange={(e) => setNewCountdown({ ...newCountdown, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Tür</Label>
              <Select
                value={newCountdown.type}
                onValueChange={(value: 'exam' | 'event' | 'holiday') =>
                  setNewCountdown({ ...newCountdown, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exam">Sınav</SelectItem>
                  <SelectItem value="event">Etkinlik</SelectItem>
                  <SelectItem value="holiday">Tatil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>İkon</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-2xl"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                >
                  {newCountdown.icon}
                </Button>
                {showIconPicker && (
                  <div className="absolute z-10 mt-2 bg-card border rounded-xl shadow-xl left-1/2 -translate-x-1/2 w-[420px]">
                    <div className="p-2 max-h-72 overflow-auto">
                      <div className="grid grid-cols-9 gap-1">
                        {colorfulIcons.map((icon, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="text-2xl hover:bg-muted rounded-md h-9 w-9 flex items-center justify-center"
                            onClick={() => {
                              setNewCountdown({ ...newCountdown, icon });
                              setShowIconPicker(false);
                            }}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAdd} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Ekle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aktif Geri Sayımlar ({countdowns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {countdowns.map((countdown) => {
              const daysLeft = Math.ceil(
                (new Date(countdown.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={countdown.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-3xl">{countdown.icon}</span>
                    <div>
                      <p className="font-medium">{countdown.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(countdown.date).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                        {' • '}
                        <span className="font-semibold">
                          {daysLeft < 0 ? 'Geçti' : daysLeft === 0 ? 'Bugün' : `${daysLeft} gün kaldı`}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(countdown.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
            {countdowns.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Henüz geri sayım eklenmemiş
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
