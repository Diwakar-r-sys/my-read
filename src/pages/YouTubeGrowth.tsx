import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Youtube, DollarSign, Clock, Plus, Trash2, CheckCircle, Circle, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const YouTubeGrowth: React.FC = () => {
  const { youtubeMetrics, updateYouTubeMetrics, contentPipeline, addVideoProject, deleteVideoProject, updateVideoStage, toggleVideoTask } = useApp();
  const [newVideoTitle, setNewVideoTitle] = useState('');

  const handleAddVideo = () => {
    if (newVideoTitle.trim()) {
      addVideoProject(newVideoTitle);
      setNewVideoTitle('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Youtube className="text-red-500" /> YouTube Growth Dashboard
        </h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Subscribers" 
          value={youtubeMetrics.subscribers} 
          goal={1000} 
          icon={<Youtube className="text-red-500" />}
          onChange={(val) => updateYouTubeMetrics({ subscribers: val })}
          suffix=""
        />
        <MetricCard 
          title="Watch Hours" 
          value={youtubeMetrics.watchHours} 
          goal={4000} 
          icon={<Clock className="text-blue-500" />}
          onChange={(val) => updateYouTubeMetrics({ watchHours: val })}
          suffix="h"
        />
        <MetricCard 
          title="Revenue" 
          value={youtubeMetrics.revenue} 
          goal={1000} 
          icon={<DollarSign className="text-green-500" />}
          onChange={(val) => updateYouTubeMetrics({ revenue: val })}
          suffix="$"
        />
      </div>

      {/* Content Pipeline */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Content Pipeline</h2>
          <div className="flex gap-2">
            <input 
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="New video idea..."
              value={newVideoTitle}
              onChange={(e) => setNewVideoTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddVideo()}
            />
            <Button onClick={handleAddVideo} size="sm" className="bg-white text-slate-900 hover:bg-slate-200">
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {contentPipeline.map((project) => (
              <motion.div 
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden"
              >
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full animate-pulse",
                      project.stage === 'Drafting' ? "bg-slate-500" :
                      project.stage === 'Recording' ? "bg-red-500" :
                      project.stage === 'Editing' ? "bg-blue-500" : "bg-green-500"
                    )} />
                    <h3 className="font-bold text-white">{project.title}</h3>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteVideoProject(project.id)} className="text-slate-500 hover:text-red-500">
                    <Trash2 size={16} />
                  </Button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Stage Selector */}
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-lg">
                    {['Drafting', 'Recording', 'Editing', 'Uploaded'].map((stage) => (
                      <button
                        key={stage}
                        onClick={() => updateVideoStage(project.id, stage as any)}
                        className={cn(
                          "flex-1 text-xs font-medium py-1.5 rounded-md transition-all",
                          project.stage === stage 
                            ? "bg-slate-800 text-white shadow-sm" 
                            : "text-slate-500 hover:text-slate-300"
                        )}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>

                  {/* Tasks */}
                  <div className="space-y-2">
                    {project.tasks.map(task => (
                      <div 
                        key={task.id}
                        onClick={() => toggleVideoTask(project.id, task.id)}
                        className="flex items-center gap-3 p-2 rounded hover:bg-slate-800/50 cursor-pointer group"
                      >
                        <div className={cn(
                          "text-slate-500 transition-colors",
                          task.completed ? "text-green-500" : "group-hover:text-slate-300"
                        )}>
                          {task.completed ? <CheckCircle size={16} /> : <Circle size={16} />}
                        </div>
                        <span className={cn(
                          "text-sm transition-all",
                          task.completed ? "text-slate-500 line-through" : "text-slate-300"
                        )}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {contentPipeline.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No active projects. Start creating!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  goal: number;
  icon: React.ReactNode;
  onChange: (val: number) => void;
  suffix: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, goal, icon, onChange, suffix }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onChange(Number(tempValue));
    setIsEditing(false);
  };

  return (
    <Card className="bg-slate-900 border-slate-800 relative group">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
            {icon}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 size={12} />
          </Button>
        </div>
        
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        
        {isEditing ? (
          <div className="flex gap-2 items-center">
            <input 
              type="number" 
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 w-24 text-white text-lg font-bold"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              autoFocus
            />
            <Button size="sm" onClick={handleSave} className="h-8 px-2">Save</Button>
          </div>
        ) : (
          <div className="text-3xl font-bold text-white mb-2">
            {value}{suffix}
            <span className="text-sm text-slate-500 font-normal ml-2">/ {goal}{suffix}</span>
          </div>
        )}
        
        <ProgressBar value={(value / goal) * 100} className="h-1.5 mt-2" indicatorClassName="bg-slate-200" />
      </CardContent>
    </Card>
  );
};

export default YouTubeGrowth;
