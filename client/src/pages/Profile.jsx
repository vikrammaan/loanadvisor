import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Camera } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState({ name: '', email: '' });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">My Profile</h1>
        <p className="text-slate-500">Manage your account information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1"
        >
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <User className="w-16 h-16 text-slate-300 mt-4" />
                </div>
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 rounded-full text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors border-4 border-white">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-slate-800">{user.name || 'User'}</h2>
            <p className="text-slate-500 text-sm mb-4">{user.email || 'user@example.com'}</p>
            <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Premium Member</span>
          </div>
        </motion.div>

        {/* Right Column - Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 md:col-span-2 space-y-6"
        >
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-4">Personal Information</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      defaultValue={user.name}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      defaultValue={user.email}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-slate-500 cursor-not-allowed" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    defaultValue="********"
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-slate-500 cursor-not-allowed mb-2" 
                  />
                </div>
                <button type="button" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">Change Password</button>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
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
