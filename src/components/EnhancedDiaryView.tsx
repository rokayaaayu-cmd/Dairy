import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import {
  BookOpen, Video, MessageSquare, Code2, Brain, Sparkles,
  Clock, Check, Target, ArrowRight, FileText, Eye,
  ChevronDown, ChevronUp, Link2, AlertTriangle, Quote
} from 'lucide-react';
import { getAppsForDate, getDiaryForDate, type AppUsage, type DiaryEntry } from '../data/mockData';
import { getCapturedContent, getProjects, type CapturedContent } from '../data/contentCapture';

// Section Header
function SectionHeader({ icon: Icon, title, count, color }: { icon: any; title: string; count?: number; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-6">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center`} style={{ background: `${color}15` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <h3 className="font-semibold text-sm text-text-primary dark:text-text-dark">{title}</h3>
      {count !== undefined && (
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-cream dark:bg-surface-dark text-text-secondary dark:text-text-dark-secondary">
          {count}
        </span>
      )}
    </div>
  );
}

// Timeline Item
function TimelineItem({ time, children }: { time: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 mb-4">
      <div className="flex flex-col items-center">
        <span className="text-xs font-medium text-text-secondary dark:text-text-dark-secondary w-12 text-right">
          {time}
        </span>
        <div className="w-2 h-2 rounded-full bg-lavender/40 mt-1" />
        <div className="w-0.5 flex-1 bg-lavender/10 mt-1" />
      </div>
      <div className="flex-1 pb-2">
        {children}
      </div>
    </div>
  );
}

