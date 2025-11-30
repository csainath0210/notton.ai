import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Clock, Battery, CheckCircle } from 'lucide-react';

interface AddTaskToCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    id: string;
    title: string;
    color: string;
  } | null;
  onAddTask: (taskData: {
    name: string;
    duration: string;
    energy: string;
    addToToday: boolean;
  }) => void;
}

const colorMap: Record<string, { accent: string; bg: string }> = {
  teal: { accent: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-900/30' },
  lavender: { accent: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  blue: { accent: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  green: { accent: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
  orange: { accent: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  pink: { accent: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-100 dark:bg-pink-900/30' },
};

const timeOptions = [
  { label: '15m', value: '15', minutes: 15 },
  { label: '30m', value: '30', minutes: 30 },
  { label: '45m', value: '45', minutes: 45 },
  { label: '1h', value: '60', minutes: 60 },
  { label: '2+ hrs', value: '120', minutes: 120 },
];

const energyOptions = [
  { label: 'Low', value: 'Low', color: 'from-blue-400 to-cyan-400' },
  { label: 'Med', value: 'Medium', color: 'from-amber-400 to-orange-400' },
  { label: 'High', value: 'High', color: 'from-rose-400 to-pink-400' },
];

export function AddTaskToCategoryModal({ 
  isOpen, 
  onClose, 
  category,
  onAddTask 
}: AddTaskToCategoryModalProps) {
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState('30');
  const [energy, setEnergy] = useState('Medium');
  const [addToToday, setAddToToday] = useState(false);

  const colors = colorMap[category?.color || 'teal'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim()) {
      onAddTask({
        name: taskName,
        duration,
        energy,
        addToToday,
      });
      // Reset form
      setTaskName('');
      setDuration('30');
      setEnergy('Medium');
      setAddToToday(false);
      onClose();
    }
  };

  const handleClose = () => {
    // Reset form on close
    setTaskName('');
    setDuration('30');
    setEnergy('Medium');
    setAddToToday(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-100">
            Add Task to {category?.title || 'Category'}
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Create a new task in this category
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="task-name" className="text-slate-700 dark:text-slate-300">
              Task Name
            </Label>
            <Input
              id="task-name"
              placeholder="e.g., Review pull requests, Write blog post"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              autoFocus
              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Time Estimate */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5" />
              Time Estimate
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDuration(option.value)}
                  className={`px-3 py-2.5 rounded-lg text-sm transition-all border ${
                    duration === option.value
                      ? `${colors.bg} ${colors.accent} border-slate-300 dark:border-slate-600 shadow-sm`
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Battery className="w-3.5 h-3.5" />
              Energy Level
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {energyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setEnergy(option.value)}
                  className={`px-3 py-2.5 rounded-lg text-sm transition-all border ${
                    energy === option.value
                      ? 'bg-gradient-to-r text-white border-transparent shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                  style={
                    energy === option.value
                      ? { backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }
                      : undefined
                  }
                >
                  <span className={energy === option.value ? '' : option.color}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Add to Today Checkbox */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800">
            <button
              type="button"
              onClick={() => setAddToToday(!addToToday)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                addToToday
                  ? 'bg-teal-500 border-teal-500'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
              }`}
            >
              {addToToday && <CheckCircle className="w-4 h-4 text-white" />}
            </button>
            <label
              onClick={() => setAddToToday(!addToToday)}
              className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer flex-1"
            >
              Add to Today's tasks
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white"
              disabled={!taskName.trim()}
            >
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}