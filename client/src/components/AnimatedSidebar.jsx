import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calculator, FileText, ChevronLeft, ChevronRight, Settings, Store, Zap } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Marketplace', icon: Store, path: '/marketplace' },
  { name: 'Eligibility', icon: FileText, path: '/eligibility' },
  { name: 'EMI Calculator', icon: Calculator, path: '/calculator' },
];

export default function AnimatedSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ width: 240 }}
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-full flex flex-col justify-between relative flex-shrink-0"
      style={{
        background: 'rgba(8, 12, 20, 0.95)',
        borderRight: '1px solid rgba(99, 102, 241, 0.12)',
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-600/10 to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b" style={{ borderColor: 'rgba(99,102,241,0.12)' }}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg" style={{ boxShadow: '0 0 16px rgba(99,102,241,0.5)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <motion.span
              animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
              transition={{ duration: 0.2 }}
              className="text-white font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden"
            >
              Fin<span className="text-indigo-400">Advisor</span>
            </motion.span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 mt-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive ? 'nav-active' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent pointer-events-none" />
                  )}
                  <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
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
      <div className="relative z-10 p-3 border-t" style={{ borderColor: 'rgba(99,102,241,0.12)' }}>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
              isActive ? 'nav-active' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <motion.span
                animate={{ opacity: isCollapsed ? 0 : 1, display: isCollapsed ? 'none' : 'block' }}
                className="font-medium text-sm whitespace-nowrap"
              >
                Settings
              </motion.span>
            </>
          )}
        </NavLink>

        <div className="mt-3 px-3 py-2" style={{ display: isCollapsed ? 'none' : 'block' }}>
          <p className="text-xs text-slate-600">FinAdvisor v2.0</p>
        </div>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        style={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 0 12px rgba(99,102,241,0.2)' }}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </motion.aside>
  );
}
