// src/components/Header.tsx
import { useState, useRef, useEffect } from 'react';

import { categoriesWithSkills } from './categories';

interface User {
  name: string;
  role?: string;
  avatar?: string;
}

interface HeaderProps {
  /** Optional custom title for the header */
  title?: string;
  /** Optional callback when navigation items are clicked */
  onNavigate?: (target: 'projects' | 'messages' | 'files') => void;
  /** Optional user data */
  user?: User;
  /** Show navigation links */
  showNavigation?: boolean;
  /** Indicates if there are new messages */
  hasNewMessages?: boolean;
  /** Optional callback for dark mode toggle */
  onToggleDarkMode?: () => void;
}

const Header = ({
  title = 'Platform',
  onNavigate,
  user,
  showNavigation = true,
  hasNewMessages = false,
  onToggleDarkMode,
  section = 'project-progress',
  onSectionChange
}: HeaderProps & { section?: string, onSectionChange?: (section: string) => void }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>(section || 'project-progress');

  const handleSectionClick = (sec: string) => {
    setActiveSection(sec);
    if (onSectionChange) onSectionChange(sec);
  };

  const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuAqoJDUeuyHNzU9ui9ak-YnGF1h0CW1YoUT5NUt16D51-Q4jOO7prYZvCfBL7KL5PKLep4Z9nZ4nyClJ7UK_vhaorvBJ4WFOFdbID-8eHA18JQOKJRatVWyBuqIavMkoJuLj4vidTzLC_E1qAKiiQqZ_zhTs1iRrmu3AItEh7Jr5dLhq45fp1X5kAaDjZ1NZkExqokokXBfVt3zj5gmz6Wbhz0zp7G46mvk6ZmocNYNT6XoDHlkW2dAjXjtULAl4WaIT_11NLmoGX9V";

  /**
   * Close menus when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handle navigation clicks
   */
  const handleNavigationClick = (target: 'projects' | 'messages' | 'files', e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(target);
    }
    setShowMobileMenu(false);
  };

  /**
   * Handle dark mode toggle
   */
  const handleDarkModeToggle = () => {
    if (onToggleDarkMode) {
      onToggleDarkMode();
    } else {
      // Default behavior: toggle dark class on document
      document.documentElement.classList.toggle('dark');
    }
    setShowUserMenu(false);
  };

  /**
   * Handle user menu actions
   */
  const handleMenuAction = (action: string) => {
    console.log(`Action: ${action}`);
    setShowUserMenu(false);
    
    // You can emit events or call callbacks here based on the action
    switch(action) {
      case 'profile':
        // Navigate to profile
        break;
      case 'settings':
        // Navigate to settings
        break;
      case 'logout':
        // Handle logout
        break;
    }
  };

  return (
    <header className="flex flex-col gap-4 border border-solid border-slate-200 dark:border-slate-700 px-4 md:px-10 py-3 bg-white dark:bg-slate-900/50 rounded-lg shadow-sm backdrop-blur-sm">
      {/* Top Row: Logo, Title, and User Menu */}
      <div className="flex items-center justify-between whitespace-nowrap">
        {/* Logo and Title Section */}
        <div className="flex items-center gap-4 text-slate-900 dark:text-slate-50">
          <div className="w-6 h-6 text-blue-600 flex-shrink-0">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-slate-100">
            {title}
          </h1>
        </div>

        {/* Navigation and User Section */}
        <div className="flex gap-4 md:gap-8 items-center">
          {/* Desktop Navigation Links */}
          {showNavigation && (
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              <a
                href="#"
                onClick={(e) => handleNavigationClick('projects', e)}
                className="text-sm font-medium leading-normal text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Back to Projects
              </a>
              <a
                href="#"
                onClick={(e) => handleNavigationClick('messages', e)}
                className="text-sm font-medium leading-normal text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 relative"
              >
                Messages
                {hasNewMessages && (
                  <span 
                    className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" 
                    aria-label="New messages"
                  />
                )}
              </a>
              <a
                href="#"
                onClick={(e) => handleNavigationClick('files', e)}
                className="text-sm font-medium leading-normal text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Files
              </a>
            </nav>
          )}

          {/* User Avatar with Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 relative"
              style={{
                backgroundImage: `url("${user?.avatar || defaultAvatar}")`
              }}
              aria-label="User menu"
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </button>

            {showUserMenu && (
              <div 
                className="absolute right-0 top-14 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 py-2 min-w-[220px]"
                role="menu"
                aria-orientation="vertical"
              >
                {user && (
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-600">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    {user.role && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                        {user.role}
                      </p>
                    )}
                  </div>
                )}

                <div className="py-1">
                  <button
                    onClick={() => handleMenuAction('profile')}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    role="menuitem"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleMenuAction('settings')}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    role="menuitem"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleDarkModeToggle}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    role="menuitem"
                  >
                    Toggle Dark Mode
                  </button>
                  <button
                    onClick={() => handleMenuAction('help')}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    role="menuitem"
                  >
                    Help & Support
                  </button>
                </div>

                <div className="py-1 border-t border-slate-200 dark:border-slate-600">
                  <button
                    onClick={() => handleMenuAction('logout')}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          {showNavigation && (
            <div className="md:hidden" ref={mobileMenuRef}>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Toggle mobile menu"
                aria-expanded={showMobileMenu}
              >
                <span className="text-slate-700 dark:text-slate-300 text-2xl">
                  {showMobileMenu ? '✕' : '☰'}
                </span>
              </button>

              {showMobileMenu && (
                <div className="absolute right-4 top-20 z-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 py-2 min-w-[200px]">
                  <a
                    href="#"
                    onClick={(e) => handleNavigationClick('projects', e)}
                    className="block px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Back to Projects
                  </a>
                  <a
                    href="#"
                    onClick={(e) => handleNavigationClick('messages', e)}
                    className="block px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors relative"
                  >
                    Messages
                    {hasNewMessages && (
                      <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                    )}
                  </a>
                  <a
                    href="#"
                    onClick={(e) => handleNavigationClick('files', e)}
                    className="block px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Files
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex flex-wrap gap-2 md:gap-4 items-center">
        <button
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${activeSection === 'project-progress' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white'}`}
          style={{ minWidth: 150 }}
          onClick={() => handleSectionClick('project-progress')}
        >
          Project Progress
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${activeSection === 'client-dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white'}`}
          style={{ minWidth: 150 }}
          onClick={() => handleSectionClick('client-dashboard')}
        >
          ClientDashboard
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${activeSection === 'freelancer-dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white'}`}
          style={{ minWidth: 180 }}
          onClick={() => handleSectionClick('freelancer-dashboard')}
        >
          Freelancer Dashboard
        </button>
      </div>


    </header>
  );
};

export default Header;