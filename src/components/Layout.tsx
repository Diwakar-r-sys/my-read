import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Clock, BookOpen, Youtube, AlertTriangle, CheckCircle, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { emergencyMode, toggleEmergencyMode, checkIns, submitMorningCheckIn, submitEveningCheckIn, activeTab, setActiveTab } = useApp();
  const [showMorningCheckIn, setShowMorningCheckIn] = useState(false);
  const [showEveningCheckIn, setShowEveningCheckIn] = useState(false);

  // Check for check-ins
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const today = now.toISOString().split('T')[0];
      const todayCheckIn = checkIns.find(c => c.date === today);

      // Morning check-in (08:00 - 10:00) - simplified logic for prototype
      if (hour >= 8 && hour < 12 && !todayCheckIn) {
        setShowMorningCheckIn(true);
      }

      // Evening check-in (22:00 - 23:59)
      if (hour >= 22 && (!todayCheckIn || !todayCheckIn.eveningSummary)) {
        setShowEveningCheckIn(true);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkIns]);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'timeline': return '24h Timeline';
      case 'exam': return 'Exam Tracker';
      case 'youtube': return 'YouTube Growth';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-blue-500">DOUBLE<span className="text-white">SPRINT</span></h1>
          <p className="text-xs text-slate-500 mt-1">30 Days to Glory</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavButton 
            icon={<LayoutDashboard size={20} />} 
            label="Command Center" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavButton 
            icon={<Clock size={20} />} 
            label="24h Timeline" 
            active={activeTab === 'timeline'} 
            onClick={() => setActiveTab('timeline')} 
          />
          <NavButton 
            icon={<BookOpen size={20} />} 
            label="Exam Tracker" 
            active={activeTab === 'exam'} 
            onClick={() => setActiveTab('exam')} 
          />
          <NavButton 
            icon={<Youtube size={20} />} 
            label="YouTube Growth" 
            active={activeTab === 'youtube'} 
            onClick={() => setActiveTab('youtube')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Button 
            variant="destructive" 
            className="w-full gap-2 font-bold animate-pulse"
            onClick={toggleEmergencyMode}
          >
            <AlertTriangle size={18} />
            EMERGENCY
          </Button>
        </div>
      </aside>

      {/* Mobile Header (Only on sub-pages) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40">
        <AnimatePresence>
          {activeTab !== 'dashboard' && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center gap-4"
            >
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors"
              >
                <ChevronLeft size={24} className="text-slate-400" />
              </button>
              <h2 className="text-lg font-bold text-white">{getPageTitle()}</h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Nav (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/50 flex justify-around items-end p-2 pb-6 z-50">
          <NavButtonMobile icon={<LayoutDashboard size={22} />} label="Home" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavButtonMobile icon={<Clock size={22} />} label="Timeline" active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} />
          
          <div className="relative -top-5 mx-2">
            <button 
              onClick={toggleEmergencyMode}
              className="bg-red-600 text-white p-4 rounded-full shadow-xl shadow-red-600/20 border-4 border-slate-950 active:scale-95 transition-transform"
            >
              <AlertTriangle size={24} />
            </button>
          </div>

          <NavButtonMobile icon={<BookOpen size={22} />} label="Exam" active={activeTab === 'exam'} onClick={() => setActiveTab('exam')} />
          <NavButtonMobile icon={<Youtube size={22} />} label="Growth" active={activeTab === 'youtube'} onClick={() => setActiveTab('youtube')} />
      </div>

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 relative transition-all",
        activeTab !== 'dashboard' ? "pt-20 md:pt-8" : "" // Add padding for mobile header
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {emergencyMode && <EmergencyOverlay onClose={toggleEmergencyMode} />}
        {showMorningCheckIn && <MorningCheckIn onClose={() => setShowMorningCheckIn(false)} onSubmit={submitMorningCheckIn} />}
        {showEveningCheckIn && <EveningCheckIn onClose={() => setShowEveningCheckIn(false)} onSubmit={submitEveningCheckIn} />}
      </AnimatePresence>
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-4 rounded-lg text-base font-medium transition-all",
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
    )}
  >
    {icon}
    {label}
  </button>
);

const NavButtonMobile = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-20",
      active ? "text-blue-500" : "text-slate-500 hover:text-slate-300"
    )}
  >
    <div className={cn(
      "p-1.5 rounded-lg transition-all",
      active && "bg-blue-500/10"
    )}>
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
    </div>
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const EmergencyOverlay = ({ onClose }: { onClose: () => void }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // Target: 30 days from now (mock)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    
    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };
    
    const interval = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-red-950/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4"
    >
      <AlertTriangle size={64} className="text-red-500 mb-6 animate-bounce" />
      <h2 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-widest">NO EXCUSES</h2>
      <p className="text-red-200 text-xl md:text-2xl mb-12 max-w-2xl font-serif italic">
        "The only thing standing between you and your goal is the story you keep telling yourself as to why you can't achieve it."
      </p>
      <div className="text-5xl md:text-8xl font-mono font-bold text-white mb-12 tabular-nums">
        {timeLeft}
      </div>
      <Button size="lg" onClick={onClose} className="bg-white text-red-900 hover:bg-gray-200 font-bold text-lg px-12 py-6 h-auto">
        GET BACK TO WORK
      </Button>
    </motion.div>
  );
};

const MorningCheckIn = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (p: string[]) => void }) => {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (p1 && p2 && p3) {
      onSubmit([p1, p2, p3]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Good Morning ☀️</h2>
        <p className="text-slate-400 mb-6">Define your 3 absolute priorities for today.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Priority 1"
            value={p1} onChange={e => setP1(e.target.value)}
            required
          />
          <input 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Priority 2"
            value={p2} onChange={e => setP2(e.target.value)}
            required
          />
          <input 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Priority 3"
            value={p3} onChange={e => setP3(e.target.value)}
            required
          />
          <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-500">
            Lock In 🔒
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

const EveningCheckIn = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (r: number) => void }) => {
  const [rating, setRating] = useState(5);

  const handleSubmit = () => {
    onSubmit(rating);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Day Complete 🌙</h2>
        <p className="text-slate-400 mb-8">Rate your focus level today (1-10).</p>
        
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <button
              key={num}
              onClick={() => setRating(num)}
              className={cn(
                "w-8 h-8 rounded-full text-sm font-bold transition-all",
                rating === num ? "bg-blue-500 text-white scale-110" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              )}
            >
              {num}
            </button>
          ))}
        </div>

        <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-500">
          Submit & Rest 😴
        </Button>
      </motion.div>
    </div>
  );
};

export default Layout;
