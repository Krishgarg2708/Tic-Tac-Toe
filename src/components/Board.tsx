import { BoardState, CellValue, Player } from '../types';
import { Cell } from './Cell';
import { Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BoardProps {
  board: BoardState;
  onPlay: (index: number) => void;
  winnerLine: number[] | null;
  winner: Player | 'draw' | null;
  currentHeatmap: { [key: number]: number };
  heatmapEnabled: boolean;
  currentBestMoveSuggestion: number | null;
  suggestionEnabled: boolean;
  isThinking: boolean;
  isHumanTurn: boolean;
}

export function Board({
  board,
  onPlay,
  winnerLine,
  winner,
  currentHeatmap,
  heatmapEnabled,
  currentBestMoveSuggestion,
  suggestionEnabled,
  isThinking,
  isHumanTurn,
}: BoardProps) {
  return (
    <div className="flex flex-col gap-4 relative w-full" id="game-board-and-statuses">
      {/* Container wrapper frame */}
      <div className="relative rounded-3xl p-6 bg-white/90 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 shadow-xs" id="board-grid-wrapper">
        
        {/* Core 3x3 interactive card grid */}
        <div className="grid grid-cols-3 gap-3 relative z-10" id="board-cells-container">
          {board.map((cell, idx) => {
            const isWinningCell = winnerLine?.includes(idx) ?? false;
            const isSuggestedMove = idx === currentBestMoveSuggestion;
            const hVal = currentHeatmap[idx];

            return (
              <Cell
                key={idx}
                index={idx}
                value={cell}
                onClick={() => onPlay(idx)}
                isWinningCell={isWinningCell}
                heatmapValue={hVal}
                heatmapEnabled={heatmapEnabled}
                isSuggestedMove={isSuggestedMove}
                suggestionEnabled={suggestionEnabled}
                disabled={isThinking || !isHumanTurn || !!winner}
              />
            );
          })}
        </div>

        {/* Dynamic visual overlay for AI thinking status */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/20 dark:bg-slate-950/40 backdrop-blur-[1px] rounded-3xl flex items-center justify-center z-20"
              id="ai-thinking-shroud"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-2xl text-slate-700 dark:text-slate-200 font-extrabold text-sm"
              >
                <Loader2 size={16} className="text-purple-600 dark:text-purple-400 animate-spin" />
                <span className="tracking-wide">AI Agent is thinking...</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Under-board auxiliary status tracker bar */}
      <div className="flex items-center justify-between px-3" id="board-status-footer">
        <div className="flex items-center gap-2">
          {winner ? (
            <span className={`text-[10px] font-bold font-display uppercase tracking-wider px-3 py-1 rounded-full border ${
              winner === 'X'
                ? 'bg-emerald-500/10 dark:bg-emerald-500/[0.04] text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : winner === 'O'
                  ? 'bg-pink-500/10 dark:bg-pink-500/[0.04] text-pink-600 dark:text-pink-400 border-pink-500/30'
                  : 'bg-slate-500/10 dark:bg-slate-500/[0.04] text-slate-500 dark:text-slate-400 border-slate-500/30'
            }`}>
              {winner === 'X' ? '🎉 You Win!' : winner === 'O' ? '🤖 AI Wins!' : '🤝 Draw Match!'}
            </span>
          ) : (
            <span className={`text-[10px] font-bold font-display uppercase tracking-wider px-3 py-1 rounded-full border ${
              isHumanTurn
                ? 'bg-indigo-500/10 dark:bg-indigo-500/[0.04] text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
                : 'bg-pink-500/10 dark:bg-pink-500/[0.04] text-pink-600 dark:text-pink-450 border-pink-500/30'
            }`}>
              {isHumanTurn ? 'Your Play (X)' : 'AI Turn (O)...'}
            </span>
          )}
        </div>

        {/* Small badge alerting suggestions/heatmap */}
        <div className="flex items-center gap-1.5 font-display text-[9px] uppercase font-bold tracking-wider">
          {heatmapEnabled && (
            <span className="bg-emerald-500/10 dark:bg-emerald-500/[0.04] text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              HEATMAP ON
            </span>
          )}
          {suggestionEnabled && (
            <span className="bg-indigo-500/10 dark:bg-indigo-500/[0.04] text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded flex items-center gap-1">
              <Sparkles size={10} className="fill-indigo-400" />
              SOLVER ACTIVE
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
