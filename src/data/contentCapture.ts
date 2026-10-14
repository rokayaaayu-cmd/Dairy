import { format, subDays, subHours } from 'date-fns';

export interface CapturedContent {
  id: string;
  timestamp: string;
  sourceApp: string;
  sourceIcon: string;
  contentType: 'article' | 'video' | 'chat' | 'code' | 'image' | 'unknown';
  confidence: 'high' | 'medium' | 'low' | 'unavailable';
  
  // Article/Book
  title?: string;
  author?: string;
  source?: string;
  mainIdeas?: string[];
  learningPoints?: string[];
  
  // Video/Reels
  creator?: string;
  topic?: string;
  keyTakeaways?: string[];
  audioAvailable?: boolean;
  captionsAvailable?: boolean;
  
  // AI Chat
  conversationTopic?: string;
  userGoal?: string;
  questionsAsked?: string[];
  solutionsDiscussed?: string[];
  codeContext?: string;
  
  // Code/Development
  projectName?: string;
  language?: string;
  files?: string[];
  features?: string[];
  errors?: string[];
  fixes?: string[];
  nextSteps?: string[];
  
  // Privacy
  isRedacted?: boolean;
  redactionReason?: string;
  
  // Evidence
  captureMethod: 'ocr' | 'notification' | 'accessibility' | 'user_import' | 'media_projection';
  hasSourceEvidence: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  language?: string;
  startDate: string;
  lastActivity: string;
  
  // Sessions
  sessions: ProjectSession[];
  
  // Progress
  completedTasks: string[];
  unresolvedProblems: string[];
  decisions: string[];
  nextActions: string[];
  
  // Metadata
  relatedApps: string[];
  totalHours: number;
  lastEdited?: string;
  userNotes?: string;
}

export interface ProjectSession {
  id: string;
  date: string;
  duration: number; // minutes
  activities: string[];
  files?: string[];
  notes?: string;
}

export interface CaptureStatus {
  isActive: boolean;
  method: 'media_projection' | 'accessibility' | 'notification' | 'ocr' | 'idle';
  startTime?: string;
  appsExcluded: string[];
  sensitiveContentRedacted: boolean;
  retentionDays: number;
}

// Generate captured content for a date
export function getCapturedContent(date: Date): CapturedContent[] {
  const daySeed = date.getDate();
  const contents: CapturedContent[] = [];

  // Articles/Books
  if (daySeed % 3 === 0) {
    contents.push({
      id: `content-${date.toISOString()}-1`,
      timestamp: `${String(9 + (daySeed % 4)).padStart(2, '0')}:${String((daySeed * 7) % 60).padStart(2, '0')}`,
      sourceApp: 'Chrome',
      sourceIcon: '🌐',
      contentType: 'article',
      confidence: 'high',
      title: 'Understanding React Server Components',
      author: 'Dan Abramov',
      source: 'overreacted.io',
      mainIdeas: [
        'Server Components run only on the server',
        'They can directly access backend resources',
        'Zero bundle size impact for server-only code',
      ],
      learningPoints: [
        'RSCs complement Client Components rather than replacing them',
        'Data fetching happens at the component level',
        'Streaming enables progressive loading',
      ],
      captureMethod: 'ocr',
      hasSourceEvidence: true,
    });
  }

  // Videos
  if (daySeed % 2 === 0) {
    contents.push({
      id: `content-${date.toISOString()}-2`,
      timestamp: `${String(14 + (daySeed % 3)).padStart(2, '0')}:${String((daySeed * 11) % 60).padStart(2, '0')}`,
      sourceApp: 'YouTube',
      sourceIcon: '▶️',
      contentType: 'video',
      confidence: 'medium',
      creator: 'Fireship',
      topic: 'TypeScript 5.4 Features',
      keyTakeaways: [
        'New type inference improvements',
        'Better pattern matching support',
        'Performance optimizations',
      ],
      audioAvailable: false,
      captionsAvailable: true,
      captureMethod: 'notification',
      hasSourceEvidence: true,
    });
  }

  // AI Chat
  if (daySeed % 4 === 0) {
    contents.push({
      id: `content-${date.toISOString()}-3`,
      timestamp: `${String(10 + (daySeed % 5)).padStart(2, '0')}:${String((daySeed * 13) % 60).padStart(2, '0')}`,
      sourceApp: 'ChatGPT',
      sourceIcon: '🤖',
      contentType: 'chat',
      confidence: 'high',
      conversationTopic: 'Debugging React hydration errors',
      userGoal: 'Fix mismatch between server and client rendering',
      questionsAsked: [
        'Why am I getting hydration mismatch errors?',
        'How do I handle browser-only APIs in RSC?',
        'What\'s the best pattern for conditional rendering?',
      ],
      solutionsDiscussed: [
        'Use useEffect for browser-only code',
        'Implement dynamic imports with next/dynamic',
        'Add suppressHydrationWarning for timestamp differences',
      ],
      codeContext: 'Next.js 14 App Router with TypeScript',
      captureMethod: 'accessibility',
      hasSourceEvidence: true,
    });
  }

  // Code/Development
  if (daySeed % 2 === 1) {
    contents.push({
      id: `content-${date.toISOString()}-4`,
      timestamp: `${String(11 + (daySeed % 4)).padStart(2, '0')}:${String((daySeed * 9) % 60).padStart(2, '0')}`,
      sourceApp: 'VS Code',
      sourceIcon: '💻',
      contentType: 'code',
      confidence: 'high',
      projectName: 'mindlog-mobile',
      language: 'TypeScript',
      files: ['src/App.tsx', 'src/components/Dashboard.tsx'],
      features: ['Dark mode toggle', 'Screen time charts'],
      errors: ['Type error in Recharts tooltip props'],
      fixes: ['Added explicit type annotation for TooltipProps'],
      nextSteps: ['Add calendar view', 'Implement data export'],
      captureMethod: 'accessibility',
      hasSourceEvidence: true,
    });
  }

  // Instagram/Reels (limited info)
  if (daySeed % 5 === 0) {
    contents.push({
      id: `content-${date.toISOString()}-5`,
      timestamp: `${String(18 + (daySeed % 3)).padStart(2, '0')}:${String((daySeed * 5) % 60).padStart(2, '0')}`,
      sourceApp: 'Instagram',
      sourceIcon: '📸',
      contentType: 'video',
      confidence: 'low',
      creator: 'Unknown',
      topic: 'Design inspiration',
      keyTakeaways: [],
      audioAvailable: false,
      captionsAvailable: false,
      captureMethod: 'notification',
      hasSourceEvidence: false,
    });
  }

  // Redacted content example
  if (daySeed % 7 === 0) {
    contents.push({
      id: `content-${date.toISOString()}-6`,
      timestamp: `${String(20 + (daySeed % 2)).padStart(2, '0')}:${String((daySeed * 3) % 60).padStart(2, '0')}`,
      sourceApp: 'Messages',
      sourceIcon: '💬',
      contentType: 'unknown',
      confidence: 'unavailable',
      isRedacted: true,
      redactionReason: 'Sensitive content - personal messages excluded',
      captureMethod: 'notification',
      hasSourceEvidence: false,
    });
  }

  return contents;
}

