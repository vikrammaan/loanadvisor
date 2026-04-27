import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState('auth'); // 'auth' or 'otp'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(endpoint, {
        email,
        password
      });
      
      if (response.data.requiresOTP) {
        setStep('otp');
        toast.success('An OTP has been sent to your email!');
      } else {
        // Store token directly (2FA disabled)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Successfully logged in!');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
      toast.error(err.response?.data?.error || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/auth/verify-otp', {
        email,
        otp
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success('Verification successful!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please try again.');
      toast.error(err.response?.data?.error || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-slate-900 transition-colors">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent mix-blend-multiply" />
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-[120px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-md p-8 sm:p-10"
      >
        <div className="glass-card rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

          <div className="mb-8 text-center relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 mb-4 border border-indigo-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">FinAdvisor</h1>
            <p className="text-slate-300 text-sm">
              {step === 'auth' ? 'Real-time Loan Eligibility & Insights' : 'Verify your identity'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center relative z-10">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'auth' ? (
              <motion.form 
                key="auth-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleAuthSubmit} 
                className="space-y-5 relative z-10"
              >
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-70"
                >
                  {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </motion.button>
                
                <div className="mt-8 text-center relative z-10">
                  <p className="text-sm text-slate-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                      onClick={() => setIsLogin(!isLogin)}
                      type="button"
                      className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                      {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                  </p>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="otp-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleOtpSubmit} 
                className="space-y-5 relative z-10"
              >
                <div className="space-y-1 text-center mb-6">
                  <p className="text-sm text-slate-300">We've sent a 6-digit verification code to <span className="font-semibold text-white">{email}</span></p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300 ml-1">Verification Code</label>
                  <div className="relative group">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="text" 
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full text-center tracking-widest text-xl bg-slate-800/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-70"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </motion.button>
                
                <div className="mt-8 text-center relative z-10">
                  <button 
                    onClick={() => { setStep('auth'); setOtp(''); }}
                    type="button"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    ← Back to Login
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
