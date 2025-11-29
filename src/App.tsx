import { useState } from 'react';
import { CategoryCard } from './components/CategoryCard';
import { AddCategoryCard } from './components/AddCategoryCard';
import { WellBeingPrompt } from './components/WellBeingPrompt';
import { ChatInput } from './components/ChatInput';
import { ChatModal } from './components/ChatModal';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Sparkles, Zap, Battery, Clock } from 'lucide-react';

export default function App() {
  const [timeFilter, setTimeFilter] = useState('30m');
  const [energyLevel, setEnergyLevel] = useState('Medium');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState('');
  const [categories, setCategories] = useState([
    {
      id: '1',
      title: 'Work',
      color: 'teal',
      taskCount: 8,
      tasks: [
        { id: '1', name: 'Review Q4 marketing deck', duration: '15 min', focus: 'High', source: 'slack' },
        { id: '2', name: 'Update team on project status', duration: '10 min', focus: 'Medium', source: 'slack' },
        { id: '3', name: 'Draft email to stakeholders', duration: '20 min', focus: 'High', source: 'notion' },
      ],
      suggestedTask: 'Review Q4 marketing deck'
    },
    {
      id: '2',
      title: 'Academics',
      color: 'lavender',
      taskCount: 5,
      tasks: [
        { id: '4', name: 'Finish Section 2 of UX Report', duration: '45 min', focus: 'High', source: 'canvas' },
        { id: '5', name: 'Read Chapter 4 - Design Systems', duration: '30 min', focus: 'Medium', source: 'canvas' },
        { id: '6', name: 'Prepare presentation slides', duration: '25 min', focus: 'High', source: 'notion' },
      ],
      suggestedTask: 'Finish Section 2 of UX Report'
    },
    {
      id: '3',
      title: 'Personal',
      color: 'blue',
      taskCount: 4,
      tasks: [
        { id: '7', name: 'Book dentist appointment', duration: '5 min', focus: 'Low', source: 'notion' },
        { id: '8', name: 'Plan weekend trip itinerary', duration: '20 min', focus: 'Medium', source: 'notion' },
        { id: '9', name: 'Reply to apartment inquiry', duration: '10 min', focus: 'Medium', source: 'slack' },
      ],
      suggestedTask: 'Book dentist appointment'
    },
    {
      id: '4',
      title: 'Well-being',
      color: 'green',
      taskCount: 3,
      tasks: [
        { id: '10', name: 'Morning meditation', duration: '15 min', focus: 'Low', source: 'notion' },
        { id: '11', name: 'Evening walk', duration: '30 min', focus: 'Low', source: 'notion' },
        { id: '12', name: 'Journal reflection', duration: '10 min', focus: 'Medium', source: 'notion' },
      ],
      suggestedTask: 'Morning meditation'
    },
  ]);

  const nextActions = [
    { text: 'Review Q4 marketing deck', icon: 'sparkles', duration: '15m' },
    { text: 'Finish Section 2 of UX Report', icon: 'zap', duration: '45m' },
    { text: 'Book dentist appointment', icon: 'clock', duration: '5m' },
  ];

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
      taskCount: 0,
      tasks: [],
      suggestedTask: 'No tasks yet'
    };
    setCategories([...categories, category]);
  };

  const handleChatSubmit = (message: string) => {
    setChatInitialMessage(message);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Top Section */}
        <div className="space-y-6">
          {/* Greeting */}
          <div>
            <h1 className="text-slate-900 mb-1">{getGreeting()}, here's what makes sense right now.</h1>
            <p className="text-slate-500">Let's focus on what matters most today</p>
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Time Selector */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <div className="inline-flex rounded-full bg-white p-1 shadow-sm border border-slate-200">
                {['15m', '30m', '1h'].map((time) => (
                  <button
                    key={time}
                    onClick={() => setTimeFilter(time)}
                    className={`px-4 py-1.5 rounded-full transition-all ${
                      timeFilter === time
                        ? 'bg-teal-500 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Selector */}
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-slate-400" />
              <div className="inline-flex rounded-full bg-white p-1 shadow-sm border border-slate-200">
                {['Low', 'Medium', 'High'].map((energy) => (
                  <button
                    key={energy}
                    onClick={() => setEnergyLevel(energy)}
                    className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                      energyLevel === energy
                        ? energy === 'Low'
                          ? 'bg-blue-400 text-white shadow-sm'
                          : energy === 'Medium'
                          ? 'bg-amber-400 text-white shadow-sm'
                          : 'bg-rose-400 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      energyLevel === energy
                        ? 'bg-white'
                        : energy === 'Low'
                        ? 'bg-blue-400'
                        : energy === 'Medium'
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`} />
                    {energy}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Where You Left Off */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-sm border border-indigo-200/50">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <h3 className="text-slate-900">Where You Left Off</h3>
              </div>
              <p className="text-slate-600">
                Drafting Section 2 of UX Report — you were on a roll!
              </p>
              <p className="text-slate-500">
                Last active: 2 hours ago
              </p>
            </div>
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm">
              Resume
            </Button>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div>
          <h2 className="text-slate-900 mb-4">Your Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
            <AddCategoryCard onAddCategory={handleAddCategory} />
          </div>
        </div>

        {/* AI Recommendation Strip */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="text-slate-900">Your Next Three Actions</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {nextActions.map((action, index) => (
              <button
                key={index}
                className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 rounded-full border border-purple-200/50 transition-all hover:shadow-md group"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  {index === 0 && <Sparkles className="w-4 h-4 text-purple-500" />}
                  {index === 1 && <Zap className="w-4 h-4 text-amber-500" />}
                  {index === 2 && <Clock className="w-4 h-4 text-teal-500" />}
                </div>
                <span className="text-slate-700 group-hover:text-slate-900 transition-colors">{action.text}</span>
                <Badge variant="secondary" className="bg-white/80">
                  {action.duration}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Well-Being Prompt */}
        <WellBeingPrompt />

        {/* Add padding at bottom for fixed chat input */}
        <div className="h-24" />
      </div>

      {/* Chat Input - Fixed at bottom */}
      <ChatInput onSubmit={handleChatSubmit} />

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialMessage={chatInitialMessage}
      />
    </div>
  );
}