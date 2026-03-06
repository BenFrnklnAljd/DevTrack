import { useState, useEffect, useCallback } from 'react';
import { Topic, StudySession, Theme, ActiveTab } from '../types';
import { storage } from '../services/storage';
import { INITIAL_TOPICS, INITIAL_SESSIONS } from '../utils/mockData';
import { generateId } from '../utils/helpers';
import { format } from 'date-fns';

export function useAppState() {
  const [topics, setTopics] = useState<Topic[]>(() => {
    return storage.getTopics() ?? INITIAL_TOPICS;
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    return storage.getSessions() ?? INITIAL_SESSIONS;
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return storage.getTheme() ?? 'dark';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  useEffect(() => {
    storage.saveTopics(topics);
  }, [topics]);

  useEffect(() => {
    storage.saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    storage.saveTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const addTopic = useCallback((topic: Omit<Topic, 'id'>) => {
    const newTopic: Topic = { ...topic, id: generateId() };
    setTopics((prev) => [...prev, newTopic]);
  }, []);

  const updateTopic = useCallback((id: string, updates: Partial<Topic>) => {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTopic = useCallback((id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
    setSessions((prev) => prev.filter((s) => s.topicId !== id));
  }, []);

  const toggleStudySession = useCallback((topicId: string, date: string, durationMinutes = 60) => {
    setSessions((prev) => {
      const existing = prev.find((s) => s.topicId === topicId && s.date === date);
      if (existing) {
        return prev.filter((s) => !(s.topicId === topicId && s.date === date));
      }
      return [
        ...prev,
        {
          id: generateId(),
          topicId,
          date,
          studied: true,
          durationMinutes,
        },
      ];
    });
  }, []);

  const isStudied = useCallback(
    (topicId: string, date: string): boolean => {
      return sessions.some((s) => s.topicId === topicId && s.date === date && s.studied);
    },
    [sessions]
  );

  const markTodayStudied = useCallback(
    (topicId: string) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      toggleStudySession(topicId, today);
    },
    [toggleStudySession]
  );

  return {
    topics,
    sessions,
    theme,
    activeTab,
    setActiveTab,
    toggleTheme,
    addTopic,
    updateTopic,
    deleteTopic,
    toggleStudySession,
    isStudied,
    markTodayStudied,
  };
}
