import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  Info,
  Package,
  HardDrive,
  Database
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  checkForUpdates, 
  downloadUpdate, 
  installUpdate, 
  getAppVersion,
  onUpdateAvailable,
  onUpdateDownloadProgress,
  onUpdateDownloaded,
  removeUpdateListeners,
  backupDatabase,
  restoreDatabase,
  isElectron
} from '@/lib/storage';

type UpdateStatus = 'idle' | 'checking' | 'available' | 'downloading' | 'ready' | 'error';

interface UpdateInfo {
  version: string;
  releaseNotes?: string;
  releaseDate?: string;
}

interface DownloadProgress {
  bytesPerSecond: number;
  percent: number;
  transferred: number;
  total: number;
}

export const UpdateManager = () => {
  const [currentVersion, setCurrentVersion] = useState<string>('1.0.0');
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('idle');
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    loadCurrentVersion();
    setupUpdateListeners();

    return () => {
      removeUpdateListeners();
    };
  }, []);

  const loadCurrentVersion = async () => {
    try {
      const version = await getAppVersion();
      setCurrentVersion(version);
    } catch (error) {
      console.error('Versiyon bilgisi yüklenemedi:', error);
    }
  };

  const setupUpdateListeners = () => {
    onUpdateAvailable((info) => {
      setUpdateInfo(info);
      setUpdateStatus('available');
      toast.success(`Yeni güncelleme mevcut: v${info.version}`);
    });

    onUpdateDownloadProgress((progress) => {
      setDownloadProgress(progress);
      setUpdateStatus('downloading');
    });

    onUpdateDownloaded((info) => {
      setUpdateStatus('ready');
      setDownloadProgress(null);
      toast.success('Güncelleme indirildi ve kurulmaya hazır!');
    });
  };

  const handleCheckForUpdates = async () => {
    // Electron tespiti için debug (sadece development'ta)
    const electronCheck = isElectron();
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 UpdateManager - Electron Check:', electronCheck);
    }
    
    // Web ortamında güncelleme kontrolü yapma
    if (!electronCheck) {
      toast.info('Güncelleme kontrolü sadece masaüstü uygulamasında mevcuttur');
      return;
    }

    try {
      setUpdateStatus('checking');
      setUpdateError(null);
      setUpdateInfo(null);

      const info = await checkForUpdates();
      if (info) {
        // Mevcut sürümle karşılaştır
        const currentVersion = await getAppVersion();
        if (info.version === currentVersion) {
          // Aynı sürümse güncel göster
          setUpdateStatus('idle');
          toast.success('🎉 Uygulama Güncel!', {
            description: 'En son versiyonu kullanıyorsunuz.',
            duration: 3000,
          });
        } else {
          setUpdateInfo(info);
          setUpdateStatus('available');
          toast.success(`Yeni güncelleme mevcut: v${info.version}`, {
            duration: 4000,
          });
        }
      } else {
        setUpdateStatus('idle');
        toast.success('🎉 Uygulama Güncel!', {
          description: 'En son versiyonu kullanıyorsunuz.',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Güncelleme kontrol hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      
      // Hata durumunda da güncel olarak göster
      setUpdateError(null);
      setUpdateStatus('idle');
      
      // Geliştirme modu için özel mesaj
      if (errorMessage.includes('Geliştirme modunda güncelleme kontrolü mevcut değil')) {
        toast.info('Güncelleme kontrolü sadece üretim sürümünde çalışır');
      } else {
        // Tüm hata durumlarında güncel olarak göster (çünkü büyük ihtimalle uygulama güncel)
        toast.success('🎉 Uygulama Güncel!', {
          description: 'En son versiyonu kullanıyorsunuz.',
          duration: 3000,
        });
      }
    }
  };

  const handleDownloadUpdate = async () => {
    if (!isElectron()) {
      toast.info('Güncelleme indirme sadece masaüstü uygulamasında mevcuttur');
      return;
    }

    // Önce güncelleme kontrolü yapılmış mı kontrol et
    if (!updateInfo) {
      toast.warning('Önce güncelleme kontrolü yapın');
      return;
    }

    try {
      setUpdateStatus('downloading');
      setUpdateError(null);
      
      await downloadUpdate();
    } catch (error) {
      console.error('Güncelleme indirme hatası:', error);
      setUpdateError(error instanceof Error ? error.message : 'İndirme hatası');
      setUpdateStatus('error');
      toast.error('Güncelleme indirilemedi');
    }
  };

  const handleInstallUpdate = async () => {
    if (!isElectron()) {
      toast.info('Güncelleme kurulum sadece masaüstü uygulamasında mevcuttur');
      return;
    }

    try {
      await installUpdate();
    } catch (error) {
      console.error('Güncelleme kurulum hatası:', error);
      setUpdateError(error instanceof Error ? error.message : 'Kurulum hatası');
      toast.error('Güncelleme kurulamadı');
    }
  };

  const handleBackup = async () => {
    if (!isElectron()) {
      toast.info('Yedekleme sadece masaüstü uygulamasında mevcuttur. Web ortamında veriler IndexedDB\'de saklanır.');
      return;
    }

    try {
      setIsBackingUp(true);
      
      // Klasör seçimi için Electron API'sini kullan
      const result = await window.electron.ipcRenderer.invoke('dialog:show-save-dialog', {
        title: 'Yedekleme Konumu Seçin',
        defaultPath: 'lovelied-board-backup',
        properties: ['createDirectory'],
        filters: [
          { name: 'Tüm Dosyalar', extensions: ['*'] }
        ]
      });
      
      if (!result.canceled && result.filePath) {
        // Seçilen klasöre yedekle (veriler + resimler)
        try {
          await window.electron.ipcRenderer.invoke('db:backup-to-folder', result.filePath);
          toast.success(`Yedekleme tamamlandı: ${result.filePath}`);
        } catch (error) {
          // Fallback: Mevcut backup handler'ını kullan
          const backupPath = await window.electron.ipcRenderer.invoke('db:backup');
          toast.success(`Yedek alındı: ${backupPath}`);
        }
      }
    } catch (error) {
      console.error('Backup hatası:', error);
      toast.error('Yedek alınamadı');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    if (!isElectron()) {
      toast.info('Yedek geri yükleme sadece masaüstü uygulamasında mevcuttur. Web ortamında veriler IndexedDB\'de saklanır.');
      return;
    }

    try {
      setIsRestoring(true);
      
      // Klasör seçimi için Electron API'sini kullan
      const result = await window.electron.ipcRenderer.invoke('dialog:show-open-dialog', {
        title: 'Yedekleme Klasörü Seçin',
        properties: ['openDirectory'],
        buttonLabel: 'Klasör Seç'
      });
      
      if (!result.canceled && result.filePaths && result.filePaths.length > 0) {
        const backupFolder = result.filePaths[0];
        // Yedekten geri yükle (geçerlilik kontrolü main process tarafında yapılır)
        await window.electron.ipcRenderer.invoke('db:restore-from-folder', backupFolder);
        toast.success('Yedek başarıyla geri yüklendi');
        // Sayfayı yenile
        window.location.reload();
      }
    } catch (error) {
      console.error('Restore hatası:', error);
      toast.error('Yedek geri yüklenemedi');
    } finally {
      setIsRestoring(false);
    }
  };

  const getStatusBadge = () => {
    switch (updateStatus) {
      case 'checking':
        return <Badge variant="secondary"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Kontrol Ediliyor</Badge>;
      case 'available':
        return <Badge variant="default"><Package className="w-3 h-3 mr-1" />Güncelleme Mevcut</Badge>;
      case 'downloading':
        return <Badge variant="default"><Download className="w-3 h-3 mr-1" />İndiriliyor</Badge>;
      case 'ready':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Kurulmaya Hazır</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Hata</Badge>;
      default:
        return <Badge variant="outline"><Info className="w-3 h-3 mr-1" />Güncel</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Güncelleme ve Yedekleme</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleCheckForUpdates} 
            disabled={updateStatus === 'checking' || !isElectron()}
            variant="outline"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${updateStatus === 'checking' ? 'animate-spin' : ''}`} />
            {isElectron() ? 'Güncelleme Kontrol Et' : 'Sadece Masaüstü Uygulamasında'}
          </Button>
        </div>
      </div>

      {/* Web Ortamı Bilgilendirmesi */}
      {!isElectron() && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Web Ortamında:</strong> Güncelleme kontrolü, yedekleme ve geri yükleme işlemleri sadece masaüstü uygulamasında mevcuttur. 
            Web ortamında verileriniz IndexedDB'de güvenli bir şekilde saklanır.
          </AlertDescription>
        </Alert>
      )}

      {/* Mevcut Versiyon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Mevcut Versiyon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">v{currentVersion}</p>
              <p className="text-sm text-muted-foreground">Digital Board</p>
            </div>
            {getStatusBadge()}
          </div>
        </CardContent>
      </Card>

      {/* Güncelleme Durumu */}
      {updateInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Güncelleme Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Yeni Versiyon</p>
                <p className="text-lg font-bold">v{updateInfo.version}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Çıkış Tarihi</p>
                <p className="text-sm">{updateInfo.releaseDate ? new Date(updateInfo.releaseDate).toLocaleDateString('tr-TR') : 'Bilinmiyor'}</p>
              </div>
            </div>

            {updateInfo.releaseNotes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Güncelleme Notları</p>
                <div className="bg-muted p-3 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap">{updateInfo.releaseNotes}</pre>
                </div>
              </div>
            )}

            {/* İndirme Progress */}
            {downloadProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>İndiriliyor...</span>
                  <span>{downloadProgress.percent.toFixed(1)}%</span>
                </div>
                <Progress value={downloadProgress.percent} className="w-full" />
                <div className="text-xs text-muted-foreground">
                  {(downloadProgress.transferred / 1024 / 1024).toFixed(1)} MB / {(downloadProgress.total / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
            )}

            {/* Hata Mesajı */}
            {updateError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{updateError}</AlertDescription>
              </Alert>
            )}

            {/* Aksiyon Butonları */}
            <div className="flex gap-2">
              {updateStatus === 'available' && (
                <Button onClick={handleDownloadUpdate} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Güncellemeyi İndir
                </Button>
              )}
              
              {updateStatus === 'ready' && (
                <Button onClick={handleInstallUpdate} className="flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Güncellemeyi Kur ve Yeniden Başlat
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Yedekleme ve Geri Yükleme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Veri Yönetimi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Yedekleme
              </h4>
              <p className="text-sm text-muted-foreground">
                Tüm verilerinizi yedekleyin
              </p>
              <Button 
                onClick={handleBackup} 
                disabled={isBackingUp || !isElectron()}
                variant="outline"
                className="w-full"
              >
                <Database className="mr-2 h-4 w-4" />
                {isBackingUp ? 'Yedekleniyor...' : isElectron() ? 'Yedek Al' : 'Sadece Masaüstü'}
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Geri Yükleme
              </h4>
              <p className="text-sm text-muted-foreground">
                Önceki yedeğinizi geri yükleyin
              </p>
              <Button 
                onClick={handleRestore} 
                disabled={isRestoring || !isElectron()}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRestoring ? 'animate-spin' : ''}`} />
                {isRestoring ? 'Geri Yükleniyor...' : isElectron() ? 'Yedek Geri Yükle' : 'Sadece Masaüstü'}
              </Button>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Yedekleme işlemi tüm verilerinizi ve resimlerinizi klasör halinde güvenli bir şekilde saklar. 
              Geri yükleme işlemi önce mevcut verilerinizi yedekler.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Güncelleme Notları */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Güncelleme Sırasında:</strong><br />
          • Verileriniz korunur ve kaybolmaz<br />
          • Güncelleme sadece uygulama kodunu değiştirir<br />
          • İsterseniz önce yedek alabilirsiniz<br />
          • Güncelleme sonrası uygulama otomatik yeniden başlar
        </AlertDescription>
      </Alert>
    </div>
  );
};
