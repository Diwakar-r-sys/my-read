import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Clock, CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const Timeline: React.FC = () => {
  const { schedule, toggleScheduleBlock } = useApp();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Deep Study': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'YouTube': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'Health': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'Rest': return 'bg-slate-700/20 border-slate-700/50 text-slate-400';
      default: return 'bg-slate-800/20 border-slate-800/50 text-slate-400';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock className="text-blue-500" /> 24-Hour Protocol
        </h2>
        <div className="text-sm text-slate-500">
          {schedule.filter(s => s.completed).length}/{schedule.length} Blocks Complete
        </div>
      </div>

      <div className="relative ml-4 space-y-8 py-4">
        {/* Vertical Line */}
        <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-slate-800/50" />

        {schedule.map((block, index) => (
          <motion.div 
            key={block.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative pl-8"
          >
            {/* Timeline Dot */}
            <div 
              className={cn(
                "absolute -left-[7px] top-6 w-4 h-4 rounded-full border-4 bg-slate-950 transition-all z-10",
                block.completed 
                  ? "border-green-500 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                  : "border-slate-700"
              )}
            />
            
            <div 
              className={cn(
                "p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden",
                getTypeColor(block.type),
                block.completed ? "opacity-60 grayscale-[0.5]" : "hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              )}
              onClick={() => toggleScheduleBlock(block.id)}
            >
              {/* Active Glow for current block (first incomplete) */}
              {!block.completed && index === schedule.findIndex(s => !s.completed) && (
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none" />
              )}

              <div className="flex justify-between items-start mb-2 relative z-10">
                <span className="font-mono text-sm font-bold opacity-70 tracking-wider">
                  {block.startTime} - {block.endTime}
                </span>
                {block.completed ? <CheckCircle size={18} className="text-green-500" /> : <Circle size={18} className="opacity-50 group-hover:opacity-100 transition-opacity" />}
              </div>
              <h3 className="text-xl font-bold text-white mb-1 relative z-10">{block.activity}</h3>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 relative z-10">
                {block.type}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
