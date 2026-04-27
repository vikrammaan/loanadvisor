import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, Building2, TrendingDown, Landmark, Filter,
  X, CheckCircle, Clock, Star, AlertCircle, ExternalLink, BadgePercent, ShieldCheck
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const initialProviders = [
  {
    id: 1, name: 'HDFC Bank', interestRate: 10.5, maxAmount: 50000, minAmount: 1000, type: 'Bank',
    logo: Building2, color: 'text-blue-600', bg: 'bg-blue-100',
    tenure: '12-60 months', processingFee: '1%', approval: '2-3 days',
    rating: 4.2, features: ['Flexible repayment', 'No prepayment charges', 'Online application'],
    website: 'https://www.hdfcbank.com'
  },
  {
    id: 2, name: 'ICICI Bank', interestRate: 10.8, maxAmount: 40000, minAmount: 500, type: 'Bank',
    logo: Building2, color: 'text-orange-600', bg: 'bg-orange-100',
    tenure: '12-48 months', processingFee: '1.5%', approval: '1-2 days',
    rating: 4.0, features: ['Instant approval', 'Zero documentation', 'Digital process'],
    website: 'https://www.icicibank.com'
  },
  {
    id: 3, name: 'SoFi Finance', interestRate: 8.5, maxAmount: 100000, minAmount: 5000, type: 'Fintech',
    logo: Landmark, color: 'text-teal-600', bg: 'bg-teal-100',
    tenure: '24-84 months', processingFee: '0%', approval: 'Same day',
    rating: 4.6, features: ['No fees ever', 'Unemployment protection', 'Career coaching included'],
    website: 'https://www.sofi.com'
  },
  {
    id: 4, name: 'LendingClub', interestRate: 9.0, maxAmount: 40000, minAmount: 1000, type: 'P2P',
    logo: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-100',
    tenure: '36-60 months', processingFee: '2-6%', approval: '2-5 days',
    rating: 3.9, features: ['Peer-to-peer model', 'Competitive rates', 'Joint applications'],
    website: 'https://www.lendingclub.com'
  },
  {
    id: 5, name: 'State Bank of India', interestRate: 9.8, maxAmount: 75000, minAmount: 2000, type: 'Bank',
    logo: Building2, color: 'text-indigo-600', bg: 'bg-indigo-100',
    tenure: '12-72 months', processingFee: '0.5%', approval: '3-5 days',
    rating: 4.1, features: ['Lowest processing fee', 'Govt. backed', 'High loan limit'],
    website: 'https://www.sbi.co.in'
  },
  {
    id: 6, name: 'Upstart', interestRate: 7.9, maxAmount: 50000, minAmount: 1000, type: 'Fintech',
    logo: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100',
    tenure: '36-60 months', processingFee: '0-8%', approval: '1 business day',
    rating: 4.5, features: ['AI-powered approvals', 'No prepayment fee', 'Good for low credit'],
    website: 'https://www.upstart.com'
  },
  {
    id: 7, name: 'Avant', interestRate: 9.9, maxAmount: 35000, minAmount: 2000, type: 'Fintech',
    logo: BadgePercent, color: 'text-cyan-600', bg: 'bg-cyan-100',
    tenure: '24-60 months', processingFee: '4.75%', approval: 'Next business day',
    rating: 4.3, features: ['Fast funding', 'Accepts lower credit scores', 'Mobile app available'],
    website: 'https://www.avant.com'
  },
  {
    id: 8, name: 'Prosper', interestRate: 8.9, maxAmount: 50000, minAmount: 2000, type: 'P2P',
    logo: TrendingDown, color: 'text-emerald-600', bg: 'bg-emerald-100',
    tenure: '36-60 months', processingFee: '1-5%', approval: '1-3 days',
    rating: 4.0, features: ['Co-borrowers accepted', 'No prepayment penalties', 'Fixed rates'],
    website: 'https://www.prosper.com'
  },
  {
    id: 9, name: 'Discover', interestRate: 7.99, maxAmount: 40000, minAmount: 2500, type: 'Bank',
    logo: Building2, color: 'text-pink-600', bg: 'bg-pink-100',
    tenure: '36-84 months', processingFee: '0%', approval: 'Same day',
    rating: 4.7, features: ['100% US-based support', 'Flexible payment dates', 'Return funds up to 30 days'],
    website: 'https://www.discover.com/personal-loans'
  },
  {
    id: 10, name: 'Upgrade', interestRate: 8.49, maxAmount: 50000, minAmount: 1000, type: 'Fintech',
    logo: Landmark, color: 'text-fuchsia-600', bg: 'bg-fuchsia-100',
    tenure: '24-84 months', processingFee: '1.85-9.99%', approval: '1 day',
    rating: 4.4, features: ['Credit health tools', 'Direct pay to creditors', 'Hardship programs'],
    website: 'https://www.upgrade.com'
  }
];

