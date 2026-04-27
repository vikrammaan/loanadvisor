import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, Users, ArrowUpRight, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const chartData = [
  { name: 'Jan', approvals: 4000, applications: 2400 },
  { name: 'Feb', approvals: 3000, applications: 1398 },
  { name: 'Mar', approvals: 5200, applications: 9800 },
  { name: 'Apr', approvals: 2780, applications: 3908 },
  { name: 'May', approvals: 1890, applications: 4800 },
  { name: 'Jun', approvals: 2390, applications: 3800 },
  { name: 'Jul', approvals: 3490, applications: 4300 },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const tooltipStyle = {
    background: isDark ? '#0d1220' : '#ffffff',
    border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'}`,
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    color: isDark ? '#e2e8f0' : '#0f172a',
  };

  const tickColor = isDark ? '#475569' : '#94a3b8';

  const stats = [
    { title: 'Total Disbursed', value: '$2.4M', icon: Wallet, trend: '+12.5%', from: '#6366f1', to: '#8b5cf6' },
    { title: 'Active Applications', value: '842', icon: Users, trend: '+5.2%', from: '#06b6d4', to: '#3b82f6' },
    { title: 'Approval Rate', value: '78.3%', icon: TrendingUp, trend: '+2.1%', from: '#10b981', to: '#06b6d4' },
  ];

  const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Hero */}
      <motion.div variants={fadeUp} className="relative rounded-3xl overflow-hidden p-8 sm:p-10"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #1e1040 0%, #0f172a 50%, #0c1a2e 100%)'
            : 'linear-gradient(135deg, #ede9fe 0%, #dbeafe 50%, #e0f2fe 100%)',
          border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'}`,
        }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 badge badge-indigo mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Live Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight" style={{ color: 'var(--c-text)' }}>
            Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-base mb-8 max-w-lg" style={{ color: 'var(--c-text-muted)' }}>
            Your portfolio is performing remarkably well. Approval rate is up{' '}
            <span className="text-emerald-500 font-semibold">2.1%</span> this week.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('📊 Report generation started! Check your email shortly.')}
              className="btn-primary flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Generate Report
            </button>
            <Link to="/marketplace"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{ color: 'var(--c-text-muted)' }}
            >
              View Marketplace <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={fadeUp} whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass-card card-hover rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-15"
              style={{ background: `linear-gradient(135deg, ${stat.from}, ${stat.to})` }} />
            <div className="flex justify-between items-start mb-5 relative">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: `${stat.from}20`, border: `1px solid ${stat.from}35` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.from }} />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3" /> {stat.trend}
              </span>
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--c-text-muted)' }}>{stat.title}</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--c-text)' }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--c-text)' }}>Applications vs Approvals</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--c-text-faint)' }}>Performance over the last 7 months</p>
          </div>
          <select className="input-dark text-xs py-1.5 px-3 w-auto" style={{ borderRadius: '10px', width: 'auto' }}>
            <option>Last 6 Months</option>
            <option>This Year</option>
          </select>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gApprovals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(99,102,241,0.2)', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="applications" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#gApps)" dot={false} />
              <Area type="monotone" dataKey="approvals" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#gApprovals)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-6 mt-4">
          {[['bg-purple-500', 'Applications'], ['bg-cyan-500', 'Approvals']].map(([c, l]) => (
            <div key={l} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${c}`} />
              <span className="text-xs" style={{ color: 'var(--c-text-faint)' }}>{l}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
