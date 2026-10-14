import { format, subDays, subHours, startOfDay } from 'date-fns';

export interface AppUsage {
  id: string;
  name: string;
  icon: string;
  category: 'social' | 'productivity' | 'entertainment' | 'education' | 'tools' | 'communication' | 'health' | 'finance';
  screenTime: number; // minutes
  sessions: number;
  firstUsed: string;
  lastUsed: string;
  color: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  app: string;
  icon: string;
  duration: number;
  type: 'session' | 'notification' | 'topic';
  topic?: string;
}

export interface TopicChip {
  name: string;
  count: number;
  color: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  summary: string;
  screenTime: number;
  topApps: string[];
  topics: string[];
  productivity: number;
  mood: 'great' | 'good' | 'neutral' | 'low';
  reflections: string;
  facts: string[];
  inferences: string[];
}

export interface WeeklyInsight {
  label: string;
  value: string;
  change: number;
  icon: string;
}

const appIcons: Record<string, string> = {
  'Chrome': '🌐',
  'Gmail': '📧',
  'YouTube': '▶️',
  'Twitter': '🐦',
  'Notion': '📝',
  'VS Code': '💻',
  'Spotify': '🎵',
  'Reddit': '🔴',
  'Slack': '💬',
  'GitHub': '🐙',
  'Duolingo': '🦉',
  'Kindle': '📚',
  'Maps': '🗺️',
  'Camera': '📷',
  'Calendar': '📅',
  'Messages': '💬',
  'Phone': '📱',
  'Settings': '⚙️',
  'Banking': '🏦',
  'Fitbit': '⌚',
  'Instagram': '📸',
  'LinkedIn': '💼',
  'Medium': '📰',
  'Figma': '🎨',
  'Terminal': '⌨️',
};

const appColors: Record<string, string> = {
  'Chrome': '#4285F4',
  'Gmail': '#EA4335',
  'YouTube': '#FF0000',
  'Twitter': '#1DA1F2',
  'Notion': '#000000',
  'VS Code': '#007ACC',
  'Spotify': '#1DB954',
  'Reddit': '#FF4500',
  'Slack': '#4A154B',
  'GitHub': '#333333',
  'Duolingo': '#58CC02',
  'Kindle': '#FF9900',
  'Maps': '#34A853',
  'Camera': '#666666',
  'Calendar': '#4285F4',
  'Messages': '#34C759',
  'Phone': '#34C759',
  'Settings': '#8E8E93',
  'Banking': '#003366',
  'Fitbit': '#00B0B9',
  'Instagram': '#E4405F',
  'LinkedIn': '#0A66C2',
  'Medium': '#000000',
  'Figma': '#A259FF',
  'Terminal': '#2D2D2D',
};

const categories: Record<string, AppUsage['category']> = {
  'Chrome': 'tools',
  'Gmail': 'communication',
  'YouTube': 'entertainment',
  'Twitter': 'social',
  'Notion': 'productivity',
  'VS Code': 'productivity',
  'Spotify': 'entertainment',
  'Reddit': 'social',
  'Slack': 'communication',
  'GitHub': 'productivity',
  'Duolingo': 'education',
  'Kindle': 'education',
  'Maps': 'tools',
  'Camera': 'tools',
  'Calendar': 'productivity',
  'Messages': 'communication',
  'Phone': 'communication',
  'Settings': 'tools',
  'Banking': 'finance',
  'Fitbit': 'health',
  'Instagram': 'social',
  'LinkedIn': 'social',
  'Medium': 'education',
  'Figma': 'productivity',
  'Terminal': 'productivity',
};

