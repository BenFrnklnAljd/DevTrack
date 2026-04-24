import React from 'react';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  BarChart2,
  LucideIcon
} from 'lucide-react';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const TABS: { id: ActiveTab; label: string; Icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendar', Icon: Calendar },
  { id: 'topics', label: 'Topics', Icon: BookOpen },
  { id: 'reports', label: 'Reports', Icon: BarChart2 },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        height: 'var(--nav-height)',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        zIndex: 50,
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              background: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              color: isActive
                ? 'var(--accent)'
                : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              position: 'relative',
              padding: '8px 4px',
            }}
          >
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 24,
                  height: 2,
                  borderRadius: '0 0 2px 2px',
                  background: 'var(--accent)',
                }}
              />
            )}

            <Icon size={20} />

            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 400,
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.02em',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
