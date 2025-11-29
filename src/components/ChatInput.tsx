import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
}

export function ChatInput({ onSubmit }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-50/90 backdrop-blur-xl border-t border-slate-200/50 shadow-lg z-40">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Notton anything..."
              className="w-full px-5 py-3 rounded-full bg-white/80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}