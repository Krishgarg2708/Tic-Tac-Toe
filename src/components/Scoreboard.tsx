import { GameStatistics } from '../types';
import { User, Cpu, Award, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScoreboardProps {
  stats: GameStatistics['scores'];
}

export function Scoreboard({ stats }: ScoreboardProps) {
  const cards = [
    {
      id: 'human',
      title: 'Human Player (X)',
      score: stats.humanWins,
      icon: User,
      bgColor: 'bg-white/90 dark:bg-slate-900/30',
      borderColor: 'border-slate-200/60 dark:border-slate-800/60',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      glow: 'shadow-sm hover:border-indigo-500/20 dark:hover:border-indigo-500/30'
    },
    {
      id: 'ai',
      title: 'Minimax AI (O)',
      score: stats.aiWins,
      icon: Cpu,
      bgColor: 'bg-white/90 dark:bg-slate-900/30',
      borderColor: 'border-slate-200/60 dark:border-slate-800/60',
      textColor: 'text-pink-600 dark:text-pink-400',
      glow: 'shadow-sm hover:border-pink-500/20 dark:hover:border-pink-500/30'
    },
    {
      id: 'draws',
      title: 'Draw Ties',
      score: stats.draws,
      icon: RefreshCw,
      bgColor: 'bg-white/90 dark:bg-slate-900/30',
      borderColor: 'border-slate-200/60 dark:border-slate-800/60',
      textColor: 'text-slate-500 dark:text-slate-400',
      glow: 'shadow-sm hover:border-slate-400/20 dark:hover:border-slate-600/30'
    },
    {
      id: 'total',
      title: 'Total Matches',
      score: stats.totalGames,
      icon: Award,
      bgColor: 'bg-white/90 dark:bg-slate-900/30',
      borderColor: 'border-slate-200/60 dark:border-slate-800/60',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      glow: 'shadow-sm hover:border-emerald-500/20 dark:hover:border-emerald-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" id="scoreboard-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            id={`scorecard-${card.id}`}
            className={`p-5 rounded-2xl border ${card.bgColor} ${card.borderColor} shadow-xs ${card.glow} flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-1px]`}
          >
            {/* Top row label and icon */}
            <div className="flex items-center justify-between gap-1 mb-3">
              <span className="text-[10px] font-bold font-display uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 ${card.textColor} shadow-xs shrink-0`}>
                <Icon size={14} />
              </div>
            </div>

            {/* Score digit */}
            <div className="flex items-baseline gap-1 mt-1" id={`score-display-${card.id}`}>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={card.score}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                  className="text-3xl font-bold font-mono text-slate-900 dark:text-slate-100 tracking-tight"
                >
                  {card.score.toString().padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Aesthetic bottom ambient bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.id === 'human' ? 'from-indigo-400 to-blue-500' : card.id === 'ai' ? 'from-purple-400 to-fuchsia-500' : card.id === 'draws' ? 'from-slate-400 to-slate-500' : 'from-emerald-400 to-teal-500'}`} />
          </div>
        );
      })}
    </div>
  );
}
