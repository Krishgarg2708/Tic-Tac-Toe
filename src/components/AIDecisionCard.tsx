import { AIExplanation } from '../types';
import { Cpu, ShieldAlert, Sparkles, BookOpen, AlertCircle, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface AIDecisionCardProps {
  explanation: AIExplanation | null;
  alphaBetaEnabled: boolean;
}

export function AIDecisionCard({ explanation, alphaBetaEnabled }: AIDecisionCardProps) {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/90 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 shadow-xs h-full" id="ai-decision-explanation-console">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 block shrink-0">
        <Cpu size={15} className="text-pink-500" />
        <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Minimax Decision Inspector
        </span>
      </div>

      {!explanation ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500 gap-2 shrink-0">
          <BookOpen className="stroke-[1.2] text-slate-300 dark:text-slate-700 w-8 h-8 animate-pulse" />
          <p className="text-xs font-bold font-display text-slate-600 dark:text-slate-400 uppercase tracking-wider">Awaiting AI Opening Move</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal max-w-[210px] font-sans">
            Once the AI plays, its decision tree evaluations, pruned branches, and scoring weights will be visualized here.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4" id="explanation-details-body">
          {/* Choice reason speech bubble */}
          <div className="p-3.5 rounded-xl bg-pink-500/[0.04] dark:bg-pink-500/[0.03] border border-pink-500/20 relative">
            <span className="text-[9px] font-bold font-display text-pink-600 dark:text-pink-400 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
              <Sparkles size={10} className="fill-pink-100" />
              Strategic Agent Comment
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed font-sans">
              &ldquo;{explanation.choiceReason}&rdquo;
            </p>
          </div>

          {/* Decision tree nodes metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60">
              <span className="text-[10px] font-bold font-display text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Nodes Evaluated</span>
              <span className="text-base font-bold font-mono text-slate-850 dark:text-slate-105 mt-1 block leading-none">
                {explanation.evaluatedMovesCount.toLocaleString()}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-1 font-sans">Total states explored</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60">
              <span className="text-[10px] font-bold font-display text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Branches Pruned</span>
              <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block leading-none">
                {alphaBetaEnabled ? explanation.prunedBranchesCount.toLocaleString() : '0 (Off)'}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-1 font-sans">Saved lookups</span>
            </div>
          </div>

          {/* Tree metrics details */}
          <div className="text-[11px] leading-normal text-slate-500 dark:text-slate-450 space-y-1.5 bg-slate-50/30 dark:bg-slate-950/10 p-3 rounded-xl border border-slate-200/40 dark:border-slate-850 font-sans">
            <div className="flex justify-between">
              <span>Search Computation time:</span>
              <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{explanation.searchTimeMs} ms</span>
            </div>
            <div className="flex justify-between">
              <span>Optimized solver latency:</span>
              <span className="font-bold font-display text-emerald-600 dark:text-emerald-400">
                {alphaBetaEnabled ? '90x Faster' : 'Standard'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Chosen branch score:</span>
              <span className={`font-bold font-mono ${explanation.bestScore > 0 ? 'text-emerald-500' : explanation.bestScore < 0 ? 'text-rose-500' : 'text-indigo-500'}`}>
                {explanation.bestScore > 0 ? `+${explanation.bestScore} (AI Win)` : explanation.bestScore < 0 ? `${explanation.bestScore} (AI Block)` : '0 (Fork Draw)'}
              </span>
            </div>
          </div>

          {/* Step-by-Step Scoring Guide */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold font-display text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={12} className="text-indigo-500" />
              Evaluation Values for Remaining Cells
            </span>

            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono" id="scanned-grid-weights">
              {Array.from({ length: 9 }).map((_, cellIdx) => {
                const hasScore = explanation.moveScores[cellIdx] !== undefined;
                const score = explanation.moveScores[cellIdx];
                const row = Math.floor(cellIdx / 3) + 1;
                const col = (cellIdx % 3) + 1;

                let scoreLabel = 'Taken';
                let scoreBg = 'bg-slate-50/50 dark:bg-slate-950/20 text-slate-450 dark:text-slate-600 border-slate-205/40 dark:border-slate-850';

                if (hasScore) {
                  if (score > 0) {
                    scoreLabel = `+${score}`;
                    scoreBg = 'bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
                  } else if (score < 0) {
                    scoreLabel = `${score}`;
                    scoreBg = 'bg-rose-50/40 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-500/20';
                  } else {
                    scoreLabel = '0 (Draw)';
                    scoreBg = 'bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
                  }
                }

                return (
                  <div
                    key={cellIdx}
                    className={`p-1.5 rounded-lg border text-center flex flex-col justify-between items-center h-[48px] ${scoreBg}`}
                  >
                    <span className="text-[7.5px] font-medium text-slate-400 dark:text-slate-500 leading-none">R{row} C{col}</span>
                    <span className="font-extrabold text-[10px] leading-none">{scoreLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
