import { Difficulty, Player } from '../types';
import { Sparkles, Brain, ShieldAlert, Cpu, HelpCircle, SwitchCamera } from 'lucide-react';
import { motion } from 'motion/react';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  alphaBetaEnabled: boolean;
  toggleAlphaBeta: () => void;
  firstPlayer: Player;
  toggleFirstPlayer: () => void;
  isThinking: boolean;
  hideHeaderAndHelp?: boolean;
}

export function DifficultySelector({
  difficulty,
  setDifficulty,
  alphaBetaEnabled,
  toggleAlphaBeta,
  firstPlayer,
  toggleFirstPlayer,
  isThinking,
  hideHeaderAndHelp = false,
}: DifficultySelectorProps) {
  const difficulties: { value: Difficulty; label: string; icon: any; color: string; desc: string }[] = [
    {
      value: 'easy',
      label: 'Easy',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-500 text-emerald-500 dark:text-emerald-400',
      desc: 'AI makes mostly random, playful moves. Excellent for practicing patterns.'
    },
    {
      value: 'medium',
      label: 'Medium',
      icon: Brain,
      color: 'from-sky-500 to-indigo-500 text-sky-500 dark:text-sky-400',
      desc: 'AI plays carefully (70% minimax lookahead, 30% random choices).'
    },
    {
      value: 'hard',
      label: 'Hard',
      icon: ShieldAlert,
      color: 'from-purple-500 to-pink-500 text-purple-500 dark:text-purple-400',
      desc: 'Perfect recursive Minimax agent. Intelligently traps any minor mistake.'
    },
    {
      value: 'impossible',
      label: 'Impossible',
      icon: Cpu,
      color: 'from-red-500 to-orange-500 text-red-500 dark:text-red-400',
      desc: 'Alpha-Beta pruned Minimax. Mathematically unbeatable; AI never loses.'
    }
  ];

  return (
    <div className="flex flex-col gap-5 p-5 rounded-2xl bg-white/90 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 shadow-xs transition-all duration-300 hover:shadow-sm" id="difficulty-selector-panel">
      
      {/* Starting Setup Options (Hidden if hideHeaderAndHelp is requested) */}
      {!hideHeaderAndHelp && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="game-controls-settings">
            {/* Toggle Who Plays First */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold font-display uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <SwitchCamera size={13} className="text-indigo-500" />
                Starting Side
              </label>
              <button
                onClick={toggleFirstPlayer}
                disabled={isThinking}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-100/50 dark:hover:bg-slate-950/40 transition-colors duration-200 disabled:opacity-50 text-left cursor-pointer"
              >
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Starts:
                </span>
                <span className={`text-[10px] font-bold font-display uppercase px-2 py-0.5 rounded ${
                  firstPlayer === 'X' 
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40' 
                    : 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40'
                }`}>
                  {firstPlayer === 'X' ? 'Human (X)' : 'AI (O)'}
                </span>
              </button>
            </div>

            {/* Alpha-Beta Pruning Switch */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold font-display uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 justify-between">
                <span className="flex items-center gap-1.5">
                  <Cpu size={13} className="text-pink-500" />
                  Alpha-Beta Pruning
                </span>
                <span className="group relative cursor-pointer">
                  <HelpCircle size={14} className="text-slate-400 hover:text-indigo-500 dark:text-slate-500 transition-colors" />
                  <span className="absolute bottom-full right-0 mb-2 w-60 p-2 bg-slate-900 dark:bg-slate-950 text-slate-100 dark:text-slate-200 text-[10px] rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity leading-normal z-50 shadow-xl border border-slate-800 font-sans">
                    Pruning cuts off search branches that cannot affect the chess-board score, reducing recursive nodes by over 90% without sacrificing perfect play.
                  </span>
                </span>
              </label>
              <button
                onClick={toggleAlphaBeta}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                  alphaBetaEnabled 
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-500/30' 
                    : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-200/60 dark:border-slate-800/60'
                }`}
              >
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Optimization:
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold font-display px-1.5 py-0.5 rounded ${
                    alphaBetaEnabled ? 'bg-emerald-200/60 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-855 text-slate-600 dark:text-slate-400'
                  }`}>
                    {alphaBetaEnabled ? 'ACTIVE' : 'OFF'}
                  </span>
                  <div className={`relative w-8 h-4.5 rounded-full transition-colors duration-300 ${alphaBetaEnabled ? 'bg-emerald-500' : 'bg-slate-350 dark:bg-slate-700'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all duration-300 ${alphaBetaEnabled ? 'translate-x-3.5' : 'translate-x-0'}`} />
                  </div>
                </div>
              </button>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800/60" />
        </>
      )}

      {/* Difficulty level card options */}
      <div className="flex flex-col gap-3" id="difficulty-selection-cards">
        <label className="text-[10px] font-bold font-display uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Agent Difficulty Levels
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {difficulties.map((diff) => {
            const Icon = diff.icon;
            const isSelected = difficulty === diff.value;
            return (
              <motion.button
                key={diff.value}
                id={`diff-btn-${diff.value}`}
                onClick={() => setDifficulty(diff.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-500/10 dark:bg-indigo-500/5 border-indigo-500/60 shadow-xs'
                    : 'bg-slate-50/20 dark:bg-slate-950/10 border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-100/50 dark:hover:bg-slate-900/30'
                }`}
              >
                <div className={`p-1 w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-100 dark:bg-slate-855 text-slate-400 dark:text-slate-500'}`}>
                  <Icon size={14} />
                </div>
                <span className={`text-[11px] font-bold font-display tracking-tight leading-none ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                  {diff.label}
                </span>
                
                {/* Active marker pill */}
                {isSelected && (
                  <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse mt-0.5" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Selected level long explanatory block */}
        <div className="p-3 rounded-xl bg-slate-50/40 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-850">
          {difficulties.map((diff) => {
            if (difficulty !== diff.value) return null;
            return (
              <motion.div
                key={diff.value}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-2.5"
              >
                <div className="mt-0.5 p-1 rounded bg-indigo-500/5 dark:bg-indigo-950/40 text-indigo-500">
                  <Cpu size={14} />
                </div>
                <div>
                  <span className="text-[10px] font-bold font-display text-indigo-600 dark:text-indigo-400 block mb-0.5 uppercase tracking-wide">
                    {diff.label} Strategy Details
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    {diff.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
