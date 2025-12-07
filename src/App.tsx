import { useEffect, useState } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './components/ui/alert-dialog';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type ApiCategory = {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  isDefault: boolean;
  sortOrder: number;
};

type ApiTask = {
  id: string;
  categoryId: string;
  title: string;
  durationMinutes: number;
  energyLevel: 'low' | 'med' | 'high';
  source: string;
  inToday: boolean;
  todayPosition: number | null;
  completed: boolean;
  archivedAt?: string | null;
};

type TodayTask = {
  id: string;
  name: string;
  category: string;
  completed: boolean;
  source: string;
  duration?: string;
  energy?: string;
};

type CategoryView = {
  id: string;
  title: string;
  color: string;
  isDefault: boolean;
  inProgress: any[];
  upNext: any[];
  completed: any[];
  suggestedTask?: string;
};

const durationLabel = (minutes?: number) => {
  switch (minutes) {
    case 15:
      return '15 min';
    case 30:
      return '30 min';
    case 60:
      return '1 hour';
    case 120:
      return '2+ hours';
    default:
      return minutes ? `${minutes} min` : undefined;
  }
};

const energyLabel = (level?: 'low' | 'med' | 'high') => {
  if (!level) return undefined;
  if (level === 'low') return 'Low';
  if (level === 'med') return 'Medium';
  return 'High';
};

async function fetchJson<T>(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json() as Promise<T>;
}

