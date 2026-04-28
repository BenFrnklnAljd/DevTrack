import React, { useState } from 'react';
import { Topic, StudySession } from '../types';
import { TopicCard } from '../components/ui/TopicCard';
import { AddTopicModal } from '../components/ui/AddTopicModal';
import { format } from 'date-fns';
import { Plus, BookOpen } from 'lucide-react';
import { getCurrentStreak, getLongestStreak, getTotalMinutes, formatMinutes, getMonthlySessions, getWeeklySessions } from '../utils/helpers';

interface TopicsPageProps {
  topics: Topic[];
  sessions: StudySession[];
  onAdd: (topic: Omit<Topic, 'id'>) => void;
  onDelete: (id: string) => void;
  onMarkToday: (id: string) => void;
}

export const TopicsPage: React.FC<TopicsPageProps> = ({ topics, sessions, onAdd, onDelete, onMarkToday }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const today = format(new Date(), 'yyyy-MM-dd');

  const isStudiedToday = (topicId: string) =>
    sessions.some((s) => s.topicId === topicId && s.date === today && s.studied);

  if (selectedTopic) {
    const topic = topics.find((t) => t.id === selectedTopic.id);
    if (!topic) { setSelectedTopic(null); return null; }

    const streak = getCurrentStreak(sessions, topic.id);
    const longestStreak = getLongestStreak(sessions, topic.id);
    const totalMins = getTotalMinutes(sessions.filter((s) => s.topicId === topic.id));
    const weeklySessions = getWeeklySessions(sessions, topic.id);
    const monthlySessions = getMonthlySessions(sessions, topic.id);

    return (
      <div className="fade-in">
        <button
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-sm text-muted mb-4"
          style={{ background: 'transparent' }}
        >
          ← Back to Topics
        </button>

        {/* Topic header */}
        <div className="card card-glow mb-4" style={{ borderLeft: `4px solid ${topic.color}` }}>
          <div className="flex items-center gap-3 mb-3">
            <div style={{
              width: 50, height: 50, borderRadius: 12,
              background: `${topic.color}22`,
              border: `2px solid ${topic.color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16,
              color: topic.color,
            }}>{topic.icon}</div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>{topic.title}</h2>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Since {format(new Date(topic.dateStarted), 'MMMM d, yyyy')}</span>
            </div>
          </div>
          {topic.notes && <p className="text-sm text-muted">{topic.notes}</p>}
        </div>

        {/* Stats */}
        <div className="grid-2 mb-4">
          <div className="stat-card">
            <div className="stat-label">Current Streak</div>
            <div className="stat-value" style={{ color: '#F59E0B' }}> {streak}</div>
            <div className="text-xs text-muted">days</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Best Streak</div>
            <div className="stat-value" style={{ color: 'var(--accent)' }}> {longestStreak}</div>
            <div className="text-xs text-muted">days</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">This Week</div>
            <div className="stat-value">{weeklySessions.length}</div>
            <div className="text-xs text-muted">sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">This Month</div>
            <div className="stat-value">{monthlySessions.length}</div>
            <div className="text-xs text-muted">sessions</div>
          </div>
        </div>

        <div className="stat-card mb-4">
          <div className="stat-label">Total Study Time</div>
          <div className="stat-value" style={{ color: '#10B981', fontSize: 28 }}>{formatMinutes(totalMins)}</div>
        </div>

        <button
          className="btn-danger"
          onClick={() => { onDelete(topic.id); setSelectedTopic(null); }}
          style={{ width: '100%', padding: 12 }}
        >
          Remove Topic
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }}>
            My Topics
          </h2>
          <p className="text-xs text-muted">{topics.length} topics tracked</p>
        </div>
        <button className="btn-primary flex items-center gap-1" onClick={() => setShowModal(true)} style={{ padding: '8px 14px' }}>
          <Plus size={16} />
          Add
        </button>
      </div>

      {topics.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <BookOpen size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>No topics yet</h3>
          <p className="text-sm text-muted mb-4">Add your first programming language or framework to track.</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>Add Your First Topic</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              sessions={sessions}
              onStudyToday={() => onMarkToday(topic.id)}
              isStudiedToday={isStudiedToday(topic.id)}
              onDelete={() => onDelete(topic.id)}
              onClick={() => setSelectedTopic(topic)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddTopicModal onAdd={onAdd} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};
