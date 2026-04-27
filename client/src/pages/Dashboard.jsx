import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

const data = [
  { name: 'Jan', approvals: 4000, applications: 2400 },
  { name: 'Feb', approvals: 3000, applications: 1398 },
  { name: 'Mar', approvals: 2000, applications: 9800 },
  { name: 'Apr', approvals: 2780, applications: 3908 },
  { name: 'May', approvals: 1890, applications: 4800 },
  { name: 'Jun', approvals: 2390, applications: 3800 },
  { name: 'Jul', approvals: 3490, applications: 4300 },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const stats = [
    { title: 'Total Disbursed', value: '$2.4M', icon: Wallet, trend: '+12.5%', color: 'from-blue-500 to-indigo-500' },
    { title: 'Active Applications', value: '842', icon: Users, trend: '+5.2%', color: 'from-purple-500 to-pink-500' },
    { title: 'Approval Rate', value: '78.3%', icon: TrendingUp, trend: '+2.1%', color: 'from-emerald-400 to-teal-500' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Hero Banner Section */}
      <motion.div variants={itemVariants} className="relative rounded-3xl overflow-hidden bg-slate-900 p-8 sm:p-10 text-white shadow-xl">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=2061&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-0" />
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Welcome back{user ? `, ${user.name}` : ''}! 👋</h1>
          <p className="text-slate-300 text-lg mb-8">Your portfolio is performing remarkably well. The approval rate has increased by 2.1% this week.</p>
          <button 
            onClick={() => alert('Report generation started. You will receive an email shortly.')}
            className="bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-colors shadow-lg"
          >
            Generate Report
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-500 blur-[100px] opacity-40 mix-blend-screen pointer-events-none" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity`} />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                {stat.trend}
              </span>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Application vs Approvals</h2>
          <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 text-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
            <option>Last 6 Months</option>
            <option>This Year</option>
          </select>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorApprovals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="applications" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
              <Area type="monotone" dataKey="approvals" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorApprovals)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
