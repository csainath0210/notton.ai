import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface AddConfirmationProps {
  isOpen: boolean;
  message: string;
}

export function AddConfirmation({ isOpen, message }: AddConfirmationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.16, 1, 0.3, 1] // Smooth ease-out curve
          }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-4"
        >
          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800 shadow-lg">
            <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
              <Check className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            </div>
            <p className="text-slate-700 dark:text-slate-200 text-sm">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}