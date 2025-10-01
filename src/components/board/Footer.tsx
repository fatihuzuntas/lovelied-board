import { Globe, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  const lastUpdate = new Date().toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
  });

  return (
    <footer className="bg-muted text-muted-foreground px-4 py-2 flex items-center justify-between text-xs flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Globe className="h-3 w-3" />
          <span>www.okulismi.edu.tr</span>
        </div>
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3" />
          <span>info@okulismi.edu.tr</span>
        </div>
        <div className="flex items-center gap-1">
          <Phone className="h-3 w-3" />
          <span>0212 XXX XX XX</span>
        </div>
      </div>
      <div className="text-[10px]">
        Son güncelleme: {lastUpdate}
      </div>
    </footer>
  );
};
