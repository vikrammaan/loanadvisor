import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Moon, Shield, Globe, ChevronRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

function Toggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
      style={{ background: enabled ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.1)', boxShadow: enabled ? '0 0 12px rgba(99,102,241,0.4)' : 'none' }}
    >
      <motion.span
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

function SettingRow({ icon: Icon, iconColor, title, description, children }) {
  return (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${iconColor}15` }}>
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">{title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setEmail(user.email);
      setTwoFactor(user.twoFactorEnabled || false);
    }
  }, []);

  const handleSave = async () => {
    try {
      const res = await axios.post('/api/user/settings', { email, twoFactorEnabled: twoFactor });
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.twoFactorEnabled = res.data.twoFactorEnabled;
        localStorage.setItem('user', JSON.stringify(user));
      }
      toast.success('Preferences saved!');
    } catch {
      toast.error('Failed to save preferences.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-2">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your preferences and account security.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

        {/* Appearance */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Appearance</h2>
          </div>
          <SettingRow icon={Moon} iconColor="#a78bfa" title="Dark Mode" description="Switch between dark and light theme.">
            <Toggle enabled={isDark} onToggle={toggleTheme} />
          </SettingRow>
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Notifications</h2>
          </div>
          <SettingRow icon={Bell} iconColor="#06b6d4" title="Email Alerts" description="Receive updates about your loan applications.">
            <Toggle enabled={notifications} onToggle={() => setNotifications(v => !v)} />
          </SettingRow>
        </div>

        {/* Security */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Security</h2>
          </div>
          <SettingRow icon={Shield} iconColor="#10b981" title="Two-Factor Authentication" description="Require an OTP email on every login.">
            <Toggle enabled={twoFactor} onToggle={() => setTwoFactor(v => !v)} />
          </SettingRow>
          <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <p className="text-xs text-slate-400 leading-relaxed">
              {twoFactor
                ? '🔒 2FA is enabled. You will be asked to verify your email OTP each time you sign in.'
                : '⚠️ 2FA is disabled. Enable it for extra security — you\'ll get an OTP on login.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary w-full text-center"
        >
          Save All Preferences
        </button>
      </motion.div>
    </div>
  );
}
