import { useState } from 'react';
import { Plus, GripVertical, Check, Sparkles, Clock, Zap, Undo2, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  name: string;
  category: string;
  completed: boolean;
  source: string;
  duration?: string;
  energy?: string;
}

interface TodayPlannerProps {
  tasks: Task[];
  onAddTask: (task: { name: string; category: string; duration?: string; energy?: string; addToToday?: boolean }) => void;
  onToggleTask: (taskId: string) => void;
  onRemoveFromToday: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onReorderTasks: (tasks: Task[]) => void;
}

const sourceIcons: Record<string, string> = {
  slack: 'Slack',
  notion: 'Notion',
  canvas: 'Canvas',
  jira: 'Jira',
  manual: 'Manual',
};

const categoryColors: Record<string, string> = {
  Work: 'text-teal-600',
  Academics: 'text-purple-600',
  Personal: 'text-blue-600',
  'Well-being': 'text-green-600',
};

export function TodayPlanner({ tasks, onAddTask, onToggleTask, onRemoveFromToday, onDeleteTask, onReorderTasks }: TodayPlannerProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Work');
  const [newTaskDuration, setNewTaskDuration] = useState('');
  const [newTaskEnergy, setNewTaskEnergy] = useState('');
  const [addToToday, setAddToToday] = useState(true);

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      onAddTask({ 
        name: newTaskName, 
        category: newTaskCategory, 
        duration: newTaskDuration, 
        energy: newTaskEnergy,
        addToToday,
      });
      setNewTaskName('');
      setNewTaskDuration('');
      setNewTaskEnergy('');
      setAddToToday(true);
      setIsAddingTask(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setIsAddingTask(false);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-md border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-slate-900 dark:text-slate-100 mb-1">Today's Tasks</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {completedCount} of {totalCount} complete
          </p>
        </div>
        <Button
          onClick={() => setIsAddingTask(true)}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-sm w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Today's Task List */}
      <div className="space-y-2 mb-5">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl border transition-all ${
              task.completed
                ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                : 'bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {/* Drag Handle */}
            <GripVertical className="hidden sm:block w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 cursor-grab flex-shrink-0" />
            
            {/* Checkbox */}
            <button
              onClick={() => onToggleTask(task.id)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                task.completed
                  ? 'bg-teal-500 border-teal-500'
                  : 'border-slate-300 dark:border-slate-600 hover:border-teal-400 dark:hover:border-teal-500'
              }`}
            >
              {task.completed && <Check className="w-3.5 h-3.5 text-white" />}
            </button>

            {/* Task Info */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${
                task.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-slate-100'
              }`}>
                {task.name}
              </p>
              <p className={`text-xs mt-0.5 ${categoryColors[task.category] || 'text-slate-500 dark:text-slate-400'}`}>
                {task.category}
              </p>
            </div>

            {/* Source + Remove */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-200 border border-slate-300/60 dark:border-slate-600/60">
                {sourceIcons[task.source] || 'Task'}
              </span>
              <button
                onClick={() => onRemoveFromToday(task.id)}
                className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400"
              >
                <Undo2 className="w-3.5 h-3.5" />
                Move to category
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-xs text-rose-500 hover:text-rose-400 inline-flex items-center gap-1"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400 dark:text-slate-500">No tasks planned for today yet</p>
            <p className="text-slate-400 dark:text-slate-600 text-sm mt-1">Add a task to get started</p>
          </div>
        )}
      </div>

      {/* Add Task Form */}
      {isAddingTask && (
        <div className="mb-5 p-4 bg-slate-800/60 dark:bg-slate-900/80 rounded-xl border border-slate-700 dark:border-slate-600">
          {/* Task Name Input */}
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Task name..."
            className="w-full px-4 py-3 mb-3 rounded-lg border-2 border-teal-500/50 dark:border-teal-400/50 bg-slate-900 dark:bg-slate-950 text-slate-100 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
            autoFocus
            onKeyDown={handleKeyDown}
          />
          
          {/* Time Estimate Buttons */}
          <div className="mb-3">
            <label className="text-xs text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Time estimate
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['15 min', '30 min', '45 min', '1 hour', '2+ hours'].map((time) => (
                <button
                  key={time}
                  onClick={() => setNewTaskDuration(time)}
                  className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                    newTaskDuration === time
                      ? 'bg-teal-500 text-white shadow-sm'
                      : 'bg-slate-700/50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-400 hover:bg-slate-700 dark:hover:bg-slate-800 border border-slate-600 dark:border-slate-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level Buttons */}
          <div className="mb-3">
            <label className="text-xs text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Energy level
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: 'Low', color: 'blue' },
                { label: 'Medium', color: 'amber' },
                { label: 'High', color: 'rose' }
              ].map((level) => (
                <button
                  key={level.label}
                  onClick={() => setNewTaskEnergy(level.label)}
                  className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                    newTaskEnergy === level.label
                      ? level.color === 'blue' ? 'bg-blue-500 text-white shadow-sm' :
                        level.color === 'amber' ? 'bg-amber-500 text-white shadow-sm' :
                        'bg-rose-500 text-white shadow-sm'
                      : 'bg-slate-700/50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-400 hover:bg-slate-700 dark:hover:bg-slate-800 border border-slate-600 dark:border-slate-700'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Row: Category, Add to Today, Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-700 dark:border-slate-600">
            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-700 dark:bg-slate-800 text-slate-100 dark:text-slate-200 border border-slate-600 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-sm"
            >
              <option>Work</option>
              <option>Academics</option>
              <option>Personal</option>
              <option>Well-being</option>
            </select>
            
            {/* Add to Today Checkbox */}
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 dark:bg-slate-800/50 border border-slate-600 dark:border-slate-700 cursor-pointer hover:bg-slate-700 dark:hover:bg-slate-800 transition-all">
              <input
                type="checkbox"
                checked={addToToday}
                onChange={(e) => setAddToToday(e.target.checked)}
                className="w-4 h-4 rounded border-slate-500 text-teal-500 focus:ring-teal-400 focus:ring-offset-0"
              />
              <span className="text-xs text-slate-300 dark:text-slate-400">Add to Today</span>
            </label>

            <div className="flex gap-2 ml-auto">
              <Button onClick={handleAddTask} size="sm" className="bg-teal-500 hover:bg-teal-600 text-white">
                Add
              </Button>
              <Button onClick={() => setIsAddingTask(false)} size="sm" variant="outline" className="border-slate-600 dark:border-slate-700 text-slate-300 dark:text-slate-400 hover:bg-slate-700 dark:hover:bg-slate-800 hover:text-slate-200">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
