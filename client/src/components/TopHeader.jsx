import { useState, useEffect } from 'react';
import { Bell, Search, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

export default function TopHeader() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search loans, clients, or reports..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors"
            onClick={() => setDropdownOpen(dropdownOpen === 'notifications' ? false : 'notifications')}
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <AnimatePresence>
            {dropdownOpen === 'notifications' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                    <p className="text-sm font-medium text-slate-800">Security Alert</p>
                    <p className="text-xs text-slate-500 mt-1">New login from Chrome on Windows.</p>
                    <p className="text-xs text-indigo-500 mt-2">2 minutes ago</p>
                  </div>
                  <div className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                    <p className="text-sm font-medium text-slate-800">Report Generated</p>
                    <p className="text-xs text-slate-500 mt-1">Your monthly portfolio report is ready to download.</p>
                    <p className="text-xs text-indigo-500 mt-2">1 hour ago</p>
                  </div>
                </div>
                <div className="p-3 text-center border-t border-slate-100">
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setDropdownOpen(dropdownOpen === 'profile' ? false : 'profile')}
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                {user ? user.name : 'Guest'}
              </p>
              <p className="text-xs text-slate-500">{user ? 'Premium Member' : 'Sign in required'}</p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]"
            >
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                <User className="w-6 h-6 text-slate-300 mt-2" />
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {dropdownOpen === 'profile' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden"
              >
                <div className="p-2 space-y-1">
                  <Link 
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link 
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4" /> Settings
                  </Link>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Log out
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
