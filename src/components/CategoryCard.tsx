import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TaskItem } from './TaskItem';
import { Sparkles, Eye, Plus, Target } from 'lucide-react';

interface Task {
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
  taskCount: number;
  tasks: Task[];
  suggestedTask: string;
}

interface CategoryCardProps {
  category: Category;
}

const colorMap: Record<string, { bg: string; border: string; badge: string; accent: string }> = {
  teal: {
    bg: 'from-teal-50 to-cyan-50',
    border: 'border-teal-200/50',
    badge: 'bg-teal-100 text-teal-700 border-teal-200',
    accent: 'text-teal-600'
  },
  lavender: {
    bg: 'from-purple-50 to-pink-50',
    border: 'border-purple-200/50',
    badge: 'bg-purple-100 text-purple-700 border-purple-200',
    accent: 'text-purple-600'
  },
  blue: {
    bg: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200/50',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    accent: 'text-blue-600'
  },
  green: {
    bg: 'from-green-50 to-emerald-50',
    border: 'border-green-200/50',
    badge: 'bg-green-100 text-green-700 border-green-200',
    accent: 'text-green-600'
  },
  orange: {
    bg: 'from-orange-50 to-amber-50',
    border: 'border-orange-200/50',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    accent: 'text-orange-600'
  },
  pink: {
    bg: 'from-pink-50 to-rose-50',
    border: 'border-pink-200/50',
    badge: 'bg-pink-100 text-pink-700 border-pink-200',
    accent: 'text-pink-600'
  },
};

export function CategoryCard({ category }: CategoryCardProps) {
  const colors = colorMap[category.color] || colorMap.teal;

  return (
    <div className={`bg-gradient-to-br ${colors.bg} rounded-2xl p-6 shadow-sm border ${colors.border} hover:shadow-md transition-all`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-slate-900">{category.title}</h3>
        <Badge variant="outline" className={colors.badge}>
          {category.taskCount}
        </Badge>
      </div>

      {/* Tasks */}
      <div className="space-y-2 mb-4">
        {category.tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

      {/* AI Suggestion */}
      <div className={`flex items-center gap-2 py-3 px-4 bg-white/60 rounded-xl mb-4 border border-slate-200/50`}>
        <Sparkles className={`w-4 h-4 ${colors.accent}`} />
        <div className="flex-1">
          <p className="text-slate-500">AI suggests next:</p>
          <p className={`${colors.accent}`}>{category.suggestedTask}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white border-slate-200">
          <Eye className="w-4 h-4 mr-1" />
          View All
        </Button>
        <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white border-slate-200">
          <Plus className="w-4 h-4 mr-1" />
          Add Task
        </Button>
        <Button variant="outline" size="sm" className={`bg-white/50 hover:bg-white border-slate-200 ${colors.accent}`}>
          <Target className="w-4 h-4 mr-1" />
          Focus
        </Button>
      </div>
    </div>
  );
}
