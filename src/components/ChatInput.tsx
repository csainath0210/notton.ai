import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
}

export function ChatInput({ onSubmit }: ChatInputProps) {
  const [input, setInput] = useState('');

  const quickActions = [
    "What should I work on?",
    "Show me what's in progress",
    "Help me return to something"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  const handleQuickAction = (action: string) => {
    onSubmit(action);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 shadow-lg z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3 sm:py-4">
        {/* Quick Actions */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-slate-400 dark:text-slate-500 text-sm whitespace-nowrap">Try:</span>
          <div className="flex gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all text-sm border border-slate-200 dark:border-slate-700 whitespace-nowrap"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 shadow-sm flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Notton.ai anything..."
              className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100 shadow-sm text-sm sm:text-base"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-400 hover:bg-purple-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex-shrink-0"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}