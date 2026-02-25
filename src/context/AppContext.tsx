import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Types
export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export type Subject = {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
};

export type VideoStage = 'Drafting' | 'Recording' | 'Editing' | 'Uploaded';

export type VideoProject = {
  id: string;
  title: string;
  stage: VideoStage;
  tasks: Task[]; // Specific tasks for this video (Script, Voice, Edit, etc.)
};

export type YouTubeMetrics = {
  subscribers: number;
  watchHours: number;
  revenue: number;
};

export type TimeBlock = {
  id: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  activity: string;
  type: 'Deep Study' | 'YouTube' | 'Rest' | 'Health' | 'Other';
  completed: boolean;
};

export type DailyCheckIn = {
  date: string;
  morningPriorities: string[];
  eveningRating: number | null;
  eveningSummary: boolean;
};

interface AppState {
  subjects: Subject[];
  youtubeMetrics: YouTubeMetrics;
  contentPipeline: VideoProject[];
  schedule: TimeBlock[];
  checkIns: DailyCheckIn[];
  emergencyMode: boolean;
  dailyGoals: Task[];
  sprintDeadline: string;
}

interface AppContextType extends AppState {
  toggleTask: (subjectId: string, taskId: string) => void;
  addTask: (subjectId: string, title: string) => void;
  deleteTask: (subjectId: string, taskId: string) => void;
  updateYouTubeMetrics: (metrics: Partial<YouTubeMetrics>) => void;
  addVideoProject: (title: string) => void;
  updateVideoStage: (id: string, stage: VideoStage) => void;
  toggleVideoTask: (videoId: string, taskId: string) => void;
  deleteVideoProject: (id: string) => void;
  toggleScheduleBlock: (blockId: string) => void;
  submitMorningCheckIn: (priorities: string[]) => void;
  submitEveningCheckIn: (rating: number) => void;
  toggleEmergencyMode: () => void;
  addSubject: (name: string) => void;
  deleteSubject: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  addDailyGoal: (title: string) => void;
  toggleDailyGoal: (id: string) => void;
  deleteDailyGoal: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getLocalStorage = <T,>(key: string, initialValue: T): T => {
  if (typeof window === 'undefined') return initialValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
};

const initialSubjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    color: 'bg-blue-500',
    tasks: [
      { id: 'm1', title: 'Calculus: Limits & Continuity', completed: true },
      { id: 'm2', title: 'Calculus: Derivatives', completed: false },
      { id: 'm3', title: 'Calculus: Integrals', completed: false },
      { id: 'm4', title: 'Algebra: Matrices', completed: false },
      { id: 'm5', title: 'Algebra: Complex Numbers', completed: false },
    ]
  },
  {
    id: 'eng',
    name: 'English',
    color: 'bg-yellow-500',
    tasks: [
      { id: 'e1', title: 'Essay Writing Practice', completed: false },
      { id: 'e2', title: 'Literature Review', completed: false },
    ]
  },
];

