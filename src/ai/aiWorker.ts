import { findBestMove, calculateBestMove, checkWinner, isBoardFull } from './minimax';

self.addEventListener('message', (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === 'findBestMove') {
    const { board, difficulty, enableAlphaBeta } = payload;
    const result = findBestMove(board, difficulty, enableAlphaBeta);
    self.postMessage({
      type: 'findBestMoveResult',
      payload: result
    });
  } else if (type === 'calculateHeatmap') {
    const { board, alphaBetaEnabled } = payload;
    const winnerCheck = checkWinner(board);
    
    if (winnerCheck.winner || isBoardFull(board)) {
      self.postMessage({
        type: 'calculateHeatmapResult',
        payload: { heatmap: {}, bestMoveSuggestion: null }
      });
      return;
    }

    const evaluations: { [key: number]: number } = {};
    const available = board
      .map((c: any, i: number) => (c === null ? i : -1))
      .filter((i: number) => i !== -1);

    available.forEach((cell: number) => {
      const tempBoard = [...board];
      tempBoard[cell] = 'X';

      const immediateSum = checkWinner(tempBoard);
      if (immediateSum.winner === 'X') {
        evaluations[cell] = 10;
      } else if (immediateSum.winner === 'draw') {
        evaluations[cell] = 0;
      } else {
        const perfectO = calculateBestMove(tempBoard, alphaBetaEnabled);
        evaluations[cell] = -1 * perfectO.explanation.bestScore;
      }
    });

    let bestCell = -1;
    let maxSc = -Infinity;
    available.forEach((cell: number) => {
      const sc = evaluations[cell];
      if (sc > maxSc) {
        maxSc = sc;
        bestCell = cell;
      }
    });

    self.postMessage({
      type: 'calculateHeatmapResult',
      payload: {
        heatmap: evaluations,
        bestMoveSuggestion: bestCell !== -1 ? bestCell : null
      }
    });
  }
});