// Enhanced Diary View
export function EnhancedDiaryView() {
  const [selectedDate] = useState(new Date());
  const apps = getAppsForDate(selectedDate);
  const diary = getDiaryForDate(selectedDate);
  const contents = getCapturedContent(selectedDate);
  const projects = getProjects();

  // Categorize content
  const articles = contents.filter(c => c.contentType === 'article');
  const videos = contents.filter(c => c.contentType === 'video');
  const chats = contents.filter(c => c.contentType === 'chat');
  const codeContent = contents.filter(c => c.contentType === 'code');

  // Active projects today
  const activeProjects = projects.filter(p =>
    p.sessions.some(s => s.date === format(selectedDate, 'yyyy-MM-dd'))
  );

  const totalScreenTime = apps.reduce((sum, a) => sum + a.screenTime, 0);

  return (
    <div className="pb-24 px-5 pt-4">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark mb-1">
          {isToday(selectedDate) ? "Today's Diary" : format(selectedDate, 'EEEE, MMMM d')}
        </h1>
        <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
          Your complete daily activity story
        </p>
      </div>

      {/* AI Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-lavender to-lavender-dark rounded-2xl p-5 text-white card-shadow mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-semibold">AI Daily Summary</span>
        </div>
        <p className="text-sm leading-relaxed opacity-95 mb-4">
          {diary.summary}
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/10 rounded-xl p-2 text-center">
            <p className="text-lg font-bold">{Math.floor(totalScreenTime / 60)}h {totalScreenTime % 60}m</p>
            <p className="text-xs opacity-70">Screen Time</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center">
            <p className="text-lg font-bold">{contents.length}</p>
            <p className="text-xs opacity-70">Content Items</p>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center">
            <p className="text-lg font-bold">{activeProjects.length}</p>
            <p className="text-xs opacity-70">Projects</p>
          </div>
        </div>
      </motion.div>

      {/* What I Read */}
      {articles.length > 0 && (
        <div>
          <SectionHeader icon={FileText} title="What I Read" count={articles.length} color="#7BA7D4" />
          <div className="space-y-2">
            {articles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-card-dark rounded-xl p-3 card-shadow"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{article.sourceIcon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-text-primary dark:text-text-dark">
                      {article.title}
                    </p>
                    {article.author && (
                      <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                        by {article.author} · {article.source}
                      </p>
                    )}
                    <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1">
                      <span className="text-text-secondary">{article.timestamp}</span> · {article.sourceApp}
                    </p>
                    {article.mainIdeas && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-blue-soft mb-1">Key ideas:</p>
                        <ul className="space-y-0.5">
                          {article.mainIdeas.slice(0, 2).map((idea, i) => (
                            <li key={i} className="text-xs text-text-secondary dark:text-text-dark-secondary flex items-start gap-1">
                              <span className="text-blue-soft">•</span>
                              {idea}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* What I Watched */}
      {videos.length > 0 && (
        <div>
          <SectionHeader icon={Video} title="What I Watched" count={videos.length} color="#D47B7B" />
          <div className="space-y-2">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-card-dark rounded-xl p-3 card-shadow"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{video.sourceIcon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-text-primary dark:text-text-dark">
                      {video.topic || 'Video content'}
                    </p>
                    {video.creator && video.creator !== 'Unknown' && (
                      <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                        by {video.creator}
                      </p>
                    )}
                    <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1">
                      <span>{video.timestamp}</span> · {video.sourceApp}
                    </p>
                    {!video.audioAvailable && !video.captionsAvailable && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-3 h-3 text-warning" />
                        <span className="text-xs text-warning">Limited info - no captions/audio access</span>
                      </div>
                    )}
                    {video.keyTakeaways && video.keyTakeaways.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-danger mb-1">Takeaways:</p>
                        <ul className="space-y-0.5">
                          {video.keyTakeaways.slice(0, 2).map((point, i) => (
                            <li key={i} className="text-xs text-text-secondary dark:text-text-dark-secondary flex items-start gap-1">
                              <span className="text-danger">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* AI Conversations */}
      {chats.length > 0 && (
        <div>
          <SectionHeader icon={MessageSquare} title="AI Conversations" count={chats.length} color="#8B7EC8" />
          <div className="space-y-2">
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-card-dark rounded-xl p-3 card-shadow"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{chat.sourceIcon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-text-primary dark:text-text-dark">
                      {chat.conversationTopic}
                    </p>
                    {chat.userGoal && (
                      <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                        Goal: {chat.userGoal}
                      </p>
                    )}
                    <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1">
                      {chat.timestamp} · {chat.sourceApp}
                    </p>
                    {chat.solutionsDiscussed && chat.solutionsDiscussed.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-lavender mb-1">Solutions explored:</p>
                        <ul className="space-y-0.5">
                          {chat.solutionsDiscussed.slice(0, 2).map((sol, i) => (
                            <li key={i} className="text-xs text-text-secondary dark:text-text-dark-secondary flex items-start gap-1">
                              <Check className="w-3 h-3 text-success mt-0.5 shrink-0" />
                              {sol}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Worked On */}
      {activeProjects.length > 0 && (
        <div>
          <SectionHeader icon={Code2} title="Projects Worked On" count={activeProjects.length} color="#6BBF8A" />
          <div className="space-y-2">
            {activeProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-card-dark rounded-xl p-3 card-shadow"
              >
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-text-primary dark:text-text-dark">
                      {project.name}
                    </p>
                    <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                      {project.language} · {project.status}
                    </p>
                    {project.sessions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-success mb-1">Today's progress:</p>
                        <ul className="space-y-0.5">
                          {project.sessions[0].activities.slice(0, 2).map((activity, i) => (
                            <li key={i} className="text-xs text-text-secondary dark:text-text-dark-secondary flex items-start gap-1">
                              <ArrowRight className="w-3 h-3 text-success mt-0.5 shrink-0" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* What I Learned */}
      <div>
        <SectionHeader icon={Brain} title="What I Learned" color="#E8B86B" />
        <div className="bg-white dark:bg-card-dark rounded-xl p-4 card-shadow">
          <div className="space-y-2">
            {diary.topics.map((topic, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-warning/10 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-warning" />
                </div>
                <span className="text-sm text-text-primary dark:text-text-dark">{topic}</span>
              </div>
            ))}
          </div>
          {articles.some(a => a.learningPoints && a.learningPoints.length > 0) && (
            <div className="mt-3 pt-3 border-t border-cream dark:border-surface-dark">
              <p className="text-xs font-medium text-warning mb-2">From reading:</p>
              {articles.flatMap(a => a.learningPoints || []).slice(0, 3).map((point, i) => (
                <p key={i} className="text-xs text-text-secondary dark:text-text-dark-secondary flex items-start gap-1.5 mb-1">
                  <Check className="w-3 h-3 text-success mt-0.5 shrink-0" />
                  {point}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress & Next Steps */}
      <div>
        <SectionHeader icon={Target} title="Progress & Next Steps" color="#7BA7D4" />
        <div className="bg-white dark:bg-card-dark rounded-xl p-4 card-shadow">
          {/* Progress */}
          <div className="mb-3">
            <p className="text-xs font-medium text-success mb-2">Completed today:</p>
            {activeProjects.flatMap(p => p.completedTasks).slice(0, 3).map((task, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <Check className="w-3 h-3 text-success" />
                <span className="text-xs text-text-secondary dark:text-text-dark-secondary">{task}</span>
              </div>
            ))}
            {activeProjects.length === 0 && (
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary italic">
                No completed tasks tracked today
              </p>
            )}
          </div>

          {/* Next Steps */}
          <div className="pt-3 border-t border-cream dark:border-surface-dark">
            <p className="text-xs font-medium text-blue-soft mb-2">Next steps:</p>
            {activeProjects.flatMap(p => p.nextActions).slice(0, 3).map((action, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <ArrowRight className="w-3 h-3 text-blue-soft" />
                <span className="text-xs text-text-secondary dark:text-text-dark-secondary">{action}</span>
              </div>
            ))}
            {activeProjects.length === 0 && (
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary italic">
                Continue your current activities
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Reflection */}
      <div className="mt-6">
        <SectionHeader icon={Quote} title="Daily Reflection" color="#B8AEE0" />
        <div className="bg-lavender/5 border border-lavender/10 rounded-xl p-4">
          <p className="text-sm text-text-primary dark:text-text-dark leading-relaxed italic">
            "{diary.reflections}"
          </p>
        </div>
      </div>

      {/* Evidence Summary */}
      <div className="mt-6 bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow">
        <h3 className="font-semibold text-sm text-text-primary dark:text-text-dark mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4 text-lavender" />
          Evidence & Sources
        </h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-success">Directly Observed</p>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                {diary.facts[0]}, {diary.facts[1]}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 text-lavender shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-lavender">AI Inferences</p>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                {diary.inferences[0]}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Link2 className="w-4 h-4 text-blue-soft shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-blue-soft">Source Evidence</p>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                {contents.filter(c => c.hasSourceEvidence).length} content items with verifiable sources
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
