import { Topic, StudySession } from '../types';
import { format, subDays, subMonths } from 'date-fns';

export const TOPIC_COLORS: Record<string, string> = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  React: '#61DAFB',
  Vue: '#4FC08D',
  'Node.js': '#339933',
  Python: '#3776AB',
  Rust: '#FF4500',
  Go: '#00ADD8',
  CSS: '#1572B6',
  'Next.js': '#000000',
  default: '#8B5CF6',
};

export const TOPIC_ICONS: Record<string, string> = {
  JavaScript: 'JS',
  TypeScript: 'TS',
  React: 'Re',
  Vue: 'Vu',
  'Node.js': 'No',
  Python: 'Py',
  Rust: 'Rs',
  Go: 'Go',
  CSS: 'CS',
  'Next.js': 'Nx',
  default: '📚',
};

export const INITIAL_TOPICS: Topic[] = [
  {
    id: 'topic-1',
    title: 'TypeScript',
    category: 'Language',
    dateStarted: format(subMonths(new Date(), 2), 'yyyy-MM-dd'),
    notes: 'Focus on advanced types and generics',
    color: '#3178C6',
    icon: 'TS',
    targetHoursPerWeek: 5,
  },
  {
    id: 'topic-2',
    title: 'React',
    category: 'Framework',
    dateStarted: format(subMonths(new Date(), 3), 'yyyy-MM-dd'),
    notes: 'Deep dive into hooks, context, and performance',
    color: '#61DAFB',
    icon: 'Re',
    targetHoursPerWeek: 7,
  },
  {
    id: 'topic-3',
    title: 'Node.js',
    category: 'Framework',
    dateStarted: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
    notes: 'Backend development and REST APIs',
    color: '#339933',
    icon: 'No',
    targetHoursPerWeek: 4,
  },
  {
    id: 'topic-4',
    title: 'Python',
    category: 'Language',
    dateStarted: format(subMonths(new Date(), 4), 'yyyy-MM-dd'),
    notes: 'Data science and automation scripts',
    color: '#3776AB',
    icon: 'Py',
    targetHoursPerWeek: 3,
  },
];

function generateSessions(topics: Topic[]): StudySession[] {
  const sessions: StudySession[] = [];
  const today = new Date();

  topics.forEach((topic) => {
    // Generate 60 days of history with ~70% study rate
    for (let i = 0; i < 60; i++) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      const shouldStudy = Math.random() > 0.3;
      if (shouldStudy) {
        sessions.push({
          id: `session-${topic.id}-${i}`,
          topicId: topic.id,
          date,
          studied: true,
          durationMinutes: Math.floor(Math.random() * 90) + 30,
        });
      }
    }
  });

  return sessions;
}

export const INITIAL_SESSIONS: StudySession[] = generateSessions(INITIAL_TOPICS);
