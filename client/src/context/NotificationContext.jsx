import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Security Alert', body: 'New login detected from Chrome on Windows.', time: new Date(Date.now() - 120000), dot: 'bg-rose-500', unread: true },
    { id: 2, title: 'Report Generated', body: 'Your monthly portfolio report is ready.', time: new Date(Date.now() - 3600000), dot: 'bg-emerald-500', unread: true },
    { id: 3, title: 'Rate Update', body: 'Upstart lowered their APR to 7.9%.', time: new Date(Date.now() - 10800000), dot: 'bg-indigo-500', unread: false },
  ]);

  // Simulate live incoming notifications
  useEffect(() => {
    const events = [
      { title: 'New Application', body: 'John Doe applied for a $25,000 personal loan.', dot: 'bg-indigo-500' },
      { title: 'Loan Approved', body: 'Sarah Smith\'s home loan was just approved!', dot: 'bg-emerald-500' },
      { title: 'System Alert', body: 'Lender API sync completed successfully.', dot: 'bg-blue-500' },
      { title: 'Document Uploaded', body: 'Action required: verify income documents.', dot: 'bg-amber-500' }
    ];

    const interval = setInterval(() => {
      // 30% chance to generate a new notification every 15 seconds
      if (Math.random() > 0.7) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const newNotif = {
          id: Date.now(),
          title: randomEvent.title,
          body: randomEvent.body,
          time: new Date(),
          dot: randomEvent.dot,
          unread: true
        };
        
        setNotifications(prev => [newNotif, ...prev].slice(0, 10)); // Keep last 10
        
        // Show a live toast for the new notification
        toast(
          (t) => (
            <div className="flex flex-col gap-1 cursor-pointer" onClick={() => toast.dismiss(t.id)}>
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${newNotif.dot}`} /> {newNotif.title}
              </span>
              <span className="text-xs text-slate-400">{newNotif.body}</span>
            </div>
          ),
          { duration: 4000, style: { background: '#0f172a', border: '1px solid rgba(99,102,241,0.3)' } }
        );
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
