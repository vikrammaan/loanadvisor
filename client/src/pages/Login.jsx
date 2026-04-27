import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Zap, Key, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(endpoint, { email, password });
      if (response.data.requiresOTP) {
        setStep('otp');
        toast.success('OTP sent to your email!', { icon: '📧' });
      } else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Welcome back!', { icon: '🎉' });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
      const msg = err.response?.data?.error || err.message || 'Authentication failed. Please try again.';
      toast.error(msg, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email first');
    setResetLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setStep('reset');
      toast.success('Reset OTP sent to your email!', { icon: '📧' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reset OTP');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/reset-password', { email, otp, newPassword });
      toast.success(response.data.message, { icon: '✅' });
      setStep('auth');
      setIsLogin(true);
      setOtp('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/verify-otp', { email, otp });
      const token = response.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Verified! Welcome aboard.', { icon: '✅' });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid OTP. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden relative" style={{ background: '#060a11' }}>
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(99,102,241,0.12)' }} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(168,85,247,0.08)' }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Fin<span className="text-indigo-400">Advisor</span></span>
          </div>
          <p className="text-slate-500 text-sm">Real-Time Loan Eligibility & AI Insights</p>
        </div>

        <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(30px)', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>

          {/* Tab toggle */}
          {step === 'auth' && (
            <div className="flex rounded-xl p-1 mb-8" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <button
                onClick={() => setIsLogin(true)}
                className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
                style={isLogin ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' } : { color: '#94a3b8' }}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
                style={!isLogin ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' } : { color: '#94a3b8' }}
              >
                Create Account
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3">
                <Key className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Verify Your Identity</h2>
              <p className="text-sm text-slate-500 mt-1">We sent a 6-digit code to <span className="text-indigo-400">{email}</span></p>
            </div>
          )}

          {step === 'reset' && (
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Reset Password</h2>
              <p className="text-sm text-slate-500 mt-1">Enter the OTP and your new password.</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'auth' ? (
              <motion.form
                key="auth"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleAuthSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email" required value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input-dark"
                      style={{ paddingLeft: '2.75rem' }}
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-medium text-slate-400">Password</label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        {resetLoading ? 'Sending...' : 'Forgot Password?'}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'} required value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="input-dark"
                      style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                  {loading
                    ? <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Processing...</span>
                    : <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </motion.form>
            ) : step === 'otp' ? (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleOtpSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Verification Code</label>
                  <input
                    type="text" required value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="input-dark text-center text-xl tracking-widest font-bold"
                    placeholder="• • • • • •"
                    maxLength={6}
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }}>
                  {loading ? 'Verifying...' : <>Verify & Continue <ArrowRight className="w-4 h-4" /></>}
                </button>
                <button type="button" onClick={() => { setStep('auth'); setOtp(''); }} className="w-full text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors py-2 rounded-xl hover:bg-white/5">
                  ← Back to login
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="reset"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleResetSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Verification Code</label>
                  <input
                    type="text" required value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="input-dark text-center text-xl tracking-widest font-bold"
                    placeholder="• • • • • •"
                    maxLength={6}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password" required value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="input-dark"
                      style={{ paddingLeft: '2.75rem' }}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                  {loading ? 'Resetting...' : <>Reset Password <ArrowRight className="w-4 h-4" /></>}
                </button>
                <button type="button" onClick={() => { setStep('auth'); setOtp(''); }} className="w-full text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors py-2 rounded-xl hover:bg-white/5">
                  ← Cancel
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © 2025 FinAdvisor. Secure & encrypted.
        </p>
      </motion.div>
    </div>
  );
}
