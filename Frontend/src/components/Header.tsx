// src/components/Header.tsx
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  /** Optional custom title for the header */
  title?: string;
  /** Optional callback when navigation items are clicked */
  onNavigate?: (target: 'projects' | 'messages' | 'files') => void;
  /** Optional user data */
  user?: {
    name: string;
    avatar: string;
    role?: string;
  };
  /** Optional flag to show/hide navigation links */
  showNavigation?: boolean;
  /** Optional callback for dark mode toggle */
  onToggleDarkMode?: () => void;
  /** Optional flag to show notification badge on messages */
  hasNewMessages?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Project Progress Hub",
  onNavigate,
  user,
  showNavigation = true,
  onToggleDarkMode,
  hasNewMessages = true
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
    <header className="flex items-center justify-between whitespace-nowrap border border-solid border-slate-200 dark:border-slate-700 px-4 md:px-10 py-3 bg-white dark:bg-slate-900/50 rounded-lg shadow-sm backdrop-blur-sm">
      {/* Logo and Title Section */}
      <div className="flex items-center gap-4 text-slate-900 dark:text-slate-50">
        <div className="w-6 h-6 text-brand-blue flex-shrink-0">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              clipRule="evenodd"
              d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] text-brand-navy-dark dark:text-slate-100">
          {title}
        </h1>
      </div>
      
      {/* Navigation and User Section */}
      <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
        {/* Desktop Navigation Links */}
        {showNavigation && (
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <a
              href="#"
              onClick={(e) => handleNavigationClick('projects', e)}
              className="text-sm font-medium leading-normal text-brand-navy-dark dark:text-slate-300 hover:text-brand-blue dark:hover:text-brand-blue transition-colors duration-200 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Projects
            </a>
            <a
              href="#"
              onClick={(e) => handleNavigationClick('messages', e)}
              className="text-sm font-medium leading-normal text-brand-navy-dark dark:text-slate-300 hover:text-brand-blue dark:hover:text-brand-blue transition-colors duration-200 relative flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">mail</span>
              Messages
              {/* Notification Badge */}
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
              className="text-sm font-medium leading-normal text-brand-navy-dark dark:text-slate-300 hover:text-brand-blue dark:hover:text-brand-blue transition-colors duration-200 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">folder</span>
              Files
            </a>
          </nav>
        )}

        {/* User Avatar with Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 hover:ring-2 hover:ring-brand-blue hover:ring-offset-2 transition-all focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 relative"
            style={{
              backgroundImage: `url("${user?.avatar || defaultAvatar}")`
            }}
            aria-label="User menu"
            aria-expanded={showUserMenu}
            aria-haspopup="true"
          >
            {/* Online status indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div 
              className="absolute right-0 top-14 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 py-2 min-w-[220px] animate-in fade-in slide-in-from-top-2 duration-200"
              role="menu"
              aria-orientation="vertical"
            >
              {/* User Info */}
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

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={() => handleMenuAction('profile')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-lg">person</span>
                  <span>View Profile</span>
                </button>
                <button
                  onClick={() => handleMenuAction('settings')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-lg">settings</span>
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleDarkModeToggle}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-lg">dark_mode</span>
                  <span>Toggle Dark Mode</span>
                </button>
                <button
                  onClick={() => handleMenuAction('help')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-lg">help</span>
                  <span>Help & Support</span>
                </button>
              </div>

              {/* Logout */}
              <div className="py-1 border-t border-slate-200 dark:border-slate-600">
                <button
                  onClick={() => handleMenuAction('logout')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 dark:text-red-400 transition-colors"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  <span>Logout</span>
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
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">
                {showMobileMenu ? 'close' : 'menu'}
              </span>
            </button>

            {/* Mobile Menu Dropdown */}
            {showMobileMenu && (
              <div className="absolute right-4 top-20 z-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 py-2 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
                <a
                  href="#"
                  onClick={(e) => handleNavigationClick('projects', e)}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                  Back to Projects
                </a>
                <a
                  href="#"
                  onClick={(e) => handleNavigationClick('messages', e)}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors relative"
                >
                  <span className="material-symbols-outlined text-base">mail</span>
                  Messages
                  {hasNewMessages && (
                    <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </a>
                <a
                  href="#"
                  onClick={(e) => handleNavigationClick('files', e)}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">folder</span>
                  Files
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;