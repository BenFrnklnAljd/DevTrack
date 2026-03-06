import React from 'react';
import { Theme } from '../../types';
import { Sun, Moon, Download } from 'lucide-react';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onExportPDF: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onExportPDF }) => {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      height: 'var(--header-height)',
      background: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      zIndex: 50,
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 30, height: 30,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>D</span>
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
          DevTrack
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={onExportPDF}
          title="Export PDF"
          style={{
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.3)',
            color: 'var(--accent)',
            padding: '7px 10px',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontWeight: 600,
          }}
        >
          <Download size={14} />
          <span>PDF</span>
        </button>

        <button
          onClick={onToggleTheme}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            padding: '7px',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 34, height: 34,
          }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
};