const initialSchedule: TimeBlock[] = [
  { id: '1', startTime: '06:00', endTime: '08:00', activity: 'Morning Routine & Exercise', type: 'Health', completed: true },
  { id: '2', startTime: '08:00', endTime: '12:00', activity: 'Deep Study Session 1 (Mathematics)', type: 'Deep Study', completed: false },
  { id: '3', startTime: '12:00', endTime: '13:00', activity: 'Lunch & Rest', type: 'Rest', completed: false },
  { id: '4', startTime: '13:00', endTime: '16:00', activity: 'YouTube Production (Script/Edit)', type: 'YouTube', completed: false },
  { id: '5', startTime: '16:00', endTime: '17:00', activity: 'Power Nap / Walk', type: 'Health', completed: false },
  { id: '6', startTime: '17:00', endTime: '21:00', activity: 'Deep Study Session 2 (English)', type: 'Deep Study', completed: false },
  { id: '7', startTime: '21:00', endTime: '22:00', activity: 'Dinner & Wind Down', type: 'Rest', completed: false },
  { id: '8', startTime: '22:00', endTime: '23:00', activity: 'Review & Plan Next Day', type: 'Other', completed: false },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or use initial
  const [subjects, setSubjects] = useState<Subject[]>(() => getLocalStorage('subjects', initialSubjects));

  const [youtubeMetrics, setYoutubeMetrics] = useState<YouTubeMetrics>(() => 
    getLocalStorage('youtubeMetrics', { subscribers: 120, watchHours: 45, revenue: 0 })
  );

  const [contentPipeline, setContentPipeline] = useState<VideoProject[]>(() => 
    getLocalStorage('contentPipeline', [
      {
        id: 'v1',
        title: 'How to Study for 12 Hours',
        stage: 'Recording',
        tasks: [
          { id: 'vt1', title: 'Topic Research', completed: true },
          { id: 'vt2', title: 'Script Writing', completed: true },
          { id: 'vt3', title: 'Voice Recording', completed: false },
          { id: 'vt4', title: 'Video Editing', completed: false },
          { id: 'vt5', title: 'Thumbnail Design', completed: false },
        ]
      }
    ])
  );

  const [schedule, setSchedule] = useState<TimeBlock[]>(() => getLocalStorage('schedule', initialSchedule));

  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>(() => getLocalStorage('checkIns', []));
  
  const [dailyGoals, setDailyGoals] = useState<Task[]>(() => getLocalStorage('dailyGoals', []));

  const [emergencyMode, setEmergencyMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [sprintDeadline, setSprintDeadline] = useState<string>(() => 
    getLocalStorage('sprintDeadline', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
  );

  // Persistence
  useEffect(() => { localStorage.setItem('subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('youtubeMetrics', JSON.stringify(youtubeMetrics)); }, [youtubeMetrics]);
  useEffect(() => { localStorage.setItem('contentPipeline', JSON.stringify(contentPipeline)); }, [contentPipeline]);
  useEffect(() => { localStorage.setItem('schedule', JSON.stringify(schedule)); }, [schedule]);
  useEffect(() => { localStorage.setItem('checkIns', JSON.stringify(checkIns)); }, [checkIns]);
  useEffect(() => { localStorage.setItem('dailyGoals', JSON.stringify(dailyGoals)); }, [dailyGoals]);
  useEffect(() => { localStorage.setItem('sprintDeadline', JSON.stringify(sprintDeadline)); }, [sprintDeadline]);

  // Actions
  const toggleTask = (subjectId: string, taskId: string) => {
    setSubjects(prev => prev.map(sub => 
      sub.id === subjectId 
        ? { ...sub, tasks: sub.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }
        : sub
    ));
  };

  const addTask = (subjectId: string, title: string) => {
    setSubjects(prev => prev.map(sub => 
      sub.id === subjectId 
        ? { ...sub, tasks: [...sub.tasks, { id: uuidv4(), title, completed: false }] }
        : sub
    ));
  };

  const deleteTask = (subjectId: string, taskId: string) => {
    setSubjects(prev => prev.map(sub => 
      sub.id === subjectId 
        ? { ...sub, tasks: sub.tasks.filter(t => t.id !== taskId) }
        : sub
    ));
  };

  const addDailyGoal = (title: string) => {
    setDailyGoals(prev => [...prev, { id: uuidv4(), title, completed: false }]);
  };

  const toggleDailyGoal = (id: string) => {
    setDailyGoals(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteDailyGoal = (id: string) => {
    setDailyGoals(prev => prev.filter(t => t.id !== id));
  };

  const updateYouTubeMetrics = (metrics: Partial<YouTubeMetrics>) => {
    setYoutubeMetrics(prev => ({ ...prev, ...metrics }));
  };

  const addVideoProject = (title: string) => {
    const newVideo: VideoProject = {
      id: uuidv4(),
      title,
      stage: 'Drafting',
      tasks: [
        { id: uuidv4(), title: 'Topic Research', completed: false },
        { id: uuidv4(), title: 'Script Writing', completed: false },
        { id: uuidv4(), title: 'Voice Recording', completed: false },
        { id: uuidv4(), title: 'Image, Effect, video and Asset', completed: false },
        { id: uuidv4(), title: 'Video Editing', completed: false },
        { id: uuidv4(), title: 'Sound effect, SFC and Background Music', completed: false },
        { id: uuidv4(), title: 'Thumbnail Design', completed: false },
        { id: uuidv4(), title: 'Title & Description', completed: false },
      ]
    };
    setContentPipeline(prev => [...prev, newVideo]);
  };

  const updateVideoStage = (id: string, stage: VideoStage) => {
    setContentPipeline(prev => prev.map(v => v.id === id ? { ...v, stage } : v));
  };

  const toggleVideoTask = (videoId: string, taskId: string) => {
    setContentPipeline(prev => prev.map(v => 
      v.id === videoId 
        ? { ...v, tasks: v.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }
        : v
    ));
  };

  const deleteVideoProject = (id: string) => {
    setContentPipeline(prev => prev.filter(v => v.id !== id));
  };

  const toggleScheduleBlock = (blockId: string) => {
    setSchedule(prev => prev.map(b => b.id === blockId ? { ...b, completed: !b.completed } : b));
  };

  const submitMorningCheckIn = (priorities: string[]) => {
    const today = new Date().toISOString().split('T')[0];
    setCheckIns(prev => {
      const existing = prev.find(c => c.date === today);
      if (existing) return prev; // Already done
      return [...prev, { date: today, morningPriorities: priorities, eveningRating: null, eveningSummary: false }];
    });
  };

  const submitEveningCheckIn = (rating: number) => {
    const today = new Date().toISOString().split('T')[0];
    setCheckIns(prev => prev.map(c => 
      c.date === today ? { ...c, eveningRating: rating, eveningSummary: true } : c
    ));
  };

  const toggleEmergencyMode = () => setEmergencyMode(prev => !prev);

  const addSubject = (name: string) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-emerald-500', 'bg-yellow-500', 'bg-cyan-500', 'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newSubject: Subject = {
      id: uuidv4(),
      name,
      color: randomColor,
      tasks: []
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  return (
    <AppContext.Provider value={{
      subjects, youtubeMetrics, contentPipeline, schedule, checkIns, emergencyMode, dailyGoals, sprintDeadline,
      toggleTask, addTask, deleteTask, updateYouTubeMetrics, addVideoProject, updateVideoStage, toggleVideoTask, deleteVideoProject,
      toggleScheduleBlock, submitMorningCheckIn, submitEveningCheckIn, toggleEmergencyMode,
      addSubject, deleteSubject,
      activeTab, setActiveTab,
      addDailyGoal, toggleDailyGoal, deleteDailyGoal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
