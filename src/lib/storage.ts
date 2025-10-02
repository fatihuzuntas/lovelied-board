import { BoardData, Slide, DutyInfo, Birthday, Countdown, Quote, BellSchedule, SchoolConfig, DaySchedule } from '@/types/board';

const STORAGE_KEY = 'school-board-data';

const defaultData: BoardData = {
  slides: [
    {
      id: 's1',
      type: 'announcement',
      title: 'Hoş Geldiniz! 🎉',
      body: 'Dijital okul panosuna hoş geldiniz. Bu sistemle tüm duyurular, etkinlikler ve önemli bilgiler burada paylaşılacak.',
      media: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
      animation: 'slide-left',
      duration: 10,
      priority: 1,
    },
    {
      id: 's2',
      type: 'news',
      title: 'Kütüphane Açılış Saatleri',
      body: 'Okul kütüphanemiz hafta içi 08:00-17:00 saatleri arasında öğrencilerimize hizmet vermektedir.',
      media: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
      animation: 'slide-right',
      duration: 8,
      priority: 2,
    },
    {
      id: 's3',
      type: 'announcement',
      title: 'Spor Kulübü Kayıtları',
      body: 'Basketbol, voleybol ve futbol kulüplerimize kayıtlar başlamıştır. Müdür yardımcılığına başvurabilirsiniz.',
      media: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
      animation: 'zoom-in',
      duration: 10,
      priority: 3,
    },
  ],
  duty: {
    date: new Date().toISOString().split('T')[0],
    teachers: [
      { name: 'Ahmet Yılmaz', area: 'Kat 1' },
      { name: 'Fatma Demir', area: 'Kat 2' },
      { name: 'Mehmet Kaya', area: 'Bahçe' },
    ],
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
  quotes: [
    {
      id: 'q1',
      type: 'verse',
      text: 'Okuyan insanlar, düşünen insanlardır.',
      source: 'Bakara Suresi 2:44',
    },
    {
      id: 'q2',
      type: 'hadith',
      text: 'İlim Çin\'de de olsa gidiniz.',
      source: 'Hz. Muhammed (S.A.V)',
    },
    {
      id: 'q3',
      type: 'quote',
      text: 'Hayatta en hakiki mürşit ilimdir.',
      source: 'Mustafa Kemal Atatürk',
    },
  ],
  bellSchedule: [
    { id: 'b1', type: 'lesson', name: '1. Ders', startTime: '08:30', endTime: '09:15', order: 1 },
    { id: 'b2', type: 'break', name: '1. Teneffüs', startTime: '09:15', endTime: '09:25', order: 2 },
    { id: 'b3', type: 'lesson', name: '2. Ders', startTime: '09:25', endTime: '10:10', order: 3 },
    { id: 'b4', type: 'break', name: '2. Teneffüs', startTime: '10:10', endTime: '10:20', order: 4 },
    { id: 'b5', type: 'lesson', name: '3. Ders', startTime: '10:20', endTime: '11:05', order: 5 },
    { id: 'b6', type: 'break', name: '3. Teneffüs', startTime: '11:05', endTime: '11:15', order: 6 },
    { id: 'b7', type: 'lesson', name: '4. Ders', startTime: '11:15', endTime: '12:00', order: 7 },
    { id: 'b8', type: 'break', name: 'Öğle Arası', startTime: '12:00', endTime: '13:00', order: 8 },
    { id: 'b9', type: 'lesson', name: '5. Ders', startTime: '13:00', endTime: '13:45', order: 9 },
    { id: 'b10', type: 'break', name: '4. Teneffüs', startTime: '13:45', endTime: '13:55', order: 10 },
    { id: 'b11', type: 'lesson', name: '6. Ders', startTime: '13:55', endTime: '14:40', order: 11 },
    { id: 'b12', type: 'break', name: '5. Teneffüs', startTime: '14:40', endTime: '14:50', order: 12 },
    { id: 'b13', type: 'lesson', name: '7. Ders', startTime: '14:50', endTime: '15:35', order: 13 },
    { id: 'b14', type: 'break', name: '6. Teneffüs', startTime: '15:35', endTime: '15:45', order: 14 },
    { id: 'b15', type: 'lesson', name: '8. Ders', startTime: '15:45', endTime: '16:30', order: 15 },
  ],
  daySchedules: [
    {
      id: 'ds1',
      day: 'all',
      schedule: [
        { id: 'b1', type: 'lesson', name: '1. Ders', startTime: '08:30', endTime: '09:15', order: 1 },
        { id: 'b2', type: 'break', name: '1. Teneffüs', startTime: '09:15', endTime: '09:25', order: 2 },
        { id: 'b3', type: 'lesson', name: '2. Ders', startTime: '09:25', endTime: '10:10', order: 3 },
        { id: 'b4', type: 'break', name: '2. Teneffüs', startTime: '10:10', endTime: '10:20', order: 4 },
        { id: 'b5', type: 'lesson', name: '3. Ders', startTime: '10:20', endTime: '11:05', order: 5 },
        { id: 'b6', type: 'break', name: '3. Teneffüs', startTime: '11:05', endTime: '11:15', order: 6 },
        { id: 'b7', type: 'lesson', name: '4. Ders', startTime: '11:15', endTime: '12:00', order: 7 },
        { id: 'b8', type: 'break', name: 'Öğle Arası', startTime: '12:00', endTime: '13:00', order: 8 },
        { id: 'b9', type: 'lesson', name: '5. Ders', startTime: '13:00', endTime: '13:45', order: 9 },
        { id: 'b10', type: 'break', name: '4. Teneffüs', startTime: '13:45', endTime: '13:55', order: 10 },
        { id: 'b11', type: 'lesson', name: '6. Ders', startTime: '13:55', endTime: '14:40', order: 11 },
        { id: 'b12', type: 'break', name: '5. Teneffüs', startTime: '14:40', endTime: '14:50', order: 12 },
        { id: 'b13', type: 'lesson', name: '7. Ders', startTime: '14:50', endTime: '15:35', order: 13 },
        { id: 'b14', type: 'break', name: '6. Teneffüs', startTime: '15:35', endTime: '15:45', order: 14 },
        { id: 'b15', type: 'lesson', name: '8. Ders', startTime: '15:45', endTime: '16:30', order: 15 },
      ],
    },
  ],
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

export const updateQuotes = (quotes: Quote[]): void => {
  const data = loadBoardData();
  data.quotes = quotes;
  saveBoardData(data);
};

export const updateBellSchedule = (bellSchedule: BellSchedule[]): void => {
  const data = loadBoardData();
  data.bellSchedule = bellSchedule;
  saveBoardData(data);
};

export const updateConfig = (config: SchoolConfig): void => {
  const data = loadBoardData();
  data.config = config;
  saveBoardData(data);
};

export const updateDaySchedules = (daySchedules: DaySchedule[]): void => {
  const data = loadBoardData();
  data.daySchedules = daySchedules;
  saveBoardData(data);
};
