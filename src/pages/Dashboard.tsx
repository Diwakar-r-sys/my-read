import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AlertTriangle, CheckCircle, Youtube, BookOpen, Target, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

const Dashboard: React.FC = () => {
  const { subjects, youtubeMetrics, contentPipeline, schedule, addTask, deleteTask, setActiveTab } = useApp();
  
  const [isAddingGoal, setIsAddingGoal] = React.useState(false);
  const [newGoalTitle, setNewGoalTitle] = React.useState('');
  const [selectedSubjectId, setSelectedSubjectId] = React.useState('');

  // Update selectedSubjectId when subjects are loaded or changed
  React.useEffect(() => {
    if (subjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  // Calculate Exam Readiness
  const totalExamTasks = subjects.reduce((acc, sub) => acc + sub.tasks.length, 0);
  const completedExamTasks = subjects.reduce((acc, sub) => acc + sub.tasks.filter(t => t.completed).length, 0);
  const examReadiness = totalExamTasks > 0 ? Math.round((completedExamTasks / totalExamTasks) * 100) : 0;

  // Calculate YouTube Goal (Monetization)
  const subGoal = 1000;
  const watchHourGoal = 4000;
  const subProgress = Math.min((youtubeMetrics.subscribers / subGoal) * 100, 100);
  const watchProgress = Math.min((youtubeMetrics.watchHours / watchHourGoal) * 100, 100);
  const monetizationReadiness = Math.round((subProgress + watchProgress) / 2);

  // Get pending tasks (Top 5 from each)
  const pendingExamTasks = subjects
    .flatMap(s => s.tasks.map(t => ({ ...t, subject: s.name, color: s.color, subjectId: s.id })))
    .filter(t => !t.completed)
    .slice(0, 5);

  const pendingVideoTasks = contentPipeline
    .flatMap(v => v.tasks.map(t => ({ ...t, video: v.title })))
    .filter(t => !t.completed)
    .slice(0, 3);

  const handleAddGoal = () => {
    if (newGoalTitle.trim() && selectedSubjectId) {
      addTask(selectedSubjectId, newGoalTitle);
      setNewGoalTitle('');
      setIsAddingGoal(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative">
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
              
              <div>
                <label className="block text-sm text-slate-400 mb-1">Subject</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
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
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Protocol Dashboard</h1>
          <p className="text-sm md:text-base text-slate-400">Day 1 of 30. Stay focused.</p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-xs md:text-sm font-mono text-green-400 font-medium">SYSTEM ONLINE</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card 
          className="bg-slate-900/50 backdrop-blur-sm border-slate-800 shadow-lg cursor-pointer hover:border-blue-500/50 transition-all group"
          onClick={() => setActiveTab('exam')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
              <BookOpen size={16} className="text-blue-500" />
              Exam Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white mb-2">{examReadiness}%</div>
            <ProgressBar value={examReadiness} className="h-3 bg-slate-800" indicatorClassName="bg-blue-600" />
            <p className="text-xs text-slate-500 mt-2">{completedExamTasks}/{totalExamTasks} Topics Covered</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-slate-900/50 backdrop-blur-sm border-slate-800 shadow-lg cursor-pointer hover:border-red-500/50 transition-all group"
          onClick={() => setActiveTab('youtube')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2 group-hover:text-red-400 transition-colors">
              <Youtube size={16} className="text-red-500" />
              Monetization Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white mb-2">{monetizationReadiness}%</div>
            <ProgressBar value={monetizationReadiness} className="h-3 bg-slate-800" indicatorClassName="bg-red-600" />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>{youtubeMetrics.subscribers}/1000 Subs</span>
              <span>{youtubeMetrics.watchHours}/4000 Hours</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Required */}
      <Card className="border-red-900/30 bg-red-950/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={20} />
            Action Required: Incomplete Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* YouTube Tasks */}
          <div>
            <h4 className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2">
              <Youtube size={14} /> YouTube Growth
            </h4>
            <div className="space-y-3">
              {pendingVideoTasks.map((task, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/50"
                >
                  <div className="mt-1 w-4 h-4 rounded border border-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{task.video}</p>
                    <p className="text-xs text-slate-500">{task.title}</p>
                  </div>
                </motion.div>
              ))}
              {pendingVideoTasks.length === 0 && <p className="text-slate-500 text-sm italic">All caught up!</p>}
            </div>
          </div>

          {/* Exam Tasks */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-green-400 flex items-center gap-2">
                <Target size={14} /> Daily Goals
              </h4>
              <button 
                onClick={() => setIsAddingGoal(true)}
                className="text-xs flex items-center gap-1 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 px-2 py-1 rounded transition-colors"
              >
                Add Today Goal <Plus size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {pendingExamTasks.map((task, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/50 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-4 h-4 rounded border border-slate-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-200">{task.title}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${task.color}`} />
                        {task.subject}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.subjectId, task.id)}
                    className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                    title="Delete Goal"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
              {pendingExamTasks.length === 0 && <p className="text-slate-500 text-sm italic">All caught up!</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
