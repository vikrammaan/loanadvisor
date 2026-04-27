import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function EMICalculator() {
  const [amount, setAmount] = useState(50000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(5);
  const [emi, setEmi] = useState(0);

  useEffect(() => {
    // EMI Formula: P x R x (1+R)^N / [(1+R)^N-1]
    const p = amount;
    const r = rate / 12 / 100;
    const n = tenure * 12;
    if (p > 0 && r > 0 && n > 0) {
      const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmi(Math.round(emiValue));
    } else {
      setEmi(0);
    }
  }, [amount, rate, tenure]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">EMI Calculator</h1>
        <p className="text-slate-500">Plan your loans with our interactive and real-time EMI calculator.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sliders Container */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
        >
          {/* Amount Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <label className="text-slate-700 font-medium">Loan Amount</label>
              <div className="text-2xl font-bold text-indigo-600">${amount.toLocaleString()}</div>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="500000" 
              step="1000"
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
              <span>$1K</span>
              <span>$500K</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <label className="text-slate-700 font-medium">Interest Rate (p.a)</label>
              <div className="text-2xl font-bold text-indigo-600">{rate}%</div>
            </div>
            <input 
              type="range" 
              min="1" 
              max="30" 
              step="0.1"
              value={rate} 
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Tenure Slider */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <label className="text-slate-700 font-medium">Tenure (Years)</label>
              <div className="text-2xl font-bold text-indigo-600">{tenure} Yr</div>
            </div>
            <input 
              type="range" 
              min="1" 
              max="30" 
              step="1"
              value={tenure} 
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
              <span>1 Yr</span>
              <span>30 Yrs</span>
            </div>
          </div>
        </motion.div>

        {/* Results Container */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-30 mix-blend-screen pointer-events-none -mt-20 -mr-20" />
          
          <div className="relative z-10 flex flex-col h-full justify-center">
            <div className="text-center mb-10">
              <p className="text-slate-400 font-medium mb-2">Equated Monthly Installment (EMI)</p>
              <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                ${emi.toLocaleString()}
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-slate-300">Principal Amount</span>
                <span className="font-semibold">${amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-slate-300">Total Interest</span>
                <span className="font-semibold">${((emi * tenure * 12) - amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="text-indigo-200 font-medium">Total Payment</span>
                <span className="font-bold">${(emi * tenure * 12).toLocaleString()}</span>
              </div>
            </div>

            <button className="w-full mt-8 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-4 rounded-xl transition-colors shadow-lg shadow-indigo-500/25">
              Apply for this Loan
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
