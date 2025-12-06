import { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, User, AlertCircle } from 'lucide-react';

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
  userId: string;
  apiKey?: string;
}

export function ChatModal({ isOpen, onClose, initialMessage, userId, apiKey }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && initialMessage && messages.length === 0) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: initialMessage,
        timestamp: new Date(),
      };
      setMessages([userMessage]);
      handleAIResponse(initialMessage);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const fetchUserContext = async () => {
    try {
      // Use the full backend URL
      const backendUrl = 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/api/chat/context`);
      if (!response.ok) throw new Error('Failed to fetch user context');
      return await response.json();
    } catch (err) {
      console.error('Error fetching context:', err);
      return null;
    }
  };

  const handleAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    setError(null);

    try {
      // Fetch user's tasks and categories from database
      const context = await fetchUserContext();
      
      if (!context) {
        throw new Error('Unable to connect to the task database. Please check if the backend server is running.');
      }

      // Build context for Gemini
      const systemPrompt = buildSystemPrompt(context);
      
      // Call Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser Question: ${userMessage}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Gemini API request failed');
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t generate a response.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI Response Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const buildSystemPrompt = (context: any) => {
    const { tasks, categories, stats } = context;

    let prompt = `You are Notton AI Assistant, a helpful task management assistant. You help users manage their tasks, prioritize work, and maintain productivity.

Current User Context:
- Total Tasks: ${stats.totalTasks}
- Active Tasks: ${stats.activeTasks}
- Completed Tasks: ${stats.completedTasks}
- Tasks in Today's List: ${stats.todayTasks}

Categories:`;

    categories.forEach((cat: any) => {
      prompt += `\n- ${cat.name}: ${cat.activeTasks} active tasks`;
    });

    prompt += `\n\nActive Tasks:`;
    
    const activeTasks = tasks.filter((t: any) => !t.completed);
    if (activeTasks.length === 0) {
      prompt += '\n- No active tasks';
    } else {
      activeTasks.forEach((task: any) => {
        const progress = task.inToday ? '(In Today)' : '';
        prompt += `\n- "${task.title}" - ${task.durationMinutes} min, ${task.energyLevel} energy, Category: ${task.category.name} ${progress}`;
      });
    }

    prompt += `\n\nInstructions:
- Help the user manage their tasks effectively
- Suggest tasks based on time available and energy level
- Provide specific task recommendations from their actual task list
- Help prioritize work and maintain work-life balance
- Be concise, friendly, and actionable
- When suggesting tasks, reference them by their actual titles
- Consider the task's duration, energy level, and category when making recommendations

Answer the user's question based on their actual task data.`;

    return prompt;
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (input.trim() && !isTyping) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input.trim(),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      
      await handleAIResponse(input.trim());
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
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notton AI Assistant</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

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
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
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
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask about your tasks..."
              rows={1}
              className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100 resize-none"
              style={{ maxHeight: '120px' }}
              disabled={isTyping}
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isTyping}
              className="rounded-full w-12 h-12 p-0 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}