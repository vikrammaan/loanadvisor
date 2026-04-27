import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, FileText, CheckCircle2, XCircle, AlertTriangle, 
  Search, Filter, ChevronRight, Shield, DollarSign, Percent, ArrowUpRight, Clock
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('loans');
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [overrideData, setOverrideData] = useState({
    status: '',
    interestRate: '',
    approvedAmount: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const headers = { 'x-admin-email': userData.email };

    try {
      if (activeTab === 'loans') {
        const res = await axios.get('/api/admin/loans', { headers });
        setLoans(res.data);
      } else {
        const res = await axios.get('/api/admin/users', { headers });
        setUsers(res.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleOverride = async (loanId) => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const headers = { 'x-admin-email': userData.email };

    try {
      await axios.post(`/api/admin/loans/${loanId}`, overrideData, { headers });
      toast.success('Loan updated successfully');
      setSelectedLoan(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to update loan');
    }
  };

  const filteredLoans = loans.filter(l => 
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Command Center</h1>
          <p className="text-slate-500 text-sm">Oversee platform activity, manage risk, and override AI decisions.</p>
        </div>
        
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
          <button 
            onClick={() => setActiveTab('loans')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'loans' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Loan Applications
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'users' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            User Directory
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Volume', value: `$${loans.reduce((acc, curr) => acc + (curr.approvedAmount || 0), 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Active Users', value: users.length || '24', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Pending Review', value: loans.filter(l => l.status === 'pending').length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Avg Fraud Score', value: (loans.reduce((acc, curr) => acc + (curr.fraudScore || 0), 0) / (loans.length || 1)).toFixed(1), icon: Shield, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 rounded-2xl flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Area */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-indigo-500 transition-colors"
            />
          </div>
          <button className="p-2 bg-slate-800 rounded-xl border border-slate-700 text-slate-400 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center text-slate-500">Loading platform data...</div>
          ) : activeTab === 'loans' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/30 text-[10px] uppercase font-bold text-slate-400">
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Loan Details</th>
                  <th className="px-6 py-4">Fraud Risk</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredLoans.map((loan) => (
                  <tr key={loan._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xs">
                          {loan.name?.[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{loan.name}</p>
                          <p className="text-xs text-slate-500">{loan.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white">${loan.requestedAmount?.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{loan.purpose}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${loan.fraudScore > 60 ? 'bg-rose-500' : loan.fraudScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${loan.fraudScore}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${loan.fraudScore > 60 ? 'text-rose-400' : loan.fraudScore > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {loan.fraudScore}%
                        </span>
                      </div>
                      {loan.fraudFlags?.length > 0 && (
                        <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Flagged
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        loan.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                        loan.status === 'rejected' ? 'bg-rose-500/10 text-rose-400' :
                        'bg-indigo-500/10 text-indigo-400'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedLoan(loan);
                          setOverrideData({
                            status: loan.status,
                            interestRate: loan.interestRate || '5.5',
                            approvedAmount: loan.approvedAmount || loan.requestedAmount
                          });
                        }}
                        className="p-2 hover:bg-indigo-500/20 rounded-lg text-indigo-400 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/30 text-[10px] uppercase font-bold text-slate-400">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4 text-right">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                          {u.name?.[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-800 text-slate-400'}`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {u.isVerified ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Email Verified
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-400 text-xs font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Pending
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300">View Logs</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Override Sidebar / Modal */}
      <AnimatePresence>
        {selectedLoan && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedLoan(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 z-[101] shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-white">Manual Override</h2>
                  <button onClick={() => setSelectedLoan(null)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400"><XCircle className="w-5 h-5" /></button>
                </div>

                <div className="space-y-6">
                  {/* Summary */}
                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                    <p className="text-xs font-bold text-indigo-400 uppercase mb-2">Application Snapshot</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-lg font-bold text-white">{selectedLoan.name}</p>
                        <p className="text-xs text-slate-500">{selectedLoan.purpose}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">${selectedLoan.requestedAmount.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-indigo-400">Requested</p>
                      </div>
                    </div>
                  </div>

                  {/* Fraud Details */}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">Risk Assessment</p>
                    <div className="space-y-2">
                       {selectedLoan.fraudFlags?.map((flag, i) => (
                         <div key={i} className="flex items-start gap-2 text-[11px] text-rose-300 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                           <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {flag}
                         </div>
                       ))}
                       {selectedLoan.fraudFlags?.length === 0 && <p className="text-xs text-emerald-400 font-medium">No fraud flags detected.</p>}
                    </div>
                  </div>

                  {/* Override Controls */}
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Decision Status</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => setOverrideData({...overrideData, status: 'approved'})}
                          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all ${overrideData.status === 'approved' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approve
                        </button>
                        <button 
                          onClick={() => setOverrideData({...overrideData, status: 'rejected'})}
                          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all ${overrideData.status === 'rejected' ? 'border-rose-500 bg-rose-500/10 text-rose-400' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Approved Amt ($)</label>
                         <div className="relative">
                           <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                           <input 
                             type="number" 
                             value={overrideData.approvedAmount}
                             onChange={(e) => setOverrideData({...overrideData, approvedAmount: e.target.value})}
                             className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white"
                           />
                         </div>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Interest Rate (%)</label>
                         <div className="relative">
                           <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                           <input 
                             type="number" 
                             step="0.1"
                             value={overrideData.interestRate}
                             onChange={(e) => setOverrideData({...overrideData, interestRate: e.target.value})}
                             className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white"
                           />
                         </div>
                       </div>
                    </div>

                    <button 
                      onClick={() => handleOverride(selectedLoan._id)}
                      className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-4"
                    >
                      Save Configuration <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
