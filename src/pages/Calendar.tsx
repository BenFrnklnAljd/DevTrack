import React, { useState } from 'react';
import { Topic, StudySession } from '../types';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, subMonths, addMonths, isToday, isFuture, parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  topics: Topic[];
  sessions: StudySession[];
  onToggleSession: (topicId: string, date: string) => void;
}

export const CalendarPage: React.FC<CalendarProps> = ({ topics, sessions, onToggleSession }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(topics[0] ?? null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);

  const isStudied = (date: Date) => {
    if (!selectedTopic) return false;
    const dateStr = format(date, 'yyyy-MM-dd');
    return sessions.some((s) => s.topicId === selectedTopic.id && s.date === dateStr && s.studied);
  };

  const handleDayClick = (date: Date) => {
    if (!selectedTopic || isFuture(date)) return;
    onToggleSession(selectedTopic.id, format(date, 'yyyy-MM-dd'));
  };

  const studiedDaysCount = days.filter(isStudied).length;
  const completionPct = Math.round((studiedDaysCount / days.length) * 100);

  // Compute streaks for current month display
  const getStreakInfo = (date: Date): 'start' | 'mid' | 'end' | 'solo' | null => {
    if (!isStudied(date)) return null;
    const prevStudied = isStudied(new Date(date.getTime() - 86400000));
    const nextStudied = !isFuture(new Date(date.getTime() + 86400000)) && isStudied(new Date(date.getTime() + 86400000));
    if (prevStudied && nextStudied) return 'mid';
    if (!prevStudied && nextStudied) return 'start';
    if (prevStudied && !nextStudied) return 'end';
    return 'solo';
  };

  return (
    <div className="fade-in">
      {/* Topic selector */}
      <div className="mb-4">
        <div className="text-sm text-muted mb-2">Select Topic</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              style={{
                padding: '6px 14px',
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                whiteSpace: 'nowrap',
                background: selectedTopic?.id === topic.id ? topic.color : 'var(--bg-card)',
                color: selectedTopic?.id === topic.id ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${selectedTopic?.id === topic.id ? topic.color : 'var(--border)'}`,
                transition: 'all 0.2s ease',
              }}
            >
              {topic.title}
            </button>
          ))}
        </div>
      </div>

      {/* Month nav */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            style={{ background: 'transparent', color: 'var(--text-secondary)', padding: 4 }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, textAlign: 'center' }}>
              {format(currentMonth, 'MMMM yyyy')}
            </div>
            {selectedTopic && (
              <div className="text-xs text-muted" style={{ textAlign: 'center', marginTop: 2 }}>
                {studiedDaysCount}/{days.length} days · {completionPct}%
              </div>
            )}
          </div>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            style={{ background: 'transparent', color: 'var(--text-secondary)', padding: 4 }}
            disabled={addMonths(currentMonth, 1) > new Date()}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Progress bar for month */}
        {selectedTopic && (
          <div className="progress-track mb-4">
            <div
              className="progress-fill"
              style={{
                width: `${completionPct}%`,
                background: `linear-gradient(90deg, ${selectedTopic.color}88, ${selectedTopic.color})`,
              }}
            />
          </div>
        )}

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-xs text-muted" style={{ textAlign: 'center', padding: '4px 0', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
          {/* Padding cells */}
          {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}

          {days.map((day) => {
            const studied = isStudied(day);
            const future = isFuture(day);
            const todayDay = isToday(day);
            const topicColor = selectedTopic?.color ?? 'var(--accent)';

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                disabled={future || !selectedTopic}
                style={{
                  aspectRatio: '1',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: todayDay ? 800 : 500,
                  fontFamily: 'var(--font-mono)',
                  background: studied
                    ? topicColor
                    : todayDay
                    ? 'rgba(139,92,246,0.15)'
                    : 'var(--bg-input)',
                  color: studied ? '#fff' : todayDay ? 'var(--accent)' : future ? 'var(--text-muted)' : 'var(--text-primary)',
                  border: todayDay ? '2px solid var(--accent)' : '1px solid transparent',
                  cursor: future || !selectedTopic ? 'default' : 'pointer',
                  opacity: future ? 0.35 : 1,
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4" style={{ justifyContent: 'center', marginBottom: 16 }}>
        <div className="flex items-center gap-1 text-xs text-muted">
          <div style={{ width: 12, height: 12, borderRadius: 3, background: selectedTopic?.color ?? 'var(--accent)' }} />
          Studied
        </div>
        <div className="flex items-center gap-1 text-xs text-muted">
          <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--bg-input)', border: '1px solid var(--border)' }} />
          Not studied
        </div>
        <div className="flex items-center gap-1 text-xs text-muted">
          <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(139,92,246,0.15)', border: '2px solid var(--accent)' }} />
          Today
        </div>
      </div>

      {/* Activity heatmap - last 4 weeks */}
      {selectedTopic && (
        <div className="card">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
            Past Weeks Activity
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: 28 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (27 - i));
              const dateStr = format(date, 'yyyy-MM-dd');
              const studied = sessions.some((s) => s.topicId === selectedTopic.id && s.date === dateStr && s.studied);
              return (
                <div
                  key={i}
                  title={format(date, 'MMM d')}
                  style={{
                    flex: 1,
                    height: 20,
                    borderRadius: 3,
                    background: studied ? selectedTopic.color : 'var(--bg-input)',
                    opacity: studied ? 0.8 + (0.2 * (i / 27)) : 1,
                  }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted">4 weeks ago</span>
            
          </div>
        </div>
      )}
    </div>
  );
};
