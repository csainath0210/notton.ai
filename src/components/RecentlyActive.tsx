interface Task {
  id: string;
  name: string;
  category: string;
  lastOpened: string;
  color: string;
}

interface RecentlyActiveProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

const colorMap: Record<string, string> = {
  teal: 'bg-teal-500',
  lavender: 'bg-purple-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
};

export function RecentlyActive({ task, onTaskClick }: RecentlyActiveProps) {
  return (
    <button
      onClick={() => onTaskClick(task)}
      className="text-left px-4 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all group shadow-sm hover:shadow"
    >
      <div className="flex items-start gap-2.5 mb-2">
        <div className={`w-2 h-2 rounded-full ${colorMap[task.color] || 'bg-teal-500'} mt-1.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="text-slate-900 dark:text-slate-100 text-sm truncate group-hover:text-slate-700 dark:group-hover:text-slate-200">
            {task.name}
          </p>
        </div>
      </div>
      <div className="ml-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">{task.category}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Last opened {task.lastOpened}</p>
      </div>
    </button>
  );
}