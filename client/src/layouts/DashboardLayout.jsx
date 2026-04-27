import { Outlet } from 'react-router-dom';
import AnimatedSidebar from '../components/AnimatedSidebar';
import TopHeader from '../components/TopHeader';
import ChatbotWidget from '../components/ChatbotWidget';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
      {/* Sidebar */}
      <AnimatedSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <TopHeader />
        
        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Chatbot */}
      <ChatbotWidget />
    </div>
  );
}
