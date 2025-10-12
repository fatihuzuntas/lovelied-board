import { useState } from 'react';
import { DutyInfo } from '@/types/board';
import { loadBoardData, updateDuty } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Plus, X, Edit, Check } from 'lucide-react';
import { toast } from 'sonner';

export const DutyManager = () => {
  const [duty, setDuty] = useState<DutyInfo>(loadBoardData().duty);
  const [newStudent, setNewStudent] = useState({ name: '', area: '' });
  const [newTeacher, setNewTeacher] = useState({ name: '', area: '' });
  const [editingTeacher, setEditingTeacher] = useState<number | null>(null);
  const [editingStudent, setEditingStudent] = useState<number | null>(null);
  const [editTeacherForm, setEditTeacherForm] = useState<{ name: string; area?: string }>({ name: '', area: '' });
  const [editStudentForm, setEditStudentForm] = useState<{ name: string; area?: string }>({ name: '', area: '' });

  const handleSave = async () => {
    await updateDuty(duty);
    toast.success('Nöbetçi bilgileri kaydedildi');
  };

  // Açılışta güncel veriyi çek
  useEffect(() => {
    (async () => {
      const data = await refreshBoardDataFromApi();
      if (data) setDuty(data.duty);
    })();
  }, []);

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

  const handleEditTeacher = (index: number) => {
    setEditingTeacher(index);
    setEditTeacherForm(duty.teachers[index]);
  };

  const handleUpdateTeacher = () => {
    if (editingTeacher === null) return;
    const updatedTeachers = [...duty.teachers];
    updatedTeachers[editingTeacher] = editTeacherForm;
    setDuty({ ...duty, teachers: updatedTeachers });
    setEditingTeacher(null);
  };

  const handleAddStudent = () => {
    if (!newStudent.name.trim()) return;
    setDuty({
      ...duty,
      students: [...duty.students, { name: newStudent.name, area: newStudent.area }],
    });
    setNewStudent({ name: '', area: '' });
  };

  const handleRemoveStudent = (index: number) => {
    setDuty({
      ...duty,
      students: duty.students.filter((_, i) => i !== index),
    });
  };

  const handleEditStudent = (index: number) => {
    setEditingStudent(index);
    setEditStudentForm(duty.students[index]);
  };

  const handleUpdateStudent = () => {
    if (editingStudent === null) return;
    const updatedStudents = [...duty.students];
    updatedStudents[editingStudent] = editStudentForm;
    setDuty({ ...duty, students: updatedStudents });
    setEditingStudent(null);
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
                  {editingTeacher === idx ? (
                    <>
                      <Input
                        value={editTeacherForm.name}
                        onChange={(e) => setEditTeacherForm({ ...editTeacherForm, name: e.target.value })}
                        placeholder="Öğretmen adı"
                        className="flex-1"
                      />
                      <Input
                        value={editTeacherForm.area || ''}
                        onChange={(e) => setEditTeacherForm({ ...editTeacherForm, area: e.target.value })}
                        placeholder="Bölge"
                        className="w-32"
                      />
                      <Button size="sm" onClick={handleUpdateTeacher}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingTeacher(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input value={teacher.name} disabled className="flex-1" />
                      <Input value={teacher.area || ''} disabled className="w-32" placeholder="Bölge" />
                      <Button size="sm" variant="outline" onClick={() => handleEditTeacher(idx)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRemoveTeacher(idx)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
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
                  {editingStudent === idx ? (
                    <>
                      <Input
                        value={editStudentForm.name}
                        onChange={(e) => setEditStudentForm({ ...editStudentForm, name: e.target.value })}
                        placeholder="Öğrenci adı - Sınıf"
                        className="flex-1"
                      />
                      <Input
                        value={editStudentForm.area || ''}
                        onChange={(e) => setEditStudentForm({ ...editStudentForm, area: e.target.value })}
                        placeholder="Bölge"
                        className="w-32"
                      />
                      <Button size="sm" onClick={handleUpdateStudent}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingStudent(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input value={student.name} disabled className="flex-1" />
                      <Input value={student.area || ''} disabled className="w-32" placeholder="Bölge" />
                      <Button size="sm" variant="outline" onClick={() => handleEditStudent(idx)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRemoveStudent(idx)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Öğrenci adı - Sınıf (örn: Ali Demir - 10A)"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddStudent()}
                />
                <Input
                  value={newStudent.area}
                  onChange={(e) => setNewStudent({ ...newStudent, area: e.target.value })}
                  placeholder="Bölge (Kat 1, Bahçe, vb.)"
                  className="w-48"
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
