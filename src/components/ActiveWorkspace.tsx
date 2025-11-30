import { Badge } from './ui/badge';
import { ArrowRight } from 'lucide-react';

interface ActiveWorkspaceProps {
  task: {
    id: string;
    name: string;
    category: string;
    color: string;
    lastOpened: string;
  };
  onTaskClick: (task: any) => void;
}

const colorMap: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  teal: { 
    bg: 'bg-teal-50', 
    text: 'text-teal-700', 
    border: 'border-teal-300',
    gradient: 'from-teal-100/50 via-cyan-100/50 to-teal-50/50'
  },
  lavender: { 
    bg: 'bg-purple-50', 
    text: 'text-purple-700', 
    border: 'border-purple-300',
    gradient: 'from-purple-100/50 via-pink-100/50 to-purple-50/50'
  },
  blue: { 
    bg: 'bg-blue-50', 
    text: 'text-blue-700', 
    border: 'border-blue-300',
    gradient: 'from-blue-100/50 via-indigo-100/50 to-blue-50/50'
  },
  green: { 
    bg: 'bg-green-50', 
    text: 'text-green-700', 
    border: 'border-green-300',
    gradient: 'from-green-100/50 via-emerald-100/50 to-green-50/50'
  },
  orange: { 
    bg: 'bg-orange-50', 
    text: 'text-orange-700', 
    border: 'border-orange-300',
    gradient: 'from-orange-100/50 via-amber-100/50 to-orange-50/50'
  },
  pink: { 
    bg: 'bg-pink-50', 
    text: 'text-pink-700', 
    border: 'border-pink-300',
    gradient: 'from-pink-100/50 via-rose-100/50 to-pink-50/50'
  },
};

export function ActiveWorkspace({ task, onTaskClick }: ActiveWorkspaceProps) {
  const colors = colorMap[task.color] || colorMap.teal;

  return (
    <button
      onClick={() => onTaskClick(task)}
      className={`w-full text-left rounded-2xl p-8 border-2 ${colors.border} bg-gradient-to-br ${colors.gradient} shadow-md hover:shadow-lg transition-all group`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${colors.text.replace('text-', 'bg-')} animate-pulse`} />
            <span className="text-slate-500">You left off here</span>
          </div>
          <Badge variant="outline" className={`${colors.border} ${colors.bg} ${colors.text}`}>
            {task.category}
          </Badge>
        </div>
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-slate-900 mb-2 leading-snug group-hover:text-slate-700 transition-colors">
              {task.name}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Ready whenever you are. It's here waiting for you.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
        </div>
      </div>
    </button>
  );
}
