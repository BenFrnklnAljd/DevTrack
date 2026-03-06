import { format, subDays, startOfWeek, startOfMonth, eachDayOfInterval, isToday, parseISO } from 'date-fns';
import { Topic, StudySession } from '../types';

export function getTodaySessions(sessions: StudySession[], topicId?: string): StudySession[] {
  const today = format(new Date(), 'yyyy-MM-dd');
  return sessions.filter(
    (s) => s.date === today && s.studied && (!topicId || s.topicId === topicId)
  );
}

export function getWeeklySessions(sessions: StudySession[], topicId?: string): StudySession[] {
  const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
  const today = format(new Date(), 'yyyy-MM-dd');
  return sessions.filter(
    (s) => s.date >= weekStart && s.date <= today && s.studied && (!topicId || s.topicId === topicId)
  );
}

export function getMonthlySessions(sessions: StudySession[], topicId?: string): StudySession[] {
  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const today = format(new Date(), 'yyyy-MM-dd');
  return sessions.filter(
    (s) => s.date >= monthStart && s.date <= today && s.studied && (!topicId || s.topicId === topicId)
  );
}

export function getCurrentStreak(sessions: StudySession[], topicId: string): number {
  let streak = 0;
  let i = 0;
  const today = new Date();

  while (i < 365) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    const hasSession = sessions.some((s) => s.topicId === topicId && s.date === date && s.studied);
    if (hasSession) {
      streak++;
      i++;
    } else {
      break;
    }
  }
  return streak;
}

export function getLongestStreak(sessions: StudySession[], topicId: string): number {
  const topicSessions = sessions.filter((s) => s.topicId === topicId && s.studied);
  if (topicSessions.length === 0) return 0;

  const dates = [...new Set(topicSessions.map((s) => s.date))].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = parseISO(dates[i - 1]);
    const curr = parseISO(dates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

export function getCompletionPercentage(sessions: StudySession[], topic: Topic): number {
  const startDate = parseISO(topic.dateStarted);
  const today = new Date();
  const totalDays = Math.max(
    1,
    Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
  const studiedDays = new Set(
    sessions.filter((s) => s.topicId === topic.id && s.studied).map((s) => s.date)
  ).size;
  return Math.min(100, Math.round((studiedDays / totalDays) * 100));
}

export function getTotalMinutes(sessions: StudySession[], topicId?: string): number {
  return sessions
    .filter((s) => s.studied && (!topicId || s.topicId === topicId))
    .reduce((sum, s) => sum + s.durationMinutes, 0);
}

export function getCalendarData(
  sessions: StudySession[],
  topicId: string,
  month: Date
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  const start = startOfMonth(month);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const days = eachDayOfInterval({ start, end });

  days.forEach((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    result[dateStr] = sessions.some(
      (s) => s.topicId === topicId && s.date === dateStr && s.studied
    );
  });

  return result;
}

export function getWeeklyChartData(sessions: StudySession[], topics: Topic[]) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const label = format(date, 'EEE');

    const data: Record<string, string | number> = { day: label };
    topics.forEach((topic) => {
      const mins = sessions
        .filter((s) => s.topicId === topic.id && s.date === dateStr && s.studied)
        .reduce((sum, s) => sum + s.durationMinutes, 0);
      data[topic.title] = Math.round(mins / 60 * 10) / 10;
    });
    return data;
  });
  return days;
}

export function getMonthlyChartData(sessions: StudySession[], topics: Topic[]) {
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const weekEnd = subDays(new Date(), i * 7);
    const weekStart = subDays(weekEnd, 6);
    const label = `W${4 - i}`;

    const data: Record<string, string | number> = { week: label };
    topics.forEach((topic) => {
      const days = sessions.filter(
        (s) =>
          s.topicId === topic.id &&
          s.studied &&
          s.date >= format(weekStart, 'yyyy-MM-dd') &&
          s.date <= format(weekEnd, 'yyyy-MM-dd')
      ).length;
      data[topic.title] = days;
    });
    return data;
  });
  return weeks.reverse();
}

export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function generateId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
