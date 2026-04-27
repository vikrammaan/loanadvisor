import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, CheckCircle2, XCircle, User, Mail,
  Briefcase, DollarSign, Target, ChevronRight, RotateCcw,
  TrendingUp, Clock, Percent, BadgeCheck
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, label: 'Personal', icon: User },
  { id: 2, label: 'Financial', icon: Briefcase },
  { id: 3, label: 'Loan', icon: Target },
];

const EMPLOYMENT_OPTIONS = [
  'Employed Full-Time',
  'Employed Part-Time',
  'Self-Employed',
  'Business Owner',
  'Freelancer',
  'Student',
  'Retired',
  'Other',
];

const PURPOSE_OPTIONS = [
  'Home Improvement',
  'Debt Consolidation',
  'Business Expansion',
  'Education',
  'Medical Expenses',
  'Vehicle Purchase',
  'Wedding',
  'Travel',
  'Emergency Fund',
  'Other',
];

function InputField({ label, icon: Icon, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-2">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />}
        {children}
      </div>
      {hint && <p className="text-xs text-slate-600 mt-1.5 ml-1">{hint}</p>}
    </div>
  );
}

export default function EligibilityForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    name: '', email: '', income: '', creditScore: 700,
    employmentStatus: '', requestedAmount: '', purpose: '', tenure: '36',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setResult(null);
    setStep(1);
    setFormData({ name: '', email: '', income: '', creditScore: 700, employmentStatus: '', requestedAmount: '', purpose: '', tenure: '36' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('/api/eligibility', {
        ...formData,
        income: Number(formData.income),
        requestedAmount: Number(formData.requestedAmount),
      });
      setResult({
        eligible: response.data.eligible,
        amount: response.data.maxAmount,
        rate: response.data.rate,
      });
      toast.success(response.data.eligible ? '🎉 Pre-approval successful!' : 'Application processed.');
    } catch {
      toast.error('Failed to process application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const creditColor = formData.creditScore >= 750 ? '#34d399' : formData.creditScore >= 670 ? '#fbbf24' : '#fb7185';
  const creditLabel = formData.creditScore >= 750 ? 'Excellent' : formData.creditScore >= 700 ? 'Good' : formData.creditScore >= 670 ? 'Fair' : 'Poor';

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#e2e8f0',
    padding: '12px 16px 12px 2.75rem',
    outline: 'none',
    fontSize: '14px',
    transition: 'border-color 0.2s',
  };

  const selectStyle = { ...inputStyle, paddingLeft: '2.75rem' };

  return (
    <div className="max-w-2xl mx-auto py-2">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Loan Eligibility Check</h1>
        <p className="text-slate-500 text-sm">Get an instant pre-approval decision — no credit score impact.</p>
      </div>

      <AnimatePresence mode="wait">
        {/* ── LOADING ── */}
        {loading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="glass-card rounded-3xl p-16 text-center"
          >
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-900 border-t-indigo-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-indigo-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Analyzing your profile…</h3>
            <p className="text-slate-500 text-sm">Our AI is evaluating your eligibility and fetching the best rates.</p>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {!loading && result && (
          <motion.div key="result" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-3xl overflow-hidden"
          >
            {/* Header */}
            <div className={`p-8 text-center relative overflow-hidden ${result.eligible
              ? 'bg-gradient-to-br from-emerald-900/50 to-teal-900/30'
              : 'bg-gradient-to-br from-rose-900/50 to-red-900/30'}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent)] pointer-events-none" />
              {result.eligible ? (
                <>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/30 mb-5"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">You're Pre-Approved! 🎉</h2>
                  <p className="text-emerald-300/80 text-sm">Based on your profile, here are your personalized loan offers.</p>
                </>
              ) : (
                <>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500/30 mb-5"
                  >
                    <XCircle className="w-10 h-10 text-rose-400" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">Not Eligible Yet</h2>
                  <p className="text-rose-300/80 text-sm">Based on your income-to-loan ratio, we can't pre-approve this request right now.</p>
                </>
              )}
            </div>

            {/* Body */}
            <div className="p-8">
              {result.eligible ? (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { label: 'Max Loan Amount', value: `$${result.amount.toLocaleString()}`, icon: DollarSign, color: '#6366f1' },
                      { label: 'Interest Rate', value: `${result.rate}% p.a.`, icon: Percent, color: '#34d399' },
                      { label: 'Max Tenure', value: '60 months', icon: Clock, color: '#06b6d4' },
                    ].map(item => (
                      <div key={item.label} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <item.icon className="w-5 h-5 mx-auto mb-2" style={{ color: item.color }} />
                        <p className="text-lg font-bold text-white">{item.value}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl p-4 mb-6 flex items-start gap-3" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                    <BadgeCheck className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-300">
                      Your application has been saved. A loan specialist will contact you at <span className="text-indigo-400 font-medium">{formData.email}</span> within 1-2 business days.
                    </p>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">Ways to improve your eligibility:</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    {['Increase your annual income or add a co-applicant', 'Reduce the requested loan amount', 'Improve your credit score by paying off existing debts', 'Try applying for a secured loan instead'].map(tip => (
                      <li key={tip} className="flex items-center gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button onClick={resetForm} className="btn-primary w-full flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" /> Start New Application
              </button>
            </div>
          </motion.div>
        )}

        {/* ── FORM ── */}
        {!loading && !result && (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-8"
          >
            {/* Step indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {STEPS.map((s, i) => (
                  <div key={s.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300"
                        style={step >= s.id
                          ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }
                          : { background: 'rgba(255,255,255,0.05)', color: '#475569', border: '1px solid rgba(255,255,255,0.08)' }
                        }
                      >
                        {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                      </div>
                      <span className="text-xs mt-1.5 font-medium" style={{ color: step >= s.id ? '#a78bfa' : '#475569' }}>{s.label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-px mx-2 mb-5 transition-all duration-500"
                        style={{ background: step > s.id ? 'linear-gradient(90deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.06)' }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* STEP 1 */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <h3 className="text-lg font-semibold text-white mb-5">Personal Details</h3>
                    <InputField label="Full Name" icon={User}>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required
                        style={inputStyle} placeholder="John Doe" />
                    </InputField>
                    <InputField label="Email Address" icon={Mail} hint="We'll send your results here.">
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required
                        style={inputStyle} placeholder="john@example.com" />
                    </InputField>
                  </motion.div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <h3 className="text-lg font-semibold text-white mb-5">Financial Information</h3>

                    <InputField label="Annual Income ($)" icon={DollarSign}>
                      <input type="number" name="income" value={formData.income} onChange={handleChange} required min="1000"
                        style={inputStyle} placeholder="e.g. 60000" />
                    </InputField>

                    <InputField label="Employment Status" icon={Briefcase}>
                      <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} required style={selectStyle}>
                        <option value="" style={{ background: '#0d1220' }}>Select status...</option>
                        {EMPLOYMENT_OPTIONS.map(o => <option key={o} value={o} style={{ background: '#0d1220' }}>{o}</option>)}
                      </select>
                    </InputField>

                    {/* Credit Score Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-medium text-slate-400">Estimated Credit Score</label>
                        <span className="text-sm font-bold px-2.5 py-0.5 rounded-lg" style={{ color: creditColor, background: `${creditColor}15` }}>
                          {formData.creditScore} — {creditLabel}
                        </span>
                      </div>
                      <input
                        type="range" name="creditScore" min="300" max="850" step="10"
                        value={formData.creditScore} onChange={handleChange}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: creditColor }}
                      />
                      <div className="flex justify-between text-xs text-slate-600 mt-1.5">
                        <span>300 Poor</span><span>580 Fair</span><span>670 Good</span><span>850 Excellent</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <h3 className="text-lg font-semibold text-white mb-5">Loan Details</h3>

                    <InputField label="Requested Amount ($)" icon={DollarSign}>
                      <input type="number" name="requestedAmount" value={formData.requestedAmount} onChange={handleChange} required min="500"
                        style={inputStyle} placeholder="e.g. 25000" />
                    </InputField>

                    <InputField label="Loan Purpose" icon={Target}>
                      <select name="purpose" value={formData.purpose} onChange={handleChange} required style={selectStyle}>
                        <option value="" style={{ background: '#0d1220' }}>Select purpose...</option>
                        {PURPOSE_OPTIONS.map(o => <option key={o} value={o} style={{ background: '#0d1220' }}>{o}</option>)}
                      </select>
                    </InputField>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-medium text-slate-400">Preferred Tenure</label>
                        <span className="text-sm font-semibold text-indigo-400">{formData.tenure} months</span>
                      </div>
                      <input
                        type="range" name="tenure" min="12" max="84" step="12"
                        value={formData.tenure} onChange={handleChange}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: '#6366f1' }}
                      />
                      <div className="flex justify-between text-xs text-slate-600 mt-1.5">
                        <span>12 mo</span><span>36 mo</span><span>60 mo</span><span>84 mo</span>
                      </div>
                    </div>

                    {/* Consent note */}
                    <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                      <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-400 leading-relaxed">
                        By submitting, you authorize a <span className="text-indigo-400 font-medium">soft credit inquiry</span> that will <strong className="text-white">not</strong> affect your credit score.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {step > 1 ? (
                  <button type="button" onClick={() => setStep(step - 1)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    ← Back
                  </button>
                ) : <div />}
                <button type="submit" className="btn-primary flex items-center gap-2">
                  {step === 3 ? 'Check Eligibility' : 'Continue'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
