import React from 'react';
import { Topic, StudySession } from '../types';
import {
  getTodaySessions,
  getWeeklySessions,
  getMonthlySessions,
  getCurrentStreak,
  getTotalMinutes,
  formatMinutes,
  getCompletionPercentage,
} from '../utils/helpers';
import { format } from 'date-fns';
import { Flame, Zap, Trophy, Star } from 'lucide-react';

interface DashboardProps {
  topics: Topic[];
  sessions: StudySession[];
  onMarkToday: (topicId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ topics, sessions, onMarkToday }) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todaySessions = getTodaySessions(sessions);
  const weeklySessions = getWeeklySessions(sessions);
  const monthlySessions = getMonthlySessions(sessions);
  const totalTime = getTotalMinutes(sessions);

  const topStreak = topics.reduce((max, t) => {
    const s = getCurrentStreak(sessions, t.id);
    return s > max ? s : max;
  }, 0);

  const avgCompletion =
    topics.length > 0
      ? Math.round(topics.reduce((sum, t) => sum + getCompletionPercentage(sessions, t), 0) / topics.length)
      : 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="fade-in">
      {/* Hero greeting */}
      <div className="card card-glow mb-4" style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.1))',
        border: '1px solid rgba(139,92,246,0.2)',
      }}>
        <div className="text-sm text-muted mb-1">{format(new Date(), 'EEEE, MMMM d')}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
          {greeting()} 
        </h1>
        <p className="text-sm text-muted">
          {todaySessions.length === 0
            ? "You haven't studied anything today yet."
            : `You've studied ${todaySessions.length} topic${todaySessions.length > 1 ? 's' : ''} today. Keep it up!`}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid-2 mb-4">
        <div className="stat-card">
          <div className="flex items-center gap-1 mb-1">
            <Flame size={14} style={{ color: '#F59E0B' }} />
            <span className="stat-label">Top Streak</span>
          </div>
          <div className="stat-value" style={{ color: '#F59E0B' }}>{topStreak}</div>
          <div className="text-xs text-muted">days</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-1 mb-1">
            <Zap size={14} style={{ color: 'var(--accent)' }} />
            <span className="stat-label">This Week</span>
          </div>
          <div className="stat-value">{weeklySessions.length}</div>
          <div className="text-xs text-muted">sessions</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-1 mb-1">
            <Trophy size={14} style={{ color: '#10B981' }} />
            <span className="stat-label">Avg Progress</span>
          </div>
          <div className="stat-value" style={{ color: '#10B981' }}>{avgCompletion}%</div>
          <div className="text-xs text-muted">completion</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-1 mb-1">
            <Star size={14} style={{ color: '#06B6D4' }} />
            <span className="stat-label">Total Time</span>
          </div>
          <div className="stat-value" style={{ color: '#06B6D4', fontSize: 18 }}>{formatMinutes(totalTime)}</div>
          <div className="text-xs text-muted">all time</div>
        </div>
      </div>

      {/* Today's checklist */}
      <div className="mb-4">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
          Today's Focus
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {topics.map((topic) => {
            const studied = sessions.some((s) => s.topicId === topic.id && s.date === today && s.studied);
            const streak = getCurrentStreak(sessions, topic.id);
            return (
              <div
                key={topic.id}
                className="card"
                style={{ padding: 12, borderLeft: `3px solid ${topic.color}` }}
              >
                <div className="flex items-center gap-3">
                  <button
                    className={`checkbox-custom ${studied ? 'checked' : ''}`}
                    onClick={() => onMarkToday(topic.id)}
                    style={{ borderColor: studied ? '#10B981' : topic.color + '66' }}
                  >
                    {studied && <span style={{ fontSize: 13, color: '#fff' }}>✓</span>}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{topic.title}</div>
                    <div className="text-xs text-muted">{topic.category}</div>
                  </div>
                  {streak > 0 && (
                    <div className="streak-badge">
                      <Flame size={10} />{streak}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {topics.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: 24 }}>
              <p className="text-muted text-sm">No topics yet. Add one in the Topics tab!</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly overview bars */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
          Monthly Overview
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topics.map((topic) => {
            const monthly = getMonthlySessions(sessions, topic.id).length;
            const daysInMonth = new Date().getDate();
            const pct = Math.min(100, Math.round((monthly / daysInMonth) * 100));
            return (
              <div key={topic.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" style={{ fontWeight: 600 }}>{topic.title}</span>
                  <span className="text-xs mono" style={{ color: topic.color }}>{monthly}d / {daysInMonth}d</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${topic.color}88, ${topic.color})` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
