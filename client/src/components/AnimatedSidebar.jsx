import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calculator, FileText, ChevronLeft, ChevronRight, Settings } from 'lucide-react';

export default function AnimatedSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Eligibility', icon: FileText, path: '/eligibility' },
    { name: 'EMI Calculator', icon: Calculator, path: '/calculator' },
  ];

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white border-r border-slate-200 h-full flex flex-col justify-between shadow-sm relative"
    >
      <div>
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-slate-100">
          <motion.div 
            className="flex items-center gap-2 text-indigo-600 font-bold text-xl"
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {!isCollapsed && <span>FinAdvisor</span>}
          </motion.div>
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              F
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <motion.span
                animate={{ opacity: isCollapsed ? 0 : 1, display: isCollapsed ? 'none' : 'block' }}
                transition={{ duration: 0.2 }}
                className="font-medium whitespace-nowrap"
              >
                {item.name}
              </motion.span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-100 space-y-4">
        <NavLink 
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-xl transition-all duration-200 w-full ${
              isActive
                ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
            }`
          }
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <motion.span
            animate={{ opacity: isCollapsed ? 0 : 1, display: isCollapsed ? 'none' : 'block' }}
            className="font-medium whitespace-nowrap"
          >
            Settings
          </motion.span>
        </NavLink>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 shadow-sm text-slate-400 hover:text-indigo-600 transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}
