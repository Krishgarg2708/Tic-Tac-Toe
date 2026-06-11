import { BoardState, CellValue, Player, Difficulty, AIExplanation } from '../types';

export const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

/**
 * Checks the current board state for a winner.
 * @returns An object with the winner ('X', 'O', or 'draw' if full and tie) and the winning line.
 */
export function checkWinner(board: BoardState): { winner: Player | 'draw' | null; line: number[] | null } {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: combo };
    }
  }

  if (isBoardFull(board)) {
    return { winner: 'draw', line: null };
  }

  return { winner: null, line: null };
}

/**
 * Checks if the board is completely full.
 */
export function isBoardFull(board: BoardState): boolean {
  return board.every(cell => cell !== null);
}

/**
 * Gets a list of indices representing available (empty) cells.
 */
export function getAvailableMoves(board: BoardState): number[] {
  return board
    .map((cell, idx) => (cell === null ? idx : -1))
    .filter(idx => idx !== -1);
}

/**
 * Evaluates the board static state score from AI's ('O') perspective.
 * Positive score for AI win, Negative for Human win, 0 for tie.
 */
export function evaluateBoard(board: BoardState, depth: number): number {
  const winnerCheck = checkWinner(board);
  if (winnerCheck.winner === 'O') {
    return 10 - depth; // Win in fewer moves is favored
  }
  if (winnerCheck.winner === 'X') {
    return depth - 10; // Loss deferred as long as possible is favored
  }
  return 0;
}

// Global transposition tables for instant AI response and real-time heatmap overlays
const standardCache = new Map<string, number>();
const alphaBetaCache = new Map<string, number>();

/**
 * Standard Minimax algorithm without pruning, now optimized with transposition caching.
 */
export function minimax(
  board: BoardState,
  depth: number,
  isMax: boolean,
  statsRef: { nodes: number }
): number {
  statsRef.nodes++;

  const winnerCheck = checkWinner(board);
  if (winnerCheck.winner !== null) {
    if (winnerCheck.winner === 'O') return 10 - depth;
    if (winnerCheck.winner === 'X') return depth - 10;
    return 0; // Draw
  }

  const cacheKey = `${board.map(c => c || '.').join('')}_${isMax}_${depth}`;
  if (standardCache.has(cacheKey)) {
    return standardCache.get(cacheKey)!;
  }

  const moves = getAvailableMoves(board);
  let result: number;

  if (isMax) {
    let best = -Infinity;
    for (const move of moves) {
      board[move] = 'O';
      const val = minimax(board, depth + 1, false, statsRef);
      board[move] = null;
      best = Math.max(best, val);
    }
    result = best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      board[move] = 'X';
      const val = minimax(board, depth + 1, true, statsRef);
      board[move] = null;
      best = Math.min(best, val);
    }
    result = best;
  }

  standardCache.set(cacheKey, result);
  return result;
}

/**
 * Optimized Minimax algorithm with Alpha-Beta Pruning, now optimized with transposition caching.
 */
export function alphaBetaMinimax(
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  isMax: boolean,
  statsRef: { nodes: number; pruned: number }
): number {
  statsRef.nodes++;

  const winnerCheck = checkWinner(board);
  if (winnerCheck.winner !== null) {
    if (winnerCheck.winner === 'O') return 10 - depth;
    if (winnerCheck.winner === 'X') return depth - 10;
    return 0; // Draw
  }

  // Include alpha and beta bounds in the key for complete mathematical rigor
  const cacheKey = `${board.map(c => c || '.').join('')}_${isMax}_${depth}_${alpha}_${beta}`;
  if (alphaBetaCache.has(cacheKey)) {
    return alphaBetaCache.get(cacheKey)!;
  }

  const moves = getAvailableMoves(board);
  let result: number;

  if (isMax) {
    let best = -Infinity;
    for (const move of moves) {
      board[move] = 'O';
      const val = alphaBetaMinimax(board, depth + 1, alpha, beta, false, statsRef);
      board[move] = null;
      best = Math.max(best, val);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) {
        statsRef.pruned += moves.length - (moves.indexOf(move) + 1);
        break; // Prune remainder
      }
    }
    result = best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      board[move] = 'X';
      const val = alphaBetaMinimax(board, depth + 1, alpha, beta, true, statsRef);
      board[move] = null;
      best = Math.min(best, val);
      beta = Math.min(beta, best);
      if (beta <= alpha) {
        statsRef.pruned += moves.length - (moves.indexOf(move) + 1);
        break; // Prune remainder
      }
    }
    result = best;
  }

  alphaBetaCache.set(cacheKey, result);
  return result;
}

