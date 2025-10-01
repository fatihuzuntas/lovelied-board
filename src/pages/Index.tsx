import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Monitor, Settings } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground">Dijital Okul Panosu</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Okulunuzun tüm duyurularını, etkinliklerini ve önemli bilgilerini 
            profesyonel ve görsel açıdan zengin bir şekilde yönetin.
          </p>
        </div>

        <div className="flex gap-4 justify-center items-center flex-wrap">
          <Link to="/board">
            <Button size="lg" className="text-lg px-8 py-6">
              <Monitor className="mr-2 h-5 w-5" />
              Pano Görünümü
            </Button>
          </Link>
          <Link to="/admin">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Settings className="mr-2 h-5 w-5" />
              Yönetim Paneli
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <div className="p-6 bg-card rounded-lg shadow-md border">
            <div className="text-3xl mb-3">📢</div>
            <h3 className="font-bold text-lg mb-2">Duyuru Yönetimi</h3>
            <p className="text-sm text-muted-foreground">
              Slayt bazlı duyuru sistemi ile görsel ve animasyonlu içerikler oluşturun.
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-md border">
            <div className="text-3xl mb-3">🎂</div>
            <h3 className="font-bold text-lg mb-2">Doğum Günleri</h3>
            <p className="text-sm text-muted-foreground">
              Öğrenci ve öğretmen doğum günlerini otomatik olarak kutlayın.
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-md border">
            <div className="text-3xl mb-3">⏱️</div>
            <h3 className="font-bold text-lg mb-2">Geri Sayımlar</h3>
            <p className="text-sm text-muted-foreground">
              Sınavlar, tatiller ve etkinlikler için geri sayım gösterin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
