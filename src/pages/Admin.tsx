import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Home, Megaphone, Users, Cake, Clock, ScrollText, Quote, Bell, Settings, Download, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { loadBoardData } from '@/lib/storage';
import { SlideManager } from '@/components/admin/SlideManager';
import { DutyManager } from '@/components/admin/DutyManager';
import { BirthdayManager } from '@/components/admin/BirthdayManager';
import { CountdownManager } from '@/components/admin/CountdownManager';
import { MarqueeManager } from '@/components/admin/MarqueeManager';
import { SettingsManager } from '@/components/admin/SettingsManager';
import { QuoteManager } from '@/components/admin/QuoteManager';
import { BellScheduleManager } from '@/components/admin/BellScheduleManager';
import { UpdateManager } from '@/components/admin/UpdateManager';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('slides');
  const [schoolName, setSchoolName] = useState('Okul Adı');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadBoardData();
        setSchoolName(data.config.schoolName || 'Okul Adı');
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const menuItems = [
    { id: 'slides', label: 'Duyurular', icon: Megaphone },
    { id: 'duty', label: 'Nöbet', icon: Users },
    { id: 'birthdays', label: 'Doğum Günleri', icon: Cake },
    { id: 'countdowns', label: 'Geri Sayımlar', icon: Clock },
    { id: 'marquee', label: 'Kayan Yazı', icon: ScrollText },
    { id: 'quotes', label: 'Ayet/Söz', icon: Quote },
    { id: 'bell', label: 'Ders Saatleri', icon: Bell },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
    { id: 'updates', label: 'Güncelleme', icon: Download },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'slides':
        return <SlideManager />;
      case 'duty':
        return <DutyManager />;
      case 'birthdays':
        return <BirthdayManager />;
      case 'countdowns':
        return <CountdownManager />;
      case 'marquee':
        return <MarqueeManager />;
      case 'quotes':
        return <QuoteManager />;
      case 'bell':
        return <BellScheduleManager />;
      case 'settings':
        return <SettingsManager />;
      case 'updates':
        return <UpdateManager />;
      default:
        return <SlideManager />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yönetim paneli yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        .sidebar-no-scroll {
          scrollbar-width: none !important; /* Firefox */
          -ms-overflow-style: none !important; /* Internet Explorer 10+ */
        }
        .sidebar-no-scroll::-webkit-scrollbar {
          display: none !important; /* WebKit */
        }
      `}</style>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 border-r shadow-md flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 h-screen sidebar-no-scroll bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center shadow">
                <Home className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground truncate">{schoolName}</h1>
                <p className="text-xs text-muted-foreground">Yönetim Paneli</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-7 w-7 p-0"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Link to="/board">
            <Button variant="outline" size="sm" className="w-full text-xs h-8">
              <ArrowLeft className="mr-2 h-3 w-3" />
              Panoya Dön
            </Button>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-hidden">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-2 h-9 rounded-md text-left transition-colors ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    activeSection === item.id
                      ? 'bg-primary/90 text-primary-foreground shadow'
                      : 'text-foreground/80 hover:bg-muted/70 hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-2 border-t bg-muted/30">
          <div className="text-xs text-muted-foreground text-center space-y-0.5">
            <p className="font-semibold text-foreground/70">Digital Board</p>
            <p className="text-[10px]">v1.0.5</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-card border-b px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {menuItems.find(item => item.id === activeSection)?.label || 'Yönetim'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {schoolName} - İçerik yönetimi
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Çevrimiçi</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          <Card>
            <CardContent className="p-6">
              {renderContent()}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Admin;
