import { useMemo, useState } from 'react';
import { Badge } from './ui/badge';
import { Sparkles, Plus, Clock, ArrowUpCircle, Trash, RotateCcw } from 'lucide-react';

interface InProgressTask {
  id: string;
  name: string;
  status?: string;
  source: string;
  lastOpened?: string;
  duration?: string;
  energy?: string;
}

interface UpNextTask {
  id: string;
  name: string;
  duration: string;
  focus?: string;
  source: string;
  energy?: string;
}

interface Category {
  id: string;
  title: string;
  color: string;
  isDefault: boolean;
  inProgress: InProgressTask[];
  upNext: UpNextTask[];
  completed: UpNextTask[];
  suggestedTask?: string;
}

interface CategoryCardProps {
  category: Category;
  timeFilter: string;
  energyLevel: string;
  onTaskClick?: (task: any) => void;
  onAddToToday?: (task: any) => void;
  onOpenAddTaskModal?: (categoryId: string, categoryTitle: string, categoryColor: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onRestoreTask?: (taskId: string) => void;
  onDeleteCategory?: (category: Category) => void;
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
  slack: 'Slack',
  notion: 'Notion',
  canvas: 'Canvas',
  jira: 'Jira',
  manual: 'Manual',
};

type TaskCardProps = {
  task: any;
  categoryTitle: string;
  pillText: string;
  onAddToToday?: (task: any) => void;
  onDeleteTask?: (taskId: string) => void;
  selected: boolean;
  onToggleSelect?: (taskId: string) => void;
};

function TaskCard({
  task,
  categoryTitle,
  pillText,
  onAddToToday,
  onDeleteTask,
  selected,
  onToggleSelect,
}: TaskCardProps) {
  return (
    <div
      className={`relative w-full text-left px-3 py-2 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-slate-200/50 dark:border-slate-700/50 group ${selected ? 'ring-2 ring-teal-400/60' : ''}`}
      onClick={() => onToggleSelect && onToggleSelect(task.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {selected && (
            <div className="mt-1 w-4 h-4 rounded border border-teal-500 bg-teal-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-sm bg-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-slate-900 dark:text-slate-100 text-sm truncate">
              {task.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {task.status && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You {task.status}
                </p>
              )}
              {task.duration && (
                <>
                  {task.status && <span className="text-slate-300 dark:text-slate-600">•</span>}
                  <span className="text-xs text-slate-500 dark:text-slate-400">{task.duration}</span>
                </>
              )}
              {task.energy && (
                <>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className={`text-xs ${
                    task.energy === 'Low' ? 'text-blue-500 dark:text-blue-400' :
                    task.energy === 'Medium' ? 'text-amber-500 dark:text-amber-400' :
                    'text-rose-500 dark:text-rose-400'
                  }`}>
                    {task.energy} energy
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-200 border border-slate-300/60 dark:border-slate-600/60 flex-shrink-0">
            {pillText}
          </span>
          {onDeleteTask && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask(task.id);
              }}
              className="text-xs text-rose-500 hover:text-rose-400"
              title="Delete task"
            >
              <Trash className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      {onAddToToday && (
        <div className="flex justify-end mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToToday({ ...task, category: categoryTitle });
            }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs text-teal-500 border border-teal-200 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/40 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ArrowUpCircle className="w-3 h-3" />
            Add to Today
          </button>
        </div>
      )}
    </div>
  );
}

export function CategoryCard({ category, timeFilter, energyLevel, onTaskClick: _onTaskClick, onAddToToday, onOpenAddTaskModal, onDeleteTask, onRestoreTask, onDeleteCategory }: CategoryCardProps) {
  const colors = colorMap[category.color] || colorMap.teal;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allActiveTasks = useMemo(
    () => [...category.inProgress, ...category.upNext],
    [category.inProgress, category.upNext]
  );

  const toggleSelect = (taskId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const handleBulkAddToToday = () => {
    if (!onAddToToday) return;
    const map: Record<string, any> = {};
    allActiveTasks.forEach((t) => (map[t.id] = t));
    selectedIds.forEach((id) => {
      const t = map[id];
      if (t) onAddToToday({ ...t, category: category.title });
    });
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    if (!onDeleteTask) return;
    selectedIds.forEach((id) => onDeleteTask(id));
    setSelectedIds(new Set());
  };

  const filterTask = (task: any) => {
    const timeMatch = (() => {
      if (timeFilter === 'All') return true;
      const duration = task.duration;
      if (!duration) return true;
      const minutes = parseInt(duration);
      if (timeFilter === '15m') return minutes <= 15;
      if (timeFilter === '30m') return minutes <= 30;
      if (timeFilter === '45m') return minutes <= 45;
      if (timeFilter === '1h') return minutes <= 60;
      if (timeFilter === '2h+') return minutes >= 90; // treat as long tasks
      return true;
    })();
    const energyMatch =
      energyLevel === 'All' ||
      task.energy === energyLevel ||
      !task.energy;
    return timeMatch && energyMatch;
  };

  const filteredInProgress = category.inProgress.filter(filterTask);
  const filteredUpNext = category.upNext.filter(filterTask);
  const filteredCompleted = category.completed.filter(filterTask);
  const hasFilteredResults = filteredInProgress.length > 0 || filteredUpNext.length > 0 || filteredCompleted.length > 0;

  return (
    <div className={`bg-gradient-to-br ${colors.bg} rounded-xl p-4 shadow-sm border ${colors.border} hover:shadow-md transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-900 dark:text-slate-100">{category.title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAddTaskModal && onOpenAddTaskModal(category.id, category.title, category.color)}
            className={`px-2.5 py-1.5 rounded-lg ${colors.progressBg} border ${colors.border} hover:border-slate-300 dark:hover:border-slate-600 transition-all group/add flex items-center gap-1.5`}
            title="Add task to this category"
          >
            <Plus className={`w-3.5 h-3.5 ${colors.accent} group-hover/add:scale-110 transition-transform`} />
            <span className={`text-xs ${colors.accent} hidden sm:inline`}>Add Task</span>
          </button>
          {!category.isDefault && onDeleteCategory && (
            <button
              onClick={() => onDeleteCategory(category)}
              className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-all group/delete flex items-center gap-1.5"
              title="Delete category and all its tasks"
            >
              <Trash className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 group-hover/delete:scale-110 transition-transform" />
              <span className="text-xs text-rose-600 dark:text-rose-400 hidden sm:inline">Delete</span>
            </button>
          )}
          <Badge variant="outline" className={colors.badge}>
            {filteredInProgress.length + filteredUpNext.length}
          </Badge>
          {(filteredInProgress.length + filteredUpNext.length) < (category.inProgress.length + category.upNext.length) && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              of {category.inProgress.length + category.upNext.length}
            </span>
          )}
        </div>
      </div>

      {!hasFilteredResults && (
        <div className="py-8 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-sm">No tasks match current filters</p>
          <p className="text-slate-400 dark:text-slate-600 text-xs mt-1">Try adjusting time or energy level</p>
        </div>
      )}

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">{selectedIds.size} selected</span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handleBulkAddToToday}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs text-teal-600 dark:text-teal-300 border border-teal-200 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/40"
            >
              <ArrowUpCircle className="w-3 h-3" />
              Add to Today
            </button>
            {onDeleteTask && (
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs text-rose-500 border border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/30"
              >
                <Trash className="w-3 h-3" />
                Delete
              </button>
            )}
          </div>
        </div>
      )}

      {filteredInProgress.length > 0 && (
        <div className="mb-3">
          <div className="mb-2">
            <span className="text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">In Progress</span>
          </div>
          <div className="space-y-1.5">
            {filteredInProgress.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                categoryTitle={category.title}
                pillText={sourceIcons[task.source] || 'Task'}
                onAddToToday={onAddToToday}
                onDeleteTask={onDeleteTask}
                selected={selectedIds.has(task.id)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
        </div>
      )}

      {filteredUpNext.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span className="text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Up Next</span>
          </div>
          <div className="space-y-1.5">
            {filteredUpNext.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                categoryTitle={category.title}
                pillText={sourceIcons[task.source] || 'Task'}
                onAddToToday={onAddToToday}
                onDeleteTask={onDeleteTask}
                selected={selectedIds.has(task.id)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
        </div>
      )}

      {hasFilteredResults && category.suggestedTask && (
        <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-3.5 h-3.5 ${colors.accent}`} />
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Suggested: <span className={colors.accent}>{category.suggestedTask}</span>
            </p>
          </div>
        </div>
      )}

      {filteredCompleted.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span className="text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Completed</span>
          </div>
          <div className="space-y-1.5">
            {filteredCompleted.map((task) => (
              <div
                key={task.id}
                className="w-full text-left px-3 py-2 bg-slate-100/70 dark:bg-slate-900/40 rounded-lg border border-slate-200/50 dark:border-slate-700/50 opacity-80"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-500 dark:text-slate-400 text-sm truncate line-through">{task.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {task.duration && <span className="text-xs text-slate-400 dark:text-slate-500">{task.duration}</span>}
                      {task.energy && (
                        <>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">{task.energy} energy</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-200 border border-slate-300/60 dark:border-slate-600/60 flex-shrink-0">
                      {sourceIcons[task.source] || 'Task'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-end mt-2">
                  {onRestoreTask && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestoreTask(task.id);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-teal-500 hover:text-teal-400"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restore
                    </button>
                  )}
                  {onDeleteTask && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-400"
                    >
                      <Trash className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
