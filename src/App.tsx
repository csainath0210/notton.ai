import { useState } from 'react';
import { CategoryCard } from './components/CategoryCard';
import { AddCategoryCard } from './components/AddCategoryCard';
import { TodayPlanner } from './components/TodayPlanner';
import { AmbientWellBeing } from './components/AmbientWellBeing';
import { ChatInput } from './components/ChatInput';
import { ChatModal } from './components/ChatModal';
import { ContextInsights } from './components/ContextInsights';
import { AddConfirmation } from './components/AddConfirmation';
import { ThemeToggle } from './components/ThemeToggle';
import { AddTaskToCategoryModal } from './components/AddTaskToCategoryModal';
import { Battery, Clock } from 'lucide-react';

export default function App() {
  const [timeFilter, setTimeFilter] = useState('30m');
  const [energyLevel, setEnergyLevel] = useState('Medium');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  
  // Add Task Modal State
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    title: string;
    color: string;
  } | null>(null);

  const [todaysTasks, setTodaysTasks] = useState([
    { id: '1', name: 'Section 2 of UX Report', category: 'Academics', completed: false, source: 'canvas' },
    { id: '2', name: 'Review Q4 marketing deck', category: 'Work', completed: false, source: 'slack' },
    { id: '3', name: 'Draft email to stakeholders', category: 'Work', completed: false, source: 'notion' },
    { id: '4', name: 'Morning meditation', category: 'Well-being', completed: false, source: 'notion' },
  ]);

  const [categories, setCategories] = useState([
    {
      id: '1',
      title: 'Work',
      color: 'teal',
      inProgress: [
        { id: '1', name: 'Finish onboarding doc revisions', status: 'got midway through this', source: 'notion', lastOpened: '5 min ago', duration: '30 min', energy: 'Medium' },
        { id: '2', name: 'Review design system proposal', status: 'started this', source: 'slack', lastOpened: '1h ago', duration: '45 min', energy: 'High' },
      ],
      upNext: [
        { id: '3', name: 'Update quarterly roadmap', duration: '20 min', focus: 'High', source: 'jira', energy: 'High' },
        { id: '4', name: 'Team standup notes', duration: '15 min', focus: 'Low', source: 'slack', energy: 'Low' },
        { id: '5', name: 'Review analytics dashboard', duration: '25 min', focus: 'Medium', source: 'notion', energy: 'Medium' },
      ],
      suggestedTask: 'Review Q4 marketing deck'
    },
    {
      id: '2',
      title: 'Academics',
      color: 'lavender',
      inProgress: [
        { id: '6', name: 'Section 2 of UX Report', status: 'got midway through this', source: 'canvas', lastOpened: 'recently', duration: '45 min', energy: 'High' },
      ],
      upNext: [
        { id: '7', name: 'Read Chapter 4 - Design Systems', duration: '30 min', focus: 'Medium', source: 'canvas', energy: 'Medium' },
        { id: '8', name: 'Prepare presentation slides', duration: '25 min', focus: 'High', source: 'notion', energy: 'High' },
        { id: '9', name: 'Review peer feedback on prototype', duration: '20 min', focus: 'Medium', source: 'slack', energy: 'Low' },
      ],
      suggestedTask: 'Read Chapter 4 - Design Systems'
    },
    {
      id: '3',
      title: 'Personal',
      color: 'blue',
      inProgress: [
        { id: '10', name: 'Plan weekend trip itinerary', status: 'started this', source: 'notion', lastOpened: '1h ago', duration: '30 min', energy: 'Low' },
      ],
      upNext: [
        { id: '11', name: 'Book dentist appointment', duration: '5 min', focus: 'Low', source: 'notion', energy: 'Low' },
        { id: '12', name: 'Reply to apartment inquiry', duration: '10 min', focus: 'Medium', source: 'slack', energy: 'Low' },
        { id: '13', name: 'Order birthday gift for mom', duration: '15 min', focus: 'Low', source: 'notion', energy: 'Low' },
      ],
      suggestedTask: 'Book dentist appointment'
    },
    {
      id: '4',
      title: 'Well-being',
      color: 'green',
      inProgress: [],
      upNext: [
        { id: '14', name: 'Morning meditation', duration: '15 min', focus: 'Low', source: 'notion', energy: 'Low' },
        { id: '15', name: 'Evening walk', duration: '30 min', focus: 'Low', source: 'notion', energy: 'Low' },
        { id: '16', name: 'Journal reflection', duration: '10 min', focus: 'Medium', source: 'notion', energy: 'Low' },
      ],
      suggestedTask: 'Morning meditation'
    },
  ]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleAddCategory = (newCategory: { title: string; color: string }) => {
    const category = {
      id: Date.now().toString(),
      title: newCategory.title,
      color: newCategory.color,
      inProgress: [],
      upNext: [],
      suggestedTask: 'No tasks yet'
    };
    setCategories([...categories, category]);
  };

  const handleChatSubmit = (message: string) => {
    setChatInitialMessage(message);
    setIsChatOpen(true);
  };

  const handleTaskClick = (task: any) => {
    console.log('Task clicked:', task);
  };

  const handleAddTask = (task: { name: string; category: string }) => {
    const newTask = {
      id: Date.now().toString(),
      name: task.name,
      category: task.category,
      completed: false,
      source: 'notion'
    };
    setTodaysTasks([...todaysTasks, newTask]);
  };

  const handleAddToToday = (task: any) => {
    // Check if task already in today's tasks
    const alreadyAdded = todaysTasks.some(t => t.id === task.id);
    if (alreadyAdded) {
      setConfirmationMessage(`${task.name} is already in today's tasks`);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2500);
      return;
    }

    // Add task to today's tasks
    const newTask = {
      id: task.id,
      name: task.name,
      category: task.category || 'Work',
      completed: false,
      source: task.source || 'notion'
    };
    setTodaysTasks([...todaysTasks, newTask]);
    
    // Show gentle confirmation
    setConfirmationMessage(`Added to Today`);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  const handleToggleTask = (taskId: string) => {
    setTodaysTasks(todaysTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleReorderTasks = (newOrder: typeof todaysTasks) => {
    setTodaysTasks(newOrder);
  };

  const handleOpenAddTaskModal = (categoryId: string, categoryTitle: string, categoryColor: string) => {
    setSelectedCategory({ id: categoryId, title: categoryTitle, color: categoryColor });
    setIsAddTaskModalOpen(true);
  };

  const handleAddTaskToCategory = (taskData: {
    name: string;
    duration: string;
    energy: string;
    addToToday: boolean;
  }) => {
    if (!selectedCategory) return;

    // Create new task
    const newTask = {
      id: Date.now().toString(),
      name: taskData.name,
      duration: taskData.duration,
      focus: 'Medium',
      source: 'notion',
      energy: taskData.energy,
    };

    // Add to category's upNext array
    setCategories(categories.map(cat => {
      if (cat.id === selectedCategory.id) {
        return {
          ...cat,
          upNext: [...cat.upNext, newTask]
        };
      }
      return cat;
    }));

    // Optionally add to today's tasks
    if (taskData.addToToday) {
      const todayTask = {
        id: newTask.id,
        name: newTask.name,
        category: selectedCategory.title,
        completed: false,
        source: 'notion'
      };
      setTodaysTasks([...todaysTasks, todayTask]);
    }

    // Show confirmation
    setConfirmationMessage(`Added to ${selectedCategory.title}`);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-slate-900 dark:text-slate-100">{getGreeting()}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Let's set up your day</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <AmbientWellBeing />
          </div>
        </div>

        {/* SECTION A: Plan Your Day - Today's Tasks */}
        <TodayPlanner 
          tasks={todaysTasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onReorderTasks={handleReorderTasks}
        />

        {/* SECTION D: Context-Aware Insights */}
        <ContextInsights />

        {/* SECTION C: Categories */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-slate-900 dark:text-slate-100">Your Areas</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Browse all tasks organized by category</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Time & Energy Filters */}
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <div className="inline-flex rounded-lg bg-white dark:bg-slate-800 p-0.5 shadow-sm border border-slate-200 dark:border-slate-700">
                  {['15m', '30m', '1h'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setTimeFilter(time)}
                      className={`px-2.5 py-1 rounded-md transition-all text-sm ${
                        timeFilter === time
                          ? 'bg-teal-500 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Battery className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <div className="inline-flex rounded-lg bg-white dark:bg-slate-800 p-0.5 shadow-sm border border-slate-200 dark:border-slate-700">
                  {['Low', 'Med', 'High'].map((energy, idx) => (
                    <button
                      key={energy}
                      onClick={() => setEnergyLevel(['Low', 'Medium', 'High'][idx])}
                      className={`px-2.5 py-1 rounded-md transition-all text-sm ${
                        energyLevel === ['Low', 'Medium', 'High'][idx]
                          ? energy === 'Low'
                            ? 'bg-blue-400 text-white shadow-sm'
                            : energy === 'Med'
                            ? 'bg-amber-400 text-white shadow-sm'
                            : 'bg-rose-400 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      {energy}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category}
                timeFilter={timeFilter}
                energyLevel={energyLevel}
                onTaskClick={handleTaskClick}
                onAddToToday={handleAddToToday}
                onOpenAddTaskModal={handleOpenAddTaskModal}
              />
            ))}
            <AddCategoryCard onAddCategory={handleAddCategory} />
          </div>
        </div>

        {/* Add padding at bottom for fixed chat input */}
        <div className="h-32 sm:h-40" />
      </div>

      {/* SECTION E: Chat Input - Fixed at bottom */}
      <ChatInput onSubmit={handleChatSubmit} />

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialMessage={chatInitialMessage}
      />

      {/* Add Confirmation */}
      <AddConfirmation
        isOpen={showConfirmation}
        message={confirmationMessage}
      />

      {/* Add Task to Category Modal */}
      <AddTaskToCategoryModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        category={selectedCategory}
        onAddTask={handleAddTaskToCategory}
      />
    </div>
  );
}