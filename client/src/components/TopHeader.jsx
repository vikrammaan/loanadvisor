import { useState, useEffect } from 'react';
import { Bell, Search, User, LogOut, Settings as SettingsIcon, ChevronDown, Sun, Moon, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';

export default function TopHeader({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllRead } = useNotifications();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const searchablePages = [
    { title: 'Dashboard', path: '/dashboard', keywords: 'home overview stats main' },
    { title: 'Marketplace', path: '/marketplace', keywords: 'loans providers banks apply borrow' },
    { title: 'Eligibility Check', path: '/eligibility', keywords: 'score check eligible form' },
    { title: 'EMI Calculator', path: '/calculator', keywords: 'math interest monthly payment' },
    { title: 'Application History', path: '/history', keywords: 'past status processing timeline' },
    { title: 'Profile Settings', path: '/profile', keywords: 'user account security password' }
  ];

  const searchResults = searchQuery.trim() 
    ? searchablePages.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.keywords.includes(searchQuery.toLowerCase())
      )
    : [];

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const panelStyle = {
    background: 'var(--c-bg-secondary)',
    border: '1px solid var(--c-border)',
    boxShadow: 'var(--c-shadow-lg)',
    borderRadius: '16px',
    overflow: 'hidden',
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-6 flex-shrink-0 relative z-20"
      style={{
        background: 'var(--c-header-bg)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--c-border-soft)',
        transition: 'background 0.3s ease',
      }}
    >
      {/* Sidebar Toggle (Mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 mr-2 rounded-xl transition-colors hover:bg-white/5"
        style={{ color: 'var(--c-text-muted)' }}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative z-50">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
            style={{ color: 'var(--c-text-faint)' }} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearch(true);
            }}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            className="input-dark pl-10 py-2 text-sm w-full transition-all"
            style={{ borderRadius: '10px' }}
          />
        </div>
        
        <AnimatePresence>
          {showSearch && searchQuery.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              className="absolute left-0 right-0 top-full mt-2 rounded-xl overflow-hidden shadow-2xl z-50"
              style={{ background: 'var(--c-bg-secondary)', border: '1px solid var(--c-border)' }}
            >
              {searchResults.length > 0 ? (
                <div className="p-2 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider px-3 pt-1 pb-2" style={{ color: 'var(--c-text-faint)' }}>Quick Links</p>
                  {searchResults.map(res => (
                    <button
                      key={res.path}
                      onClick={() => {
                        navigate(res.path);
                        setSearchQuery('');
                        setShowSearch(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors"
                      style={{ color: 'var(--c-text)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--c-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span className="font-medium">{res.title}</span>
                      <span className="text-xs" style={{ color: 'var(--c-text-faint)' }}>Jump to</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm" style={{ color: 'var(--c-text-muted)' }}>
                  No results found for "{searchQuery}"
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 ml-4">
        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          whileTap={{ scale: 0.9 }}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all relative overflow-hidden"
          style={{ 
            background: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(251,191,36,0.12)',
            border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(251,191,36,0.25)'}`,
          }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun className="w-4 h-4 text-amber-400" />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon className="w-4 h-4 text-indigo-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Divider */}
        <div className="w-px h-6" style={{ background: 'var(--c-border-soft)' }} />

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setDropdownOpen(dropdownOpen === 'notifications' ? false : 'notifications');
              if (dropdownOpen !== 'notifications') markAllRead();
            }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ color: 'var(--c-text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--c-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 animate-pulse"
                style={{ ringColor: 'var(--c-bg)' }} />
            )}
          </button>

          <AnimatePresence>
            {dropdownOpen === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-80 z-50"
                style={panelStyle}
              >
                <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--c-border-soft)' }}>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--c-text)' }}>Notifications</h3>
                  {unreadCount > 0 && <span className="badge badge-indigo">{unreadCount} new</span>}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm" style={{ color: 'var(--c-text-muted)' }}>No notifications</div>
                  ) : (
                    notifications.map((n, i) => (
                    <div key={n.id || i} className="p-4 cursor-pointer transition-colors"
                      style={{ borderBottom: '1px solid var(--c-border-soft)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--c-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--c-text)' }}>{n.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--c-text-muted)' }}>{n.body}</p>
                          <p className="text-xs text-indigo-500 mt-1">
                            {Math.floor((new Date() - new Date(n.time)) / 60000) < 1 ? 'Just now' : `${Math.floor((new Date() - new Date(n.time)) / 60000)} min ago`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )))}
                </div>
                <div className="p-3 text-center" style={{ borderTop: '1px solid var(--c-border-soft)' }}>
                  <button className="text-xs font-medium text-indigo-500 hover:text-indigo-400 transition-colors">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-6" style={{ background: 'var(--c-border-soft)' }} />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(dropdownOpen === 'profile' ? false : 'profile')}
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all"
            onMouseEnter={e => e.currentTarget.style.background = 'var(--c-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ boxShadow: '0 0 12px rgba(99,102,241,0.4)' }}>
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold leading-none" style={{ color: 'var(--c-text)' }}>{user?.name || 'User'}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--c-text-faint)' }}>Premium</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 hidden lg:block" style={{ color: 'var(--c-text-faint)' }} />
          </button>

          <AnimatePresence>
            {dropdownOpen === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-52 z-50"
                style={panelStyle}
              >
                <div className="p-2 space-y-0.5">
                  {[
                    { to: '/profile', icon: User, label: 'My Profile' },
                    { to: '/settings', icon: SettingsIcon, label: 'Settings' },
                  ].map(item => (
                    <Link key={item.to} to={item.to}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition-colors"
                      style={{ color: 'var(--c-text-2)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--c-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <item.icon className="w-4 h-4" style={{ color: 'var(--c-text-faint)' }} /> {item.label}
                    </Link>
                  ))}
                  <div className="h-px my-1" style={{ background: 'var(--c-border-soft)' }} />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-500 hover:text-rose-400 rounded-xl transition-colors"
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
