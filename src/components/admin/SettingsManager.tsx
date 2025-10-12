import { useState, useEffect } from 'react';
import { loadBoardData, saveBoardData } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export const SettingsManager = () => {
  const [schoolName, setSchoolName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // Açılışta güncel veriyi çek
  useEffect(() => {
    (async () => {
      const data = await loadBoardData();
      setSchoolName(data.config.schoolName || '');
      setLogoUrl(data.config.logoUrl || '');
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    const data = await loadBoardData();
    const updatedData = {
      ...data,
      config: {
        ...data.config,
        schoolName,
        logoUrl: logoUrl || undefined,
      },
    };
    await saveBoardData(updatedData);
    toast.success('Ayarlar kaydedildi');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
        toast.success('Logo yüklendi');
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Ayarlar yükleniyor...</p>
        </div>
      </div>
    );
  }

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
            <Label>Okul Logosu</Label>
            <div className="space-y-3 mt-2">
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG veya SVG formatında logo yükleyin
                </p>
              </div>
              <div>
                <Label className="text-xs">veya Logo URL</Label>
                <Input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              {logoUrl && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Logo önizleme:</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="h-20 w-20 object-contain border rounded p-2 bg-white"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLogoUrl('')}
                    >
                      Logoyu Kaldır
                    </Button>
                  </div>
                </div>
              )}
            </div>
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
