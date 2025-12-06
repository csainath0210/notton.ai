import { Badge } from './ui/badge';
import { Sparkles, Clock, ArrowUpCircle } from 'lucide-react';

interface InProgressTask {
  id: string;
  name: string;
  status: string;
  source: string;
  lastOpened: string;
}

interface UpNextTask {
  id: string;
  name: string;
  duration: string;
  focus: string;
  source: string;
}

interface Category {
  id: string;
  title: string;
  color: string;
  inProgress: InProgressTask[];
  upNext: UpNextTask[];
  suggestedTask: string;
}

interface CategoryCardProps {
  category: Category;
  timeFilter: string;
  energyLevel: string;
  onTaskClick?: (task: any) => void;
  onAddToToday?: (task: any) => void;
}

const colorMap: Record<string, { 
  bg: string; 
  border: string; 
  badge: string; 
  accent: string;
  progressBg: string;
  upNextBg: string;
}> = {
  teal: {
    bg: 'from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20',
    border: 'border-teal-200/50 dark:border-teal-800/30',
    badge: 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    accent: 'text-teal-600 dark:text-teal-400',
    progressBg: 'bg-teal-100/50 dark:bg-teal-900/30',
    upNextBg: 'bg-white/60 dark:bg-slate-800/60'
  },
  lavender: {
    bg: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
    border: 'border-purple-200/50 dark:border-purple-800/30',
    badge: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    accent: 'text-purple-600 dark:text-purple-400',
    progressBg: 'bg-purple-100/50 dark:bg-purple-900/30',
    upNextBg: 'bg-white/60 dark:bg-slate-800/60'
  },
  blue: {
    bg: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20',
    border: 'border-blue-200/50 dark:border-blue-800/30',
    badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    accent: 'text-blue-600 dark:text-blue-400',
    progressBg: 'bg-blue-100/50 dark:bg-blue-900/30',
    upNextBg: 'bg-white/60 dark:bg-slate-800/60'
  },
  green: {
    bg: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
    border: 'border-green-200/50 dark:border-green-800/30',
    badge: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    accent: 'text-green-600 dark:text-green-400',
    progressBg: 'bg-green-100/50 dark:bg-green-900/30',
    upNextBg: 'bg-white/60 dark:bg-slate-800/60'
  },
  orange: {
    bg: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20',
    border: 'border-orange-200/50 dark:border-orange-800/30',
    badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    accent: 'text-orange-600 dark:text-orange-400',
    progressBg: 'bg-orange-100/50 dark:bg-orange-900/30',
    upNextBg: 'bg-white/60 dark:bg-slate-800/60'
  },
};

const sourceIcons: Record<string, string> = {
  slack: '💬',
  notion: '📝',
  canvas: '🎓',
  jira: '🎯',
};

export function CategoryCard({ category, timeFilter: _timeFilter, energyLevel: _energyLevel, onTaskClick, onAddToToday }: CategoryCardProps) {
  const colors = colorMap[category.color] || colorMap.teal;

  return (
    <div className={`bg-gradient-to-br ${colors.bg} rounded-xl p-4 shadow-sm border ${colors.border} hover:shadow-md transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-900 dark:text-slate-100">{category.title}</h3>
        <Badge variant="outline" className={colors.badge}>
          {category.inProgress.length + category.upNext.length}
        </Badge>
      </div>

      {/* In Progress Section */}
      {category.inProgress.length > 0 && (
        <div className="mb-3">
          <div className="mb-2">
            <span className="text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">In Progress</span>
          </div>
          <div className="space-y-1.5">
            {category.inProgress.map((task) => (
              <div
                key={task.id}
                className="relative group/task"
              >
                <button
                  className={`w-full text-left px-3 py-2 ${colors.progressBg} rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all`}
                  onClick={() => onTaskClick && onTaskClick({ ...task, category: category.title, color: category.color })}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 dark:text-slate-100 text-sm truncate group-hover/task:text-slate-700 dark:group-hover/task:text-slate-200">
                        {task.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        You {task.status}
                      </p>
                    </div>
                    <span className="text-base flex-shrink-0">{sourceIcons[task.source] || '📄'}</span>
                  </div>
                </button>
                
                {/* Add to Today Affordance - Appears on Hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToToday && onAddToToday({ ...task, category: category.title });
                  }}
                  className="absolute top-1 right-1 opacity-0 group-hover/task:opacity-100 transition-all duration-300 ease-out px-2 py-1 rounded-md bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-xs shadow-sm hover:shadow flex items-center gap-1"
                >
                  <ArrowUpCircle className="w-3 h-3" />
                  <span className="hidden sm:inline">Add to Today</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Up Next Section */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span className="text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Up Next</span>
        </div>
        <div className="space-y-1.5">
          {category.upNext.length > 0 ? (
            category.upNext.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="relative group/task"
              >
                <button
                  className={`w-full text-left px-3 py-2 ${colors.upNextBg} rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all`}
                  onClick={() => onTaskClick && onTaskClick({ ...task, category: category.title, color: category.color })}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 dark:text-slate-100 text-sm truncate group-hover/task:text-slate-700 dark:group-hover/task:text-slate-200">
                        {task.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{task.duration}</p>
                    </div>
                    <span className="text-base flex-shrink-0">{sourceIcons[task.source] || '📄'}</span>
                  </div>
                </button>
                
                {/* Add to Today Affordance - Appears on Hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToToday && onAddToToday({ ...task, category: category.title });
                  }}
                  className="absolute top-1 right-1 opacity-0 group-hover/task:opacity-100 transition-all duration-300 ease-out px-2 py-1 rounded-md bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-xs shadow-sm hover:shadow flex items-center gap-1"
                >
                  <ArrowUpCircle className="w-3 h-3" />
                  <span className="hidden sm:inline">Add to Today</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            ))
          ) : (
            <div className="px-3 py-3 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-slate-200/30 dark:border-slate-700/30 text-center">
              <p className="text-slate-400 dark:text-slate-500 text-xs">All clear</p>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Next Task */}
      {category.suggestedTask && (
        <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-3.5 h-3.5 ${colors.accent}`} />
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Suggested: <span className={colors.accent}>{category.suggestedTask}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
