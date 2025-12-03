import { X, Coffee, Droplet, Wind, Moon, Footprints } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WellBeingMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const wellBeingActions = [
  {
    id: 'break',
    icon: Coffee,
    label: 'Take a 5-min break',
    description: 'Step away and rest your mind',
    color: 'from-amber-400 to-orange-400'
  },
  {
    id: 'water',
    icon: Droplet,
    label: 'Drink some water',
    description: 'Stay hydrated',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    id: 'breathe',
    icon: Wind,
    label: 'Breathing exercise',
    description: '1 minute mindful breathing',
    color: 'from-teal-400 to-emerald-400'
  },
  {
    id: 'stretch',
    icon: Footprints,
    label: 'Stretch & move',
    description: 'Quick body movement',
    color: 'from-purple-400 to-pink-400'
  },
  {
    id: 'rest',
    icon: Moon,
    label: 'Rest your eyes',
    description: 'Look away from screen',
    color: 'from-indigo-400 to-violet-400'
  }
];

export function WellBeingMenu({ isOpen, onClose }: WellBeingMenuProps) {
  const handleAction = (actionId: string) => {
    // Here you could trigger specific actions or timers
    console.log('Well-being action:', actionId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 right-4 sm:right-8 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center shadow-sm">
                  <Wind className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-slate-100">Take care of yourself</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Quick well-being actions</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Actions */}
            <div className="p-3 space-y-2">
              {wellBeingActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-slate-900 dark:text-slate-100 text-sm">{action.label}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">{action.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
              <p className="text-slate-400 dark:text-slate-500 text-xs text-center">
                Small breaks help you stay focused and energized
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
