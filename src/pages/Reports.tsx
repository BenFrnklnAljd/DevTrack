import React, { useState } from 'react';
import { Topic, StudySession } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import {
  getWeeklyChartData, getMonthlyChartData,
  getCurrentStreak, getLongestStreak,
  getTotalMinutes, formatMinutes,
  getWeeklySessions, getMonthlySessions,
  getCompletionPercentage,
} from '../utils/helpers';

interface ReportsProps {
  topics: Topic[];
  sessions: StudySession[];
}

type ChartView = 'weekly' | 'monthly';

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

export const ReportsPage: React.FC<ReportsProps> = ({ topics, sessions }) => {
  const [chartView, setChartView] = useState<ChartView>('weekly');

  const weeklyData = getWeeklyChartData(sessions, topics);
  const monthlyData = getMonthlyChartData(sessions, topics);
  const chartData = chartView === 'weekly' ? weeklyData : monthlyData;
  const xKey = chartView === 'weekly' ? 'day' : 'week';

  const radarData = topics.map((topic) => ({
    subject: topic.title,
    streak: getCurrentStreak(sessions, topic.id),
    weekly: getWeeklySessions(sessions, topic.id).length,
    monthly: getMonthlySessions(sessions, topic.id).length,
    completion: getCompletionPercentage(sessions, topic),
  }));

  const totalAllTime = getTotalMinutes(sessions);
  const totalWeekly = sessions
    .filter((s) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(s.date) >= weekAgo && s.studied;
    })
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  // Consistency score: % of days in last 30 with at least one session
  const studiedDaysLast30 = new Set(
    sessions
      .filter((s) => {
        const date30ago = new Date();
        date30ago.setDate(date30ago.getDate() - 30);
        return new Date(s.date) >= date30ago && s.studied;
      })
      .map((s) => s.date)
  ).size;
  const consistencyScore = Math.round((studiedDaysLast30 / 30) * 100);

  return (
    <div className="fade-in">
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
        Analytics
      </h2>

      {/* Summary stats */}
      <div className="grid-3 mb-4">
        <div className="stat-card" style={{ padding: 12 }}>
          <div className="stat-label" style={{ fontSize: 10 }}>Total Time</div>
          <div className="stat-value" style={{ fontSize: 16, color: 'var(--accent)' }}>{formatMinutes(totalAllTime)}</div>
        </div>
        <div className="stat-card" style={{ padding: 12 }}>
          <div className="stat-label" style={{ fontSize: 10 }}>This Week</div>
          <div className="stat-value" style={{ fontSize: 16, color: '#10B981' }}>{formatMinutes(totalWeekly)}</div>
        </div>
        <div className="stat-card" style={{ padding: 12 }}>
          <div className="stat-label" style={{ fontSize: 10 }}>Consistency</div>
          <div className="stat-value" style={{ fontSize: 16, color: '#F59E0B' }}>{consistencyScore}%</div>
        </div>
      </div>

      {/* Chart toggle */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-4">
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>
            Study Hours
          </span>
          <div className="flex gap-1" style={{ background: 'var(--bg-input)', borderRadius: 8, padding: 3 }}>
            {(['weekly', 'monthly'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setChartView(v)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  background: chartView === v ? 'var(--accent)' : 'transparent',
                  color: chartView === v ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 8, fontSize: 11, fontFamily: 'var(--font-mono)',
              }}
            />
            {topics.map((topic, i) => (
              <Bar key={topic.id} dataKey={topic.title} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} stackId="a" />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-topic breakdown */}
      <div className="card mb-4">
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
          Topic Breakdown
        </div>
        {topics.map((topic, i) => {
          const streak = getCurrentStreak(sessions, topic.id);
          const longest = getLongestStreak(sessions, topic.id);
          const totalMins = getTotalMinutes(sessions.filter((s) => s.topicId === topic.id));
          const completion = getCompletionPercentage(sessions, topic);

          return (
            <div key={topic.id} style={{ marginBottom: i < topics.length - 1 ? 16 : 0 }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: topic.color }} />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{topic.title}</span>
                </div>
                <span className="mono text-xs" style={{ color: topic.color }}>{completion}%</span>
              </div>
              <div className="progress-track mb-2">
                <div
                  className="progress-fill"
                  style={{ width: `${completion}%`, background: `linear-gradient(90deg, ${topic.color}88, ${topic.color})` }}
                />
              </div>
              <div className="flex gap-3 text-xs text-muted">
                <span> {streak} streak</span>
                <span> {longest} best</span>
                <span>⏱ {formatMinutes(totalMins)}</span>
              </div>
              {i < topics.length - 1 && <div className="divider" />}
            </div>
          );
        })}
      </div>

      {/* Consistency line chart (30 days) */}
      <div className="card mb-4">
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
          30-Day Activity
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart
            data={Array.from({ length: 30 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (29 - i));
              const dateStr = date.toISOString().split('T')[0];
              const count = new Set(sessions.filter((s) => s.date === dateStr && s.studied).map((s) => s.topicId)).size;
              return { day: i + 1, topics: count };
            })}
            margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
            <Line type="monotone" dataKey="topics" stroke="var(--accent)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
