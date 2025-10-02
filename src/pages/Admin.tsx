import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SlideManager } from '@/components/admin/SlideManager';
import { DutyManager } from '@/components/admin/DutyManager';
import { BirthdayManager } from '@/components/admin/BirthdayManager';
import { CountdownManager } from '@/components/admin/CountdownManager';
import { MarqueeManager } from '@/components/admin/MarqueeManager';
import { SettingsManager } from '@/components/admin/SettingsManager';
import { QuoteManager } from '@/components/admin/QuoteManager';
import { BellScheduleManager } from '@/components/admin/BellScheduleManager';

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Yönetim Paneli</h1>
              <p className="text-sm text-muted-foreground mt-1">Dijital okul panosu içerik yönetimi</p>
            </div>
            <Link to="/board">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Panoya Dön
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="slides" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-2">
            <TabsTrigger value="slides">Duyurular</TabsTrigger>
            <TabsTrigger value="duty">Nöbet</TabsTrigger>
            <TabsTrigger value="birthdays">Doğum Günleri</TabsTrigger>
            <TabsTrigger value="countdowns">Geri Sayımlar</TabsTrigger>
            <TabsTrigger value="marquee">Kayan Yazı</TabsTrigger>
            <TabsTrigger value="quotes">Ayet/Söz</TabsTrigger>
            <TabsTrigger value="bell">Ders Saatleri</TabsTrigger>
            <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          </TabsList>

          <TabsContent value="slides">
            <SlideManager />
          </TabsContent>

          <TabsContent value="duty">
            <DutyManager />
          </TabsContent>

          <TabsContent value="birthdays">
            <BirthdayManager />
          </TabsContent>

          <TabsContent value="countdowns">
            <CountdownManager />
          </TabsContent>

          <TabsContent value="marquee">
            <MarqueeManager />
          </TabsContent>

          <TabsContent value="quotes">
            <QuoteManager />
          </TabsContent>

          <TabsContent value="bell">
            <BellScheduleManager />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
