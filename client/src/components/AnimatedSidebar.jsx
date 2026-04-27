import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { History, LayoutDashboard, Calculator, FileText, ChevronLeft, ChevronRight, Settings, Store, Zap, Shield } from 'lucide-react';

const navItems = [
  { name: 'Dashboard',    icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Marketplace',  icon: Store,           path: '/marketplace' },
  { name: 'Eligibility',  icon: FileText,        path: '/eligibility' },
  { name: 'EMI Calculator', icon: Calculator,    path: '/calculator' },
  { name: 'History',      icon: History,         path: '/history' },
  { name: 'Admin Panel',  icon: Shield,          path: '/admin' },
];

export default function AnimatedSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = userData.role === 'admin';

  const filteredNavItems = navItems.filter(item => {
    if (item.name === 'Admin Panel') return isAdmin;
    return true;
  });

  return (
    <motion.aside
      initial={{ width: 240 }}
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-full flex flex-col justify-between relative flex-shrink-0"
      style={{
        background: 'var(--c-sidebar-bg)',
        borderRight: '1px solid var(--c-border-soft)',
        backdropFilter: 'blur(20px)',
        transition: 'background 0.3s ease',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(99,102,241,0.06), transparent)' }} />

      <div className="relative z-10">
        {/* Logo */}
        <div className="h-16 flex items-center px-4" style={{ borderBottom: '1px solid var(--c-border-soft)' }}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <motion.span
              animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
              transition={{ duration: 0.2 }}
              className="font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden"
              style={{ color: 'var(--c-text)' }}
            >
              Fin<span style={{ color: '#6366f1' }}>Advisor</span>
            </motion.span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 mt-2 space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive ? 'nav-active' : ''}`
              }
              style={({ isActive }) => isActive ? {} : {
                color: 'var(--c-text-muted)',
              }}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-indigo-400' : ''}`}
                    style={isActive ? {} : { color: 'var(--c-text-faint)' }} />
                  <motion.span
                    animate={{ opacity: isCollapsed ? 0 : 1, display: isCollapsed ? 'none' : 'block' }}
                    transition={{ duration: 0.15 }}
                    className="font-medium text-sm whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div className="relative z-10 p-3" style={{ borderTop: '1px solid var(--c-border-soft)' }}>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive ? 'nav-active' : ''}`
          }
          style={({ isActive }) => isActive ? {} : { color: 'var(--c-text-muted)' }}
        >
          {({ isActive }) => (
            <>
              <Settings className="w-5 h-5 flex-shrink-0"
                style={isActive ? { color: '#818cf8' } : { color: 'var(--c-text-faint)' }} />
              <motion.span
                animate={{ opacity: isCollapsed ? 0 : 1, display: isCollapsed ? 'none' : 'block' }}
                className="font-medium text-sm whitespace-nowrap"
              >
                Settings
              </motion.span>
            </>
          )}
        </NavLink>
        {!isCollapsed && (
          <p className="text-xs px-3 mt-3" style={{ color: 'var(--c-text-faint)' }}>FinAdvisor v2.0</p>
        )}
      </div>

      {/* Collapse */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
        style={{
          background: 'var(--c-sidebar-bg)',
          border: '1px solid var(--c-border)',
          color: 'var(--c-text-muted)',
          boxShadow: '0 0 12px rgba(99,102,241,0.15)',
        }}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </motion.aside>
  );
}
