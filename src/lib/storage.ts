import { BoardData, Slide, DutyInfo, Birthday, Countdown } from '@/types/board';

const STORAGE_KEY = 'school-board-data';

const defaultData: BoardData = {
  slides: [
    {
      id: 's1',
      type: 'announcement',
      title: 'Hoş Geldiniz! 🎉',
      body: 'Dijital okul panosuna hoş geldiniz. Bu sistemle tüm duyurular, etkinlikler ve önemli bilgiler burada paylaşılacak.',
      animation: 'slide-left',
      duration: 10,
      priority: 1,
    },
    {
      id: 's2',
      type: 'news',
      title: 'Kütüphane Açılış Saatleri',
      body: 'Okul kütüphanemiz hafta içi 08:00-17:00 saatleri arasında öğrencilerimize hizmet vermektedir.',
      animation: 'slide-right',
      duration: 8,
      priority: 2,
    },
    {
      id: 's3',
      type: 'announcement',
      title: 'Spor Kulübü Kayıtları',
      body: 'Basketbol, voleybol ve futbol kulüplerimize kayıtlar başlamıştır. Müdür yardımcılığına başvurabilirsiniz.',
      animation: 'zoom-in',
      duration: 10,
      priority: 3,
    },
  ],
  duty: {
    date: new Date().toISOString().split('T')[0],
    teacher: 'Ahmet Yılmaz',
    students: ['Ali Demir - 10A', 'Ayşe Kaya - 10B', 'Mehmet Şahin - 10C'],
  },
  birthdays: [
    {
      name: 'Zeynep Arslan',
      date: '2008-10-15',
      class: '9A',
    },
    {
      name: 'Burak Yıldız',
      date: '2007-10-15',
      class: '10B',
    },
  ],
  countdowns: [
    {
      id: 'c1',
      name: 'Ara Tatil',
      date: '2025-11-15',
      type: 'holiday',
      icon: '🏖️',
    },
    {
      id: 'c2',
      name: 'Final Sınavları',
      date: '2025-12-20',
      type: 'exam',
      icon: '📚',
    },
  ],
  marqueeText: 'Lütfen koridorlarda sessiz olalım. Temizlik kurallarına uyalım. Öğle yemeği 12:00-13:00 saatleri arasındadır.',
  marqueePriority: 'normal',
  config: {
    schoolName: 'Atatürk Anadolu Lisesi',
    timezone: 'Europe/Istanbul',
    primaryColor: 'hsl(214, 88%, 48%)',
    secondaryColor: 'hsl(24, 95%, 53%)',
  },
};

export const loadBoardData = (): BoardData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading board data:', error);
  }
  return defaultData;
};

export const saveBoardData = (data: BoardData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving board data:', error);
  }
};

export const updateSlides = (slides: Slide[]): void => {
  const data = loadBoardData();
  data.slides = slides;
  saveBoardData(data);
};

export const updateDuty = (duty: DutyInfo): void => {
  const data = loadBoardData();
  data.duty = duty;
  saveBoardData(data);
};

export const updateBirthdays = (birthdays: Birthday[]): void => {
  const data = loadBoardData();
  data.birthdays = birthdays;
  saveBoardData(data);
};

export const updateCountdowns = (countdowns: Countdown[]): void => {
  const data = loadBoardData();
  data.countdowns = countdowns;
  saveBoardData(data);
};

export const updateMarquee = (text: string, priority?: 'normal' | 'urgent' | 'critical'): void => {
  const data = loadBoardData();
  data.marqueeText = text;
  if (priority) {
    data.marqueePriority = priority;
  }
  saveBoardData(data);
};
