export interface Slide {
  id: string;
  type: 'news' | 'announcement';
  title: string;
  body: string;
  media?: string;
  animation: 'slide-left' | 'slide-right' | 'slide-up' | 'zoom-in' | 'fade';
  duration: number;
  schedule?: {
    start: string;
    end: string;
  };
  priority?: number;
  mediaOnly?: boolean;
}

export interface DutyInfo {
  date: string;
  teachers: Array<{
    name: string;
    area?: string;
    photo?: string;
  }>;
  students: Array<{
    name: string;
    area?: string;
  }>;
}

export interface Birthday {
  name: string;
  date: string;
  class: string;
  type: 'student' | 'teacher';
  photo?: string;
}

export interface Countdown {
  id: string;
  name: string;
  date: string;
  type: 'exam' | 'event' | 'holiday';
  icon?: string;
}

export interface Quote {
  id: string;
  type: 'verse' | 'hadith' | 'quote';
  text: string;
  source?: string;
}

export interface BellSchedule {
  id: string;
  type: 'lesson' | 'break';
  name: string;
  startTime: string;
  endTime: string;
  order: number;
}

export interface DaySchedule {
  id: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'all';
  schedule: BellSchedule[];
}

export interface SchoolConfig {
  schoolName: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  timezone: string;
}

export interface MarqueeItem {
  id: string;
  text: string;
  priority: 'normal' | 'urgent' | 'critical';
}

export interface BoardData {
  slides: Slide[];
  duty: DutyInfo;
  birthdays: Birthday[];
  countdowns: Countdown[];
  marqueeTexts: MarqueeItem[];
  config: SchoolConfig;
  quotes: Quote[];
  bellSchedule: BellSchedule[];
  daySchedules?: DaySchedule[];
}
