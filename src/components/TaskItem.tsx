import { Badge } from './ui/badge';
import { MessageSquare, CheckSquare, FileText, StickyNote } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  duration: string;
  focus: string;
  source: string;
}

interface TaskItemProps {
  task: Task;
}

const sourceIcons: Record<string, React.ReactNode> = {
  slack: <MessageSquare className="w-3 h-3" />,
  jira: <CheckSquare className="w-3 h-3" />,
  canvas: <FileText className="w-3 h-3" />,
  notion: <StickyNote className="w-3 h-3" />,
};

const focusColors: Record<string, string> = {
  High: 'bg-rose-100 text-rose-700 border-rose-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Low: 'bg-blue-100 text-blue-700 border-blue-200',
};

export function TaskItem({ task }: TaskItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl hover:bg-white transition-colors group cursor-pointer border border-transparent hover:border-slate-200">
      {/* Source Icon */}
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
        {sourceIcons[task.source]}
      </div>

      {/* Task Info */}
      <div className="flex-1 min-w-0">
        <p className="text-slate-800 truncate">{task.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-slate-500">{task.duration}</span>
          <span className="text-slate-300">•</span>
          <Badge variant="outline" className={`${focusColors[task.focus]}`}>
            {task.focus}
          </Badge>
        </div>
      </div>
    </div>
  );
}