// Generate projects
export function getProjects(): Project[] {
  return [
    {
      id: 'project-1',
      name: 'MindLog Mobile App',
      description: 'AI-powered daily activity diary for Android',
      status: 'active',
      language: 'TypeScript',
      startDate: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
      lastActivity: format(new Date(), 'yyyy-MM-dd'),
      sessions: [
        {
          id: 'session-1',
          date: format(new Date(), 'yyyy-MM-dd'),
          duration: 120,
          activities: ['Implemented dashboard UI', 'Added screen time charts'],
          files: ['src/App.tsx', 'src/components/Dashboard.tsx'],
          notes: 'Working on responsive layout for different screen sizes',
        },
        {
          id: 'session-2',
          date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
          duration: 90,
          activities: ['Set up project structure', 'Configured Tailwind CSS'],
          files: ['package.json', 'tailwind.config.js'],
        },
      ],
      completedTasks: [
        'Project setup with Vite + React',
        'Tailwind CSS configuration',
        'Basic dashboard layout',
      ],
      unresolvedProblems: [
        'Chart responsiveness on small screens',
        'Dark mode transition animations',
      ],
      decisions: [
        'Using Recharts for data visualization',
        'Local-first architecture with optional cloud sync',
      ],
      nextActions: [
        'Add calendar view component',
        'Implement data export functionality',
        'Test on different Android devices',
      ],
      relatedApps: ['VS Code', 'GitHub', 'Chrome', 'ChatGPT'],
      totalHours: 12.5,
    },
    {
      id: 'project-2',
      name: 'Learning React Server Components',
      description: 'Deep dive into RSC architecture and patterns',
      status: 'active',
      language: 'TypeScript',
      startDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
      lastActivity: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
      sessions: [
        {
          id: 'session-3',
          date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
          duration: 60,
          activities: ['Read documentation', 'Watched tutorial videos'],
          notes: 'Understanding the mental model for server vs client components',
        },
      ],
      completedTasks: [
        'Read official React documentation',
        'Watched 3 tutorial videos',
        'Built small example app',
      ],
      unresolvedProblems: [
        'When to use server vs client components',
        'Data fetching patterns in RSC',
      ],
      decisions: [
        'Start with simple use cases before complex patterns',
      ],
      nextActions: [
        'Build a real-world example with data fetching',
        'Experiment with streaming',
      ],
      relatedApps: ['Chrome', 'YouTube', 'Notion', 'ChatGPT'],
      totalHours: 4.2,
    },
  ];
}

export function getCaptureStatus(): CaptureStatus {
  return {
    isActive: false,
    method: 'idle',
    appsExcluded: ['Banking', 'Messages', 'Settings'],
    sensitiveContentRedacted: true,
    retentionDays: 30,
  };
}
