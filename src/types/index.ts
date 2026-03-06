export type Category = 'Language' | 'Framework' | 'Library' | 'Tool';

export interface Topic {
  id: string;
  title: string;
  category: Category;
  dateStarted: string;
  notes: string;
  color: string;
  icon: string;
  targetHoursPerWeek: number;
}

export interface StudySession {
  id: string;
  topicId: string;
  date: string; // YYYY-MM-DD
  studied: boolean;
  durationMinutes: number;
  notes?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  condition: (sessions: StudySession[], topic: Topic) => boolean;
}

export type Theme = 'dark' | 'light';

export type ActiveTab = 'dashboard' | 'calendar' | 'topics' | 'reports';

export interface AppState {
  topics: Topic[];
  sessions: StudySession[];
  theme: Theme;
  activeTab: ActiveTab;
}
