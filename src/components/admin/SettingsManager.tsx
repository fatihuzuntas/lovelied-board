import { useState } from 'react';
import { loadBoardData, saveBoardData } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export const SettingsManager = () => {
  const data = loadBoardData();
  const [schoolName, setSchoolName] = useState(data.config.schoolName);
  const [logoUrl, setLogoUrl] = useState(data.config.logoUrl || '');

  const handleSave = () => {
    const updatedData = {
      ...data,
      config: {
        ...data.config,
        schoolName,
        logoUrl,
      },
    };
    saveBoardData(updatedData);
    toast.success('Ayarlar kaydedildi');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Genel Ayarlar</h2>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Kaydet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Okul Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Okul Adı</Label>
            <Input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Örn: Atatürk Anadolu Lisesi"
            />
          </div>

          <div>
            <Label>Logo URL (opsiyonel)</Label>
            <Input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
            />
            {logoUrl && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Logo önizleme:</p>
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-20 w-20 object-contain border rounded p-2"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sistem Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Saat Dilimi:</span>
              <span className="font-medium">Europe/Istanbul</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Veri Depolama:</span>
              <span className="font-medium">LocalStorage</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Versiyon:</span>
              <span className="font-medium">1.0.0</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
