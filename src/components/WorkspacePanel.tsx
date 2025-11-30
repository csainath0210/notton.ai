import { Play, Pause, StickyNote, Clock, ArrowLeftRight, Circle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ActiveTask {
  id: string;
  name: string;
  category: string;
  progress: number;
  timeActive: number;
  color: string;
}

interface RecentTask {
  id: string;
  name: string;
  progress: string;
  lastActive: string;
  category: string;
  color: string;
}

interface WorkspacePanelProps {
  activeTask: ActiveTask;
  recentTasks: RecentTask[];
  onTaskSwitch: () => void;
}

const colorMap: Record<string, string> = {
  teal: 'bg-teal-500',
  lavender: 'bg-purple-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
};

export function WorkspacePanel({ activeTask, recentTasks, onTaskSwitch }: WorkspacePanelProps) {
  return (
    <div className="fixed left-0 top-0 h-screen w-80 bg-white border-r border-slate-200 shadow-lg flex flex-col z-30">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-slate-900">Active Workspace</span>
        </div>
        <p className="text-slate-500 text-sm">Always on, always ready</p>
      </div>

      {/* Current Active Task */}
      <div className="px-6 py-6 border-b border-slate-200">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Current Task</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
              {activeTask.category}
            </Badge>
          </div>
          <h3 className="text-slate-900 mb-3 leading-snug">{activeTask.name}</h3>
          
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-600 text-sm">Progress</span>
              <span className="text-slate-900">{activeTask.progress}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${colorMap[activeTask.color] || 'bg-teal-500'} transition-all duration-500`}
                style={{ width: `${activeTask.progress}%` }}
              />
            </div>
          </div>

          {/* Time Active */}
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Clock className="w-4 h-4" />
            <span>Working for {activeTask.timeActive} minutes</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button className="bg-teal-500 hover:bg-teal-600 text-white shadow-sm">
            <Play className="w-4 h-4 mr-2" />
            Resume
          </Button>
          <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button 
            variant="outline" 
            className="border-slate-200 hover:bg-slate-50"
            onClick={onTaskSwitch}
          >
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            Switch
          </Button>
          <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
            <StickyNote className="w-4 h-4 mr-2" />
            Note
          </Button>
        </div>
      </div>

      {/* Recently Active Tasks */}
      <div className="flex-1 px-6 py-5 overflow-y-auto">
        <h4 className="text-slate-700 mb-3">Recently Active</h4>
        <div className="space-y-2">
          {recentTasks.map((task) => (
            <button
              key={task.id}
              className="w-full text-left px-3 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all group"
            >
              <div className="flex items-start gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${colorMap[task.color] || 'bg-teal-500'} mt-1.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-sm truncate group-hover:text-slate-700">
                    {task.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between ml-4">
                <span className="text-xs text-slate-500">{task.progress}</span>
                <span className="text-xs text-slate-400">{task.lastActive}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Circle className="w-3 h-3 text-green-500 fill-green-500" />
            <span className="text-slate-600">Session active</span>
          </div>
          <span className="text-slate-500">2h 14m</span>
        </div>
      </div>
    </div>
  );
}
