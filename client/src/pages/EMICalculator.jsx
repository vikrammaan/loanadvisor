import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  Calculator, TrendingUp, DollarSign, Clock, ArrowRight,
  Download, RefreshCw, Info, Percent, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LOAN_PRESETS = [
  { label: 'Home Loan',     amount: 300000, rate: 8.5,  tenure: 20 },
  { label: 'Car Loan',      amount: 30000,  rate: 9.5,  tenure: 5  },
  { label: 'Personal Loan', amount: 15000,  rate: 11.0, tenure: 3  },
  { label: 'Education',     amount: 50000,  rate: 7.5,  tenure: 7  },
  { label: 'Business',      amount: 100000, rate: 10.0, tenure: 5  },
];

const PIE_COLORS = ['#6366f1', '#f59e0b'];

const darkTooltip = {
  background: '#0d1220',
  border: '1px solid rgba(99,102,241,0.2)',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '12px',
};

function SliderField({ label, value, min, max, step, onChange, display, minLabel, maxLabel, accentColor = '#6366f1' }) {
  return (
    <div className="mb-7">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-medium text-slate-400">{label}</label>
        <span className="text-lg font-bold text-white px-3 py-1 rounded-xl" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}>
          {display}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step}
        value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ accentColor }}
      />
      <div className="flex justify-between mt-2 text-xs text-slate-600">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

