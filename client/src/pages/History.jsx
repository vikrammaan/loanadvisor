import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, ChevronRight, Calendar, Building2, Search, Filter } from 'lucide-react';

const MOCK_HISTORY = [
  {
    id: 'LN-2023-891',
    provider: 'Upstart',
    amount: 25000,
    purpose: 'Home Renovation',
    appliedDate: '2023-10-12',
    status: 'Disbursed',
    processingTime: '2 days',
    interestRate: 7.9,
    steps: [
      { name: 'Application Submitted', date: 'Oct 12, 2023', completed: true },
      { name: 'Documents Verified', date: 'Oct 13, 2023', completed: true },
      { name: 'Loan Approved', date: 'Oct 13, 2023', completed: true },
      { name: 'Funds Disbursed', date: 'Oct 14, 2023', completed: true },
    ]
  },
  {
    id: 'LN-2023-942',
    provider: 'HDFC Bank',
    amount: 15000,
    purpose: 'Personal Loan',
    appliedDate: '2023-11-05',
    status: 'Processing',
    processingTime: 'Pending (Day 3)',
    interestRate: 10.5,
    steps: [
      { name: 'Application Submitted', date: 'Nov 05, 2023', completed: true },
      { name: 'Documents Verified', date: 'Nov 06, 2023', completed: true },
      { name: 'Underwriting', date: 'In Progress', completed: false },
      { name: 'Funds Disbursed', date: 'Pending', completed: false },
    ]
  },
  {
    id: 'LN-2023-750',
    provider: 'State Bank of India',
    amount: 50000,
    purpose: 'Business Expansion',
    appliedDate: '2023-08-20',
    status: 'Rejected',
    processingTime: '4 days',
    interestRate: null,
    steps: [
      { name: 'Application Submitted', date: 'Aug 20, 2023', completed: true },
      { name: 'Documents Verified', date: 'Aug 22, 2023', completed: true },
      { name: 'Underwriting', date: 'Aug 24, 2023', completed: true },
      { name: 'Funds Disbursed', date: 'Rejected', completed: false },
    ]
  }
];

const StatusBadge = ({ status }) => {
  const styles = {
    'Disbursed': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Processing': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Rejected': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };
  
  const icons = {
    'Disbursed': <CheckCircle className="w-3.5 h-3.5" />,
    'Processing': <Clock className="w-3.5 h-3.5 animate-pulse" />,
    'Rejected': <XCircle className="w-3.5 h-3.5" />
  };

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  );
};

export default function History() {
  const [expandedId, setExpandedId] = useState(MOCK_HISTORY[0].id);
  const [search, setSearch] = useState('');

  const filteredHistory = MOCK_HISTORY.filter(h => 
    h.provider.toLowerCase().includes(search.toLowerCase()) || 
    h.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--c-text)' }}>Application History</h1>
        <p style={{ color: 'var(--c-text-muted)' }}>Track your past loan applications and view processing timelines.</p>
      </motion.div>

      {/* Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-4 mb-6 flex flex-col sm:flex-row justify-between gap-4"
      >
        <div className="relative w-full sm:max-w-md flex items-center">
          <Search className="absolute left-4 w-4 h-4" style={{ color: 'var(--c-text-faint)' }} />
          <input
            type="text"
            placeholder="Search by application ID or provider..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm transition-colors"
            style={{ background: 'var(--c-input-bg)', border: '1px solid var(--c-input-border)', color: 'var(--c-text)', outline: 'none' }}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ background: 'var(--c-hover)', color: 'var(--c-text)' }}
          >
            <Filter className="w-4 h-4" /> Filter Status
          </button>
        </div>
      </motion.div>

      {/* List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredHistory.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                key={item.id}
                className="glass-card rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Header Row */}
                <div 
                  className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--c-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-500">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: 'var(--c-text)' }}>{item.provider}</h3>
                      <div className="flex items-center gap-3 text-xs mt-1" style={{ color: 'var(--c-text-muted)' }}>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.appliedDate}</span>
                        <span>•</span>
                        <span className="font-mono">{item.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 md:gap-12">
                    <div className="text-left md:text-right">
                      <p className="text-xs mb-1" style={{ color: 'var(--c-text-muted)' }}>Requested Amount</p>
                      <p className="font-bold text-lg" style={{ color: 'var(--c-text)' }}>${item.amount.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={item.status} />
                      <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} className="hidden sm:block text-slate-400">
                        <ChevronRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t"
                      style={{ borderColor: 'var(--c-border-soft)', background: 'var(--c-bg-secondary)' }}
                    >
                      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Details */}
                        <div className="lg:col-span-1 space-y-4">
                          <h4 className="font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--c-text-muted)' }}>Application Details</h4>
                          <div className="space-y-3 p-4 rounded-xl" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border-soft)' }}>
                            <div className="flex justify-between text-sm">
                              <span style={{ color: 'var(--c-text-muted)' }}>Purpose</span>
                              <span className="font-semibold" style={{ color: 'var(--c-text)' }}>{item.purpose}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span style={{ color: 'var(--c-text-muted)' }}>Offered APR</span>
                              <span className="font-semibold text-emerald-500">{item.interestRate ? `${item.interestRate}%` : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span style={{ color: 'var(--c-text-muted)' }}>Processing Time</span>
                              <span className="font-semibold" style={{ color: 'var(--c-text)' }}>{item.processingTime}</span>
                            </div>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="lg:col-span-2 space-y-4">
                          <h4 className="font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--c-text-muted)' }}>Processing Timeline</h4>
                          <div className="relative pt-2">
                            {/* Line connecting nodes */}
                            <div className="absolute top-6 left-5 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700" />
                            
                            <div className="space-y-6 relative z-10">
                              {item.steps.map((step, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-4 ${
                                    step.completed 
                                      ? 'bg-emerald-500 border-emerald-100 dark:border-emerald-900/30 text-white shadow-md' 
                                      : item.status === 'Rejected' && i === 3
                                        ? 'bg-rose-500 border-rose-100 dark:border-rose-900/30 text-white shadow-md'
                                        : 'bg-slate-200 dark:bg-slate-700 border-white dark:border-slate-800 text-slate-400'
                                  }`}>
                                    {step.completed ? <CheckCircle className="w-5 h-5" /> : item.status === 'Rejected' && i === 3 ? <XCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                  </div>
                                  <div className="pt-2">
                                    <p className={`font-semibold text-sm ${step.completed ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-500'}`}>
                                      {step.name}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">{step.date}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12 glass-card rounded-2xl">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-slate-400">No applications found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
