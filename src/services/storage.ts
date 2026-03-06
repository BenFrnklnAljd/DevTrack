import { Topic, StudySession, Theme } from '../types';

const KEYS = {
  TOPICS: 'devtrack_topics',
  SESSIONS: 'devtrack_sessions',
  THEME: 'devtrack_theme',
};

export const storage = {
  getTopics(): Topic[] | null {
    try {
      const data = localStorage.getItem(KEYS.TOPICS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveTopics(topics: Topic[]): void {
    localStorage.setItem(KEYS.TOPICS, JSON.stringify(topics));
  },
  getSessions(): StudySession[] | null {
    try {
      const data = localStorage.getItem(KEYS.SESSIONS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveSessions(sessions: StudySession[]): void {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  },
  getTheme(): Theme | null {
    return (localStorage.getItem(KEYS.THEME) as Theme) || null;
  },
  saveTheme(theme: Theme): void {
    localStorage.setItem(KEYS.THEME, theme);
  },
};
