import { CellValue } from '../types';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface CellProps {
  value: CellValue;
  index: number;
  onClick: () => void;
  isWinningCell: boolean;
  heatmapValue: number | undefined;
  heatmapEnabled: boolean;
  isSuggestedMove: boolean;
  suggestionEnabled: boolean;
  disabled: boolean;
  key?: number | string;
}

export function Cell({
  value,
  index,
  onClick,
  isWinningCell,
  heatmapValue,
  heatmapEnabled,
  isSuggestedMove,
  suggestionEnabled,
  disabled
}: CellProps) {
  const isX = value === 'X';
  const isO = value === 'O';

  // Heatmap styling calculations
  let heatmapClasses = '';
  let heatmapBadge = null;

  if (value === null && heatmapEnabled && heatmapValue !== undefined) {
    if (heatmapValue > 0) {
      heatmapClasses = 'bg-emerald-500/[0.04] dark:bg-emerald-500/[0.03] hover:bg-emerald-500/[0.08] dark:hover:bg-emerald-500/[0.06] border-emerald-500/20 dark:border-emerald-500/20';
      heatmapBadge = {
        label: 'Win',
        color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30'
      };
    } else if (heatmapValue === 0) {
      heatmapClasses = 'bg-sky-500/[0.04] dark:bg-sky-500/[0.03] hover:bg-sky-500/[0.08] dark:hover:bg-sky-500/[0.06] border-sky-500/20 dark:border-sky-500/20';
      heatmapBadge = {
        label: 'Draw',
        color: 'bg-sky-500/10 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 border-sky-200/50 dark:border-sky-900/30'
      };
    } else {
      heatmapClasses = 'bg-rose-500/[0.04] dark:bg-rose-500/[0.03] hover:bg-rose-500/[0.08] dark:hover:bg-rose-500/[0.06] border-rose-500/20 dark:border-rose-500/20';
      heatmapBadge = {
        label: 'Loss',
        color: 'bg-rose-500/10 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30'
      };
    }
  }

  return (
    <motion.button
      id={`cell-${index}`}
      onClick={onClick}
      disabled={disabled || value !== null}
      whileHover={{ scale: value === null ? 1.02 : 1 }}
      whileTap={{ scale: value === null ? 0.97 : 1 }}
      className={`h-28 md:h-32 rounded-2xl border transition-all duration-300 relative flex items-center justify-center cursor-pointer overflow-hidden ${
        // Winning highlights
        isWinningCell
          ? 'bg-gradient-to-br from-indigo-550 to-pink-500 border-transparent shadow-lg text-white'
          : value !== null
            ? 'bg-slate-50/40 dark:bg-slate-950/35 border-slate-200/60 dark:border-slate-800/60 text-slate-900 dark:text-slate-200'
            : heatmapClasses || 'bg-white/90 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-950/40'
      } ${
        // Suggested move border glowing effect
        value === null && isSuggestedMove && suggestionEnabled
          ? 'ring-2 ring-indigo-500/70 border-indigo-500/40 shadow-indigo-500/10 shadow-lg'
          : ''
      }`}
    >
      {/* Visual background glow for suggested move */}
      {value === null && isSuggestedMove && suggestionEnabled && (
        <span className="absolute inset-0 bg-indigo-500/5 animate-pulse" />
      )}

      {/* Actual symbol renders with custom motion effects */}
      {isX && (
        <motion.svg
          initial={{ pathLength: 0, scale: 0.8 }}
          animate={{ pathLength: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-12 h-12 stroke-[11] shrink-0"
          viewBox="0 0 100 100"
          fill="none"
          stroke={isWinningCell ? '#ffffff' : '#6366f1'}
          strokeLinecap="round"
        >
          <path d="M 20,20 L 80,80" />
          <path d="M 80,20 L 20,80" />
        </motion.svg>
      )}

      {isO && (
        <motion.svg
          initial={{ pathLength: 0, scale: 0.8 }}
          animate={{ pathLength: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-12 h-12 stroke-[11] shrink-0"
          viewBox="0 0 100 100"
          fill="none"
          stroke={isWinningCell ? '#ffffff' : '#ec4899'}
          strokeLinecap="round"
        >
          <circle cx="50" cy="50" r="30" />
        </motion.svg>
      )}

      {/* Mini indicator labels for Game Theory analysis heatmap */}
      {value === null && heatmapEnabled && heatmapBadge && (
        <motion.div
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute bottom-2 left-2 text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded border ${heatmapBadge.color}`}
        >
          {heatmapBadge.label}
        </motion.div>
      )}

      {/* Best Suggestion overlay bubble */}
      {value === null && isSuggestedMove && suggestionEnabled && (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-2 right-2 bg-indigo-500 text-white p-1 rounded-full shadow-md z-10"
          title="Optimal game play suggestion for current board state!"
        >
          <Sparkles size={8} className="fill-white" />
        </motion.div>
      )}
    </motion.button>
  );
}
