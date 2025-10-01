import { Globe, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  const lastUpdate = new Date().toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
  });

  return (
    <footer className="bg-muted text-muted-foreground px-8 py-4 flex items-center justify-between text-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>www.okulismi.edu.tr</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>info@okulismi.edu.tr</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span>0212 XXX XX XX</span>
        </div>
      </div>
      <div className="text-xs">
        Son güncelleme: {lastUpdate}
      </div>
    </footer>
  );
};
