export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type BoardState = CellValue[];

export type Difficulty = 'easy' | 'medium' | 'hard' | 'impossible';

export interface MoveLog {
  moveIndex: number;
  player: Player;
  index: number; // 0 to 8
  row: number; // 1 to 3
  col: number; // 1 to 3
  timestamp: string;
  comment: string;
}

export interface GameStatistics {
  scores: {
    humanWins: number;
    aiWins: number;
    draws: number;
    totalGames: number;
  };
  difficultyStats: {
    easyGames: number;
    easyWins: number;
    mediumGames: number;
    mediumWins: number;
    hardGames: number;
    hardWins: number;
    impossibleGames: number;
    impossibleWins: number;
  };
  startingPlayerStats: {
    humanFirst: number;
    aiFirst: number;
  };
  totalThinkingTimeMs: number;
  totalAIMoves: number;
}

export interface AIExplanation {
  choiceReason: string;
  evaluatedMovesCount: number;
  prunedBranchesCount: number;
  bestScore: number;
  moveScores: { [key: number]: number }; // map cell index to score
  searchTimeMs: number;
}
