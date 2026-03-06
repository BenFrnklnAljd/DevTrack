import React from 'react';
import { Topic, StudySession } from '../../types';
import { getCurrentStreak, getCompletionPercentage, getTotalMinutes, formatMinutes } from '../../utils/helpers';
import { format } from 'date-fns';
import { Flame, Clock, Zap } from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  sessions: StudySession[];
  onStudyToday: () => void;
  isStudiedToday: boolean;
  onDelete: () => void;
  onClick?: () => void;
}

const CATEGORY_BADGE: Record<string, { class: string; label: string }> = {
  Language: { class: 'badge-lang', label: 'Language' },
  Framework: { class: 'badge-fw', label: 'Framework' },
  Library: { class: 'badge-lib', label: 'Library' },
  Tool: { class: 'badge-tool', label: 'Tool' },
};

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  sessions,
  onStudyToday,
  isStudiedToday,
  onDelete,
  onClick,
}) => {
  const streak = getCurrentStreak(sessions, topic.id);
  const completion = getCompletionPercentage(sessions, topic);
  const totalMins = getTotalMinutes(sessions.filter((s) => s.topicId === topic.id));
  const catBadge = CATEGORY_BADGE[topic.category];

  return (
    <div
      className="card fade-in"
      style={{
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: `3px solid ${topic.color}`,
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      {/* Glow bg */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 120, height: 120,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${topic.color}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: `${topic.color}22`,
            border: `1.5px solid ${topic.color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
            color: topic.color,
            flexShrink: 0,
          }}>
            {topic.icon}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
              {topic.title}
            </div>
            <span className={`badge ${catBadge.class}`}>{catBadge.label}</span>
          </div>
        </div>

        {streak > 0 && (
          <div className="streak-badge">
            <Flame size={11} />
            {streak}
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted">Progress</span>
          <span className="mono text-sm font-bold" style={{ color: topic.color }}>{completion}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${completion}%`, background: `linear-gradient(90deg, ${topic.color}88, ${topic.color})` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 mb-3">
        <div className="flex items-center gap-1 text-xs text-muted">
          <Clock size={11} />
          <span>{formatMinutes(totalMins)}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted">
          <Zap size={11} />
          <span>Since {format(new Date(topic.dateStarted), 'MMM d')}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onStudyToday}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            background: isStudiedToday
              ? 'rgba(16,185,129,0.15)'
              : `linear-gradient(135deg, ${topic.color}33, ${topic.color}22)`,
            border: `1px solid ${isStudiedToday ? 'rgba(16,185,129,0.4)' : topic.color + '44'}`,
            color: isStudiedToday ? '#10B981' : topic.color,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {isStudiedToday ? '✓ Studied Today' : '+ Mark Today'}
        </button>
        <button
          onClick={onDelete}
          className="btn-danger"
          style={{ padding: '8px 10px', fontSize: 12 }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
