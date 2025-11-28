// src/components/TabNavigation.tsx
import type { FC, KeyboardEvent } from 'react';

type TabType = 'overview' | 'phases' | 'notes';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
  iconFilled?: boolean;
  badge?: number;
}

interface TabNavigationProps {
  /** Currently active tab */
  activeTab: TabType;
  /** Callback when tab changes */
  onTabChange: (tab: TabType) => void;
  /** Optional custom tabs configuration */
  tabs?: Tab[];
  /** Optional className for custom styling */
  className?: string;
}

const TabNavigation: FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange,
  tabs,
  className = ''
}) => {
  // Default tabs configuration
  const defaultTabs: Tab[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'grid_view',
      iconFilled: true
    },
    {
      id: 'phases',
      label: 'Phases & Tasks',
      icon: 'folder_open',
      iconFilled: true
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: 'description',
      iconFilled: false
    }
  ];

  const tabsToRender = tabs || defaultTabs;

  /**
   * Handles tab click with keyboard support
   */
  const handleTabClick = (tabId: TabType) => {
    onTabChange(tabId);
  };

  /**
   * Handles keyboard navigation
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, tabId: TabType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTabClick(tabId);
    }

    // Arrow key navigation
    const currentIndex = tabsToRender.findIndex(tab => tab.id === activeTab);
    
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      e.preventDefault();
      handleTabClick(tabsToRender[currentIndex - 1].id);
    } else if (e.key === 'ArrowRight' && currentIndex < tabsToRender.length - 1) {
      e.preventDefault();
      handleTabClick(tabsToRender[currentIndex + 1].id);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div 
        className="flex border-b border-slate-300 dark:border-slate-700 overflow-x-auto"
        role="tablist"
        aria-label="Project navigation tabs"
      >
        {tabsToRender.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              id={`${tab.id}-tab`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              className={`
                flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm font-semibold 
                border-t border-x rounded-t-lg -mb-px z-0 
                transition-all duration-200 ease-in-out
                relative whitespace-nowrap
                ${isActive 
                  ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-brand-navy-dark dark:text-white z-10 shadow-sm' 
                  : 'bg-slate-100/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-200/60 dark:hover:bg-slate-700/50 hover:text-slate-700 dark:hover:text-slate-300'
                }
                focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2
              `}
              style={{
                borderBottomColor: isActive ? 'var(--tab-bg, white)' : 'transparent'
              }}
            >
              {/* Icon */}
              <span 
                className={`material-symbols-outlined !text-xl !font-light ${
                  isActive ? 'text-brand-blue' : 'text-current'
                }`}
                style={{ 
                  fontVariationSettings: tab.iconFilled ? "'FILL' 1" : "'FILL' 0"
                }}
                aria-hidden="true"
              >
                {tab.icon}
              </span>

              {/* Label */}
              <span className="hidden sm:inline">{tab.label}</span>

              {/* Badge (if exists) */}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span 
                  className="ml-1 px-2 py-0.5 text-xs font-bold bg-brand-blue text-white rounded-full"
                  aria-label={`${tab.badge} items`}
                >
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}

              {/* Active indicator line */}
              {isActive && (
                <span 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
        
        {/* Spacer to complete the bottom border */}
        <div className="flex-grow border-b border-slate-300 dark:border-slate-700" aria-hidden="true" />
      </div>
    </div>
  );
};

export default TabNavigation;