import { Button } from './ui/button';
import { Heart, Droplet } from 'lucide-react';

export function WellBeingPrompt() {
  return (
    <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 shadow-sm border border-green-200/50">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
          <Heart className="w-6 h-6 text-green-500" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-slate-900 mb-2">Time for a mindful pause</h3>
          <p className="text-slate-600 mb-4">
            You've been working for 48 minutes — want a quick stretch or water break?
          </p>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-green-500 hover:bg-green-600 text-white shadow-sm">
              <Droplet className="w-4 h-4 mr-2" />
              Take Break
            </Button>
            <Button variant="outline" className="bg-white/70 hover:bg-white border-green-200">
              Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
