import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isYesterday } from 'date-fns';
import {
  Eye, EyeOff, Shield, AlertTriangle, Check, X, Info,
  Pause, Play, StopCircle, Camera, FileText, Video,
  MessageSquare, Code2, Brain, BookOpen, ChevronRight,
  Lock, Unlock, Trash2, Clock, Search, Filter,
  Edit3, Merge, Split, Plus, Star, CircleDot,
  ExternalLink, Link2, Image, Radio
} from 'lucide-react';
import {
  getCapturedContent, getCaptureStatus,
  type CapturedContent, type CaptureStatus
} from '../data/contentCapture';

// Capture Status Indicator
export function CaptureIndicator() {
  const [status, setStatus] = useState<CaptureStatus>(getCaptureStatus());
  const [showControls, setShowControls] = useState(false);

  return (
    <>
      {/* Persistent indicator when active */}
      {status.isActive && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-lavender text-white text-xs font-medium shadow-lg shadow-lavender/30"
        >
          <div className="w-2 h-2 rounded-full bg-white animate-pulse-soft" />
          <span>Capture Active</span>
          <button
            onClick={() => setStatus(prev => ({ ...prev, isActive: false, method: 'idle' }))}
            className="ml-1 p-0.5 rounded-full bg-white/20 hover:bg-white/30"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}

      {/* Controls panel */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
            onClick={() => setShowControls(false)}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-card-dark rounded-t-3xl p-5 safe-bottom"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-primary dark:text-text-dark">Capture Controls</h3>
                <button onClick={() => setShowControls(false)}>
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setStatus(prev => ({
                    ...prev,
                    isActive: !prev.isActive,
                    method: !prev.isActive ? 'media_projection' : 'idle',
                    startTime: !prev.isActive ? new Date().toISOString() : undefined,
                  }))}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl ${
                    status.isActive
                      ? 'bg-danger/10 text-danger'
                      : 'bg-lavender/10 text-lavender'
                  }`}
                >
                  {status.isActive ? (
                    <>
                      <StopCircle className="w-5 h-5" />
                      <div className="text-left flex-1">
                        <p className="font-semibold text-sm">Stop Capture</p>
                        <p className="text-xs opacity-70">End current screen capture session</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      <div className="text-left flex-1">
                        <p className="font-semibold text-sm">Start Capture</p>
                        <p className="text-xs opacity-70">Begin user-initiated screen capture</p>
                      </div>
                    </>
                  )}
                </button>

                <div className="bg-cream dark:bg-surface-dark rounded-xl p-3">
                  <p className="text-xs font-semibold text-text-secondary dark:text-text-dark-secondary mb-2">
                    Capture Method
                  </p>
                  <p className="text-xs text-text-primary dark:text-text-dark">
                    Current: <span className="font-medium">{status.method.replace('_', ' ')}</span>
                  </p>
                  <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1">
                    Only user-initiated capture is supported. Background monitoring requires explicit Android permissions.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Content type badge
function ContentTypeBadge({ type, confidence }: { type: string; confidence: string }) {
  const config: Record<string, { icon: any; color: string; label: string }> = {
    article: { icon: FileText, color: 'text-blue-soft', label: 'Article' },
    video: { icon: Video, color: 'text-danger', label: 'Video' },
    chat: { icon: MessageSquare, color: 'text-lavender', label: 'AI Chat' },
    code: { icon: Code2, color: 'text-success', label: 'Code' },
    image: { icon: Image, color: 'text-warning', label: 'Image' },
    unknown: { icon: AlertTriangle, color: 'text-text-secondary', label: 'Unknown' },
  };

  const confConfig: Record<string, string> = {
    high: 'bg-success/10 text-success',
    medium: 'bg-warning/10 text-warning',
    low: 'bg-danger/10 text-danger',
    unavailable: 'bg-gray-100 dark:bg-surface-dark text-text-secondary',
  };

  const { icon: Icon, color, label } = config[type] || config.unknown;

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${color} bg-opacity-10`} style={{ background: 'rgba(139,126,200,0.1)' }}>
        <Icon className="w-3 h-3" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full ${confConfig[confidence]}`}>
        {confidence} confidence
      </span>
    </div>
  );
}

// Content Card
function ContentCard({ content }: { content: CapturedContent }) {
  const [expanded, setExpanded] = useState(false);

  if (content.isRedacted) {
    return (
      <div className="bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow border border-danger/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-danger" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-text-primary dark:text-text-dark">Content Redacted</p>
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary">{content.sourceApp}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 p-2 rounded-lg bg-danger/5">
          <Shield className="w-3.5 h-3.5 text-danger mt-0.5 shrink-0" />
          <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
            {content.redactionReason || 'This content was excluded by your privacy settings.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-cream dark:bg-surface-dark flex items-center justify-center text-lg shrink-0">
          {content.sourceIcon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-sm text-text-primary dark:text-text-dark truncate">
              {content.sourceApp}
            </p>
            <span className="text-xs text-text-secondary dark:text-text-dark-secondary">
              {content.timestamp}
            </span>
          </div>
          <ContentTypeBadge type={content.contentType} confidence={content.confidence} />
        </div>
      </div>

      {/* Article Content */}
      {content.contentType === 'article' && (
        <div>
          <h4 className="font-semibold text-sm text-text-primary dark:text-text-dark mb-1">
            {content.title}
          </h4>
          {content.author && (
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary mb-2">
              by {content.author} {content.source && `· ${content.source}`}
            </p>
          )}
          {expanded && content.mainIdeas && (
            <div className="mt-3 space-y-2">
              <div>
                <p className="text-xs font-semibold text-lavender mb-1">Main Ideas</p>
                <ul className="space-y-1">
                  {content.mainIdeas.map((idea, i) => (
                    <li key={i} className="text-xs text-text-secondary dark:text-text-dark-secondary flex items-start gap-1.5">
                      <span className="text-lavender mt-0.5">•</span>
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>
              {content.learningPoints && (
                <div>
                  <p className="text-xs font-semibold text-success mb-1">Learning Points</p>
                  <ul className="space-y-1">
                    {content.learningPoints.map((point, i) => (
                      <li key={i} className="text-xs text-text-secondary dark:text-text-dark-secondary flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-success mt-0.5 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Video Content */}
      {content.contentType === 'video' && (
        <div>
          {content.creator && content.creator !== 'Unknown' && (
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary mb-1">
              by {content.creator}
            </p>
          )}
          {content.topic && (
            <p className="font-medium text-sm text-text-primary dark:text-text-dark mb-2">
              {content.topic}
            </p>
          )}
          {!content.audioAvailable && !content.captionsAvailable && (
            <div className="flex items-start gap-2 p-2 rounded-lg bg-warning/5 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                Audio and captions unavailable. Content details are limited to visible metadata.
              </p>
            </div>
          )}
          {expanded && content.keyTakeaways && content.keyTakeaways.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-blue-soft mb-1">Key Takeaways</p>
              <ul className="space-y-1">
                {content.keyTakeaways.map((point, i) => (
                  <li key={i} className="text-xs text-text-secondary dark:text-text-dark-secondary flex items-start gap-1.5">
                    <span className="text-blue-soft mt-0.5">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {content.confidence === 'low' && (
            <div className="flex items-start gap-2 p-2 rounded-lg bg-danger/5 mt-2">
              <Info className="w-3.5 h-3.5 text-danger mt-0.5 shrink-0" />
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                Limited information available. Video content cannot be analyzed without captions or audio access.
              </p>
            </div>
          )}
        </div>
      )}

      {/* AI Chat Content */}
      {content.contentType === 'chat' && (
        <div>
          {content.conversationTopic && (
            <p className="font-medium text-sm text-text-primary dark:text-text-dark mb-1">
              {content.conversationTopic}
            </p>
          )}
          {content.userGoal && (
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary mb-2">
              Goal: {content.userGoal}
            </p>
          )}
          {expanded && (
            <div className="space-y-2">
              {content.questionsAsked && content.questionsAsked.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-lavender mb-1">Questions Asked</p>
                  <ul className="space-y-1">
                    {content.questionsAsked.map((q, i) => (
                      <li key={i} className="text-xs text-text-secondary dark:text-text-dark-secondary flex items-start gap-1.5">
                        <span className="text-lavender">?</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {content.solutionsDiscussed && content.solutionsDiscussed.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-success mb-1">Solutions Discussed</p>
                  <ul className="space-y-1">
                    {content.solutionsDiscussed.map((s, i) => (
                      <li key={i} className="text-xs text-text-secondary dark:text-text-dark-secondary flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-success mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {content.codeContext && (
                <div className="p-2 rounded-lg bg-cream dark:bg-surface-dark">
                  <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                    <span className="font-medium">Context:</span> {content.codeContext}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Code Content */}
      {content.contentType === 'code' && (
        <div>
          {content.projectName && (
            <p className="font-medium text-sm text-text-primary dark:text-text-dark mb-1">
              Project: {content.projectName}
            </p>
          )}
          {content.language && (
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary mb-2">
              {content.language}
            </p>
          )}
          {expanded && (
            <div className="space-y-2">
              {content.files && content.files.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-blue-soft mb-1">Files</p>
                  <div className="flex flex-wrap gap-1">
                    {content.files.map((f, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-cream dark:bg-surface-dark text-text-secondary dark:text-text-dark-secondary font-mono">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {content.errors && content.errors.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-danger mb-1">Errors</p>
                  <ul className="space-y-1">
                    {content.errors.map((e, i) => (
                      <li key={i} className="text-xs text-text-secondary dark:text-text-dark-secondary flex items-start gap-1.5">
                        <X className="w-3 h-3 text-danger mt-0.5 shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {content.fixes && content.fixes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-success mb-1">Fixes</p>
                  <ul className="space-y-1">
                    {content.fixes.map((f, i) => (
                      <li key={i} className="text-xs text-text-secondary dark:text-text-dark-secondary flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-success mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {content.nextSteps && content.nextSteps.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-warning mb-1">Next Steps</p>
                  <ul className="space-y-1">
                    {content.nextSteps.map((n, i) => (
                      <li key={i} className="text-xs text-text-secondary dark:text-text-dark-secondary flex items-start gap-1.5">
                        <ChevronRight className="w-3 h-3 text-warning mt-0.5 shrink-0" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Evidence badge */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-cream dark:border-surface-dark">
        <div className="flex items-center gap-1.5">
          {content.hasSourceEvidence ? (
            <>
              <Link2 className="w-3 h-3 text-success" />
              <span className="text-xs text-success">Source evidence available</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3 h-3 text-text-secondary" />
              <span className="text-xs text-text-secondary">No direct evidence</span>
            </>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-lavender font-medium"
        >
          {expanded ? 'Less' : 'More'}
        </button>
      </div>
    </motion.div>
  );
}

// Main Content View
export function ContentView() {
  const [selectedDate] = useState(new Date());
  const [filter, setFilter] = useState<string>('all');
  const contents = getCapturedContent(selectedDate);

  const filteredContents = filter === 'all'
    ? contents
    : contents.filter(c => c.contentType === filter);

  const filterOptions = [
    { id: 'all', label: 'All', count: contents.length },
    { id: 'article', label: 'Articles', count: contents.filter(c => c.contentType === 'article').length },
    { id: 'video', label: 'Videos', count: contents.filter(c => c.contentType === 'video').length },
    { id: 'chat', label: 'AI Chats', count: contents.filter(c => c.contentType === 'chat').length },
    { id: 'code', label: 'Code', count: contents.filter(c => c.contentType === 'code').length },
  ];

  return (
    <div className="pb-24 px-5 pt-4">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark">Content</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream dark:bg-card-dark">
            <div className="w-1.5 h-1.5 rounded-full bg-text-secondary" />
            <span className="text-xs text-text-secondary dark:text-text-dark-secondary">
              {contents.length} items
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-4">
        What you read, watched, and discussed
      </p>

      {/* Privacy Notice */}
      <div className="bg-lavender/5 border border-lavender/10 rounded-xl p-3 mb-4">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-lavender shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-text-primary dark:text-text-dark mb-0.5">
              Content captured with your permission
            </p>
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
              Only user-initiated captures are recorded. Content from secure apps, DRM-protected media, and excluded apps is never captured.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1 scrollbar-none">
        {filterOptions.map(opt => (
          <button
            key={opt.id}
            onClick={() => setFilter(opt.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filter === opt.id
                ? 'bg-lavender text-white'
                : 'bg-white dark:bg-card-dark text-text-secondary dark:text-text-dark-secondary card-shadow'
            }`}
          >
            {opt.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              filter === opt.id ? 'bg-white/20' : 'bg-cream dark:bg-surface-dark'
            }`}>
              {opt.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="space-y-3">
        {filteredContents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-cream dark:bg-card-dark flex items-center justify-center mx-auto mb-3">
              <Eye className="w-8 h-8 text-text-secondary dark:text-text-dark-secondary" />
            </div>
            <p className="text-sm font-medium text-text-primary dark:text-text-dark mb-1">
              No content captured
            </p>
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
              Start a capture session to see content here
            </p>
          </div>
        ) : (
          filteredContents.map((content, i) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ContentCard content={content} />
            </motion.div>
          ))
        )}
      </div>

      {/* Capture Limitations */}
      <div className="mt-6 bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow">
        <h3 className="font-semibold text-sm text-text-primary dark:text-text-dark mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-lavender" />
          Capture Limitations
        </h3>
        <div className="space-y-2">
          {[
            { label: 'Secure screens (banking, passwords)', status: 'Blocked' },
            { label: 'DRM-protected video content', status: 'Blocked' },
            { label: 'Apps in exclusion list', status: 'Excluded' },
            { label: 'Background screen reading', status: 'Not available' },
            { label: 'Audio transcription', status: 'Not available' },
            { label: 'OCR on visible text', status: 'Available' },
            { label: 'Notification content', status: 'Available' },
            { label: 'User-imported content', status: 'Available' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-xs text-text-secondary dark:text-text-dark-secondary">{item.label}</span>
              <span className={`text-xs font-medium ${
                item.status === 'Available' ? 'text-success' :
                item.status === 'Blocked' || item.status === 'Excluded' ? 'text-danger' :
                'text-text-secondary'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
