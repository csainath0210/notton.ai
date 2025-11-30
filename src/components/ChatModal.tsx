import { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, User } from 'lucide-react';
import { Button } from './ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage: string;
}

export function ChatModal({ isOpen, onClose, initialMessage }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && initialMessage && messages.length === 0) {
      // Add initial user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: initialMessage,
        timestamp: new Date(),
      };
      setMessages([userMessage]);
      
      // Simulate AI response after a short delay
      setIsTyping(true);
      setTimeout(() => {
        const aiResponse = generateAIResponse(initialMessage);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
        };
        setMessages([userMessage, assistantMessage]);
        setIsTyping(false);
      }, 1500);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Task switching responses
    if (lowerMessage.includes('switch') && (lowerMessage.includes('onboarding') || lowerMessage.includes('doc'))) {
      return "Switching you back to 'Onboarding documentation for new hires' in your Work category — you were 40% done. I'll open this task in focus mode. Should I start a timer for 30 minutes?";
    }
    
    if (lowerMessage.includes('switch') && lowerMessage.includes('ux report')) {
      return "Resuming 'Section 2 of UX Report' from your Academics category — you're 65% done and making great progress! Should I enable focus mode to help you finish this section?";
    }
    
    if (lowerMessage.includes('switch') || lowerMessage.includes('back to')) {
      return "I can help you switch between your in-progress tasks. You currently have 4 tasks in progress:\n\n• Onboarding documentation (40% done)\n• Draft email to stakeholders (Midway)\n• Section 2 of UX Report (65% done)\n• Plan weekend trip itinerary (Started)\n\nWhich one would you like to resume?";
    }
    
    // Time-based responses
    if (lowerMessage.includes('20 minutes') || lowerMessage.includes('20 min')) {
      return "Perfect! For a 20-minute window, I'd suggest:\n\n1. **Draft email to stakeholders** (20 min, High focus) — you're already midway through this\n2. **Plan weekend trip itinerary** (20 min remaining) — finish what you started\n3. **Book dentist appointment** (5 min) + **Reply to apartment inquiry** (10 min) — quick wins!\n\nWhich sounds best?";
    }
    
    if (lowerMessage.includes('low energy') || lowerMessage.includes('low-energy')) {
      return "Here are your best low-energy options right now:\n\n• Book dentist appointment (5 min)\n• Morning meditation (15 min)\n• Reply to apartment inquiry (10 min)\n• Evening walk (30 min)\n\nI'd start with the dentist appointment — it's quick and gives you momentum!";
    }
    
    if (lowerMessage.includes('task') || lowerMessage.includes('to do') || lowerMessage.includes('todo')) {
      return "I can help you manage your tasks! You have 4 tasks in progress and 11 tasks queued up. Based on your current energy level, I'd recommend resuming 'Section 2 of UX Report' — you're 65% done and on a roll. Want to finish it?";
    }
    
    if (lowerMessage.includes('focus') || lowerMessage.includes('concentrate')) {
      return "I notice you have several high-focus tasks ahead. I'd suggest tackling them during your peak productivity hours. Would you like to enable Focus Mode? It will help you work distraction-free on your most important tasks.";
    }
    
    if (lowerMessage.includes('schedule') || lowerMessage.includes('plan')) {
      return "Looking at your categories, I can help you create a balanced schedule. You have 4 tasks in progress and 11 pending. Let's prioritize:\n\n1. Finish your in-progress tasks first (better for context)\n2. Tackle high-focus work during peak energy\n3. Save low-energy tasks for later\n\nHow would you like to structure your time?";
    }
    
    if (lowerMessage.includes('break') || lowerMessage.includes('rest')) {
      return "It's great that you're thinking about breaks! I recommend taking a 15-minute break after every 90 minutes of focused work. Your Well-being category has some great options like 'Morning meditation' or 'Evening walk'. Would you like to schedule one?";
    }
    
    return "I'm here to help you stay productive and balanced! I can help you:\n\n• Switch between in-progress tasks\n• Suggest tasks based on your time and energy\n• Prioritize what matters most\n• Keep track of progress\n\nWhat would you like to do?";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input.trim(),
        timestamp: new Date(),
      };
      
      setMessages([...messages, userMessage]);
      setInput('');
      setIsTyping(true);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = generateAIResponse(input.trim());
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-950/30 dark:to-teal-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-slate-100">Notton AI Assistant</h3>
              <p className="text-slate-500 dark:text-slate-400">Always here to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-white dark:bg-slate-900">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center shadow-sm flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center shadow-sm flex-shrink-0">
                  <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center shadow-sm flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-800">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100 resize-none"
              style={{ maxHeight: '120px' }}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="rounded-full w-12 h-12 p-0 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 shadow-md hover:shadow-lg"
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}