export default function EMICalculator() {
  const navigate = useNavigate();
  const [amount, setAmount]         = useState(50000);
  const [rate, setRate]             = useState(10.5);
  const [tenure, setTenure]         = useState(5);
  const [showSchedule, setShowSchedule] = useState(false);
  const [activePreset, setActivePreset] = useState(null);

  const months = tenure * 12;
  const r      = rate / 12 / 100;
  const emi    = useMemo(() => {
    if (amount > 0 && r > 0 && months > 0) {
      return Math.round((amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
    }
    return 0;
  }, [amount, r, months]);

  const totalPayment  = emi * months;
  const totalInterest = Math.round(totalPayment - amount);
  const interestPct   = Math.round((totalInterest / totalPayment) * 100);

  // Yearly amortization schedule (grouped by year)
  const yearlySchedule = useMemo(() => {
    const rows = [];
    let balance = amount;
    for (let y = 1; y <= tenure; y++) {
      let yearPrincipal = 0, yearInterest = 0;
      for (let m = 0; m < 12; m++) {
        const int  = balance * r;
        const prin = emi - int;
        yearInterest  += int;
        yearPrincipal += prin;
        balance       -= prin;
      }
      rows.push({
        year: `Yr ${y}`,
        principal: Math.round(yearPrincipal),
        interest:  Math.round(yearInterest),
        balance:   Math.max(0, Math.round(balance)),
      });
    }
    return rows;
  }, [amount, r, emi, tenure]);

  // Pie data
  const pieData = [
    { name: 'Principal', value: amount },
    { name: 'Interest',  value: totalInterest },
  ];

  const applyPreset = (preset, idx) => {
    setAmount(preset.amount);
    setRate(preset.rate);
    setTenure(preset.tenure);
    setActivePreset(idx);
  };

  const reset = () => {
    setAmount(50000); setRate(10.5); setTenure(5); setActivePreset(null);
  };

  const handleDownload = () => {
    const rows = [
      ['Year', 'Principal Paid', 'Interest Paid', 'Remaining Balance'],
      ...yearlySchedule.map(r => [r.year, `$${r.principal.toLocaleString()}`, `$${r.interest.toLocaleString()}`, `$${r.balance.toLocaleString()}`]),
      [],
      ['EMI', `$${emi.toLocaleString()}`],
      ['Total Interest', `$${totalInterest.toLocaleString()}`],
      ['Total Payment', `$${totalPayment.toLocaleString()}`],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'emi-schedule.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto py-2">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">EMI Calculator</h1>
          <p className="text-slate-500 text-sm">Plan your loan with real-time interactive calculations.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium btn-primary">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Loan Type Presets */}
      <div className="flex gap-3 flex-wrap mb-6">
        {LOAN_PRESETS.map((p, i) => (
          <button key={p.label} onClick={() => applyPreset(p, i)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={activePreset === i
              ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }
              : { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── LEFT: Sliders ── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-card rounded-3xl p-7"
        >
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" /> Loan Parameters
          </h2>

          <SliderField label="Loan Amount" value={amount} min={1000} max={1000000} step={1000}
            display={`$${amount.toLocaleString()}`} minLabel="$1K" maxLabel="$1M"
            onChange={setAmount} />

          <SliderField label="Interest Rate (p.a.)" value={rate} min={1} max={30} step={0.1}
            display={`${rate.toFixed(1)}%`} minLabel="1%" maxLabel="30%"
            onChange={setRate} accentColor="#f59e0b" />

          <SliderField label="Loan Tenure" value={tenure} min={1} max={30} step={1}
            display={`${tenure} yr${tenure > 1 ? 's' : ''}`} minLabel="1 yr" maxLabel="30 yrs"
            onChange={setTenure} accentColor="#06b6d4" />

          {/* Manual Input Fields */}
          <div className="border-t pt-5 mt-1 space-y-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-xs text-slate-500 mb-3">Or type exact values:</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Amount $', value: amount, set: setAmount, prefix: '$' },
                { label: 'Rate %', value: rate, set: setRate, step: '0.1' },
                { label: 'Years', value: tenure, set: setTenure },
              ].map(({ label, value, set, step }) => (
                <div key={label}>
                  <label className="block text-xs text-slate-500 mb-1">{label}</label>
                  <input type="number" value={value} step={step || 1}
                    onChange={e => set(Number(e.target.value))}
                    className="input-dark text-sm py-2 px-3 text-center"
                    style={{ borderRadius: '10px', padding: '8px 12px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT: Results ── */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* EMI Hero Card */}
          <div className="rounded-3xl p-7 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1050 0%, #0f1730 60%, #0a1525 100%)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/15 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10 text-center mb-7">
              <p className="text-slate-400 text-sm mb-2">Monthly EMI</p>
              <motion.div key={emi} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-black text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #ffffff, #a78bfa)' }}
              >
                ${emi.toLocaleString()}
              </motion.div>
              <p className="text-xs text-slate-500 mt-2">per month for {months} months</p>
            </div>

            <div className="grid grid-cols-3 gap-4 relative z-10">
              {[
                { label: 'Principal', value: `$${amount.toLocaleString()}`, icon: DollarSign, color: '#6366f1' },
                { label: 'Total Interest', value: `$${totalInterest.toLocaleString()}`, icon: Percent, color: '#f59e0b' },
                { label: 'Total Payment', value: `$${totalPayment.toLocaleString()}`, icon: TrendingUp, color: '#34d399' },
              ].map(item => (
                <div key={item.label} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <item.icon className="w-4 h-4 mx-auto mb-2" style={{ color: item.color }} />
                  <p className="text-sm font-bold text-white">{item.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 relative z-10">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Principal ({100 - interestPct}%)</span>
                <span>Interest ({interestPct}%)</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div className="h-full rounded-l-full" style={{ background: '#6366f1' }}
                  animate={{ width: `${100 - interestPct}%` }} transition={{ duration: 0.5 }} />
                <motion.div className="h-full rounded-r-full" style={{ background: '#f59e0b' }}
                  animate={{ width: `${interestPct}%` }} transition={{ duration: 0.5 }} />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Pie */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-400" /> Principal vs Interest
              </h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                    paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={darkTooltip} formatter={v => `$${Number(v).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-xs text-slate-400">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Yearly bar chart */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Yearly Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={yearlySchedule.slice(0, 10)} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={darkTooltip} formatter={v => `$${Number(v).toLocaleString()}`} />
                  <Bar dataKey="principal" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="interest"  stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" /> Smart Loan Tips
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { tip: 'A 1% lower interest rate saves you', calc: `$${Math.round(((amount * (rate / 12 / 100)) - (amount * ((rate - 1) / 12 / 100))) * months).toLocaleString()}`, icon: '💡' },
                { tip: '5 extra years of tenure costs you', calc: `+$${Math.round((emi * (tenure + 5) * 12) - totalPayment).toLocaleString()} more`, icon: '⏳' },
                { tip: 'Paying 10% more EMI cuts tenure by', calc: `~${Math.round(months * 0.14)} months`, icon: '🚀' },
                { tip: 'Your interest-to-principal ratio is', calc: `${interestPct}% interest`, icon: '📊' },
              ].map(item => (
                <div key={item.tip} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs text-slate-500">{item.tip}</p>
                    <p className="text-sm font-bold text-white mt-0.5">{item.calc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Apply CTA */}
          <div className="flex gap-3">
            <button onClick={() => navigate('/eligibility')} className="btn-primary flex-1 flex items-center justify-center gap-2">
              Check Full Eligibility <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/marketplace')} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              Compare Lenders <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── Amortization Table Toggle ── */}
      <div className="mt-6">
        <button onClick={() => setShowSchedule(v => !v)}
          className="w-full flex items-center justify-between p-5 glass-card rounded-2xl text-left"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span className="font-semibold text-slate-200">Yearly Amortization Schedule</span>
            <span className="badge badge-indigo">{tenure} years</span>
          </div>
          {showSchedule ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        <AnimatePresence>
          {showSchedule && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card rounded-b-2xl overflow-x-auto mt-1">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['Year', 'Principal Paid', 'Interest Paid', 'Total Paid', 'Balance'].map(h => (
                        <th key={h} className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {yearlySchedule.map((row, i) => (
                      <tr key={i} className="transition-colors hover:bg-white/5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="py-3.5 px-5 font-semibold text-slate-300">{row.year}</td>
                        <td className="py-3.5 px-5 text-indigo-400 font-medium">${row.principal.toLocaleString()}</td>
                        <td className="py-3.5 px-5 text-amber-400 font-medium">${row.interest.toLocaleString()}</td>
                        <td className="py-3.5 px-5 text-slate-300">${(row.principal + row.interest).toLocaleString()}</td>
                        <td className="py-3.5 px-5 text-emerald-400">${row.balance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
