import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CheckSquare, Square, ChevronDown, ChevronUp, BookOpen, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const ExamTracker: React.FC = () => {
  const { subjects, toggleTask, addTask, deleteTask, addSubject, deleteSubject } = useApp();
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedSubject(expandedSubject === id ? null : id);
    setNewTaskTitle(''); // Clear input when switching subjects
  };

  const handleAddTask = (subjectId: string) => {
    if (newTaskTitle.trim()) {
      addTask(subjectId, newTaskTitle);
      setNewTaskTitle('');
    }
  };

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      addSubject(newSubjectName);
      setNewSubjectName('');
      setIsAddingSubject(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      {/* Add Subject Modal */}
      {isAddingSubject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Add New Subject</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Subject Name</label>
                <input 
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Psychology"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  onClick={() => setIsAddingSubject(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddSubject}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                >
                  Add Subject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="text-blue-500" /> Exam Syllabus Tracker
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-slate-500 text-sm hidden md:inline">{subjects.length} Subjects / 30 Days</span>
          <button 
            onClick={() => setIsAddingSubject(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Add Subject <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subject) => {
          const completedCount = subject.tasks.filter(t => t.completed).length;
          const totalCount = subject.tasks.length;
          const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
          const isExpanded = expandedSubject === subject.id;

          return (
            <motion.div layout key={subject.id} className="h-fit">
              <Card 
                className={cn(
                  "border-slate-800 bg-slate-900/50 transition-all hover:border-slate-700 cursor-pointer overflow-hidden group",
                  isExpanded && "ring-1 ring-blue-500/50 bg-slate-900"
                )}
                onClick={() => toggleExpand(subject.id)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-1 h-8 rounded-full", subject.color)} />
                      <h3 className="font-bold text-lg text-white">{subject.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-400">{progress}%</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete ${subject.name}?`)) {
                            deleteSubject(subject.id);
                          }
                        }}
                        className="text-slate-600 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Subject"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <ProgressBar 
                    value={progress} 
                    className="h-1.5 bg-slate-800 mb-2" 
                    indicatorClassName={subject.color.replace('bg-', 'bg-')} 
                  />
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-800 bg-slate-950/30"
                    >
                      <div className="p-4 space-y-2">
                        {/* Add New Task Input */}
                        <div className="flex gap-2 mb-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            placeholder="Add new lesson..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddTask(subject.id);
                              }
                            }}
                          />
                          <Button 
                            size="sm" 
                            onClick={() => handleAddTask(subject.id)}
                            className="bg-blue-600 hover:bg-blue-500"
                          >
                            <Plus size={16} />
                          </Button>
                        </div>

                        {subject.tasks.map(task => (
                          <div 
                            key={task.id}
                            className="flex items-center justify-between p-2 rounded hover:bg-slate-800/50 group"
                          >
                            <div 
                              className="flex items-center gap-3 cursor-pointer flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTask(subject.id, task.id);
                              }}
                            >
                              <div className={cn(
                                "text-slate-500 transition-colors",
                                task.completed ? "text-green-500" : "group-hover:text-slate-300"
                              )}>
                                {task.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                              </div>
                              <span className={cn(
                                "text-sm transition-all",
                                task.completed ? "text-slate-500 line-through" : "text-slate-300"
                              )}>
                                {task.title}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-600 hover:text-red-500 hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(subject.id, task.id);
                              }}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ExamTracker;