function generateDayApps(date: Date): AppUsage[] {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  const baseApps = isWeekend 
    ? ['Spotify', 'YouTube', 'Reddit', 'Kindle', 'Chrome', 'Messages', 'Instagram', 'Maps', 'Camera', 'Fitbit']
    : ['VS Code', 'GitHub', 'Chrome', 'Slack', 'Gmail', 'Notion', 'Spotify', 'Terminal', 'Calendar', 'Messages', 'Duolingo', 'LinkedIn', 'Fitbit'];

  return baseApps.map((name, i) => {
    const baseTime = isWeekend 
      ? Math.floor(Math.random() * 60) + 10
      : (name === 'VS Code' || name === 'GitHub' || name === 'Terminal' ? Math.floor(Math.random() * 180) + 60 : Math.floor(Math.random() * 45) + 5);
    
    const hour = 6 + Math.floor(Math.random() * 4);
    const lastHour = 20 + Math.floor(Math.random() * 3);
    
    return {
      id: `${format(date, 'yyyy-MM-dd')}-${i}`,
      name,
      icon: appIcons[name] || '📱',
      category: categories[name] || 'tools',
      screenTime: baseTime,
      sessions: Math.floor(Math.random() * 20) + 3,
      firstUsed: `${String(hour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      lastUsed: `${String(Math.min(lastHour, 23)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      color: appColors[name] || '#666666',
    };
  }).sort((a, b) => b.screenTime - a.screenTime);
}

function generateTimeline(date: Date): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const apps = generateDayApps(date);
  let currentHour = 7;

  for (let i = 0; i < 12; i++) {
    const app = apps[i % apps.length];
    const duration = Math.floor(Math.random() * 30) + 5;
    const topics = ['React development', 'AI research', 'Design systems', 'TypeScript patterns', 'Product strategy', 'Music discovery', 'News reading', 'Language learning', 'Code review', 'Documentation'];
    
    events.push({
      id: `event-${date.toISOString()}-${i}`,
      time: `${String(currentHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      app: app.name,
      icon: app.icon,
      duration,
      type: i % 4 === 0 ? 'topic' : 'session',
      topic: i % 4 === 0 ? topics[Math.floor(Math.random() * topics.length)] : undefined,
    });
    
    currentHour += Math.floor(Math.random() * 2) + 1;
    if (currentHour > 22) break;
  }

  return events;
}

function generateDiary(date: Date): DiaryEntry {
  const apps = generateDayApps(date);
  const totalScreenTime = apps.reduce((sum, a) => sum + a.screenTime, 0);
  const topApps = apps.slice(0, 3).map(a => a.name);
  
  const topicSets = [
    ['React patterns', 'TypeScript', 'Web performance', 'API design'],
    ['Machine learning', 'Neural networks', 'Python', 'Data analysis'],
    ['UI/UX design', 'Figma', 'Design systems', 'Accessibility'],
    ['Product management', 'User research', 'Analytics', 'Strategy'],
    ['Open source', 'Git workflows', 'CI/CD', 'Documentation'],
  ];
  
  const topics = topicSets[date.getDay() % topicSets.length];
  const productivity = Math.floor(Math.random() * 30) + 60;
  const moods: DiaryEntry['mood'][] = ['great', 'good', 'neutral', 'good'];
  const mood = moods[date.getDay() % moods.length];

  const summaries = [
    `A productive day focused on ${topApps[0]} and deep work sessions. Explored topics in ${topics[0].toLowerCase()} and maintained good focus throughout the morning.`,
    `Today was a balanced mix of creative and analytical work. Spent significant time in ${topApps[0]} while also staying connected through ${topApps[1]}.`,
    `A learning-focused day with exploration in ${topics[0].toLowerCase()} and ${topics[1].toLowerCase()}. Good progress on ongoing projects.`,
    `Started strong with focused sessions in ${topApps[0]}, took a midday break for ${topApps[1]}, then returned to deep work in the afternoon.`,
  ];

  const reflections = [
    "Felt most productive during morning hours. Consider blocking social media until after lunch.",
    "Good balance between focused work and breaks. The Pomodoro technique helped maintain concentration.",
    "Spent more time than intended on social feeds. Tomorrow, try the app timer feature.",
    "Excellent deep work session in the morning. Afternoon was lighter but still productive.",
  ];

  return {
    id: `diary-${format(date, 'yyyy-MM-dd')}`,
    date: format(date, 'yyyy-MM-dd'),
    summary: summaries[date.getDate() % summaries.length],
    screenTime: totalScreenTime,
    topApps,
    topics,
    productivity,
    mood,
    reflections: reflections[date.getDate() % reflections.length],
    facts: [
      `Total screen time: ${Math.floor(totalScreenTime / 60)}h ${totalScreenTime % 60}m`,
      `Most used app: ${topApps[0]} (${apps[0].screenTime}min)`,
      `${apps.length} apps opened across ${apps.reduce((s, a) => s + a.sessions, 0)} sessions`,
      `Active from ${apps[apps.length - 1]?.firstUsed || '07:00'} to ${apps[0]?.lastUsed || '22:00'}`,
    ],
    inferences: [
      `Based on usage patterns, you were most productive between 9-11 AM`,
      `Topic clustering suggests interest in ${topics[0].toLowerCase()}`,
      `Screen time is ${totalScreenTime > 240 ? 'above' : 'within'} your daily average`,
    ],
  };
}

export function getAppsForDate(date: Date): AppUsage[] {
  return generateDayApps(date);
}

export function getTimelineForDate(date: Date): TimelineEvent[] {
  return generateTimeline(date);
}

export function getDiaryForDate(date: Date): DiaryEntry {
  return generateDiary(date);
}

export function getWeeklyDiaries(): DiaryEntry[] {
  return Array.from({ length: 7 }, (_, i) => generateDiary(subDays(new Date(), i)));
}

export function getMonthlyDiaries(): DiaryEntry[] {
  return Array.from({ length: 30 }, (_, i) => generateDiary(subDays(new Date(), i)));
}

export function getWeeklyInsights(): WeeklyInsight[] {
  return [
    { label: 'Avg Screen Time', value: '4h 23m', change: -8, icon: '📱' },
    { label: 'Productivity Score', value: '78/100', change: 12, icon: '⚡' },
    { label: 'Focus Sessions', value: '14', change: 5, icon: '🎯' },
    { label: 'Apps Used', value: '23', change: -3, icon: '📊' },
    { label: 'Learning Time', value: '1h 45m', change: 15, icon: '📚' },
    { label: 'Social Media', value: '1h 12m', change: -18, icon: '💬' },
  ];
}

export function getTopicTrends(): TopicChip[] {
  return [
    { name: 'React', count: 12, color: '#61DAFB' },
    { name: 'TypeScript', count: 9, color: '#3178C6' },
    { name: 'AI/ML', count: 8, color: '#8B7EC8' },
    { name: 'Design', count: 6, color: '#FF6B6B' },
    { name: 'Productivity', count: 5, color: '#6BBF8A' },
    { name: 'Music', count: 4, color: '#1DB954' },
    { name: 'News', count: 7, color: '#E8B86B' },
    { name: 'Open Source', count: 3, color: '#333333' },
    { name: 'Languages', count: 4, color: '#58CC02' },
    { name: 'Finance', count: 2, color: '#003366' },
  ];
}

export function getScreenTimeData() {
  return Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const apps = generateDayApps(date);
    return {
      day: format(date, 'EEE'),
      fullDate: format(date, 'MMM dd'),
      total: Math.round(apps.reduce((s, a) => s + a.screenTime, 0) / 60 * 10) / 10,
      productive: Math.round(apps.filter(a => a.category === 'productivity' || a.category === 'education').reduce((s, a) => s + a.screenTime, 0) / 60 * 10) / 10,
      leisure: Math.round(apps.filter(a => a.category === 'entertainment' || a.category === 'social').reduce((s, a) => s + a.screenTime, 0) / 60 * 10) / 10,
    };
  });
}

export function getCategoryBreakdown(date: Date) {
  const apps = generateDayApps(date);
  const categories: Record<string, number> = {};
  
  apps.forEach(app => {
    const cat = app.category;
    categories[cat] = (categories[cat] || 0) + app.screenTime;
  });

  return Object.entries(categories)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round(value / 60 * 10) / 10,
      percentage: Math.round(value / apps.reduce((s, a) => s + a.screenTime, 0) * 100),
    }))
    .sort((a, b) => b.value - a.value);
}