/**
 * Searches the best move for O, along with full metrics and decision details.
 */
export function calculateBestMove(
  board: BoardState,
  enableAlphaBeta: boolean
): { bestMove: number; explanation: AIExplanation } {
  const startTime = performance.now();
  const moves = getAvailableMoves(board);
  const moveScores: { [key: number]: number } = {};
  
  const stats = { nodes: 0, pruned: 0 };
  let bestMove = -1;
  let bestScore = -Infinity;

  // Let's copy the board to avoid accidental mutation
  const tempBoard = [...board];

  for (const move of moves) {
    tempBoard[move] = 'O'; // Make AI move
    let score = 0;

    if (enableAlphaBeta) {
      score = alphaBetaMinimax(tempBoard, 0, -Infinity, Infinity, false, stats);
    } else {
      score = minimax(tempBoard, 0, false, stats);
    }

    tempBoard[move] = null; // Backtrack
    moveScores[move] = score;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  // If no move can be chosen (board full), default to -1
  if (bestMove === -1 && moves.length > 0) {
    bestMove = moves[0];
  }

  const endTime = performance.now();
  const searchTimeMs = parseFloat((endTime - startTime).toFixed(3));

  // Build strategic explanation comments dynamically
  let choiceReason = "Selecting a neutral position to challenge you.";
  if (bestScore > 0) {
    choiceReason = "AI has mathematically secured a winning outcome. Victory is inevitable!";
  } else if (bestScore < 0) {
    choiceReason = "AI is playing defensively to delay or prevent an imminent human victory.";
  } else {
    // If it's a draw score, let's give structural insights
    const isFirstMove = moves.length === 9;
    const isCentralAvailable = board[4] === null;
    if (isFirstMove) {
      choiceReason = "Opening with standard optimal minimax exploration. Corner or center is preferred.";
    } else if (bestMove === 4 && isCentralAvailable) {
      choiceReason = "Claiming critical center control to command diagonals and lines.";
    } else {
      choiceReason = "Executing optimal blocking configurations to guarantee a tie score.";
    }
  }

  return {
    bestMove,
    explanation: {
      choiceReason,
      evaluatedMovesCount: stats.nodes,
      prunedBranchesCount: stats.pruned,
      bestScore,
      moveScores,
      searchTimeMs
    }
  };
}

/**
 * Finds the move based on the current active difficulty level.
 */
export function findBestMove(
  board: BoardState,
  difficulty: Difficulty,
  enableAlphaBeta: boolean
): { bestMove: number; explanation: AIExplanation } {
  const moves = getAvailableMoves(board);
  if (moves.length === 0) {
    return {
      bestMove: -1,
      explanation: {
        choiceReason: "Board is full. Game over.",
        evaluatedMovesCount: 0,
        prunedBranchesCount: 0,
        bestScore: 0,
        moveScores: {},
        searchTimeMs: 0
      }
    };
  }

  // Always compute the perfect Minimax result first to extract heatmaps & decision logs
  const perfectResult = calculateBestMove(board, enableAlphaBeta);

  let playPerfect = true;
  const rand = Math.random();

  if (difficulty === 'easy') {
    // 25% Minimax, 75% Random
    playPerfect = rand < 0.25;
  } else if (difficulty === 'medium') {
    // 70% Minimax, 30% Random
    playPerfect = rand < 0.70;
  } else if (difficulty === 'hard') {
    // 90% Minimax, 10% Random (allows a rare error for portfolio study)
    playPerfect = rand < 0.90;
  } else {
    // Impossible mode - 100% Minimax perfect play with Alpha-beta options
    playPerfect = true;
  }

  if (playPerfect) {
    return perfectResult;
  } else {
    // Choose a random available move, but explain that it was forced by current difficulty level
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    
    // Create an explanation card modified for sub-optimal play
    const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const subExplanation: AIExplanation = {
      ...perfectResult.explanation,
      choiceReason: `${difficultyLabel} mode: AI chose a sub-optimal random move (${randomMove}) instead of perfect minimax square (${perfectResult.bestMove}).`,
      bestScore: perfectResult.explanation.moveScores[randomMove] ?? 0
    };

    return {
      bestMove: randomMove,
      explanation: subExplanation
    };
  }
}
