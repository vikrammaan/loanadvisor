import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Lock, Moon, Globe, Shield } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

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
      const res = await axios.post('/api/user/settings', {
        email,
        twoFactorEnabled: twoFactor
      });
      
      // update local storage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.twoFactorEnabled = res.data.twoFactorEnabled;
        localStorage.setItem('user', JSON.stringify(user));
      }

      toast.success('Preferences saved successfully!');
    } catch (err) {
      toast.error('Failed to save preferences.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your application preferences and security.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Appearance & Language */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-500" />
            General
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-200">Dark Mode</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Switch to a dark theme for low-light environments.</p>
              </div>
              <button 
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" />
            Notifications
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-200">Email Alerts</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Receive updates about your loan applications.</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            Security
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-200">Two-Factor Authentication (2FA)</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Receive an OTP email when logging in to secure your account.</p>
              </div>
              <button 
                onClick={() => setTwoFactor(!twoFactor)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactor ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
          >
            Save Preferences
          </button>
        </div>
      </motion.div>
    </div>
  );
}
