import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Target, Plus, Trash2, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const WorkToday: React.FC = () => {
  const { dailyGoals, addDailyGoal, toggleDailyGoal, deleteDailyGoal } = useApp();
  const [isAddingGoal, setIsAddingGoal] = React.useState(false);
  const [newGoalTitle, setNewGoalTitle] = React.useState('');

  const handleAddGoal = () => {
    if (newGoalTitle.trim()) {
      addDailyGoal(newGoalTitle);
      setNewGoalTitle('');
      setIsAddingGoal(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto relative">
      {/* Add Goal Modal */}
      {isAddingGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Add New Daily Goal</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Goal Title</label>
                <input 
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Complete Calculus Chapter 4"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  onClick={() => setIsAddingGoal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddGoal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Work Today</h1>
        <p className="text-base text-slate-400">Lock in. Execute the plan.</p>
      </div>

      <div className="w-full">
        {/* Daily Goals */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold text-green-400 flex items-center gap-2">
              <Target size={20} /> Today's Focus
            </CardTitle>
            <Button 
              onClick={() => setIsAddingGoal(true)}
              variant="outline"
              size="sm"
              className="text-slate-300 border-slate-700 hover:bg-slate-800"
            >
              Add Goal <Plus size={16} className="ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {dailyGoals.map((task, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  key={task.id} 
                  className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 group cursor-pointer hover:bg-slate-900 transition-all"
                  onClick={() => toggleDailyGoal(task.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                      task.completed ? "bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "border-slate-600 group-hover:border-slate-400"
                    )}>
                      {task.completed && <CheckCircle size={14} className="text-slate-950 font-bold" />}
                    </div>
                    <div>
                      <p className={cn(
                        "text-lg font-medium transition-all",
                        task.completed ? "text-slate-500 line-through" : "text-slate-200"
                      )}>{task.title}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDailyGoal(task.id);
                    }}
                    className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"
                    title="Delete Goal"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
              {dailyGoals.length === 0 && (
                <div className="text-center py-10 bg-slate-950/30 rounded-xl border border-slate-800 border-dashed">
                  <Target size={32} className="mx-auto text-slate-700 mb-3" />
                  <p className="text-slate-500 italic">No goals set for today.</p>
                  <Button variant="link" className="text-blue-500 mt-2" onClick={() => setIsAddingGoal(true)}>Add your first goal</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default WorkToday;
