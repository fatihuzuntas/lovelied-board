import { useState, useEffect } from 'react';
import { loadBoardData, updateMarqueeTexts } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { MarqueeItem } from '@/types/board';

export const MarqueeManager = () => {
  const data = loadBoardData();
  const [marqueeTexts, setMarqueeTexts] = useState<MarqueeItem[]>(
    data.marqueeTexts || []
  );
  const [newMarquee, setNewMarquee] = useState({ text: '', priority: 'normal' as 'normal' | 'urgent' | 'critical' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ text: '', priority: 'normal' as 'normal' | 'urgent' | 'critical' });


  // Açılışta güncel veriyi çek
  useEffect(() => {
    (async () => {
      const data = await loadBoardData();
      setMarqueeTexts(data.marqueeTexts || []);
    })();
  }, []);

  const handleAdd = async () => {
    if (!newMarquee.text.trim()) {
      toast.error('Lütfen bir metin girin');
      return;
    }
    const newItem: MarqueeItem = {
      id: `m${Date.now()}`,
      text: newMarquee.text,
      priority: newMarquee.priority,
    };
    const updated = [...marqueeTexts, newItem];
    setMarqueeTexts(updated);
    setNewMarquee({ text: '', priority: 'normal' });
    try {
      await updateMarqueeTexts(updated);
      toast.success('Kayan yazı eklendi ve kaydedildi');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      toast.error('Kayan yazı kaydedilemedi');
    }
  };

  const handleEdit = (item: MarqueeItem) => {
    setEditingId(item.id);
    setEditForm({ text: item.text, priority: item.priority });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const updated = marqueeTexts.map(m => 
      m.id === editingId ? { ...m, text: editForm.text, priority: editForm.priority } : m
    );
    setMarqueeTexts(updated);
    setEditingId(null);
    try {
      await updateMarqueeTexts(updated);
      toast.success('Kayan yazı güncellendi ve kaydedildi');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      toast.error('Kayan yazı kaydedilemedi');
    }
  };

  const handleDelete = async (id: string) => {
    const updated = marqueeTexts.filter(m => m.id !== id);
    setMarqueeTexts(updated);
    try {
      await updateMarqueeTexts(updated);
      toast.success('Kayan yazı silindi ve kaydedildi');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      toast.error('Kayan yazı kaydedilemedi');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kayan Yazı Yönetimi</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yeni Kayan Yazı Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Yazı İçeriği</Label>
              <Textarea
                value={newMarquee.text}
                onChange={(e) => setNewMarquee({ ...newMarquee, text: e.target.value })}
                rows={3}
                placeholder="Kayan yazıda gösterilecek metni buraya girin..."
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Öncelik Seviyesi</Label>
                <Select
                  value={newMarquee.priority}
                  onValueChange={(value: 'normal' | 'urgent' | 'critical') =>
                    setNewMarquee({ ...newMarquee, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">📢 Normal</SelectItem>
                    <SelectItem value="urgent">⚠️ Acil</SelectItem>
                    <SelectItem value="critical">🚨 Kritik</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ekle
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kayan Yazılar ({marqueeTexts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {marqueeTexts.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                {editingId === item.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editForm.text}
                      onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Select
                        value={editForm.priority}
                        onValueChange={(value: 'normal' | 'urgent' | 'critical') =>
                          setEditForm({ ...editForm, priority: value })
                        }
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">📢 Normal</SelectItem>
                          <SelectItem value="urgent">⚠️ Acil</SelectItem>
                          <SelectItem value="critical">🚨 Kritik</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" onClick={handleUpdate}>
                        <Check className="h-4 w-4 mr-2" />
                        Güncelle
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div
                        className={`p-3 rounded mb-2 ${
                          item.priority === 'critical'
                            ? 'bg-destructive text-destructive-foreground'
                            : item.priority === 'urgent'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        <p className="text-sm font-semibold">{item.text}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.priority === 'critical' ? '🚨 Kritik' : item.priority === 'urgent' ? '⚠️ Acil' : '📢 Normal'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {marqueeTexts.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Henüz kayan yazı eklenmemiş
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
