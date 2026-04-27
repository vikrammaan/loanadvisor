import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import axios from 'axios';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I am your AI Financial Advisor. Ask me anything about loans, interest rates, or your eligibility.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Connect to the backend /api/chat which uses OpenAI (or fallback)
      const response = await axios.post('/api/chat', { 
        message: userMessage.text,
        sessionId: 'user-session-' + new Date().getDate() // Simple daily session 
      });
      
      const botMessage = { id: Date.now() + 1, sender: 'bot', text: response.data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: 'Sorry, I am having trouble connecting to my server right now. Please try again later.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-50 shadow-2xl"
            style={{ 
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 8px 32px rgba(99,102,241,0.5)'
            }}
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] rounded-2xl flex flex-col z-50 overflow-hidden glass-card shadow-2xl"
            style={{ 
              border: '1px solid var(--c-border)',
              maxHeight: 'calc(100vh - 40px)'
            }}
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between" 
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">FinAdvisor AI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-white/80 uppercase font-semibold tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: 'var(--c-bg-secondary)' }}>
                  {messages.map((msg) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id}
                      className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                        {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                      </div>
                      <div 
                        className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                          msg.sender === 'user' 
                            ? 'bg-indigo-500 text-white rounded-tr-sm' 
                            : 'bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-tl-sm border dark:border-slate-700 border-slate-200 shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                      <div className="w-7 h-7 flex-shrink-0 rounded-full bg-slate-700 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 border dark:border-slate-700 border-slate-200 flex items-center gap-1 shadow-sm">
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-slate-400" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-slate-400" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-slate-400" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-3" style={{ background: 'var(--c-header-bg)', borderTop: '1px solid var(--c-border-soft)' }}>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask a question..."
                      className="w-full pl-4 pr-12 py-3 rounded-xl text-sm transition-colors"
                      style={{ 
                        background: 'var(--c-input-bg)',
                        border: '1px solid var(--c-input-border)',
                        color: 'var(--c-text)',
                        outline: 'none'
                      }}
                    />
                    <button 
                      type="submit" 
                      disabled={!input.trim() || isTyping}
                      className="absolute right-2 p-2 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
