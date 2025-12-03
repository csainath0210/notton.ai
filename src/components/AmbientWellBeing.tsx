import { useState } from 'react';
import { Wind } from 'lucide-react';
import { WellBeingMenu } from './WellBeingMenu';

export function AmbientWellBeing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Breathing Ring Animation - Now Interactive */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="relative flex items-center justify-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-slate-950 rounded-full"
          aria-label="Open well-being menu"
        >
          <div className="absolute w-10 h-10 rounded-full bg-teal-400/20 dark:bg-teal-400/10 animate-ping group-hover:bg-teal-400/30 dark:group-hover:bg-teal-400/20 transition-colors" style={{ animationDuration: '4s' }} />
          <div className="absolute w-8 h-8 rounded-full bg-teal-400/20 dark:bg-teal-400/10 animate-ping group-hover:bg-teal-400/30 dark:group-hover:bg-teal-400/20 transition-colors" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-teal-300/80 to-cyan-300/80 dark:from-teal-400/60 dark:to-cyan-400/60 group-hover:from-teal-400 group-hover:to-cyan-400 dark:group-hover:from-teal-500 dark:group-hover:to-cyan-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
            <Wind className="w-3.5 h-3.5 text-white" />
          </div>
        </button>
      </div>

      {/* Well-Being Menu */}
      <WellBeingMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}