export default function App() {
  const [timeFilter, setTimeFilter] = useState('All');
  const [energyLevel, setEnergyLevel] = useState('All');
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

  // Delete Category Confirmation State
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string;
    title: string;
    taskCount: number;
  } | null>(null);

  const [todaysTasks, setTodaysTasks] = useState<TodayTask[]>([]);
  const [categories, setCategories] = useState<CategoryView[]>([]);
  const [categoryLookup, setCategoryLookup] = useState<Record<string, ApiCategory>>({});

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const refreshData = async () => {
    try {
      const [catRes, taskRes, todayRes] = await Promise.all([
        fetchJson<ApiCategory[]>('/categories'),
        fetchJson<ApiTask[]>('/tasks'),
        fetchJson<ApiTask[]>('/today'),
      ]);

      const lookup: Record<string, ApiCategory> = {};
      catRes.forEach((c) => {
        lookup[c.id] = c;
      });
      setCategoryLookup(lookup);

      const categoryViews: CategoryView[] = catRes.map((cat) => {
        const upNext = taskRes
          .filter((task) => task.categoryId === cat.id && !task.inToday && !task.completed && !task.archivedAt)
          .map((task) => ({
            id: task.id,
            name: task.title,
            duration: durationLabel(task.durationMinutes),
            focus: 'Available',
            source: task.source,
            energy: energyLabel(task.energyLevel),
          }));

        const completed = taskRes
          .filter((task) => task.categoryId === cat.id && task.completed && !task.archivedAt)
          .map((task) => ({
            id: task.id,
            name: task.title,
            duration: durationLabel(task.durationMinutes),
            source: task.source,
            energy: energyLabel(task.energyLevel),
          }));

        return {
          id: cat.id,
          title: cat.name,
          color: cat.color || 'teal',
          isDefault: cat.isDefault,
          inProgress: [],
          upNext,
          completed,
          suggestedTask: upNext[0]?.name,
        };
      });

      const todayTasks: TodayTask[] = todayRes
        .filter((t) => !t.archivedAt)
        .map((task) => ({
          id: task.id,
          name: task.title,
          category: lookup[task.categoryId]?.name || 'Task',
          completed: task.completed,
          source: task.source,
          duration: durationLabel(task.durationMinutes),
          energy: energyLabel(task.energyLevel),
        }));

      setCategories(categoryViews);
      setTodaysTasks(todayTasks);
    } catch (error) {
      console.error('Failed to refresh data', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleChatSubmit = (message: string) => {
    setChatInitialMessage(message);
    setIsChatOpen(true);
  };

  const handleTaskClick = (task: any) => {
    console.log('Task clicked:', task);
  };

  const handleAddCategory = async (newCategory: { title: string; color: string }) => {
    try {
      await fetchJson('/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: newCategory.title,
          color: newCategory.color,
          sortOrder: categories.length + 1,
        }),
      });
      await refreshData();
    } catch (error) {
      console.error('Failed to add category', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await fetchJson(`/categories/${categoryId}`, {
        method: 'DELETE',
      });
      setCategoryToDelete(null);
      await refreshData();
      setConfirmationMessage('Category deleted');
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    } catch (error) {
      console.error('Failed to delete category', error);
      setCategoryToDelete(null);
    }
  };

  const handleRequestDeleteCategory = (category: CategoryView) => {
    const taskCount = category.inProgress.length + category.upNext.length + category.completed.length;
    setCategoryToDelete({
      id: category.id,
      title: category.title,
      taskCount,
    });
  };

  const handleAddToToday = (task: any) => {
    const alreadyAdded = todaysTasks.some((t) => t.id === task.id);
    if (alreadyAdded) return;

    fetchJson(`/tasks/${task.id}/today`, {
      method: 'PATCH',
      body: JSON.stringify({ inToday: true }),
    })
      .then(() => refreshData())
      .catch((err) => console.error('Failed to add to today', err));

    setConfirmationMessage(`Added to Today`);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  const handleToggleTask = (taskId: string) => {
    const target = todaysTasks.find((t) => t.id === taskId);
    if (!target) return;

    fetchJson(`/tasks/${taskId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: !target.completed }),
    })
      .then(() => refreshData())
      .catch((err) => console.error('Failed to toggle task', err));
  };

  const handleRemoveFromToday = (taskId: string) => {
    fetchJson(`/tasks/${taskId}/today`, {
      method: 'PATCH',
      body: JSON.stringify({ inToday: false }),
    })
      .then(() => refreshData())
      .catch((err) => console.error('Failed to move task back to category', err));
  };

  const handleReorderTasks = (newOrder: typeof todaysTasks) => {
    const ids = newOrder.map((t) => t.id);
    fetchJson('/today/reorder', {
      method: 'POST',
      body: JSON.stringify({ taskIds: ids }),
    })
      .then(() => refreshData())
      .catch((err) => console.error('Failed to reorder today tasks', err));
  };

  const handleDeleteTask = (taskId: string) => {
    // Optimistic UI update
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        upNext: cat.upNext.filter((t: any) => t.id !== taskId),
        inProgress: cat.inProgress.filter((t: any) => t.id !== taskId),
        completed: cat.completed.filter((t: any) => t.id !== taskId),
      }))
    );
    setTodaysTasks((prev) => prev.filter((t) => t.id !== taskId));

    fetchJson(`/tasks/${taskId}/archive`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    })
      .then(() => refreshData())
      .catch((err) => console.error('Failed to delete task', err));
  };

  const handleRestoreTask = (taskId: string) => {
    fetchJson(`/tasks/${taskId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: false }),
    })
      .then(() => refreshData())
      .catch((err) => console.error('Failed to restore task', err));
  };

  const handleOpenAddTaskModal = (categoryId: string, categoryTitle: string, categoryColor: string) => {
    setSelectedCategory({ id: categoryId, title: categoryTitle, color: categoryColor });
    setIsAddTaskModalOpen(true);
  };

  const handleAddTaskToCategory = (taskData: {
    name: string;
    duration: string;
    energy: 'low' | 'med' | 'high';
    addToToday: boolean;
  }) => {
    if (!selectedCategory) return;

    const durationMinutes = Number(taskData.duration) || 30;

    fetchJson('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: taskData.name,
        categoryId: selectedCategory.id,
        durationMinutes,
        energyLevel: taskData.energy,
        source: 'manual',
        addToToday: taskData.addToToday,
      }),
    })
      .then(() => {
        setConfirmationMessage(`Added to ${selectedCategory.title}`);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);
        refreshData();
      })
      .catch((err) => console.error('Failed to add task to category', err));
  };

  const handleAddTask = (task: { name: string; category: string; duration?: string; energy?: string; addToToday?: boolean }) => {
    const categoryEntry = Object.values(categoryLookup).find(
      (c) => c.name.toLowerCase() === task.category.toLowerCase()
    );
    if (!categoryEntry) {
      console.error('Category not found for task', task.category);
      return;
    }

    const durationMinutes = (() => {
      const parsed = parseInt(task.duration || '30', 10);
      if ([15, 30, 60, 120].includes(parsed)) return parsed;
      return 30;
    })();

    const energyLevel = (() => {
      const value = (task.energy || '').toLowerCase();
      if (value.startsWith('l')) return 'low' as const;
      if (value.startsWith('h')) return 'high' as const;
      return 'med' as const;
    })();

    fetchJson('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: task.name,
        categoryId: categoryEntry.id,
        durationMinutes,
        energyLevel,
        source: 'manual',
        addToToday: task.addToToday ?? true,
      }),
    })
      .then(() => refreshData())
      .catch((err) => console.error('Failed to add task from today planner', err));
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
          onRemoveFromToday={handleRemoveFromToday}
          onDeleteTask={handleDeleteTask}
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
                  {['All', '15m', '30m', '45m', '1h', '2h+'].map((time) => (
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
                  {['All', 'Low', 'Med', 'High'].map((energy, idx) => (
                    <button
                      key={energy}
                      onClick={() => setEnergyLevel(['All', 'Low', 'Medium', 'High'][idx])}
                      className={`px-2.5 py-1 rounded-md transition-all text-sm ${
                        energyLevel === ['All', 'Low', 'Medium', 'High'][idx]
                          ? energy === 'Low'
                            ? 'bg-blue-400 text-white shadow-sm'
                            : energy === 'Med'
                            ? 'bg-amber-400 text-white shadow-sm'
                            : energy === 'High'
                            ? 'bg-rose-400 text-white shadow-sm'
                            : 'bg-slate-600 text-white shadow-sm'
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
                onDeleteTask={handleDeleteTask}
                onRestoreTask={handleRestoreTask}
                onDeleteCategory={handleRequestDeleteCategory}
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
        initialMessage={chatInitialMessage || 'What should I work on today?'}
        userId={'default'}
        onTaskCreated={refreshData}
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

      {/* Delete Category Confirmation Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-100">
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
              {categoryToDelete && (
                <>
                  Are you sure you want to delete <strong>"{categoryToDelete.title}"</strong>?
                  {categoryToDelete.taskCount > 0 && (
                    <span className="block mt-2 text-rose-600 dark:text-rose-400">
                      This will permanently delete {categoryToDelete.taskCount} task{categoryToDelete.taskCount !== 1 ? 's' : ''} in this category.
                    </span>
                  )}
                  <span className="block mt-2">This action cannot be undone.</span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => categoryToDelete && handleDeleteCategory(categoryToDelete.id)}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
