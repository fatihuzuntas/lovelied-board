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
  const [newTeacher, setNewTeacher] = useState({ name: '', area: '' });

  const handleSave = () => {
    updateDuty(duty);
    toast.success('Nöbetçi bilgileri kaydedildi');
  };

  const handleAddTeacher = () => {
    if (!newTeacher.name.trim()) return;
    setDuty({
      ...duty,
      teachers: [...duty.teachers, { name: newTeacher.name, area: newTeacher.area }],
    });
    setNewTeacher({ name: '', area: '' });
  };

  const handleRemoveTeacher = (index: number) => {
    setDuty({
      ...duty,
      teachers: duty.teachers.filter((_, i) => i !== index),
    });
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
          <div>
            <Label>Tarih</Label>
            <Input
              type="date"
              value={duty.date}
              onChange={(e) => setDuty({ ...duty, date: e.target.value })}
            />
          </div>

          <div>
            <Label>Nöbetçi Öğretmenler</Label>
            <div className="space-y-2 mt-2">
              {duty.teachers.map((teacher, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input value={teacher.name} disabled className="flex-1" />
                  <Input 
                    value={teacher.area || ''} 
                    disabled 
                    className="w-32"
                    placeholder="Bölge" 
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveTeacher(idx)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  placeholder="Öğretmen adı"
                  className="flex-1"
                />
                <Input
                  value={newTeacher.area}
                  onChange={(e) => setNewTeacher({ ...newTeacher, area: e.target.value })}
                  placeholder="Bölge (Kat 1, Bahçe, vb.)"
                  className="w-48"
                />
                <Button onClick={handleAddTeacher}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
