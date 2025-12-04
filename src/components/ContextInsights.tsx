import { Sparkles, Clock, Bell, Check } from 'lucide-react';

export function ContextInsights() {
  const insights = [
    {
      icon: Check,
      text: 'TODO: Update this Context Insights section after the LLM is implemented',
      color: 'text-indigo-400'
    },
    {
      icon: Sparkles,
      text: 'You last worked on your UX report — pick it up if you\'d like',
      color: 'text-indigo-400'
    },
    {
      icon: Clock,
      text: 'You have a short window before your next meeting',
      color: 'text-amber-400'
    },
  ];

  return (
    <div className="bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 sm:p-5 border border-indigo-200/30 dark:border-indigo-800/30">
      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className="flex items-start gap-3">
              <Icon className={`w-4 h-4 ${insight.color} mt-0.5 flex-shrink-0`} />
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {insight.text}
              </p>
            </div>
          );
        })}
        <div className="flex items-start gap-3 pt-2 border-t border-indigo-200/30 dark:border-indigo-800/30">
          <Bell className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            A few tasks you care about might need attention
          </p>
        </div>
      </div>
    </div>
  );
}