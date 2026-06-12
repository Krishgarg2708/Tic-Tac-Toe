import { MoveLog } from '../types';
import { ScrollText, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface MoveHistoryProps {
  logs: MoveLog[];
  replayMode: boolean;
  replayStep: number;
}

export function MoveHistory({ logs, replayMode, replayStep }: MoveHistoryProps) {
  return (
    <div className="flex flex-col h-full rounded-2xl bg-white/90 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 shadow-xs p-5 overflow-hidden" id="move-history-card">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 shrink-0">
        <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <ScrollText size={15} className="text-indigo-500" />
          Game Move Log
        </span>
        <span className="text-[10px] font-bold font-mono bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-500 border border-slate-200/40 dark:border-slate-850 px-2 py-0.5 rounded">
          {logs.length.toString().padStart(2, '0')} {logs.length === 1 ? 'MOVE' : 'MOVES'}
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-600 gap-2 shrink-0">
          <Compass size={28} className="stroke-[1.2] text-slate-300 dark:text-slate-700 animate-spin-slow" />
          <p className="text-xs font-bold font-display uppercase tracking-wider">No Moves Logged</p>
          <p className="text-[11px] text-slate-450 dark:text-slate-505 leading-normal max-w-[180px] font-sans">
            Make your opening play above to occupy the grid.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[300px] lg:max-h-[380px] custom-scrollbar" id="move-logs-scroller">
          {logs.map((log, idx) => {
            const isX = log.player === 'X';
            
            // Highlight active frame inside replay
            const isHighlightedInReplay = replayMode && replayStep === log.moveIndex;

            return (
              <motion.div
                key={log.moveIndex}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: Math.min(idx * 0.05, 0.4) }}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  isHighlightedInReplay
                    ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'border-slate-200/40 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20'
                }`}
              >
                {/* Meta Row: Player marker + coordinate index */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-extrabold ${
                      isX
                        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                        : 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400'
                    }`}>
                      {log.player}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Move {log.moveIndex}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">
                    {log.timestamp}
                  </span>
                </div>

                {/* Grid coordinate labels */}
                <div className="flex flex-col gap-1 mt-1.5" id={`log-detail-${log.moveIndex}`}>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Occupied <span className="font-bold text-slate-800 dark:text-slate-100">Row {log.row}</span>, <span className="font-bold text-slate-800 dark:text-slate-100">Col {log.col}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-600 ml-1.5">
                      (Index {log.index})
                    </span>
                  </p>
                  
                  {log.comment && (
                    <p className="text-[11px] italic text-slate-400 dark:text-slate-500 leading-normal pl-1 border-l-2 border-slate-200 dark:border-slate-800/80">
                      &ldquo;{log.comment}&rdquo;
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
