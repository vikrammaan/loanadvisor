import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Camera, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [name, setName] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setName(parsed.name || '');
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    // Update local storage
    const updated = { ...user, name };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
    toast.success('Profile updated!');
  };

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="max-w-4xl mx-auto py-2">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">My Profile</h1>
        <p className="text-slate-500 text-sm">Manage your personal information and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-1">
          <div className="glass-card rounded-3xl p-7 flex flex-col items-center text-center">
            <div className="relative mb-5">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold" style={{ boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}>
                {initials}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-xl text-white flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-colors border-2 border-[#080c14]">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <h2 className="text-lg font-bold text-white">{user.name || 'User'}</h2>
            <p className="text-slate-500 text-sm mb-4">{user.email || 'user@example.com'}</p>
            <span className="badge badge-emerald">Premium Member</span>

            <div className="mt-6 w-full space-y-3 text-left">
              {[
                { label: 'Email Verified', ok: true },
                { label: 'Identity Verified', ok: true },
                { label: '2FA Enabled', ok: user.twoFactorEnabled },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <span className="text-xs text-slate-400">{item.label}</span>
                  <CheckCircle className={`w-4 h-4 ${item.ok ? 'text-emerald-400' : 'text-slate-600'}`} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2">
          <div className="glass-card rounded-3xl p-7">
            <h3 className="text-base font-semibold text-slate-200 mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              Personal Information
            </h3>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="input-dark pl-10"
                      placeholder="Your name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="input-dark pl-10 opacity-50 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 ml-1">Email cannot be changed.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Password</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    defaultValue="••••••••"
                    disabled
                    className="input-dark pl-10 opacity-50 cursor-not-allowed"
                  />
                </div>
                <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium mt-2 ml-1 transition-colors">
                  Change Password →
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
