import { GameStatistics } from '../types';
import { BarChart3, HelpCircle, Activity, Info, AlertTriangle, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface StatisticsPanelProps {
  stats: GameStatistics;
  onClearStats: () => void;
}

export function StatisticsPanel({ stats, onClearStats }: StatisticsPanelProps) {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Helper values
  const avgAgentLatency = stats.totalAIMoves > 0
    ? parseFloat((stats.totalThinkingTimeMs / stats.totalAIMoves).toFixed(2))
    : 0;

  // Simple progress percentage calculators
  const getSuccessRate = (wins: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((wins / total) * 100);
  };

  const difficultyRows = [
    { label: 'Easy Level', wins: stats.difficultyStats.easyWins, games: stats.difficultyStats.easyGames, color: 'bg-emerald-500' },
    { label: 'Medium Level', wins: stats.difficultyStats.mediumWins, games: stats.difficultyStats.mediumGames, color: 'bg-sky-500' },
    { label: 'Hard Level', wins: stats.difficultyStats.hardWins, games: stats.difficultyStats.hardGames, color: 'bg-purple-500' },
    { label: 'Impossible Level', wins: stats.difficultyStats.impossibleWins, games: stats.difficultyStats.impossibleGames, color: 'bg-red-500' },
  ];

  return (
    <div className="flex flex-col gap-5 p-5 rounded-2xl bg-white/90 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 shadow-xs h-full" id="stats-dashboard-card">
      <div className="flex items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3 block shrink-0">
        <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <BarChart3 size={15} className="text-indigo-500" />
          AI Portfolio Analytics
        </span>
        
        {/* Reset statistics button */}
        <button
          onClick={() => setShowConfirmModal(true)}
          className="text-[10px] font-bold font-display uppercase text-red-500 hover:text-red-650 tracking-wider transition-colors bg-red-500/5 dark:bg-red-500/[0.03] px-2.5 py-1 rounded border border-red-500/25 cursor-pointer"
        >
          Reset Stats
        </button>
      </div>

      {/* AI Telemetry details */}
      <div className="grid grid-cols-2 gap-3" id="ai-performance-telemetry">
        <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60 flex flex-col">
          <span className="text-[10px] font-bold font-display text-slate-400 dark:text-slate-550 uppercase tracking-wider flex items-center gap-1">
            <Activity size={10} className="text-indigo-500" />
            Search Efficiency
          </span>
          <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-100 mt-1 leading-none">
            {stats.totalAIMoves > 0 ? `${stats.totalAIMoves.toString().padStart(2, '0')} Plays` : '00 Plays'}
          </span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 font-sans">
            Total engine evaluations
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60 flex flex-col">
          <span className="text-[10px] font-bold font-display text-slate-400 dark:text-slate-550 uppercase tracking-wider flex items-center gap-1">
            <Cpu size={10} className="text-pink-500" />
            Avg AI Latency
          </span>
          <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-100 mt-1 leading-none">
            {avgAgentLatency.toFixed(1)} ms
          </span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 font-sans">
            Calculation search time
          </span>
        </div>
      </div>

      {/* Starting advantage analysis */}
      <div className="p-3 rounded-xl bg-indigo-500/[0.04] dark:bg-indigo-500/[0.03] border border-indigo-500/20">
        <span className="text-[10px] font-bold font-display text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
          <Info size={11} />
          Starting Side Affinity
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs font-sans">
          <div>
            <p className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium">Player Played First</p>
            <p className="text-sm font-bold font-mono text-slate-800 dark:text-slate-300">{(stats.startingPlayerStats?.humanFirst || 0).toString().padStart(2, '0')}</p>
          </div>
          <div>
            <p className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium">AI Played First</p>
            <p className="text-sm font-bold font-mono text-slate-800 dark:text-slate-300">{(stats.startingPlayerStats?.aiFirst || 0).toString().padStart(2, '0')}</p>
          </div>
        </div>
      </div>

      {/* Human Win rate across difficulties */}
      <div className="flex flex-col gap-3" id="diffs-rates-wrapper">
        <span className="text-[10px] font-bold font-display uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Human Success by Difficulty
        </span>

        <div className="flex flex-col gap-3">
          {difficultyRows.map((row) => {
            const hasPlayed = row.games > 0;
            const rate = getSuccessRate(row.wins, row.games);

            return (
              <div key={row.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-705 dark:text-slate-300 font-display">
                    {row.label}
                  </span>
                  <span className="text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500">
                    {hasPlayed ? `${row.wins.toString().padStart(2, '0')}/${row.games.toString().padStart(2, '0')} Wins (${rate}%)` : 'NO PLAY LOGS'}
                  </span>
                </div>
                
                {/* Horizontal progress representation */}
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-950 border border-slate-200/20 dark:border-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${row.color} rounded-full transition-all duration-500`}
                    style={{ width: `${hasPlayed ? rate : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal Overlay for Stats Reset */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3.5" id="confirmation-body">
                <div className="p-2 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-xl">
                  <AlertTriangle size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Reset Portfolio Statistics?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5">
                    This irreversible action clears your stored game history, victory rates, and search metrics across all difficulty tiers. Do you wish to continue?
                  </p>
                </div>
              </div>

              {/* Confirm Buttons */}
              <div className="flex justify-end gap-3 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearStats();
                    setShowConfirmModal(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-sm transition-colors cursor-pointer"
                >
                  Yes, Clear Statistics
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
