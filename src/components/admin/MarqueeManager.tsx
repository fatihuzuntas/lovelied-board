import { useState } from 'react';
import { loadBoardData, updateMarquee } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export const MarqueeManager = () => {
  const data = loadBoardData();
  const [text, setText] = useState(data.marqueeText);
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'critical'>(
    data.marqueePriority || 'normal'
  );

  const handleSave = () => {
    updateMarquee(text, priority);
    toast.success('Kayan yazı kaydedildi');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kayan Yazı Yönetimi</h2>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Kaydet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kayan Yazı İçeriği</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Öncelik Seviyesi</Label>
            <Select
              value={priority}
              onValueChange={(value: 'normal' | 'urgent' | 'critical') => setPriority(value)}
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
            <p className="text-sm text-muted-foreground mt-2">
              Öncelik seviyesi kayan yazının rengini ve görünümünü değiştirir
            </p>
          </div>

          <div>
            <Label>Yazı İçeriği</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Kayan yazıda gösterilecek metni buraya girin..."
            />
            <p className="text-sm text-muted-foreground mt-2">
              İpucu: Birden fazla duyuruyu ayırmak için • karakterini kullanabilirsiniz
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-2">Önizleme:</p>
            <div
              className={`p-3 rounded overflow-hidden ${
                priority === 'critical'
                  ? 'bg-destructive text-destructive-foreground'
                  : priority === 'urgent'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              <div className="whitespace-nowrap animate-marquee text-sm font-semibold">
                {text}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
