import { useState, useEffect, useRef } from 'react';
import { BoardState, CellValue, Player, Difficulty, MoveLog, GameStatistics, AIExplanation } from '../types';
import { checkWinner, isBoardFull } from '../ai/minimax';
import { playSound, setMutedState } from '../utils/audio';

const STORAGE_KEY_STATS = 'tictactoe_ai_statistics';
const STORAGE_KEY_THEME = 'tictactoe_ai_theme';
const STORAGE_KEY_SETTINGS = 'tictactoe_ai_settings';

const INITIAL_BOARD: BoardState = Array(9).fill(null);

const DEFAULT_STATS: GameStatistics = {
  scores: { humanWins: 0, aiWins: 0, draws: 0, totalGames: 0 },
  difficultyStats: {
    easyGames: 0, easyWins: 0,
    mediumGames: 0, mediumWins: 0,
    hardGames: 0, hardWins: 0,
    impossibleGames: 0, impossibleWins: 0,
  },
  startingPlayerStats: { humanFirst: 0, aiFirst: 0 },
  totalThinkingTimeMs: 0,
  totalAIMoves: 0,
};

export function useGameLogic() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Navigation Scene state
  const [currentScene, setCurrentScene] = useState<'welcome' | 'gameplay' | 'analytics'>('welcome');

  // Game board states
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [isHumanTurn, setIsHumanTurn] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('impossible');
  const [alphaBetaEnabled, setAlphaBetaEnabled] = useState<boolean>(true);
  const [firstPlayer, setFirstPlayer] = useState<Player>('X'); // X is human, O is AI
  const [winnerInfo, setWinnerInfo] = useState<{ winner: Player | 'draw' | null; line: number[] | null }>({
    winner: null,
    line: null,
  });

  // Replay, Undo & Chronology
  const [history, setHistory] = useState<BoardState[]>([INITIAL_BOARD]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [moveLogs, setMoveLogs] = useState<MoveLog[]>([]);
  const [replayMode, setReplayMode] = useState<boolean>(false);
  const [replayStep, setReplayStep] = useState<number>(0);

  // Stats Dashboard
  const [stats, setStats] = useState<GameStatistics>(DEFAULT_STATS);

  // Audio configuration
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // AI & Explanations State
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [lastAIExplanation, setLastAIExplanation] = useState<AIExplanation | null>(null);
  
  // Interactive Bonus Features
  const [heatmapEnabled, setHeatmapEnabled] = useState<boolean>(false);
  const [suggestionEnabled, setSuggestionEnabled] = useState<boolean>(false);
  const [currentHeatmap, setCurrentHeatmap] = useState<{ [key: number]: number }>({});
  const [currentBestMoveSuggestion, setCurrentBestMoveSuggestion] = useState<number | null>(null);

  // Sound triggering lock to prevent dual plays
  const gameEndedReported = useRef<boolean>(false);

  // Web Worker for offloading heavy search computations
  const aiWorkerRef = useRef<Worker | null>(null);

  // Initialize Web Worker instance
  useEffect(() => {
    const worker = new Worker(
      new URL('../ai/aiWorker.ts', import.meta.url),
      { type: 'module' }
    );
    aiWorkerRef.current = worker;

    return () => {
      worker.terminate();
    };
  }, []);

  // Initialize theme, stats, and settings from local storage
  useEffect(() => {
    // Load theme Preference
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }

    // Load statistics
    const savedStats = localStorage.getItem(STORAGE_KEY_STATS);
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Failed to parse statistics", e);
      }
    }

    // Load settings (mute, difficulty, alphaBeta, etc.)
    const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.difficulty) setDifficulty(parsed.difficulty);
        if (typeof parsed.alphaBetaEnabled === 'boolean') setAlphaBetaEnabled(parsed.alphaBetaEnabled);
        if (typeof parsed.isMuted === 'boolean') {
          setIsMuted(parsed.isMuted);
          setMutedState(parsed.isMuted);
        }
        if (typeof parsed.heatmapEnabled === 'boolean') setHeatmapEnabled(parsed.heatmapEnabled);
        if (typeof parsed.suggestionEnabled === 'boolean') setSuggestionEnabled(parsed.suggestionEnabled);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  // Sync settings modifications to local storage
  useEffect(() => {
    const settings = { difficulty, alphaBetaEnabled, isMuted, heatmapEnabled, suggestionEnabled };
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    setMutedState(isMuted);
  }, [difficulty, alphaBetaEnabled, isMuted, heatmapEnabled, suggestionEnabled]);

  // Sync theme modifications to local storage & HTML root class
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Helper: format rows and cols for log
  const getRowCol = (index: number) => {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    return { row, col };
  };

  // Register the Web Worker to coordinate background Minimax calculations asynchronously
  useEffect(() => {
    if (!aiWorkerRef.current) return;

    aiWorkerRef.current.onmessage = (event: MessageEvent) => {
      const { type, payload } = event.data;

      if (type === 'findBestMoveResult') {
        const { bestMove, explanation } = payload;
        
        if (bestMove !== -1) {
          setBoard(currentBoard => {
            const nextBoard = [...currentBoard];
            nextBoard[bestMove] = 'O';

            // Add moves history and current frame states
            setHistory(currHistory => {
              const revised = [...currHistory.slice(0, currentStep + 1), nextBoard];
              return revised;
            });
            setCurrentStep(prev => prev + 1);

            // Log details
            const rc = getRowCol(bestMove);
            const moveIndex = moveLogs.length + 1;
            const logItem: MoveLog = {
              moveIndex,
              player: 'O',
              index: bestMove,
              row: rc.row,
              col: rc.col,
              timestamp: new Date().toLocaleTimeString(),
              comment: explanation.choiceReason
            };
            setMoveLogs(prevLogs => [...prevLogs, logItem]);

            // Save AI decision metrics
            setLastAIExplanation(explanation);
            playSound('aiMove');

            // Save telemetry into Statistics
            setStats(currStats => {
              const nextStats = {
                ...currStats,
                totalAIMoves: currStats.totalAIMoves + 1,
                totalThinkingTimeMs: currStats.totalThinkingTimeMs + explanation.searchTimeMs
              };
              localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(nextStats));
              return nextStats;
            });

            return nextBoard;
          });
        }
        setIsThinking(false);
        setIsHumanTurn(true);
      } else if (type === 'calculateHeatmapResult') {
        const { heatmap, bestMoveSuggestion } = payload;
        setCurrentHeatmap(heatmap);
        setCurrentBestMoveSuggestion(bestMoveSuggestion);
      }
    };
  }, [currentStep, moveLogs]);

  // Compute Heatmap and suggestion live via the Web Worker
  useEffect(() => {
    if (aiWorkerRef.current) {
      aiWorkerRef.current.postMessage({
        type: 'calculateHeatmap',
        payload: {
          board,
          alphaBetaEnabled
        }
      });
    }
  }, [board, alphaBetaEnabled]);

  // Trigger AI move dynamically at active turning point using the background Web Worker
  useEffect(() => {
    const winnerCheck = checkWinner(board);
    setWinnerInfo(winnerCheck);

    if (winnerCheck.winner) {
      handleGameOver(winnerCheck.winner, winnerCheck.line);
      return;
    }

    // AI's action
    if (!isHumanTurn && !isThinking && !replayMode) {
      setIsThinking(true);
      if (aiWorkerRef.current) {
        aiWorkerRef.current.postMessage({
          type: 'findBestMove',
          payload: {
            board,
            difficulty,
            enableAlphaBeta: alphaBetaEnabled
          }
        });
      }
    }
  }, [isHumanTurn, board, isThinking, replayMode, difficulty, alphaBetaEnabled]);

  // Handle Game Over scoring & logs
  const handleGameOver = (winner: Player | 'draw', line: number[] | null) => {
    if (gameEndedReported.current) return;
    gameEndedReported.current = true;

    // Trigger sounds corresponding to final state
    if (winner === 'draw') {
      playSound('draw');
    } else if (winner === 'X') {
      playSound('win');
    } else if (winner === 'O') {
      playSound('lose');
    }

    // Save outputs into Statistics
    setStats(currStats => {
      const nextScores = { ...currStats.scores };
      nextScores.totalGames += 1;
      
      const nextDiffStats = { ...currStats.difficultyStats };
      const nextStartingStats = { ...currStats.startingPlayerStats };

      if (firstPlayer === 'X') {
        nextStartingStats.humanFirst += 1;
      } else {
        nextStartingStats.aiFirst += 1;
      }

      if (winner === 'X') {
        nextScores.humanWins += 1;
      } else if (winner === 'O') {
        nextScores.aiWins += 1;
      } else {
        nextScores.draws += 1;
      }

      // Track relative performance according to current difficulty level
      if (difficulty === 'easy') {
        nextDiffStats.easyGames += 1;
        if (winner === 'X') nextDiffStats.easyWins += 1;
      } else if (difficulty === 'medium') {
        nextDiffStats.mediumGames += 1;
        if (winner === 'X') nextDiffStats.mediumWins += 1;
      } else if (difficulty === 'hard') {
        nextDiffStats.hardGames += 1;
        if (winner === 'X') nextDiffStats.hardWins += 1;
      } else if (difficulty === 'impossible') {
        nextDiffStats.impossibleGames += 1;
        if (winner === 'X') nextDiffStats.impossibleWins += 1;
      }

      const nextStats = {
        ...currStats,
        scores: nextScores,
        difficultyStats: nextDiffStats,
        startingPlayerStats: nextStartingStats
      };

      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(nextStats));
      return nextStats;
    });
  };

  /**
   * Action triggering when human clicks board cell
   */
  const handleHumanPlay = (index: number) => {
    if (!isHumanTurn || isThinking || board[index] !== null || winnerInfo.winner || replayMode) {
      return;
    }

    playSound('click');

    // Update active grid values
    const nextBoard = [...board];
    nextBoard[index] = 'X';
    setBoard(nextBoard);

    // Save state history frame
    setHistory(currHistory => {
      const revised = [...currHistory.slice(0, currentStep + 1), nextBoard];
      return revised;
    });
    setCurrentStep(prev => prev + 1);

    // Logging move logs
    const rc = getRowCol(index);
    const moveIndex = moveLogs.length + 1;
    
    // Choose comments dynamically for Human to make logs look beautiful and responsive!
    let comment = `Human played standard center square.`;
    if (index === 4) {
      comment = `Claimed central diagonal pivot square.`;
    } else if ([0, 2, 6, 8].includes(index)) {
      comment = `Secured strategic corner vertex square.`;
    } else {
      comment = `Selected boundary edge square.`;
    }

    const logItem: MoveLog = {
      moveIndex,
      player: 'X',
      index,
      row: rc.row,
      col: rc.col,
      timestamp: new Date().toLocaleTimeString(),
      comment
    };
    setMoveLogs(prevLogs => [...prevLogs, logItem]);

    // Give turn control to AI agent
    setIsHumanTurn(false);
  };

  /**
   * Safe check for active Undo availability
   */
  const canUndo = () => {
    if (isThinking || replayMode) return false;
    // We can undo if we have enough turn states
    // If AI is playing second, undoing reverts human last play and AI last play (2 frames)
    return currentStep >= 2;
  };

  /**
   * Perform state reversion back by one complete turn cycle
   */
  const handleUndo = () => {
    if (!canUndo()) return;
    playSound('undo');

    // Roll back board frames by 2 states (O's last play and X's last play)
    const targetStep = currentStep - 2;
    const targetBoard = history[targetStep];

    setBoard(targetBoard);
    setCurrentStep(targetStep);
    setHistory(currHistory => currHistory.slice(0, targetStep + 1));
    setMoveLogs(currLogs => currLogs.slice(0, currLogs.length - 2));
    
    // Reset winner states if undoing from winning frame
    setWinnerInfo({ winner: null, line: null });
    gameEndedReported.current = false;
    setIsHumanTurn(true);
  };

  /**
   * Reset game board state to start fresh
   */
  const handleResetBoard = (startingPlayerOverride?: Player) => {
    playSound('clickSoft');
    setBoard(INITIAL_BOARD);
    setHistory([INITIAL_BOARD]);
    setCurrentStep(0);
    setMoveLogs([]);
    setWinnerInfo({ winner: null, line: null });
    gameEndedReported.current = false;
    setReplayMode(false);
    setReplayStep(0);

    // Set player turn preference
    const picker = startingPlayerOverride || firstPlayer;
    if (picker === 'X') {
      setIsHumanTurn(true);
    } else {
      setIsHumanTurn(false);
    }
  };

  /**
   * Set first turning player preference
   */
  const handleToggleFirstPlayer = () => {
    playSound('clickSoft');
    const nextPlayer = firstPlayer === 'X' ? 'O' : 'X';
    setFirstPlayer(nextPlayer);
    handleResetBoard(nextPlayer);
  };

  /**
   * Restore/clear statistics
   */
  const handleResetStatistics = () => {
    playSound('clickSoft');
    setStats(DEFAULT_STATS);
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(DEFAULT_STATS));
  };

  /**
   * Toggle Replay mode controller
   */
  const handleToggleReplayMode = (enable: boolean) => {
    playSound('clickSoft');
    if (enable) {
      setReplayStep(currentStep); // Start replay at the final active state
      setReplayMode(true);
    } else {
      setReplayMode(false);
    }
  };

  /**
   * Navigate forward / backward recursively across the step history inside Replay frame
   */
  const handleNavigateReplay = (direction: 'prev' | 'next' | 'first' | 'last') => {
    playSound('clickSoft');
    if (!replayMode) return;

    if (direction === 'first') {
      setReplayStep(0);
    } else if (direction === 'last') {
      setReplayStep(history.length - 1);
    } else if (direction === 'prev') {
      setReplayStep(prev => Math.max(0, prev - 1));
    } else if (direction === 'next') {
      setReplayStep(prev => Math.min(history.length - 1, prev + 1));
    }
  };

  // Obtain board currently matching the active visualization state (normal play / replay review window)
  const activeViewBoard = replayMode ? history[replayStep] : board;

  // Recalculate winner state for active Replay frame
  const activeReplayWinnerInfo = replayMode ? checkWinner(activeViewBoard) : winnerInfo;

  return {
    theme,
    toggleTheme: () => {
      playSound('clickSoft');
      setTheme(curr => (curr === 'dark' ? 'light' : 'dark'));
    },
    board: activeViewBoard,
    isHumanTurn,
    difficulty,
    setDifficulty: (diff: Difficulty) => {
      playSound('clickSoft');
      setDifficulty(diff);
      handleResetBoard(); // Automatically start a fresh game when difficulty updates
    },
    alphaBetaEnabled,
    toggleAlphaBeta: () => {
      playSound('clickSoft');
      setAlphaBetaEnabled(curr => !curr);
    },
    firstPlayer,
    toggleFirstPlayer: handleToggleFirstPlayer,
    winnerInfo: activeReplayWinnerInfo,
    moveLogs,
    isThinking,
    lastAIExplanation,
    stats,
    handleHumanPlay,
    handleUndo,
    canUndo: canUndo(),
    handleResetBoard: () => handleResetBoard(),
    handleResetStatistics,
    isMuted,
    toggleMuted: () => {
      setIsMuted(curr => !curr);
    },
    
    // Playback Controller API
    replayMode,
    replayStep,
    totalReplaySteps: history.length,
    handleToggleReplayMode,
    handleNavigateReplay,

    // Smart Assist Tool API
    heatmapEnabled,
    setHeatmapEnabled,
    currentHeatmap,
    suggestionEnabled,
    setSuggestionEnabled,
    currentBestMoveSuggestion,

    // Scene Navigation
    currentScene,
    setCurrentScene,
  };
}
