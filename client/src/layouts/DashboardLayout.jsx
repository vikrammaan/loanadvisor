import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AnimatedSidebar from '../components/AnimatedSidebar';
import TopHeader from '../components/TopHeader';
import ChatbotWidget from '../components/ChatbotWidget';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full animated-bg overflow-hidden text-slate-200">
      <AnimatedSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <ChatbotWidget />
    </div>
  );
}
