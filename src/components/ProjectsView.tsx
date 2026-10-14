import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isToday, isYesterday, differenceInDays } from 'date-fns';
import {
  Folder, ChevronRight, ChevronDown, Plus, Edit3, Merge, Split,
  Check, X, Clock, Code2, FileText, AlertTriangle, Star,
  CircleDot, Target, Zap, Calendar, TrendingUp, MoreHorizontal,
  ArrowRight, Brain, Sparkles, Hash, Tag
} from 'lucide-react';
import { getProjects, type Project, type ProjectSession } from '../data/contentCapture';

// Project Card
function ProjectCard({ project, onSelect }: { project: Project; onSelect: (p: Project) => void }) {
  const statusColors: Record<string, string> = {
    active: 'bg-success/10 text-success',
    paused: 'bg-warning/10 text-warning',
    completed: 'bg-blue-soft/10 text-blue-soft',
    archived: 'bg-gray-100 dark:bg-surface-dark text-text-secondary',
  };

  const statusIcons: Record<string, any> = {
    active: CircleDot,
    paused: Clock,
    completed: Check,
    archived: Folder,
  };

  const StatusIcon = statusIcons[project.status] || CircleDot;
  const daysSinceLastActivity = differenceInDays(new Date(), parseISO(project.lastActivity));

  return (
    <motion.button
      onClick={() => onSelect(project)}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow text-left"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-lavender/10 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-lavender" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-text-primary dark:text-text-dark">
              {project.name}
            </h3>
            {project.language && (
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                {project.language}
              </p>
            )}
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
          <StatusIcon className="w-3 h-3" />
          {project.status}
        </div>
      </div>

      {project.description && (
        <p className="text-xs text-text-secondary dark:text-text-dark-secondary mb-3 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-text-secondary dark:text-text-dark-secondary">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{project.totalHours}h total</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>
            {daysSinceLastActivity === 0 ? 'Today' :
             daysSinceLastActivity === 1 ? 'Yesterday' :
             `${daysSinceLastActivity}d ago`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Hash className="w-3 h-3" />
          <span>{project.sessions.length} sessions</span>
        </div>
      </div>

      {/* Related apps */}
      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
        {project.relatedApps.slice(0, 4).map(app => (
          <span key={app} className="text-[10px] px-1.5 py-0.5 rounded bg-cream dark:bg-surface-dark text-text-secondary dark:text-text-dark-secondary">
            {app}
          </span>
        ))}
        {project.relatedApps.length > 4 && (
          <span className="text-[10px] text-text-secondary">+{project.relatedApps.length - 4}</span>
        )}
      </div>
    </motion.button>
  );
}

// Project Detail View
function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState(project.name);

  return (
    <div className="pb-24 px-5 pt-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-cream dark:hover:bg-surface-dark">
          <ChevronRight className="w-5 h-5 text-text-secondary dark:text-text-dark-secondary rotate-180" />
        </button>
        <div className="flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                value={editedName}
                onChange={e => setEditedName(e.target.value)}
                className="text-lg font-bold text-text-primary dark:text-text-dark bg-transparent border-b border-lavender outline-none flex-1"
              />
              <button onClick={() => setEditing(false)} className="p-1 rounded-lg bg-lavender/10">
                <Check className="w-4 h-4 text-lavender" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-text-primary dark:text-text-dark">
                {project.name}
              </h1>
              <button onClick={() => setEditing(true)} className="p-1 rounded-lg hover:bg-cream dark:hover:bg-surface-dark">
                <Edit3 className="w-3.5 h-3.5 text-text-secondary" />
              </button>
            </div>
          )}
          <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
            {project.language} · Started {format(parseISO(project.startDate), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* Status & Stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-white dark:bg-card-dark rounded-xl p-3 card-shadow text-center">
          <p className="text-lg font-bold text-text-primary dark:text-text-dark">{project.totalHours}h</p>
          <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Total Time</p>
        </div>
        <div className="bg-white dark:bg-card-dark rounded-xl p-3 card-shadow text-center">
          <p className="text-lg font-bold text-text-primary dark:text-text-dark">{project.sessions.length}</p>
          <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Sessions</p>
        </div>
        <div className="bg-white dark:bg-card-dark rounded-xl p-3 card-shadow text-center">
          <p className="text-lg font-bold text-text-primary dark:text-text-dark">{project.completedTasks.length}</p>
          <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Tasks Done</p>
        </div>
      </div>

      {/* Session Timeline */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm text-text-primary dark:text-text-dark mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-lavender" />
          Session Timeline
        </h3>
        <div className="space-y-2">
          {project.sessions.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3"
            >
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-lavender/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-lavender" />
                </div>
                {i < project.sessions.length - 1 && (
                  <div className="w-0.5 flex-1 bg-lavender/20 mt-1" />
                )}
              </div>
              <div className="flex-1 bg-white dark:bg-card-dark rounded-xl p-3 card-shadow pb-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-text-primary dark:text-text-dark">
                    {isToday(parseISO(session.date)) ? 'Today' :
                     isYesterday(parseISO(session.date)) ? 'Yesterday' :
                     format(parseISO(session.date), 'MMM d')}
                  </p>
                  <span className="text-xs text-text-secondary dark:text-text-dark-secondary">
                    {session.duration}min
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-1">
                  {session.activities.map((activity, j) => (
                    <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-cream dark:bg-surface-dark text-text-secondary dark:text-text-dark-secondary">
                      {activity}
                    </span>
                  ))}
                </div>
                {session.files && session.files.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {session.files.map((file, j) => (
                      <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-soft/10 text-blue-soft font-mono">
                        {file}
                      </span>
                    ))}
                  </div>
                )}
                {session.notes && (
                  <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-2 italic">
                    {session.notes}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        {/* Completed Tasks */}
        <div className="bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow">
          <h3 className="font-semibold text-sm text-text-primary dark:text-text-dark mb-3 flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            Completed Tasks
          </h3>
          <div className="space-y-1.5">
            {project.completedTasks.map((task, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-success/10 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-success" />
                </div>
                <span className="text-xs text-text-secondary dark:text-text-dark-secondary">{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unresolved Problems */}
        {project.unresolvedProblems.length > 0 && (
          <div className="bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow">
            <h3 className="font-semibold text-sm text-text-primary dark:text-text-dark mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Unresolved Problems
            </h3>
            <div className="space-y-1.5">
              {project.unresolvedProblems.map((problem, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="w-2.5 h-2.5 text-warning" />
                  </div>
                  <span className="text-xs text-text-secondary dark:text-text-dark-secondary">{problem}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decisions */}
        {project.decisions.length > 0 && (
          <div className="bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow">
            <h3 className="font-semibold text-sm text-text-primary dark:text-text-dark mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-lavender" />
              Key Decisions
            </h3>
            <div className="space-y-1.5">
              {project.decisions.map((decision, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-lavender/10 flex items-center justify-center">
                    <Star className="w-2.5 h-2.5 text-lavender" />
                  </div>
                  <span className="text-xs text-text-secondary dark:text-text-dark-secondary">{decision}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Actions */}
        <div className="bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow">
          <h3 className="font-semibold text-sm text-text-primary dark:text-text-dark mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-soft" />
            Next Actions
          </h3>
          <div className="space-y-1.5">
            {project.nextActions.map((action, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-soft/10 flex items-center justify-center">
                  <ArrowRight className="w-2.5 h-2.5 text-blue-soft" />
                </div>
                <span className="text-xs text-text-secondary dark:text-text-dark-secondary">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Management Actions */}
      <div className="mt-6 flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cream dark:bg-surface-dark text-text-secondary dark:text-text-dark-secondary text-xs font-medium">
          <Merge className="w-4 h-4" />
          Merge
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cream dark:bg-surface-dark text-text-secondary dark:text-text-dark-secondary text-xs font-medium">
          <Split className="w-4 h-4" />
          Split
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cream dark:bg-surface-dark text-text-secondary dark:text-text-dark-secondary text-xs font-medium">
          <Edit3 className="w-4 h-4" />
          Reclassify
        </button>
      </div>

      {/* AI Inference Notice */}
      <div className="mt-4 bg-lavender/5 border border-lavender/10 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-lavender shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-text-primary dark:text-text-dark mb-0.5">
              Project grouping is AI-inferred
            </p>
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
              Sessions are grouped based on file names, topics, and app usage patterns. Use Merge/Split to correct any misclassifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Projects View
export function ProjectsView() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const projects = getProjects();

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.status === filter);

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div className="pb-24 px-5 pt-4">
      <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark mb-1">Projects</h1>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-5">
        Connected coding sessions across apps and days
      </p>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
        {[
          { id: 'all', label: 'All' },
          { id: 'active', label: 'Active' },
          { id: 'paused', label: 'Paused' },
          { id: 'completed', label: 'Completed' },
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => setFilter(opt.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filter === opt.id
                ? 'bg-lavender text-white'
                : 'bg-white dark:bg-card-dark text-text-secondary dark:text-text-dark-secondary card-shadow'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {filteredProjects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ProjectCard project={project} onSelect={setSelectedProject} />
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-cream dark:bg-card-dark flex items-center justify-center mx-auto mb-3">
            <Folder className="w-8 h-8 text-text-secondary dark:text-text-dark-secondary" />
          </div>
          <p className="text-sm font-medium text-text-primary dark:text-text-dark mb-1">
            No projects found
          </p>
          <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
            Projects are automatically created from your coding sessions
          </p>
        </div>
      )}

      {/* How it works */}
      <div className="mt-6 bg-white dark:bg-card-dark rounded-2xl p-4 card-shadow">
        <h3 className="font-semibold text-sm text-text-primary dark:text-text-dark mb-3 flex items-center gap-2">
          <Brain className="w-4 h-4 text-lavender" />
          How Project Memory Works
        </h3>
        <div className="space-y-2">
          {[
            { icon: '🔗', text: 'Connects related sessions across VS Code, GitHub, Terminal, and AI chats' },
            { icon: '📊', text: 'Tracks progress, decisions, and unresolved problems' },
            { icon: '✏️', text: 'You can rename, merge, or split projects at any time' },
            { icon: '🔍', text: 'Searchable by project name, language, or file' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-sm">{item.icon}</span>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
