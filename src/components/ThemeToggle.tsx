import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isMuted: boolean;
  toggleMuted: () => void;
}

export function ThemeToggle({ theme, toggleTheme, isMuted, toggleMuted }: ThemeToggleProps) {
  return (
    <div className="flex items-center gap-3" id="theme-controls-wrapper">
      {/* Sound Controller Button */}
      <motion.button
        id="sound-control-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMuted}
        className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/30 text-slate-600 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-950/20 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        title={isMuted ? "Unmute game audio" : "Mute game audio"}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </motion.button>

      {/* Theme Toggle Button */}
      <motion.button
        id="theme-toggle-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/30 text-slate-600 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-950/20 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {theme === 'dark' ? (
          <Sun size={16} className="text-amber-500" />
        ) : (
          <Moon size={16} className="text-indigo-600" />
        )}
      </motion.button>
    </div>
  );
}
