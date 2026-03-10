import React, { useState } from 'react';
import { Topic, Category } from '../../types';
import { format } from 'date-fns';
import { TOPIC_COLORS, TOPIC_ICONS } from '../../utils/mockData';
import { X } from 'lucide-react';

interface AddTopicModalProps {
  onAdd: (topic: Omit<Topic, 'id'>) => void;
  onClose: () => void;
}

const CATEGORIES: Category[] = ['Language', 'Framework', 'Library', 'Tool'];
const COLOR_PRESETS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#3178C6', '#61DAFB', '#339933', '#FF4500'];

export const AddTopicModal: React.FC<AddTopicModalProps> = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Language');
  const [dateStarted, setDateStarted] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState('#8B5CF6');
  const [targetHours, setTargetHours] = useState(5);

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!title.trim()) return;
    const icon = TOPIC_ICONS[title] ?? title.slice(0, 2).toUpperCase();
    const topicColor = TOPIC_COLORS[title] ?? color;
    onAdd({ title: title.trim(), category, dateStarted, notes, color: topicColor, icon, targetHoursPerWeek: targetHours });
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ overflowY: 'auto', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>Add New Topic</h2>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-col gap-3" style={{ display: 'flex' }}>
          <div>
            <label className="text-sm text-muted" style={{ display: 'block', marginBottom: 6 }}>Topic Name *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. React, Python, Rust..."
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm text-muted" style={{ display: 'block', marginBottom: 6 }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm text-muted" style={{ display: 'block', marginBottom: 6 }}>Date Started</label>
            <input type="date" value={dateStarted} onChange={(e) => setDateStarted(e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-muted" style={{ display: 'block', marginBottom: 6 }}>
              Target Hours / Week: <strong style={{ color: 'var(--accent)' }}>{targetHours}h</strong>
            </label>
            <input
              type="range" min={1} max={20} value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              style={{ padding: 0, cursor: 'pointer' }}
            />
          </div>

          <div>
            <label className="text-sm text-muted" style={{ display: 'block', marginBottom: 6 }}>Color</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 28, height: 28,
                    borderRadius: 8,
                    background: c,
                    border: color === c ? '2px solid white' : '2px solid transparent',
                    outline: color === c ? `2px solid ${c}` : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-muted" style={{ display: 'block', marginBottom: 6 }}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What do you want to learn?"
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!title.trim()}
              style={{ flex: 2, opacity: !title.trim() ? 0.5 : 1 }}
            >
              Add Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};