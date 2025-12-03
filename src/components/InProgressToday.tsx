import { ArrowRight } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  category: string;
  context: string;
  lastOpened: string;
  color: string;
}

interface InProgressTodayProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const colorMap: Record<string, { gradient: string; border: string; dot: string }> = {
  teal: { 
    gradient: 'from-teal-100/50 via-cyan-100/50 to-teal-50/50',
    border: 'border-teal-300',
    dot: 'bg-teal-500'
  },
  lavender: { 
    gradient: 'from-purple-100/50 via-pink-100/50 to-purple-50/50',
    border: 'border-purple-300',
    dot: 'bg-purple-500'
  },
  blue: { 
    gradient: 'from-blue-100/50 via-indigo-100/50 to-blue-50/50',
    border: 'border-blue-300',
    dot: 'bg-blue-500'
  },
  green: { 
    gradient: 'from-green-100/50 via-emerald-100/50 to-green-50/50',
    border: 'border-green-300',
    dot: 'bg-green-500'
  },
};

export function InProgressToday({ tasks, onTaskClick }: InProgressTodayProps) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-slate-900 dark:text-slate-100">In Progress Today</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Tasks you're working on right now</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {tasks.map((task) => {
          const colors = colorMap[task.color] || colorMap.teal;
          return (
            <button
              key={task.id}
              onClick={() => onTaskClick(task)}
              className={`text-left rounded-xl p-4 sm:p-5 border-2 ${colors.border} dark:border-opacity-50 bg-gradient-to-br ${colors.gradient} dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 shadow-sm hover:shadow-md transition-all group`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} animate-pulse`} />
                      <span className="text-slate-500 dark:text-slate-400 text-sm">{task.category}</span>
                    </div>
                    <h4 className="text-slate-900 dark:text-slate-100 leading-snug group-hover:text-slate-700 dark:group-hover:text-slate-200">
                      {task.name}
                    </h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {task.context}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}