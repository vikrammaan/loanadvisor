import { useState, useEffect } from 'react';
import { Bell, Search, User, LogOut, Settings as SettingsIcon, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

export default function TopHeader() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header
      className="h-16 flex items-center justify-between px-6 flex-shrink-0 relative z-20"
      style={{
        background: 'rgba(8, 12, 20, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.12)',
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search anything..."
            className="input-dark pl-10 py-2 text-sm"
            style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(dropdownOpen === 'notifications' ? false : 'notifications')}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-[#080c14]" />
          </button>

          <AnimatePresence>
            {dropdownOpen === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-80 rounded-2xl overflow-hidden z-50"
                style={{ background: '#0d1220', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}
              >
                <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 className="font-semibold text-slate-200 text-sm">Notifications</h3>
                  <span className="badge badge-indigo">2 new</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {[
                    { title: 'Security Alert', body: 'New login detected from Chrome on Windows.', time: '2 min ago', dot: 'bg-rose-500' },
                    { title: 'Report Generated', body: 'Your monthly portfolio report is ready.', time: '1 hour ago', dot: 'bg-emerald-500' },
                    { title: 'Rate Update', body: 'Upstart lowered their APR to 7.9%.', time: '3 hours ago', dot: 'bg-indigo-500' },
                  ].map((n, i) => (
                    <div key={i} className="p-4 hover:bg-white/5 transition-colors cursor-pointer" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                        <div>
                          <p className="text-sm font-medium text-slate-200">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>
                          <p className="text-xs text-indigo-500 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(dropdownOpen === 'profile' ? false : 'profile')}
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-white/5 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ boxShadow: '0 0 12px rgba(99,102,241,0.4)' }}>
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-200 leading-none">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 mt-0.5">Premium</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden md:block" />
          </button>

          <AnimatePresence>
            {dropdownOpen === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-52 rounded-2xl overflow-hidden z-50"
                style={{ background: '#0d1220', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}
              >
                <div className="p-3 space-y-0.5">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-500" /> My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4 text-slate-500" /> Settings
                  </Link>
                  <div className="h-px my-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
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
