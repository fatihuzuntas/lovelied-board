import { useState, useRef, useEffect } from 'react';
import { Slide } from '@/types/board';
import { loadBoardData, updateSlides, uploadMedia, resolveMediaUrl } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit, Save, X, Upload } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

// Yardımcı bileşenler: Electron'da /user-data/media/... için data URL'e çevirir
const MediaPreview = ({ url, title, onClear }: { url: string; title: string; onClear: () => void }) => {
  const [resolved, setResolved] = useState<string>('');
  useEffect(() => {
    (async () => {
      const r = await resolveMediaUrl(url);
      if (r) setResolved(r);
    })();
  }, [url]);

  const isVideo = resolved && (resolved.startsWith('data:video') || resolved.endsWith('.mp4') || resolved.endsWith('.webm'));
  return (
    <div className="relative">
      {resolved ? (
        isVideo ? (
          <video src={resolved} className="w-full h-32 object-cover rounded" controls />
        ) : (
          <img src={resolved} alt={title} className="w-full h-32 object-cover rounded" />
        )
      ) : (
        <div className="w-full h-32 bg-muted rounded animate-pulse" />
      )}
      <Button
        size="sm"
        variant="destructive"
        className="absolute top-2 right-2"
        onClick={onClear}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

const MediaInline = ({ url, alt }: { url: string; alt: string }) => {
  const [resolved, setResolved] = useState<string>('');
  useEffect(() => {
    (async () => {
      const r = await resolveMediaUrl(url);
      if (r) setResolved(r);
    })();
  }, [url]);
  const isVideo = resolved && (resolved.startsWith('data:video') || resolved.endsWith('.mp4') || resolved.endsWith('.webm'));
  if (!resolved) return <div className="mt-4 h-32 bg-muted rounded animate-pulse" />;
  return isVideo ? (
    <video src={resolved} className="mt-4 h-32 object-cover rounded" controls />
  ) : (
    <img src={resolved} alt={alt} className="mt-4 h-32 object-cover rounded" />
  );
};

export const SlideManager = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Slide>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newForm, setNewForm] = useState<Slide>({
    id: '',
    type: 'announcement',
    title: '',
    body: '',
    animation: 'slide-left',
    duration: 10,
    priority: 1,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadBoardData();
        setSlides(data.slides);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
        toast.error('Veriler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Global kaydet butonu kaldırıldığı için burada genel kaydet akışı kullanılmıyor

  const handleAdd = () => {
    setNewForm({
      id: `s${Date.now()}`,
      type: 'announcement',
      title: '',
      body: '',
      animation: 'slide-left',
      duration: 10,
      priority: slides.length + 1,
    });
    setAddOpen(true);
  };

  const handleCreate = async () => {
    const toAdd: Slide = { ...newForm };
    // Eğer sadece medya göster seçiliyse başlık ve içeriği temizle
    if (toAdd.mediaOnly) {
      toAdd.title = '';
      toAdd.body = '';
    }
    const next = [...slides, toAdd];
    setSlides(next);
    try {
      await updateSlides(next);
      toast.success('Duyuru eklendi ve kaydedildi');
      setAddOpen(false);
      setNewForm({ ...newForm, title: '', body: '', media: undefined, mediaOnly: false });
    } catch (error) {
      console.error('Ekleme hatası:', error);
      toast.error('Duyuru kaydedilemedi');
    }
  };

  const handleEdit = (slide: Slide) => {
    setEditingId(slide.id);
    setEditForm({ ...slide });
    setAddOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const updatedForm = { ...editForm };
    // Eğer sadece medya göster seçiliyse başlık ve içeriği temizle
    if (updatedForm.mediaOnly) {
      updatedForm.title = '';
      updatedForm.body = '';
    }
    const updated = slides.map(s => s.id === editingId ? { ...s, ...updatedForm } as Slide : s);
    setSlides(updated);
    try {
      await updateSlides(updated);
      toast.success('Duyuru güncellendi ve kaydedildi');
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      toast.error('Duyuru kaydedilemedi');
    } finally {
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleDelete = async (id: string) => {
    const next = slides.filter(s => s.id !== id);
    setSlides(next);
    if (editingId === id) {
      setEditingId(null);
      setEditForm({});
    }
    try {
      await updateSlides(next);
      toast.success('Duyuru silindi');
    } catch (error) {
      console.error('Silme hatası:', error);
      toast.error('Duyuru silinemedi');
    }
  };

  const handleCancel = () => {
    // If it's a new slide that was never saved, remove it
    if (editingId && slides.find(s => s.id === editingId && !s.body)) {
      setSlides(slides.filter(s => s.id !== editingId));
    }
    setEditingId(null);
    setEditForm({});
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const url = await uploadMedia(base64String, file.name.replace(/\.[^.]+$/, ''));
      setEditForm({ ...editForm, media: url });
      toast.success('Medya yüklendi');
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Veriler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Duyuru Yönetimi</h2>
        <div className="flex gap-2">
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Duyuru
          </Button>
        </div>
      </div>

      {/* Ekle/Düzenle Modal */}
      <Dialog open={addOpen} onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditingId(null); setEditForm({}); } else { setAddOpen(true);} }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Duyuruyu Düzenle' : 'Yeni Duyuru Ekle'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Sadece medya seçeneği */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mediaOnly"
                checked={Boolean(editingId ? editForm.mediaOnly : newForm.mediaOnly)}
                onCheckedChange={(checked) => {
                  const v = Boolean(checked);
                  if (editingId) setEditForm({ ...editForm, mediaOnly: v });
                  else setNewForm({ ...newForm, mediaOnly: v });
                }}
              />
              <Label htmlFor="mediaOnly">Sadece medya göster</Label>
            </div>

            {/* Başlık ve Tür - mediaOnly kapalıyken */}
            {!(editingId ? editForm.mediaOnly : newForm.mediaOnly) && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Başlık</Label>
                  {editingId ? (
                    <Input
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Duyuru başlığı"
                    />
                  ) : (
                    <Input
                      value={newForm.title}
                      onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                      placeholder="Duyuru başlığı"
                    />
                  )}
                </div>
                <div>
                  <Label>Tür</Label>
                  {editingId ? (
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
                  ) : (
                    <Select
                      value={newForm.type}
                      onValueChange={(value: 'news' | 'announcement') => setNewForm({ ...newForm, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="news">Haber</SelectItem>
                        <SelectItem value="announcement">Duyuru</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            )}

            {!(editingId ? editForm.mediaOnly : newForm.mediaOnly) && (
              <div>
                <Label>İçerik</Label>
                {editingId ? (
                  <Textarea
                    value={editForm.body || ''}
                    onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                    rows={4}
                    placeholder="Duyuru içeriği"
                  />
                ) : (
                  <Textarea
                    value={newForm.body}
                    onChange={(e) => setNewForm({ ...newForm, body: e.target.value })}
                    rows={4}
                    placeholder="Duyuru içeriği"
                  />
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Medya</Label>
                <div className="flex gap-2">
                  <Input
                    ref={modalFileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = async () => {
                        const base64String = reader.result as string;
                        const url = await uploadMedia(base64String, file.name.replace(/\.[^.]+$/, ''));
                        if (editingId) {
                          setEditForm({ ...editForm, media: url });
                        } else {
                          setNewForm({ ...newForm, media: url });
                        }
                        toast.success('Medya yüklendi');
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => modalFileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Dosya Seç
                  </Button>
                </div>
              </div>
              <div className="flex items-end">
                <div className="text-sm text-muted-foreground">Medya yüklerseniz pano arka planı olarak kullanılır.</div>
              </div>
            </div>
            {newForm.media && !editingId && (
              <MediaPreview
                url={newForm.media}
                title="Önizleme"
                onClear={() => setNewForm({ ...newForm, media: undefined })}
              />
            )}
            {editForm.media && editingId && (
              <MediaPreview
                url={editForm.media}
                title="Önizleme"
                onClear={() => setEditForm({ ...editForm, media: undefined })}
              />
            )}
          </div>
          <DialogFooter>
            {editingId ? (
              <Button onClick={handleUpdate}>
                <Save className="mr-2 h-4 w-4" />
                Güncelle
              </Button>
            ) : (
              <Button onClick={handleCreate}>
                <Save className="mr-2 h-4 w-4" />
                Ekle
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {slides.map((slide) => (
          <Card key={slide.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{slide.mediaOnly ? '🖼️ Sadece Medya' : slide.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {slide.mediaOnly ? 'Sadece medya gösterilecek' : (slide.type === 'news' ? '📰 Haber' : '📢 Duyuru')}
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
              {!slide.mediaOnly && <p className="text-sm">{slide.body}</p>}
              {slide.media && (
                <MediaInline url={slide.media} alt={slide.title || 'Medya'} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
