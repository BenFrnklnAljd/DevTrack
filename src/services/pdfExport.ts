import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Topic, StudySession } from '../types';
import {
  getCurrentStreak,
  getCompletionPercentage,
  getTotalMinutes,
  getWeeklySessions,
  getMonthlySessions,
  getTodaySessions,
  formatMinutes,
} from '../utils/helpers';

export function exportToPDF(topics: Topic[], sessions: StudySession[]): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const today = format(new Date(), 'MMMM dd, yyyy');

  // Header
  doc.setFillColor(18, 18, 30);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('DevTrack', 14, 18);
  doc.setTextColor(200, 200, 220);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Learning Progress Report', 14, 27);
  doc.text(`Generated: ${today}`, 14, 34);

  let yPos = 50;

  // Summary Stats
  doc.setTextColor(30, 30, 50);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Overview', 14, yPos);
  yPos += 8;

  const totalTopics = topics.length;
  const totalStudyTime = formatMinutes(getTotalMinutes(sessions));
  const todaySessions = getTodaySessions(sessions).length;
  const weeklySessions = getWeeklySessions(sessions).length;
  const monthlySessions = getMonthlySessions(sessions).length;

  autoTable(doc, {
    startY: yPos,
    head: [['Metric', 'Value']],
    body: [
      ['Total Topics Tracked', totalTopics.toString()],
      ['Total Study Time (All Time)', totalStudyTime],
      ['Topics Studied Today', todaySessions.toString()],
      ['Study Sessions This Week', weeklySessions.toString()],
      ['Study Sessions This Month', monthlySessions.toString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: [139, 92, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 243, 255] },
    margin: { left: 14, right: 14 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 12;

  // Topics Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 50);
  doc.text('Topics Progress', 14, yPos);
  yPos += 6;

  const topicRows = topics.map((topic) => {
    const streak = getCurrentStreak(sessions, topic.id);
    const completion = getCompletionPercentage(sessions, topic);
    const weekly = getWeeklySessions(sessions, topic.id).length;
    const monthly = getMonthlySessions(sessions, topic.id).length;
    const totalMins = getTotalMinutes(sessions.filter((s) => s.topicId === topic.id));
    return [
      topic.title,
      topic.category,
      format(new Date(topic.dateStarted), 'MMM dd, yyyy'),
      `${streak} days`,
      `${completion}%`,
      weekly.toString(),
      monthly.toString(),
      formatMinutes(totalMins),
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [['Topic', 'Category', 'Started', 'Streak', 'Progress', 'Weekly', 'Monthly', 'Total Time']],
    body: topicRows,
    theme: 'grid',
    headStyles: { fillColor: [139, 92, 246], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 243, 255] },
    margin: { left: 14, right: 14 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 12;

  // Recent Activity (last 14 days)
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 50);
  doc.text('Recent Activity (Last 14 Days)', 14, yPos);
  yPos += 6;

  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return format(date, 'yyyy-MM-dd');
  });

  const activityRows = last14Days.map((date) => {
    const daySessions = sessions.filter((s) => s.date === date && s.studied);
    const topicsStudied = topics
      .filter((t) => daySessions.some((s) => s.topicId === t.id))
      .map((t) => t.title)
      .join(', ');
    const totalMins = daySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    return [
      format(new Date(date), 'EEE, MMM dd'),
      daySessions.length.toString(),
      topicsStudied || '—',
      totalMins > 0 ? formatMinutes(totalMins) : '—',
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Sessions', 'Topics', 'Time']],
    body: activityRows,
    theme: 'grid',
    headStyles: { fillColor: [139, 92, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 243, 255] },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(18, 18, 30);
    doc.rect(0, doc.internal.pageSize.getHeight() - 10, pageWidth, 10, 'F');
    doc.setTextColor(150, 150, 170);
    doc.setFontSize(8);
    doc.text(`DevTrack • Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 3, { align: 'center' });
  }

  doc.save(`devtrack-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}
