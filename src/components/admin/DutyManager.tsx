import { useState } from 'react';
import { DutyInfo } from '@/types/board';
import { loadBoardData, updateDuty } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export const DutyManager = () => {
  const [duty, setDuty] = useState<DutyInfo>(loadBoardData().duty);
  const [newStudent, setNewStudent] = useState('');

  const handleSave = () => {
    updateDuty(duty);
    toast.success('Nöbetçi bilgileri kaydedildi');
  };

  const handleAddStudent = () => {
    if (!newStudent.trim()) return;
    setDuty({
      ...duty,
      students: [...duty.students, newStudent],
    });
    setNewStudent('');
  };

  const handleRemoveStudent = (index: number) => {
    setDuty({
      ...duty,
      students: duty.students.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Nöbetçi Yönetimi</h2>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Kaydet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nöbetçi Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tarih</Label>
              <Input
                type="date"
                value={duty.date}
                onChange={(e) => setDuty({ ...duty, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Nöbetçi Öğretmen</Label>
              <Input
                value={duty.teacher}
                onChange={(e) => setDuty({ ...duty, teacher: e.target.value })}
                placeholder="Öğretmen adı"
              />
            </div>
          </div>

          <div>
            <Label>Nöbetçi Öğrenciler</Label>
            <div className="space-y-2 mt-2">
              {duty.students.map((student, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input value={student} disabled className="flex-1" />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveStudent(idx)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newStudent}
                  onChange={(e) => setNewStudent(e.target.value)}
                  placeholder="Öğrenci adı - Sınıf (örn: Ali Demir - 10A)"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddStudent()}
                />
                <Button onClick={handleAddStudent}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
