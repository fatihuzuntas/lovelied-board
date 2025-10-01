import { useState } from 'react';
import { Slide } from '@/types/board';
import { loadBoardData, updateSlides } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export const SlideManager = () => {
  const [slides, setSlides] = useState<Slide[]>(loadBoardData().slides);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Slide>>({});

  const handleSave = () => {
    updateSlides(slides);
    toast.success('Duyurular kaydedildi');
  };

  const handleAdd = () => {
    const newSlide: Slide = {
      id: `s${Date.now()}`,
      type: 'announcement',
      title: 'Yeni Duyuru',
      body: '',
      animation: 'slide-left',
      duration: 10,
      priority: slides.length + 1,
    };
    setSlides([...slides, newSlide]);
    setEditingId(newSlide.id);
    setEditForm(newSlide);
  };

  const handleEdit = (slide: Slide) => {
    setEditingId(slide.id);
    setEditForm({ ...slide });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    const updated = slides.map(s => s.id === editingId ? { ...s, ...editForm } as Slide : s);
    setSlides(updated);
    setEditingId(null);
    setEditForm({});
    toast.success('Duyuru güncellendi');
  };

  const handleDelete = (id: string) => {
    setSlides(slides.filter(s => s.id !== id));
    toast.success('Duyuru silindi');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Duyuru Yönetimi</h2>
        <div className="flex gap-2">
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Duyuru
          </Button>
          <Button onClick={handleSave} variant="secondary">
            <Save className="mr-2 h-4 w-4" />
            Değişiklikleri Kaydet
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {slides.map((slide) => (
          <Card key={slide.id}>
            {editingId === slide.id ? (
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Başlık</Label>
                    <Input
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Tür</Label>
                    <Select
                      value={editForm.type}
                      onValueChange={(value: 'news' | 'announcement') => setEditForm({ ...editForm, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="news">Haber</SelectItem>
                        <SelectItem value="announcement">Duyuru</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>İçerik</Label>
                  <Textarea
                    value={editForm.body || ''}
                    onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Animasyon</Label>
                    <Select
                      value={editForm.animation}
                      onValueChange={(value: any) => setEditForm({ ...editForm, animation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slide-left">Soldan Kaydır</SelectItem>
                        <SelectItem value="slide-right">Sağdan Kaydır</SelectItem>
                        <SelectItem value="slide-up">Yukarı Kaydır</SelectItem>
                        <SelectItem value="zoom-in">Yakınlaştır</SelectItem>
                        <SelectItem value="fade">Belir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Süre (saniye)</Label>
                    <Input
                      type="number"
                      value={editForm.duration || 10}
                      onChange={(e) => setEditForm({ ...editForm, duration: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Görsel URL (opsiyonel)</Label>
                    <Input
                      value={editForm.media || ''}
                      onChange={(e) => setEditForm({ ...editForm, media: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button onClick={handleUpdate} size="sm">
                    <Save className="mr-2 h-4 w-4" />
                    Güncelle
                  </Button>
                  <Button onClick={handleCancel} size="sm" variant="outline">
                    <X className="mr-2 h-4 w-4" />
                    İptal
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{slide.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {slide.type === 'news' ? '📰 Haber' : '📢 Duyuru'} • {slide.duration}s • {slide.animation}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(slide)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(slide.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{slide.body}</p>
                  {slide.media && (
                    <img src={slide.media} alt={slide.title} className="mt-4 h-32 object-cover rounded" />
                  )}
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
