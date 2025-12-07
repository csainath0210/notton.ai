import { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, User, AlertCircle, CheckCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  taskCreated?: {
    id: string;
    title: string;
  };
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage: string;
  userId: string;
  onTaskCreated?: () => void; // Callback to refresh tasks in parent component
}

interface TaskCreationRequest {
  title: string;
  categoryId: string;
  durationMinutes: number;
  energyLevel: 'low' | 'med' | 'high';
  addToToday?: boolean;
}

export function ChatModal({ isOpen, onClose, initialMessage, onTaskCreated }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setInput('');
      setError(null);
    }
  }, [isOpen]);

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
      const response = await fetch(`${API_BASE_URL}/api/chat/context`);
      if (!response.ok) throw new Error('Failed to fetch user context');
      return await response.json();
    } catch (err) {
      console.error('Error fetching context:', err);
      return null;
    }
  };

  const createTask = async (taskData: TaskCreationRequest) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskData,
          source: 'manual',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const createdTask = await response.json();
      return createdTask;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  };

  const parseTaskCreationFromAI = (aiResponse: string): TaskCreationRequest | null => {

    const jsonMatch = aiResponse.match(/\{[^}]*"action":\s*"create_task"[^}]*\}/);
    if (!jsonMatch) return null;

    try {
      const taskRequest = JSON.parse(jsonMatch[0]);

      if (!taskRequest.title || !taskRequest.categoryId || !taskRequest.durationMinutes || !taskRequest.energyLevel) {
        return null;
      }

      return {
        title: taskRequest.title,
        categoryId: taskRequest.categoryId,
        durationMinutes: taskRequest.durationMinutes,
        energyLevel: taskRequest.energyLevel,
        addToToday: taskRequest.addToToday || false,
      };
    } catch (err) {
      console.error('Error parsing task creation:', err);
      return null;
    }
  };

  const stripSimpleMarkdown = (text: string) => {
    return text
      // strip fenced code blocks (with or without language label)
      .replace(/```[a-zA-Z0-9]*\s*([\s\S]*?)```/g, '$1')
      // inline code
      .replace(/`([^`]*)`/g, '$1')
      // bold / italics
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      // bullet markers normalize
      .replace(/^\s*[-*+]\s+/gm, '- ')
      // collapse extra blank lines
      .replace(/\r?\n\r?\n+/g, '\n\n')
      .trim();
  };

  const handleAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    setError(null);

    try {
      const context = await fetchUserContext();

      if (!context) {
        throw new Error('Unable to connect to the task database. Please check if the backend server is running.');
      }

      const systemPrompt = buildSystemPrompt(context);

      const aiResp = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          reasoningEnabled: true,
        }),
      });

      if (!aiResp.ok) {
        const text = await aiResp.text();
        throw new Error(text || 'AI request failed');
      }

      const data = await aiResp.json();
      const rawResponse = data?.message?.content || 'Sorry, I couldnâ€™t generate a response.';
      const aiResponse = stripSimpleMarkdown(rawResponse);

      const taskCreationRequest = parseTaskCreationFromAI(aiResponse);

      let createdTask = null;
      if (taskCreationRequest) {
        try {
          createdTask = await createTask(taskCreationRequest);

          const systemMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'system',
            content: `âœ“ Task created: "${createdTask.title}"`,
            timestamp: new Date(),
            taskCreated: {
              id: createdTask.id,
              title: createdTask.title,
            },
          };
          setMessages(prev => [...prev, systemMessage]);

          if (onTaskCreated) {
            onTaskCreated();
          }
        } catch (err) {
          console.error('Failed to create task:', err);
        }
      }

      const cleanedResponse = aiResponse.replace(/\{[^}]*"action":\s*"create_task"[^}]*\}/g, '').trim();

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: cleanedResponse || aiResponse,
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

Available Categories:`;

    categories.forEach((cat: any) => {
      prompt += `\n- ${cat.name} (ID: ${cat.id}): ${cat.activeTasks} active tasks${cat.description ? ' - ' + cat.description : ''}`;
    });

    prompt += `\n\nActive Tasks:`;

    const activeTasks = tasks.filter((t: any) => !t.completed);
    if (activeTasks.length === 0) {
      prompt += '\n- No active tasks';
    } else {
      activeTasks.slice(0, 20).forEach((task: any) => {
        const progress = task.inToday ? '(In Today)' : '';
        prompt += `\n- "${task.title}" - ${task.durationMinutes} min, ${task.energyLevel} energy, Category: ${task.category.name} ${progress}`;
      });
    }

    prompt += `\n\nCapabilities:
- Help users manage and prioritize their tasks
- Suggest tasks based on time available and energy level
- **CREATE NEW TASKS** when users ask you to add, create, or make a new task
- Provide specific task recommendations from their actual task list
- Help prioritize work and maintain work-life balance

TASK CREATION INSTRUCTIONS:
When a user asks you to create a task (e.g., "add a task to...", "create a task for...", "remind me to..."), you MUST:
1. Extract the task details from their request
2. Choose the most appropriate category ID from the available categories above
3. Estimate duration (15, 30, 60, or 120 minutes)
4. Assess energy level (low, med, or high)
5. Output a JSON object in this EXACT format:
   {"action": "create_task", "title": "Task title", "categoryId": "uuid-here", "durationMinutes": 30, "energyLevel": "med", "addToToday": false}

6. After the JSON, provide a friendly confirmation message to the user

Example:
User: "Add a task to review the quarterly report"
Your response: {"action": "create_task", "title": "Review quarterly report", "categoryId": "${categories[0]?.id}", "durationMinutes": 60, "energyLevel": "high", "addToToday": false}

I've added a task to review the quarterly report. It's set for 60 minutes with high energy required. Would you like me to add it to your Today list?

IMPORTANT:
- Always use valid category IDs from the list above
- Duration must be exactly 15, 30, 60, or 120
- Energy level must be exactly "low", "med", or "high"
- Be conversational and friendly in your responses
- When suggesting tasks, reference them by their actual titles
- Consider the task's duration, energy level, and category when making recommendations`;

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
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Powered by OpenRouter (Nova 2 Lite) - Free tier, responses may be slower - Can create tasks
              </p>
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
            <div key={message.id}>
              {message.role === 'system' ? (
                <div className="flex items-center justify-center">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full px-4 py-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <p className="text-sm text-green-700 dark:text-green-300">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
              placeholder="Ask about tasks or say 'create a task to...'"
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


