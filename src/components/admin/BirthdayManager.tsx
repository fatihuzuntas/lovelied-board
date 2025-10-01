import { useState } from 'react';
import { Birthday } from '@/types/board';
import { loadBoardData, updateBirthdays } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const BirthdayManager = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>(loadBoardData().birthdays);
  const [newBirthday, setNewBirthday] = useState<Partial<Birthday>>({
    name: '',
    date: '',
    class: '',
  });

  const handleSave = () => {
    updateBirthdays(birthdays);
    toast.success('Doğum günü listesi kaydedildi');
  };

  const handleAdd = () => {
    if (!newBirthday.name || !newBirthday.date || !newBirthday.class) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }
    setBirthdays([...birthdays, newBirthday as Birthday]);
    setNewBirthday({ name: '', date: '', class: '' });
    toast.success('Doğum günü eklendi');
  };

  const handleDelete = (index: number) => {
    setBirthdays(birthdays.filter((_, i) => i !== index));
    toast.success('Doğum günü silindi');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Doğum Günü Yönetimi</h2>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Kaydet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yeni Doğum Günü Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>İsim Soyisim</Label>
              <Input
                value={newBirthday.name}
                onChange={(e) => setNewBirthday({ ...newBirthday, name: e.target.value })}
                placeholder="Örn: Ahmet Yılmaz"
              />
            </div>
            <div>
              <Label>Doğum Tarihi</Label>
              <Input
                type="date"
                value={newBirthday.date}
                onChange={(e) => setNewBirthday({ ...newBirthday, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Sınıf</Label>
              <Input
                value={newBirthday.class}
                onChange={(e) => setNewBirthday({ ...newBirthday, class: e.target.value })}
                placeholder="Örn: 10A"
              />
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
          <CardTitle>Doğum Günü Listesi ({birthdays.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {birthdays.map((birthday, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <p className="font-medium">{birthday.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(birthday.date).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">{birthday.class}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {birthdays.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Henüz doğum günü eklenmemiş
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
