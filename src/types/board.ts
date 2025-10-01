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
}

export interface DutyInfo {
  date: string;
  teacher: string;
  students: string[];
  teacherPhoto?: string;
}

export interface Birthday {
  name: string;
  date: string;
  class: string;
  photo?: string;
}

export interface Countdown {
  id: string;
  name: string;
  date: string;
  type: 'exam' | 'event' | 'holiday';
  icon?: string;
}

export interface SchoolConfig {
  schoolName: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  timezone: string;
}

export interface BoardData {
  slides: Slide[];
  duty: DutyInfo;
  birthdays: Birthday[];
  countdowns: Countdown[];
  marqueeText: string;
  marqueePriority?: 'normal' | 'urgent' | 'critical';
  config: SchoolConfig;
}
