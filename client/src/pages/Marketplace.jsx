import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Building2, TrendingDown, Landmark, Filter } from 'lucide-react';
import axios from 'axios';

const initialProviders = [
  { id: 1, name: 'HDFC Bank', interestRate: 10.5, maxAmount: 50000, type: 'Bank', logo: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 2, name: 'ICICI Bank', interestRate: 10.8, maxAmount: 40000, type: 'Bank', logo: Building2, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 3, name: 'SoFi Finance', interestRate: 8.5, maxAmount: 100000, type: 'Fintech', logo: Landmark, color: 'text-teal-600', bg: 'bg-teal-100' },
  { id: 4, name: 'LendingClub', interestRate: 9.0, maxAmount: 40000, type: 'P2P', logo: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-100' },
  { id: 5, name: 'State Bank of India', interestRate: 9.8, maxAmount: 75000, type: 'Bank', logo: Building2, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { id: 6, name: 'Upstart', interestRate: 7.9, maxAmount: 50000, type: 'Fintech', logo: Landmark, color: 'text-purple-600', bg: 'bg-purple-100' },
];

export default function Marketplace() {
  const [providers, setProviders] = useState(initialProviders);
  const [sortOption, setSortOption] = useState('default');
  
  // AI State
  const [loanAmount, setLoanAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const handleSort = (e) => {
    const value = e.target.value;
    setSortOption(value);
    
    let sorted = [...providers];
    if (value === 'interest_low') sorted.sort((a, b) => a.interestRate - b.interestRate);
    if (value === 'amount_high') sorted.sort((a, b) => b.maxAmount - a.maxAmount);
    if (value === 'default') sorted = [...initialProviders];
    
    setProviders(sorted);
  };

  const getRecommendation = async (e) => {
    e.preventDefault();
    if (!loanAmount || !purpose) return;
    
    setLoadingAI(true);
    try {
      const res = await axios.post('/api/ai-recommendation', {
        amount: loanAmount,
        purpose,
        providers: providers.map(p => ({ name: p.name, interestRate: p.interestRate, maxAmount: p.maxAmount }))
      });
      setAiRecommendation(res.data.recommendation);
    } catch (error) {
      setAiRecommendation("Sorry, I couldn't generate a recommendation right now. Please try again.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Loan Marketplace</h1>
        <p className="text-slate-500 dark:text-slate-400">Compare top providers and let AI find your perfect match.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - AI Recommendation Tool */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-6 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                AI Smart Match
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Unsure who to choose?</h2>
              <p className="text-indigo-100 mb-6 text-sm">Tell us what you need and our AI will recommend the absolute best provider from the market.</p>
              
              <form onSubmit={getRecommendation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-1">Loan Amount ($)</label>
                  <input 
                    type="number" 
                    required
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="e.g. 25000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-1">Purpose</label>
                  <input 
                    type="text" 
                    required
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="e.g. Home Renovation"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loadingAI}
                  className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loadingAI ? 'Analyzing...' : 'Get Recommendation'}
                  {!loadingAI && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              {aiRecommendation && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md text-sm leading-relaxed"
                >
                  {aiRecommendation}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Provider Grid */}
        <div className="lg:col-span-2">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
              <Filter className="w-5 h-5 text-indigo-500" />
              <span>{providers.length} Providers Found</span>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">Sort by:</span>
              <select 
                value={sortOption}
                onChange={handleSort}
                className="w-full sm:w-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="default">Featured</option>
                <option value="interest_low">Lowest Interest Rate</option>
                <option value="amount_high">Highest Loan Amount</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {providers.map((provider, idx) => (
              <motion.div 
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-100 to-transparent dark:from-slate-700 rounded-bl-full -z-0 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${provider.bg} ${provider.color}`}>
                      <provider.logo className="w-6 h-6" />
                    </div>
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {provider.type}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{provider.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Starting APR</p>
                      <p className="text-lg font-bold text-emerald-500">{provider.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Max Amount</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-200">${provider.maxAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <button className="w-full py-2.5 rounded-xl border-2 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
