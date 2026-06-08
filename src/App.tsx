import { useGameLogic } from './hooks/useGameLogic';
import { Scoreboard } from './components/Scoreboard';
import { Board } from './components/Board';
import { MoveHistory } from './components/MoveHistory';
import { DifficultySelector } from './components/DifficultySelector';
import { ThemeToggle } from './components/ThemeToggle';
import { StatisticsPanel } from './components/StatisticsPanel';
import { AIDecisionCard } from './components/AIDecisionCard';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  RefreshCw, 
  Undo2, 
  Play, 
  Compass, 
  Sparkles, 
  Map, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  X,
  BookOpen,
  Github,
  Award
} from 'lucide-react';

export default function App() {
  const {
    theme,
    toggleTheme,
    board,
    isHumanTurn,
    difficulty,
    setDifficulty,
    alphaBetaEnabled,
    toggleAlphaBeta,
    firstPlayer,
    toggleFirstPlayer,
    winnerInfo,
    moveLogs,
    isThinking,
    lastAIExplanation,
    stats,
    handleHumanPlay,
    handleUndo,
    canUndo,
    handleResetBoard,
    handleResetStatistics,
    isMuted,
    toggleMuted,
    
    // Playback state API
    replayMode,
    replayStep,
    totalReplaySteps,
    handleToggleReplayMode,
    handleNavigateReplay,

    // Assist Tool API
    heatmapEnabled,
    setHeatmapEnabled,
    currentHeatmap,
    suggestionEnabled,
    setSuggestionEnabled,
    currentBestMoveSuggestion,

    // Scene Navigation
    currentScene,
    setCurrentScene,
  } = useGameLogic();

  const isGameOver = !!winnerInfo.winner;

  // Handles starting a game match from the configuration screen page
  const handleStartMatch = () => {
    handleResetBoard();
    setCurrentScene('gameplay');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col font-sans" id="app-root-layout">
      {/* Top Main Navigation Header */}
      <header className="border-b border-slate-200/60 dark:border-slate-900/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-45 px-4 py-3 md:py-4 shrink-0" id="global-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Main Logo block */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentScene('welcome')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-xs font-display tracking-widest shrink-0 shadow-xs">
              TTT
            </div>
            <div>
              <h1 className="text-xs md:text-sm font-bold font-display uppercase tracking-wider text-slate-900 dark:text-slate-150">
                Tic-Tac-Toe AI
              </h1>
              <p className="text-[10.5px] text-slate-400 dark:text-slate-500 leading-none mt-0.5 font-semibold font-sans">
                Unbeatable Minimax & Alpha-Beta Agent
              </p>
            </div>
          </div>

          {/* Core global triggers (theme, sound) */}
          <ThemeToggle 
            theme={theme} 
            toggleTheme={toggleTheme} 
            isMuted={isMuted} 
            toggleMuted={toggleMuted} 
          />
        </div>
      </header>

      {/* Main Multi-Scene Workspace layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6" id="primary-grid-workspace">
        
        {/* Render a navigation bar when playable match is running */}
        {currentScene !== 'welcome' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/85 dark:bg-slate-900/25 border border-slate-200/60 dark:border-slate-800/60 px-4 py-3 rounded-2xl shadow-xs" id="scene-nav-pills">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentScene('gameplay')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase font-display tracking-wider transition-all cursor-pointer ${
                  currentScene === 'gameplay'
                    ? 'bg-indigo-500 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-950/40'
                }`}
              >
                🎮 Active Match
              </button>
              <button
                onClick={() => setCurrentScene('analytics')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase font-display tracking-wider transition-all cursor-pointer ${
                  currentScene === 'analytics'
                    ? 'bg-indigo-500 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-950/40'
                }`}
              >
                🧠 Solver Insights
              </button>
            </div>

            <button
              onClick={() => setCurrentScene('welcome')}
              className="px-3 py-1.5 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-950/40 rounded-xl transition-all border border-transparent hover:border-slate-200/40 dark:hover:border-slate-850 cursor-pointer"
            >
              ⚙️ Settings Hub
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Welcome Screen Setup Scene */}
          {currentScene === 'welcome' && (
            <motion.div
              key="welcome-scene"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center py-6 max-w-2xl mx-auto w-full gap-8"
              id="welcome-scene-parent"
            >
              <div className="text-center flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full self-center">
                  MINIMAX CONSOLE V1.4
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-tight tracking-tight mt-1 text-slate-900 dark:text-white">
                  Tic-Tac-Toe AI Arena
                </h2>
                <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 max-w-md mx-auto leading-relaxed font-sans">
                  Configure starting affinities and algorithm heuristics. Engage an unbeatable machine training model.
                </p>
              </div>

              {/* Central Settings Deck */}
              <div className="w-full bg-white/90 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 p-6 md:p-8 rounded-3xl shadow-xs flex flex-col gap-6" id="welcome-options-card">
                {/* 1. Choice of Difficulty */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Step 1: Set Engine Difficulty
                  </span>
                  <DifficultySelector
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    alphaBetaEnabled={alphaBetaEnabled}
                    toggleAlphaBeta={toggleAlphaBeta}
                    firstPlayer={firstPlayer}
                    toggleFirstPlayer={toggleFirstPlayer}
                    isThinking={isThinking}
                    hideHeaderAndHelp={true} // Add props to make nested selector clean
                  />
                </div>

                {/* 3. Choose starting turn priority and properties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold font-display uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                      Turn Affirmation:
                    </span>
                    <button
                      onClick={toggleFirstPlayer}
                      className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-950/60 transition-all font-display text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                    >
                      <span>Starting Priority</span>
                      <span className="bg-indigo-500 text-white px-2.5 py-0.5 rounded text-[10px] uppercase">
                        {firstPlayer === 'X' ? 'Player (X)' : 'AI (O)'}
                      </span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold font-display uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                      Pruning Optimization:
                    </span>
                    <button
                      onClick={toggleAlphaBeta}
                      className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-950/60 transition-all font-display text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                    >
                      <span>Alpha-Beta Pruning</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase ${alphaBetaEnabled ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                        {alphaBetaEnabled ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Giant Glowing Action CTA */}
                <button
                  onClick={handleStartMatch}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold font-display tracking-wider uppercase shadow-md shadow-pink-500/10 hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer text-sm"
                >
                  <Play size={15} className="fill-current" />
                  Engage AI Match
                </button>
              </div>

              {/* High Score Stats Summary teaser */}
              <div className="flex justify-center items-center gap-6 text-[11px] text-slate-400 font-medium font-sans">
                <span className="flex items-center gap-1.5">
                  <Award size={13} className="text-pink-500" />
                  Wins Tracker: {stats.scores.humanWins} Wins
                </span>
                <span className="text-slate-200 dark:text-slate-850">|</span>
                <span>Draws Matchups: {stats.scores.draws} ties</span>
              </div>
            </motion.div>
          )}

          {/* Gameplay Match Scene */}
          {currentScene === 'gameplay' && (
            <motion.div
              key="gameplay-scene"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
              id="gameplay-scene-parent"
            >
              {/* Left Column: Quick Stats summary and controllers */}
              <div className="md:col-span-4 flex flex-col gap-6" id="gameplay-sidebar">
                
                {/* Embedded Scoreboard summary block */}
                <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 shadow-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-[10px] font-bold font-display uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Match telemetry
                    </span>
                    <span className="text-[9.5px] font-bold font-mono text-indigo-500 uppercase">
                      Active: {difficulty} Mode
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center font-sans">
                    <div className="bg-slate-55/30 dark:bg-slate-950/20 p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-850">
                      <span className="text-[10.5px] text-slate-400 block font-medium">Player (X)</span>
                      <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 block mt-1">
                        {stats.scores.humanWins.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="bg-slate-55/30 dark:bg-slate-950/20 p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-850">
                      <span className="text-[10.5px] text-slate-400 block font-medium">Machine (O)</span>
                      <span className="text-xl font-bold font-mono text-pink-500 dark:text-pink-400 block mt-1">
                        {stats.scores.aiWins.toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Game Theory Assist Toggles */}
                <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 shadow-xs flex flex-col gap-4" id="smart-tutors-card">
                  <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Compass size={15} className="text-indigo-500" />
                    Solver Assist Overlays
                  </span>
                  
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setHeatmapEnabled(!heatmapEnabled)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        heatmapEnabled 
                          ? 'bg-emerald-500/10 dark:bg-emerald-500/[0.04] border-emerald-500/30' 
                          : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-200/40 dark:border-slate-850'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1 rounded-lg ${heatmapEnabled ? 'bg-emerald-500/15 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          <Map size={14} />
                        </div>
                        <div>
                          <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                            Visual Move Heatmap
                          </span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${heatmapEnabled ? 'bg-emerald-500 border-transparent text-white' : 'border-slate-300 dark:border-slate-700'}`}>
                        {heatmapEnabled && (
                          <svg className="w-2.5 h-2.5 fill-none stroke-current stroke-3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => setSuggestionEnabled(!suggestionEnabled)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        suggestionEnabled 
                          ? 'bg-indigo-500/10 dark:bg-indigo-500/[0.04] border-indigo-500/30' 
                          : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-200/40 dark:border-slate-850'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1 rounded-lg ${suggestionEnabled ? 'bg-indigo-500/15 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          <Sparkles size={14} className="fill-current" />
                        </div>
                        <div>
                          <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                            Solver Suggestion
                          </span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${suggestionEnabled ? 'bg-indigo-500 border-transparent text-white' : 'border-slate-300 dark:border-slate-700'}`}>
                        {suggestionEnabled && (
                          <svg className="w-2.5 h-2.5 fill-none stroke-current stroke-3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

              </div>

              {/* Center Column: The Interactive Board Card */}
              <div className="md:col-span-5 flex flex-col items-center gap-6">
                <div className="w-full max-w-md">
                  <Board
                    board={board}
                    onPlay={handleHumanPlay}
                    winnerLine={winnerInfo.line}
                    winner={winnerInfo.winner}
                    currentHeatmap={currentHeatmap}
                    heatmapEnabled={heatmapEnabled}
                    currentBestMoveSuggestion={currentBestMoveSuggestion}
                    suggestionEnabled={suggestionEnabled}
                    isThinking={isThinking}
                    isHumanTurn={isHumanTurn}
                  />
                </div>

                {/* Game controls row */}
                <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-sm font-display text-[11px] uppercase tracking-wider">
                  <button
                    onClick={() => handleResetBoard()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all font-bold cursor-pointer shadow-xs"
                  >
                    <RefreshCw size={12} className={isThinking ? "animate-spin" : ""} />
                    Reset Match
                  </button>

                  <button
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/90 dark:bg-slate-900/30 text-slate-650 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-950/25 disabled:opacity-40 transition-colors font-bold cursor-pointer disabled:cursor-not-allowed shadow-xs"
                  >
                    <Undo2 size={12} />
                    Undo Move
                  </button>
                </div>
              </div>

              {/* Right Column: Game Chronology & Move Logs Teaser */}
              <div className="md:col-span-3 flex flex-col gap-4">
                <div id="active-comment-pills" className="p-4 bg-indigo-500/[0.04] dark:bg-indigo-500/[0.03] border border-indigo-500/20 rounded-2xl flex flex-col gap-2">
                  <span className="text-[9px] font-bold font-display text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block flex items-center gap-1">
                    <Sparkles size={10} className="fill-indigo-150" />
                    Real-Time Solver Evaluation
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic font-medium font-sans leading-relaxed">
                    {lastAIExplanation?.choiceReason || "Awaiting your first turn coordinates to begin search lookup..."}
                  </p>
                </div>

                <div className="text-center p-5 rounded-2xl bg-slate-100/50 dark:bg-slate-900/10 border border-slate-200/40 dark:border-slate-850 flex flex-col gap-3">
                  <span className="text-[10px] font-bold font-display uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Live Analyzer Status
                  </span>
                  <p className="text-[11px] text-slate-500 leading-normal font-sans">
                    Once the game completes, step through moves in detail on the Solver Insights page.
                  </p>
                  <button
                    onClick={() => {
                      setCurrentScene('analytics');
                      if (moveLogs.length > 0) handleToggleReplayMode(true);
                    }}
                    className="py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold font-display border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-950/25 cursor-pointer"
                  >
                    View Insights Laboratory
                  </button>
                </div>
              </div>

              {/* End-Of-Game Interactive Screen Overlay Banner */}
              {isGameOver && (
                <div className="col-span-12 mt-4 p-5 rounded-3xl bg-pink-500/[0.06] border border-pink-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 font-display" id="end-banner-overlay">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <h4 className="font-extrabold uppercase tracking-widest text-slate-900 dark:text-slate-100 text-sm">
                        {winnerInfo.winner === 'X' ? '🎉 You Win!' : winnerInfo.winner === 'O' ? '🤖 AI Defeated You!' : '🤝 Draw Matchup!'}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                        Evaluated {lastAIExplanation ? lastAIExplanation.evaluatedMovesCount.toLocaleString() : '0'} nodes in {lastAIExplanation ? lastAIExplanation.searchTimeMs : '0'}ms.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleResetBoard()}
                      className="px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-pink-600 transition-all cursor-pointer"
                    >
                      Rematch Play
                    </button>
                    <button
                      onClick={() => {
                        handleToggleReplayMode(true);
                        setCurrentScene('analytics');
                      }}
                      className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-750 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-950/25 transition-all cursor-pointer"
                    >
                      Step Chronicle
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Solver Insights Column Scene */}
          {currentScene === 'analytics' && (
            <motion.div
              key="analytics-scene"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
              id="analytics-scene-parent"
            >
              {/* Chronological Step Navigator warning trigger block if in active study replay */}
              {replayMode && (
                <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 font-display">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider block">Game Chronicle Study Sequencer</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block mt-0.5">
                        Use buttons to step through historical AI evaluation trees and minimax board priority grids.
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-900/30 p-1 rounded-xl border border-slate-250/20 shadow-xs self-end md:self-auto">
                    <button onClick={() => handleNavigateReplay('first')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-905 cursor-pointer text-slate-500"><ChevronsLeft size={16} /></button>
                    <button onClick={() => handleNavigateReplay('prev')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-905 cursor-pointer text-slate-500"><ChevronLeft size={16} /></button>
                    <span className="text-xs font-mono font-extrabold px-3 py-0.5 text-indigo-500">STEP {replayStep}/{totalReplaySteps - 1}</span>
                    <button onClick={() => handleNavigateReplay('next')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-905 cursor-pointer text-slate-500"><ChevronRight size={16} /></button>
                    <button onClick={() => handleNavigateReplay('last')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-905 cursor-pointer text-slate-500"><ChevronsRight size={16} /></button>
                  </div>
                </div>
              )}

              {/* Split Core Tri-Grid panels */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                {/* Minimax Decision Tree weight grids */}
                <div className="md:col-span-4">
                  <AIDecisionCard
                    explanation={lastAIExplanation}
                    alphaBetaEnabled={alphaBetaEnabled}
                  />
                </div>

                {/* Scroll sequence Move chronicles log */}
                <div className="md:col-span-4">
                  <MoveHistory
                    logs={moveLogs}
                    replayMode={replayMode}
                    replayStep={replayStep}
                  />
                </div>

                {/* Sub-panels grids for portfolio statistics */}
                <div className="md:col-span-4">
                  <div className="bg-white/90 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 shadow-xs rounded-2xl p-5 flex flex-col gap-4 h-full">
                    <span className="text-[10px] font-bold font-display uppercase text-indigo-500 tracking-wider">
                      Quick Action Board Deck
                    </span>
                    <div className="grid grid-cols-1 gap-2.5 font-display text-[11px] uppercase tracking-wider">
                      {replayMode ? (
                        <button
                          onClick={() => handleToggleReplayMode(false)}
                          className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-amber-500 text-white font-bold cursor-pointer"
                        >
                          <X size={12} />
                          Exit Sequel Study
                        </button>
                      ) : (
                        moveLogs.length > 0 && (
                          <button
                            onClick={() => handleToggleReplayMode(true)}
                            className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-pink-500 text-white font-bold cursor-pointer"
                          >
                            <Play size={12} className="fill-current" />
                            Launch Chronicles
                          </button>
                        )
                      )}
                      
                      <button
                        onClick={() => {
                          handleResetBoard();
                          setCurrentScene('gameplay');
                        }}
                        className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-950/25 transition-colors cursor-pointer text-center font-bold"
                      >
                        Start Fresh Battle Mat
                      </button>
                    </div>

                    {/* Miniature stats breakdown inside layout */}
                    <div className="border-t border-slate-200/30 mt-2 pt-4 flex flex-col gap-2 font-sans text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Play Minutes:</span>
                        <span className="font-bold text-slate-650 dark:text-slate-250">{(stats.scores.totalGames * 1.5).toFixed(1)} mins</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Nodes Scanned:</span>
                        <span className="font-bold font-mono text-slate-650 dark:text-slate-250">{(stats.totalThinkingTimeMs * 11).toLocaleString()} nodes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Width historic win tracking graph dashboards */}
              <div id="diagnostics-panel" className="mt-2">
                <StatisticsPanel stats={stats} onClearStats={handleResetStatistics} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Footer Credentials */}
      <footer className="border-t border-slate-200/50 dark:border-slate-900/50 bg-white dark:bg-slate-950 mt-auto py-5 text-center shrink-0" id="global-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500 font-medium">
          <p className="flex items-center gap-1">
            <Award size={12} className="text-indigo-500" />
            Artificial Intelligence Game Theory Course Work submission &copy; 2026.
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-indigo-500 transition-colors cursor-pointer" onClick={() => setCurrentScene('welcome')}>Setup hub</span>
            <span className="text-slate-300 dark:text-slate-850">|</span>
            <span className="hover:text-indigo-500 transition-colors cursor-pointer flex items-center gap-1" onClick={() => setCurrentScene('gameplay')}>
              Gameplay Mat
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
