import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, Building2, TrendingDown, Landmark, Filter,
  X, CheckCircle, Clock, Star, AlertCircle, ExternalLink
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
    logo: Landmark, color: 'text-purple-600', bg: 'bg-purple-100',
    tenure: '36-60 months', processingFee: '0-8%', approval: '1 business day',
    rating: 4.5, features: ['AI-powered approvals', 'No prepayment fee', 'Good for low credit'],
    website: 'https://www.upstart.com'
  },
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
      <span className="text-xs text-slate-500 ml-1">{rating.toFixed(1)}</span>
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${provider.bg} ${provider.color}`}>
              <provider.logo className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{provider.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold px-2 py-0.5 rounded-md">{provider.type}</span>
                <StarRating rating={provider.rating} />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">Starting APR</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{provider.interestRate}%</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4">
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">Loan Range</p>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${provider.minAmount.toLocaleString()} – ${provider.maxAmount.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
              <p className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/>Tenure</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{provider.tenure}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
              <p className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>Processing Fee</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{provider.processingFee}</p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">Key Features</p>
            <ul className="space-y-2">
              {provider.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Approval time */}
          <div className="flex items-center gap-2 mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <Clock className="w-4 h-4 text-yellow-600" />
            <p className="text-sm text-yellow-700 dark:text-yellow-400"><span className="font-semibold">Approval time:</span> {provider.approval}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => { window.open(provider.website, '_blank'); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Visit Site
            </button>
            <button
              onClick={() => onApply(provider)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
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
  const [selectedProvider, setSelectedProvider] = useState(null);

  // AI State
  const [loanAmount, setLoanAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const handleSort = (value) => {
    setSortOption(value);
    let sorted = [...initialProviders];
    if (value === 'interest_low') sorted.sort((a, b) => a.interestRate - b.interestRate);
    if (value === 'amount_high') sorted.sort((a, b) => b.maxAmount - a.maxAmount);
    if (value === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    setProviders(sorted);
  };

  const filteredProviders = typeFilter === 'All'
    ? providers
    : providers.filter(p => p.type === typeFilter);

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
      toast.success('AI recommendation ready!');
    } catch (error) {
      setAiRecommendation("Sorry, I couldn't generate a recommendation right now. Please try again.");
      toast.error('Failed to get AI recommendation.');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleApply = (provider) => {
    setSelectedProvider(null);
    toast.success(`Redirecting you to ${provider.name}'s application...`);
    setTimeout(() => window.open(provider.website, '_blank'), 800);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Provider Detail Modal */}
      {selectedProvider && (
        <ProviderModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
          onApply={handleApply}
        />
      )}

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
              <p className="text-indigo-100 mb-6 text-sm">Tell us what you need and our AI will recommend the best provider.</p>

              <form onSubmit={getRecommendation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-1">Loan Amount ($)</label>
                  <input
                    type="number"
                    required
                    min="100"
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
                  {loadingAI ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    <>Get AI Recommendation <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <AnimatePresence>
                {aiRecommendation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md text-sm leading-relaxed"
                  >
                    <p className="font-semibold text-yellow-300 flex items-center gap-1 mb-2">
                      <Sparkles className="w-4 h-4" /> AI Recommendation
                    </p>
                    {aiRecommendation}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 text-sm">Market Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">Lowest Rate Available</span>
                <span className="font-bold text-emerald-500">7.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">Max Loan Available</span>
                <span className="font-bold text-indigo-600">$100,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">Fastest Approval</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">Same Day</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">Total Providers</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{initialProviders.length}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Provider Grid */}
        <div className="lg:col-span-2">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 mb-6 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            {/* Type Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {ALL_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    typeFilter === type
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            
            {/* Sort */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium text-sm">
                <Filter className="w-4 h-4 text-indigo-500" />
                <span>{filteredProviders.length} providers shown</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => handleSort(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="default">Featured</option>
                  <option value="interest_low">Lowest Interest Rate</option>
                  <option value="amount_high">Highest Loan Amount</option>
                  <option value="rating">Best Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6" layout>
            <AnimatePresence>
              {filteredProviders.map((provider, idx) => (
                <motion.div
                  key={provider.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-100 to-transparent dark:from-slate-700 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${provider.bg} ${provider.color}`}>
                        <provider.logo className="w-6 h-6" />
                      </div>
                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-lg">
                        {provider.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{provider.name}</h3>
                    <StarRating rating={provider.rating} />

                    <div className="grid grid-cols-2 gap-3 my-4">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Starting APR</p>
                        <p className="text-xl font-bold text-emerald-500">{provider.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Max Amount</p>
                        <p className="text-xl font-bold text-slate-700 dark:text-slate-200">${provider.maxAmount.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-4 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Approval: {provider.approval}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProvider(provider)}
                        className="flex-1 py-2.5 rounded-xl border-2 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleApply(provider)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-md shadow-indigo-500/20"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredProviders.length === 0 && (
              <div className="col-span-2 text-center py-16 text-slate-400 dark:text-slate-500">
                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No providers found for this filter.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