const ALL_TYPES = ['All', 'Bank', 'Fintech', 'P2P'];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
        />
      ))}
      <span className="text-xs font-medium" style={{ color: 'var(--c-text-muted)' }}>{rating.toFixed(1)}</span>
    </div>
  );
}

function ProviderModal({ provider, onClose, onApply }) {
  if (!provider) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="glass-card rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-500/10 transition-colors"
            style={{ color: 'var(--c-text-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div 
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${provider.bg} ${provider.color}`}
            >
              <provider.logo className="w-7 h-7" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--c-text)' }}>{provider.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: 'var(--c-hover)', color: 'var(--c-text)' }}>{provider.type}</span>
                <StarRating rating={provider.rating} />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 transition-transform hover:scale-105">
              <p className="text-xs font-medium mb-1 text-emerald-500">Starting APR</p>
              <p className="text-2xl font-bold text-emerald-500">{provider.interestRate}%</p>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 transition-transform hover:scale-105">
              <p className="text-xs font-medium mb-1 text-indigo-500">Loan Range</p>
              <p className="text-lg font-bold text-indigo-500">${provider.minAmount.toLocaleString()} – ${provider.maxAmount.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: 'var(--c-hover)' }}>
              <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--c-text-muted)' }}><Clock className="w-3 h-3"/>Tenure</p>
              <p className="text-sm font-bold" style={{ color: 'var(--c-text)' }}>{provider.tenure}</p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: 'var(--c-hover)' }}>
              <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--c-text-muted)' }}><AlertCircle className="w-3 h-3"/>Processing Fee</p>
              <p className="text-sm font-bold" style={{ color: 'var(--c-text)' }}>{provider.processingFee}</p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--c-text)' }}>Key Features</p>
            <ul className="space-y-2">
              {provider.features.map((f, i) => (
                <motion.li 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--c-text-muted)' }}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {f}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Approval time */}
          <div className="flex items-center gap-2 mb-6 p-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10">
            <Clock className="w-4 h-4 text-yellow-500" />
            <p className="text-sm text-yellow-600 dark:text-yellow-400"><span className="font-semibold">Approval time:</span> {provider.approval}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => { window.open(provider.website, '_blank'); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold transition-colors"
              style={{ borderColor: 'var(--c-border)', color: 'var(--c-text)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--c-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <ExternalLink className="w-4 h-4" /> Visit Site
            </button>
            <button
              onClick={() => onApply(provider)}
              className="btn-primary flex-1 py-3 text-center"
            >
              Apply Now →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Marketplace() {
  const [providers, setProviders] = useState(initialProviders);
  const [sortOption, setSortOption] = useState('default');
  const [typeFilter, setTypeFilter] = useState('All');
  const [amountFilter, setAmountFilter] = useState(100000);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // AI State
  const [loanAmount, setLoanAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  // Memoized Filter & Sort
  const filteredProviders = useMemo(() => {
    let result = providers.filter(p => p.maxAmount >= amountFilter);
    if (typeFilter !== 'All') {
      result = result.filter(p => p.type === typeFilter);
    }

    if (sortOption === 'interest_low') result.sort((a, b) => a.interestRate - b.interestRate);
    if (sortOption === 'amount_high') result.sort((a, b) => b.maxAmount - a.maxAmount);
    if (sortOption === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [providers, typeFilter, sortOption, amountFilter]);

  const getRecommendation = async (e) => {
    e.preventDefault();
    if (!loanAmount || !purpose) {
      toast.error('Please enter both amount and purpose');
      return;
    }
    if (loanAmount < 100) {
      toast.error('Minimum loan amount is $100');
      return;
    }

    setLoadingAI(true);
    setAiRecommendation('');
    
    try {
      const res = await axios.post('/api/ai-recommendation', {
        amount: loanAmount,
        purpose,
        providers: providers.map(p => ({ name: p.name, interestRate: p.interestRate, maxAmount: p.maxAmount }))
      });
      setAiRecommendation(res.data.recommendation);
      toast.success('AI recommendation generated successfully!');
    } catch (error) {
      setAiRecommendation("Sorry, our AI is currently taking a break. Please review the options manually.");
      toast.error('Failed to get AI recommendation.');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleApply = (provider) => {
    setSelectedProvider(null);
    toast.success(`Redirecting you to ${provider.name}'s secure application...`, { duration: 3000 });
    setTimeout(() => window.open(provider.website, '_blank'), 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      {selectedProvider && (
        <ProviderModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
          onApply={handleApply}
        />
      )}

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--c-text)' }}>Loan Marketplace</h1>
        <p style={{ color: 'var(--c-text-muted)' }}>Compare {initialProviders.length} top providers and let AI find your perfect match.</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Filters & AI */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* AI Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10">
              <motion.div 
                animate={{ boxShadow: ['0 0 0px rgba(253,224,71,0)', '0 0 20px rgba(253,224,71,0.5)', '0 0 0px rgba(253,224,71,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-6 backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                AI Smart Match
              </motion.div>

              <h2 className="text-2xl font-bold mb-2">Unsure who to choose?</h2>
              <p className="text-indigo-100 mb-6 text-sm">Tell us what you need and our AI will recommend the absolute best provider.</p>

              <form onSubmit={getRecommendation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-1">Loan Amount ($)</label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    placeholder="e.g. 25000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-1">Purpose</label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    placeholder="e.g. Home Renovation"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loadingAI}
                  className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg"
                >
                  {loadingAI ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    <>Get Recommendation <ArrowRight className="w-4 h-4" /></>
                  )}
                </motion.button>
              </form>

              <AnimatePresence>
                {aiRecommendation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, mt: 0 }}
                    animate={{ opacity: 1, height: 'auto', mt: 24 }}
                    exit={{ opacity: 0, height: 0, mt: 0 }}
                    className="p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md text-sm leading-relaxed overflow-hidden"
                  >
                    <p className="font-semibold text-yellow-300 flex items-center gap-1 mb-2">
                      <Sparkles className="w-4 h-4" /> Recommended for You
                    </p>
                    {aiRecommendation}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* New Slider Filter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-6"
          >
            <h3 className="font-semibold mb-4 text-sm flex items-center justify-between" style={{ color: 'var(--c-text)' }}>
              <span>Filter by Max Amount</span>
              <span className="text-indigo-500 font-bold">${amountFilter.toLocaleString()}</span>
            </h3>
            <input 
              type="range" 
              min="10000" 
              max="100000" 
              step="5000"
              value={amountFilter} 
              onChange={(e) => setAmountFilter(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer" 
            />
            <div className="flex justify-between mt-2 text-xs font-medium" style={{ color: 'var(--c-text-muted)' }}>
              <span>$10k</span>
              <span>$100k</span>
            </div>
          </motion.div>

        </div>

        {/* Right Column - Provider Grid */}
        <div className="xl:col-span-2">
          {/* Toolbar */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 mb-6 p-4 rounded-2xl glass-card shadow-sm"
          >
            {/* Type Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {ALL_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    typeFilter === type
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={typeFilter !== type ? { background: 'var(--c-hover)', color: 'var(--c-text)' } : {}}
                >
                  {type}
                </button>
              ))}
            </div>
            
            {/* Sort */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 font-medium text-sm" style={{ color: 'var(--c-text)' }}>
                <Filter className="w-4 h-4 text-indigo-500" />
                <span>{filteredProviders.length} providers found</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: 'var(--c-text-muted)' }}>Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="input-dark text-sm py-1.5 px-3 rounded-lg outline-none cursor-pointer"
                >
                  <option value="default">Featured</option>
                  <option value="interest_low">Lowest Interest Rate</option>
                  <option value="amount_high">Highest Loan Amount</option>
                  <option value="rating">Best Rated</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Grid */}
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProviders.map((provider) => (
                <motion.div
                  variants={itemVariants}
                  key={provider.id}
                  layout
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="glass-card card-hover rounded-3xl p-6 relative overflow-hidden group"
                >
                  {/* Decorative background circle */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700 ease-out pointer-events-none"
                    style={{ background: `linear-gradient(135deg, transparent, currentColor)` }} 
                    color={provider.color.replace('text-', '')} // Simple visual hack
                  />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${provider.bg} ${provider.color}`}>
                        <provider.logo className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ background: 'var(--c-hover)', color: 'var(--c-text)' }}>
                        {provider.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--c-text)' }}>{provider.name}</h3>
                    <StarRating rating={provider.rating} />

                    <div className="grid grid-cols-2 gap-3 my-4">
                      <div className="bg-emerald-500/10 rounded-xl p-2 px-3 border border-emerald-500/20">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-500 mb-0.5">Starting APR</p>
                        <p className="text-lg font-bold text-emerald-500">{provider.interestRate}%</p>
                      </div>
                      <div className="bg-indigo-500/10 rounded-xl p-2 px-3 border border-indigo-500/20">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-500 mb-0.5">Max Amount</p>
                        <p className="text-lg font-bold text-indigo-500">${(provider.maxAmount / 1000).toFixed(0)}k</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mb-5 text-xs font-medium" style={{ color: 'var(--c-text-muted)' }}>
                      <Clock className="w-4 h-4" />
                      <span>Approve: {provider.approval}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProvider(provider)}
                        className="flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm transition-colors"
                        style={{ borderColor: 'var(--c-border)', color: 'var(--c-text)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--c-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleApply(provider)}
                        className="flex-1 py-2.5 rounded-xl btn-primary text-sm font-bold shadow-lg shadow-indigo-500/25"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredProviders.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-slate-500/10 rounded-full flex items-center justify-center mb-4">
                  <Filter className="w-8 h-8" style={{ color: 'var(--c-text-muted)' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--c-text)' }}>No providers found</h3>
                <p style={{ color: 'var(--c-text-muted)' }}>Try adjusting your filters or increasing the loan amount slider.</p>
                <button 
                  onClick={() => { setTypeFilter('All'); setAmountFilter(100000); }}
                  className="mt-4 px-6 py-2 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
