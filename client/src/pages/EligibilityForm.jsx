import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function EligibilityForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    income: '',
    employmentStatus: '',
    requestedAmount: '',
    purpose: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post('/api/eligibility', {
          ...formData,
          income: Number(formData.income),
          requestedAmount: Number(formData.requestedAmount)
        });
        
        setResult({
          eligible: response.data.eligible,
          amount: `$${response.data.maxAmount.toLocaleString()}`,
          rate: response.data.rate ? `${response.data.rate}%` : 'N/A',
        });
      } catch (err) {
        setError('Failed to process eligibility. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Check Your Eligibility</h1>
        <p className="text-slate-500">Get an instant pre-approval decision without affecting your credit score.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden"
      >
        {/* Progress Bar */}
        {!result && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-colors ${step >= i ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {i}
                </div>
              ))}
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-600"
                initial={{ width: '0%' }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {result ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            {result.eligible ? (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">You're Pre-Approved!</h2>
                <p className="text-slate-500 mb-8">Based on your profile, here are your personalized loan offers.</p>
                
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Max Loan Amount</p>
                      <p className="text-2xl font-bold text-indigo-600">{result.amount}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Interest Rate</p>
                      <p className="text-2xl font-bold text-emerald-500">{result.rate}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 text-red-500 rounded-full mb-6">
                  <span className="text-4xl font-bold">!</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Not Eligible Currently</h2>
                <p className="text-slate-500 mb-8">Based on your income-to-loan ratio, we cannot pre-approve this loan at this time.</p>
              </>
            )}
            
            <button 
              onClick={() => {setResult(null); setStep(1); setFormData({name: '', email: '', income: '', employmentStatus: '', requestedAmount: '', purpose: ''});}}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Start New Application
            </button>
          </motion.div>
        ) : loading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Analyzing your profile...</h3>
            <p className="text-slate-500">Our AI is fetching the best rates for you.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Personal Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" />
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Financial Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Annual Income ($)</label>
                      <input type="number" name="income" value={formData.income} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Employment Status</label>
                      <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all">
                        <option value="">Select...</option>
                        <option>Employed Full-Time</option>
                        <option>Self-Employed</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Loan Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Requested Amount ($)</label>
                      <input type="number" name="requestedAmount" value={formData.requestedAmount} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Loan Purpose</label>
                      <select name="purpose" value={formData.purpose} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all">
                        <option value="">Select...</option>
                        <option>Home Improvement</option>
                        <option>Debt Consolidation</option>
                        <option>Business</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-start gap-3 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <ShieldCheck className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                    <p className="text-sm text-indigo-800">By submitting this form, you authorize us to perform a soft credit check which will not affect your credit score.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between pt-6 border-t border-slate-100">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                  Back
                </button>
              ) : <div></div>}
              <button type="submit" className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                {step === 3 ? 'Check Eligibility' : 'Continue'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
