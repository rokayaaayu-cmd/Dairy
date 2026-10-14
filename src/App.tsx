import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays, isToday, isYesterday, parseISO } from 'date-fns';
import {
  Sun, Moon, BookOpen, BarChart3, Calendar, Settings, Search,
  ChevronLeft, ChevronRight, Clock, Smartphone, Brain, Sparkles,
  TrendingUp, TrendingDown, Shield, Eye, EyeOff, Download,
  Trash2, Bell, BellOff, Check, X, Info, ArrowRight, Zap,
  Target, Heart, Coffee, Star, Activity, PieChart as PieIcon
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import {
  getAppsForDate, getTimelineForDate, getDiaryForDate,
  getWeeklyDiaries, getWeeklyInsights, getTopicTrends,
  getScreenTimeData, getCategoryBreakdown,
  type AppUsage, type DiaryEntry, type TimelineEvent
} from './data/mockData';

// Context
interface AppState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (v: boolean) => void;
  trackingEnabled: boolean;
  setTrackingEnabled: (v: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

// Custom hook with safety check
function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContext.Provider');
  }
  return context;
}

// Onboarding Component
function Onboarding() {
  const { setOnboardingComplete } = useAppContext();
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Brain className="w-16 h-16 text-lavender" />,
      title: 'Welcome to MindLog',
      subtitle: 'Your AI-powered daily activity diary that helps you understand your digital life.',
    },
    {
      icon: <Shield className="w-16 h-16 text-blue-soft" />,
      title: 'Privacy First',
      subtitle: 'All data stays on your device. We never access private content inside other apps. You control everything.',
    },
    {
      icon: <Activity className="w-16 h-16 text-success" />,
      title: 'Smart Tracking',
      subtitle: 'Automatically tracks app usage, screen time, and sessions through Android\'s UsageStatsManager.',
    },
    {
      icon: <Sparkles className="w-16 h-16 text-warning" />,
      title: 'AI Diary Generation',
      subtitle: 'Get beautiful daily summaries with insights about your productivity, learning, and habits.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-cream dark:bg-[#13131F]"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center max-w-sm"
        >
          <div className="mb-8 flex justify-center">
            <div className="w-28 h-28 rounded-3xl bg-white dark:bg-card-dark card-shadow flex items-center justify-center">
              {steps[step].icon}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark mb-3">
            {steps[step].title}
          </h1>
          <p className="text-text-secondary dark:text-text-dark-secondary text-base leading-relaxed">
            {steps[step].subtitle}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 mt-12 mb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? 'w-8 bg-lavender' : 'w-2 bg-lavender/30'
            }`}
          />
        ))}
      </div>

      <div className="flex gap-4 w-full max-w-sm">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 py-3.5 rounded-2xl border-2 border-lavender/20 text-lavender font-semibold"
          >
            Back
          </button>
        )}
        <button
          onClick={() => {
            if (step < steps.length - 1) setStep(step + 1);
            else setOnboardingComplete(true);
          }}
          className="flex-1 py-3.5 rounded-2xl bg-lavender text-white font-semibold shadow-lg shadow-lavender/30"
        >
          {step < steps.length - 1 ? 'Next' : 'Get Started'}
        </button>
      </div>

      {step === steps.length - 1 && (
        <button
          onClick={() => setOnboardingComplete(true)}
          className="mt-4 text-text-secondary dark:text-text-dark-secondary text-sm underline"
        >
          Skip intro
        </button>
      )}
    </motion.div>
  );
}

// Dashboard Component
function Dashboard() {
  const { darkMode, trackingEnabled } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const apps = getAppsForDate(selectedDate);
  const diary = getDiaryForDate(selectedDate);
  const timeline = getTimelineForDate(selectedDate);
  const screenTimeData = getScreenTimeData();
  const totalScreenTime = apps.reduce((sum, a) => sum + a.screenTime, 0);

  const navigateDate = (direction: number) => {
    setSelectedDate(prev => {
      const newDate = subDays(prev, direction);
      if (newDate > new Date()) return new Date();
      return newDate;
    });
  };

  const formatDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMM d');
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark">
              MindLog
            </h1>
            <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
              Your AI Activity Diary
            </p>
          </div>
          <div className="flex items-center gap-2">
            {trackingEnabled && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
                <span className="text-xs font-medium text-success">Tracking</span>
              </div>
            )}
          </div>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center justify-between bg-white dark:bg-card-dark rounded-2xl p-3 card-shadow">
          <button onClick={() => navigateDate(1)} className="p-2 rounded-xl hover:bg-cream dark:hover:bg-surface-dark transition-colors">
            <ChevronLeft className="w-5 h-5 text-text-secondary dark:text-text-dark-secondary" />
          </button>
          <span className="font-semibold text-text-primary dark:text-text-dark">
            {formatDateLabel(selectedDate)}
          </span>
          <button
            onClick={() => navigateDate(-1)}
            disabled={isToday(selectedDate)}
            className="p-2 rounded-xl hover:bg-cream dark:hover:bg-surface-dark transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5 text-text-secondary dark:text-text-dark-secondary" />
          </button>
        </div>
      </div>

      {/* Screen Time Summary Card */}
      <div className="px-5 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-lavender to-lavender-dark rounded-3xl p-5 text-white card-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm">Total Screen Time</p>
              <p className="text-3xl font-bold mt-1">
                {Math.floor(totalScreenTime / 60)}h {totalScreenTime % 60}m
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 bg-white/10 rounded-xl p-3">
              <p className="text-white/60 text-xs">Apps Used</p>
              <p className="text-lg font-bold">{apps.length}</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl p-3">
              <p className="text-white/60 text-xs">Sessions</p>
              <p className="text-lg font-bold">{apps.reduce((s, a) => s + a.sessions, 0)}</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl p-3">
              <p className="text-white/60 text-xs">Productivity</p>
              <p className="text-lg font-bold">{diary.productivity}%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly Chart */}
      <div className="px-5 mt-6">
        <div className="bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text-primary dark:text-text-dark text-sm">This Week</h3>
            <span className="text-xs text-text-secondary dark:text-text-dark-secondary">Screen hours</span>
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={screenTimeData} barGap={4}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: darkMode ? '#A8A4BC' : '#6B6880' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: darkMode ? '#2A2A3E' : '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="productive" fill="#8B7EC8" radius={[4, 4, 0, 0]} name="Productive" />
                <Bar dataKey="leisure" fill="#B8AEE0" radius={[4, 4, 0, 0]} name="Leisure" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Apps */}
      <div className="px-5 mt-6">
        <h3 className="font-semibold text-text-primary dark:text-text-dark mb-3">Top Apps Today</h3>
        <div className="space-y-2">
          {apps.slice(0, 5).map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 bg-white dark:bg-card-dark rounded-xl p-3 card-shadow"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${app.color}15` }}>
                {app.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-text-primary dark:text-text-dark truncate">{app.name}</p>
                <p className="text-xs text-text-secondary dark:text-text-dark-secondary">{app.sessions} sessions</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm text-text-primary dark:text-text-dark">
                  {app.screenTime >= 60 ? `${Math.floor(app.screenTime / 60)}h ${app.screenTime % 60}m` : `${app.screenTime}m`}
                </p>
                <div className="w-16 h-1.5 rounded-full bg-cream dark:bg-surface-dark mt-1">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(app.screenTime / apps[0].screenTime) * 100}%`, background: app.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Diary Card */}
      <div className="px-5 mt-6">
        <div className="bg-white dark:bg-card-dark rounded-2xl p-5 card-shadow border border-lavender/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-lavender/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-lavender" />
            </div>
            <h3 className="font-semibold text-text-primary dark:text-text-dark">AI Diary</h3>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-lavender/10 text-lavender">Auto-generated</span>
          </div>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary leading-relaxed mb-4">
            {diary.summary}
          </p>
          
          {/* Topics */}
          <div className="flex flex-wrap gap-2 mb-4">
            {diary.topics.map(topic => (
              <span key={topic} className="px-2.5 py-1 rounded-full bg-cream dark:bg-surface-dark text-xs font-medium text-text-secondary dark:text-text-dark-secondary">
                {topic}
              </span>
            ))}
          </div>

          {/* Facts vs Inferences */}
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-success/5">
              <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-success mb-1">Collected Facts</p>
                <p className="text-xs text-text-secondary dark:text-text-dark-secondary">{diary.facts[0]}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-lavender/5">
              <Brain className="w-4 h-4 text-lavender mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-lavender mb-1">AI Inference</p>
                <p className="text-xs text-text-secondary dark:text-text-dark-secondary">{diary.inferences[0]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 mt-6">
        <h3 className="font-semibold text-text-primary dark:text-text-dark mb-3">Activity Timeline</h3>
        <div className="space-y-3">
          {timeline.slice(0, 6).map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3"
            >
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-card-dark card-shadow flex items-center justify-center text-sm">
                  {event.icon}
                </div>
                {i < 5 && <div className="w-0.5 h-full bg-lavender/20 mt-1" />}
              </div>
              <div className="flex-1 pb-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-text-primary dark:text-text-dark">{event.app}</p>
                  <span className="text-xs text-text-secondary dark:text-text-dark-secondary">{event.time}</span>
                </div>
                <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-0.5">
                  {event.duration}min {event.topic && `· ${event.topic}`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Diary View Component
function DiaryView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const diaries = getWeeklyDiaries();
  const currentDiary = getDiaryForDate(selectedDate);

  return (
    <div className="pb-24 px-5 pt-4">
      <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark mb-1">Diary</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-5">AI-generated daily reflections</p>

      {/* Current Diary Entry */}
      <motion.div
        key={currentDiary.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-card-dark rounded-2xl p-5 card-shadow mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
              {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMMM d')}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg">
                {currentDiary.mood === 'great' ? '🌟' : currentDiary.mood === 'good' ? '😊' : currentDiary.mood === 'neutral' ? '😐' : '😔'}
              </span>
              <span className="text-sm font-medium text-text-primary dark:text-text-dark capitalize">{currentDiary.mood}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-lavender">
              {Math.floor(currentDiary.screenTime / 60)}h {currentDiary.screenTime % 60}m
            </p>
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary">screen time</p>
          </div>
        </div>

        <div className="bg-cream dark:bg-surface-dark rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-lavender" />
            <span className="text-xs font-semibold text-lavender">AI Summary</span>
          </div>
          <p className="text-sm text-text-primary dark:text-text-dark leading-relaxed">
            {currentDiary.summary}
          </p>
        </div>

        <div className="bg-cream dark:bg-surface-dark rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-danger" />
            <span className="text-xs font-semibold text-danger">Reflection</span>
          </div>
          <p className="text-sm text-text-primary dark:text-text-dark leading-relaxed">
            {currentDiary.reflections}
          </p>
        </div>

        {/* Facts & Inferences */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text-secondary dark:text-text-dark-secondary uppercase tracking-wide">
            Evidence & Analysis
          </p>
          {currentDiary.facts.map((fact, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-success/5">
              <Check className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">{fact}</p>
            </div>
          ))}
          {currentDiary.inferences.map((inf, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-lavender/5">
              <Brain className="w-3.5 h-3.5 text-lavender mt-0.5 shrink-0" />
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">{inf}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Week Overview */}
      <h3 className="font-semibold text-text-primary dark:text-text-dark mb-3">This Week</h3>
      <div className="space-y-2">
        {diaries.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDate(parseISO(d.date))}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              d.date === format(selectedDate, 'yyyy-MM-dd')
                ? 'bg-lavender/10 border border-lavender/30'
                : 'bg-white dark:bg-card-dark card-shadow'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-cream dark:bg-surface-dark flex items-center justify-center">
              <span className="text-lg">
                {d.mood === 'great' ? '🌟' : d.mood === 'good' ? '😊' : d.mood === 'neutral' ? '😐' : '😔'}
              </span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-text-primary dark:text-text-dark">
                {isToday(parseISO(d.date)) ? 'Today' : format(parseISO(d.date), 'EEE, MMM d')}
              </p>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary truncate">
                {d.summary.slice(0, 60)}...
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-text-primary dark:text-text-dark">
                {Math.floor(d.screenTime / 60)}h {d.screenTime % 60}m
              </p>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">{d.productivity}%</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Insights Component
function Insights() {
  const insights = getWeeklyInsights();
  const topics = getTopicTrends();
  const screenTimeData = getScreenTimeData();
  const categoryData = getCategoryBreakdown(new Date());
  const { darkMode } = useAppContext();

  const PIE_COLORS = ['#8B7EC8', '#7BA7D4', '#6BBF8A', '#E8B86B', '#D47B7B', '#B8AEE0'];

  return (
    <div className="pb-24 px-5 pt-4">
      <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark mb-1">Insights</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-5">Weekly patterns & trends</p>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {insights.map((insight, i) => (
          <motion.div
            key={insight.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{insight.icon}</span>
              <div className={`flex items-center gap-0.5 text-xs font-medium ${
                insight.change > 0 ? 'text-success' : 'text-danger'
              }`}>
                {insight.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(insight.change)}%
              </div>
            </div>
            <p className="text-lg font-bold text-text-primary dark:text-text-dark">{insight.value}</p>
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-0.5">{insight.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Screen Time Trend */}
      <div className="bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow mb-6">
        <h3 className="font-semibold text-sm text-text-primary dark:text-text-dark mb-3">Screen Time Trend</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={screenTimeData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B7EC8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B7EC8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#3A3A4E' : '#F0EDF5'} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: darkMode ? '#A8A4BC' : '#6B6880' }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: darkMode ? '#2A2A3E' : '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="total" stroke="#8B7EC8" strokeWidth={2} fill="url(#colorTotal)" name="Hours" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow mb-6">
        <h3 className="font-semibold text-sm text-text-primary dark:text-text-dark mb-3">Category Breakdown</h3>
        <div className="flex items-center gap-4">
          <div className="w-28 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5">
            {categoryData.slice(0, 5).map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-xs text-text-secondary dark:text-text-dark-secondary flex-1">{cat.name}</span>
                <span className="text-xs font-medium text-text-primary dark:text-text-dark">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topic Trends */}
      <div className="bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow">
        <h3 className="font-semibold text-sm text-text-primary dark:text-text-dark mb-3">Topic Trends</h3>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <div
              key={topic.name}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
              style={{ borderColor: `${topic.color}40`, background: `${topic.color}10` }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: topic.color }} />
              <span className="text-xs font-medium text-text-primary dark:text-text-dark">{topic.name}</span>
              <span className="text-xs text-text-secondary dark:text-text-dark-secondary">{topic.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Calendar Component
function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const monthlyDiaries = getWeeklyDiaries();

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getDiaryForDay = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return monthlyDiaries.find(d => d.date === format(date, 'yyyy-MM-dd'));
  };

  return (
    <div className="pb-24 px-5 pt-4">
      <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark mb-1">Calendar</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-5">Browse your diary history</p>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 rounded-xl hover:bg-cream dark:hover:bg-surface-dark">
          <ChevronLeft className="w-5 h-5 text-text-secondary dark:text-text-dark-secondary" />
        </button>
        <h2 className="font-semibold text-text-primary dark:text-text-dark">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 rounded-xl hover:bg-cream dark:hover:bg-surface-dark">
          <ChevronRight className="w-5 h-5 text-text-secondary dark:text-text-dark-secondary" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-center text-xs font-medium text-text-secondary dark:text-text-dark-secondary py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map(i => <div key={`blank-${i}`} />)}
          {days.map(day => {
            const diary = getDiaryForDay(day);
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isSelected = selectedDay && format(date, 'yyyy-MM-dd') === format(selectedDay, 'yyyy-MM-dd');
            const isTodayDate = isToday(date);

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(date)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition-all ${
                  isSelected
                    ? 'bg-lavender text-white'
                    : isTodayDate
                    ? 'bg-lavender/10 text-lavender font-bold'
                    : 'hover:bg-cream dark:hover:bg-surface-dark text-text-primary dark:text-text-dark'
                }`}
              >
                <span>{day}</span>
                {diary && !isSelected && (
                  <div className="flex gap-0.5 mt-0.5">
                    <div className={`w-1 h-1 rounded-full ${
                      diary.mood === 'great' ? 'bg-success' : diary.mood === 'good' ? 'bg-blue-soft' : 'bg-warning'
                    }`} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail */}
      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow"
        >
          <h3 className="font-semibold text-sm text-text-primary dark:text-text-dark mb-3">
            {format(selectedDay, 'EEEE, MMMM d')}
          </h3>
          {(() => {
            const diary = getDiaryForDate(selectedDay);
            return (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {diary.mood === 'great' ? '🌟' : diary.mood === 'good' ? '😊' : diary.mood === 'neutral' ? '😐' : '😔'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text-primary dark:text-text-dark">
                      {Math.floor(diary.screenTime / 60)}h {diary.screenTime % 60}m screen time
                    </p>
                    <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                      {diary.topics.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-text-secondary dark:text-text-dark-secondary leading-relaxed">
                  {diary.summary}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {diary.topics.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-cream dark:bg-surface-dark text-xs text-text-secondary dark:text-text-dark-secondary">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}

// Settings Component
function SettingsView() {
  const { darkMode, toggleDarkMode, trackingEnabled, setTrackingEnabled } = useAppContext();
  const [showPermissions, setShowPermissions] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [summaryTime, setSummaryTime] = useState('21:00');
  const [cloudAI, setCloudAI] = useState(false);

  return (
    <div className="pb-24 px-5 pt-4">
      <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark mb-1">Settings</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-5">Customize your experience</p>

      {/* Appearance */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-text-secondary dark:text-text-dark-secondary uppercase tracking-wide mb-3">Appearance</h3>
        <div className="bg-white dark:bg-card-dark rounded-2xl card-shadow overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-cream dark:border-surface-dark">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-lavender" /> : <Sun className="w-5 h-5 text-warning" />}
              <span className="text-sm font-medium text-text-primary dark:text-text-dark">Dark Mode</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-7 rounded-full transition-colors ${darkMode ? 'bg-lavender' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Tracking */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-text-secondary dark:text-text-dark-secondary uppercase tracking-wide mb-3">Tracking</h3>
        <div className="bg-white dark:bg-card-dark rounded-2xl card-shadow overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-cream dark:border-surface-dark">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-success" />
              <div>
                <span className="text-sm font-medium text-text-primary dark:text-text-dark">Usage Tracking</span>
                <p className="text-xs text-text-secondary dark:text-text-dark-secondary">UsageStatsManager</p>
              </div>
            </div>
            <button
              onClick={() => setTrackingEnabled(!trackingEnabled)}
              className={`w-12 h-7 rounded-full transition-colors ${trackingEnabled ? 'bg-success' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${trackingEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <button
            onClick={() => setShowPermissions(!showPermissions)}
            className="flex items-center justify-between w-full p-4 border-b border-cream dark:border-surface-dark"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-soft" />
              <span className="text-sm font-medium text-text-primary dark:text-text-dark">Permissions</span>
            </div>
            <ChevronRight className="w-4 h-4 text-text-secondary dark:text-text-dark-secondary" />
          </button>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-warning" />
              <span className="text-sm font-medium text-text-primary dark:text-text-dark">Daily Summary</span>
            </div>
            <input
              type="time"
              value={summaryTime}
              onChange={(e) => setSummaryTime(e.target.value)}
              className="text-sm text-lavender font-medium bg-transparent border-none outline-none"
            />
          </div>
        </div>

        <AnimatePresence>
          {showPermissions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow"
            >
              <h4 className="font-semibold text-sm text-text-primary dark:text-text-dark mb-3">Permission Status</h4>
              <div className="space-y-3">
                {[
                  { name: 'Usage Access', status: trackingEnabled, desc: 'Required for app usage tracking' },
                  { name: 'Notifications', status: notificationsEnabled, desc: 'For daily summary alerts' },
                  { name: 'Browser History', status: false, desc: 'Optional - for topic analysis' },
                ].map(perm => (
                  <div key={perm.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary dark:text-text-dark">{perm.name}</p>
                      <p className="text-xs text-text-secondary dark:text-text-dark-secondary">{perm.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      perm.status ? 'bg-success/10' : 'bg-gray-100 dark:bg-surface-dark'
                    }`}>
                      {perm.status ? (
                        <Check className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-text-secondary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Settings */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-text-secondary dark:text-text-dark-secondary uppercase tracking-wide mb-3">AI & Privacy</h3>
        <div className="bg-white dark:bg-card-dark rounded-2xl card-shadow overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-cream dark:border-surface-dark">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-lavender" />
              <div>
                <span className="text-sm font-medium text-text-primary dark:text-text-dark">Cloud AI</span>
                <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Enhanced summaries (optional)</p>
              </div>
            </div>
            <button
              onClick={() => setCloudAI(!cloudAI)}
              className={`w-12 h-7 rounded-full transition-colors ${cloudAI ? 'bg-lavender' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${cloudAI ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border-b border-cream dark:border-surface-dark">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-blue-soft" />
              <span className="text-sm font-medium text-text-primary dark:text-text-dark">Export Data</span>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-lavender/10 text-lavender text-xs font-medium">
              Export
            </button>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-danger" />
              <span className="text-sm font-medium text-danger">Delete All Data</span>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-danger/10 text-danger text-xs font-medium">
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-lavender/5 rounded-2xl p-4 border border-lavender/10">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-lavender shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-text-primary dark:text-text-dark mb-1">Local-First Design</p>
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary leading-relaxed">
              All your data is stored locally on your device. AI inferences are clearly separated from collected facts. 
              No private content from other apps is ever accessed. You have full control over your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Bottom Navigation
function BottomNav({ active, onChange }: { active: string; onChange: (tab: string) => void }) {
  const tabs = [
    { id: 'dashboard', icon: BarChart3, label: 'Home' },
    { id: 'diary', icon: BookOpen, label: 'Diary' },
    { id: 'insights', icon: Target, label: 'Insights' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-lavender/10 safe-bottom z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map(tab => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive ? 'text-lavender' : 'text-text-secondary dark:text-text-dark-secondary'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-lavender/10' : ''}`}>
                <tab.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (!onboardingComplete) {
    return (
      <AppContext.Provider value={{ darkMode, toggleDarkMode, onboardingComplete, setOnboardingComplete, trackingEnabled, setTrackingEnabled }}>
        <div className={`min-h-screen ${darkMode ? 'dark bg-[#13131F]' : 'bg-cream'}`}>
          <Onboarding />
        </div>
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={{ darkMode, toggleDarkMode, onboardingComplete, setOnboardingComplete, trackingEnabled, setTrackingEnabled }}>
      <div className={`min-h-screen max-w-lg mx-auto ${darkMode ? 'dark bg-[#13131F]' : 'bg-cream'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'diary' && <DiaryView />}
            {activeTab === 'insights' && <Insights />}
            {activeTab === 'calendar' && <CalendarView />}
            {activeTab === 'settings' && <SettingsView />}
          </motion.div>
        </AnimatePresence>
        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>
    </AppContext.Provider>
  );
}
