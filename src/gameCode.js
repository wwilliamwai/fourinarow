const EMPTY = 0;
const PLAYER_PIECE = 1;
const AI_PIECE = 2;

const gameIsGoing = 0;
const gameWon = 1;
const gameDrawn = 2;

export function getAllWinningLines(squares) {
    const winningLines = []
    const rows = squares.length;
    const columns = squares[0].length;

    // Horizontal Lines
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= columns - 4; col++) {
            let line = [
                squares[row][col],
                squares[row][col + 1],
                squares[row][col + 2],
                squares[row][col + 3],
            ];
            winningLines.push(line);
        }
    }

    // Vertical Lines
    for (let col = 0; col < columns; col++) {
        for (let row = 0; row <= rows - 4; row++) {
            let line = [
                squares[row][col],
                squares[row + 1][col],
                squares[row + 2][col],
                squares[row + 3][col],
            ];
            winningLines.push(line);
        }
    }

    // Diagonal Lines (Top-Left to Bottom-Right)
    for (let row = 0; row <= rows - 4; row++) {
        for (let col = 0; col <= columns - 4; col++) {
            let line = [
                squares[row][col],
                squares[row + 1][col + 1],
                squares[row + 2][col + 2],
                squares[row + 3][col + 3],
            ];
            winningLines.push(line);
        }
    }

    // Diagonal Lines (Bottom-Left to Top-Right)
    for (let row = 3; row < rows; row++) {
        for (let col = 0; col <= columns - 4; col++) {
            let line = [
                squares[row][col],
                squares[row - 1][col + 1],
                squares[row - 2][col + 2],
                squares[row - 3][col + 3],
            ];
            winningLines.push(line);
        }
    }

    return winningLines;
};

const isAllSquaresFilled = ((squares) => {
    for (const row of squares) {
        for (const square of row) {
            if (square === EMPTY) {
                return false;
            }
        }
    }
    return true;
});

export const checkGameOver = (squares) => {
    if (isAllSquaresFilled(squares)) {
        return gameDrawn;
    }
    const winningLines = getAllWinningLines(squares);
    for (const line of winningLines) {
        if (line.filter((square) => square !== EMPTY && square === line[0]).length === 4) {
            return gameWon;
        }
    }
    return gameIsGoing;
} 

const evaluateLine = (line, color) => {
    let score = 0;
    const opponentColor = color === AI_PIECE ? PLAYER_PIECE : AI_PIECE;

    const playerPieceNum = line.filter((square) => square === color).length;
    const opponentPieceNum = line.filter((square) => square === opponentColor).length;
    const emptyPieceNum = line.filter((square) => square === EMPTY).length;

    if (playerPieceNum === 4) {
        score += 100;
    } else if (playerPieceNum === 3 && emptyPieceNum === 1) {
        score += 10;
    } else if (playerPieceNum == 2 && emptyPieceNum === 2) {
        score += 5;
    }

    if (opponentPieceNum === 3 && emptyPieceNum === 1) {
        score -= 80;
    }
    return score;
};

export const scorePosition = (squares, color) => {
    let score = 0;

    // score center column
    const centerLine = [];
    const centerColumn = Math.floor(squares.length/2);
    for (let row = 0; row < squares.length; row++) {
        centerLine.push(squares[row][centerColumn]);
    }
    const centerCount = centerLine.filter((square) => square === color).length;
    score += centerCount * 6;

    // horizontal score
    for (let row = 0; row < squares.length; row++) {
        for (let col = 0; col < squares[0].length - 3; col++ ) {
            const line = [squares[row][col], squares[row][col + 1], squares[row][col + 2], squares[row][col + 3]];
            score += evaluateLine(line, color);
        }
    }

    // vertical score
    for (let col = 0; col < squares[0].length; col++) {
        for (let row = 0; row < squares.length - 3; row++) {
            const line = [squares[row][col], squares[row + 1][col], squares[row + 2][col], squares[row + 3][col]];
            score += evaluateLine(line, color);
        }
    }
    // downward diagonal
    for (let row = 0; row < squares.length - 3; row++) {
        for (let col = 0; col < squares[0].length - 3; col++) {
            const line = [squares[row][col], squares[row + 1][col + 1], squares[row + 2][col + 2], squares[row + 3][col + 3]];
            score += evaluateLine(line, color);
        }
    }
    // upward diagonal
    for (let row = 3; row < squares.length; row++) {
        for (let col = 0; col < squares.length - 3; col++) {
            const line = [squares[row][col], squares[row - 1][col + 1], squares[row - 2][col + 2], squares[row - 3][col + 3]];
            score += evaluateLine(line, color);
        }
    }
    return score;
};


  export const evaluateBoardScore = (squares, maximizingPlayer) => {
    const color = maximizingPlayer ? AI_PIECE : PLAYER_PIECE;
    let score = 0;
    
    const allWinningLines = getAllWinningLines(squares);
    for (const line of allWinningLines) {
      score += evaluateLine(line, color);
    }

    let centerColumn = squares.map((row) => row[Math.floor(squares[0].length /2)]);
    let centerCount = centerColumn.filter(piece => piece === color).length;
    score += centerCount * 5;
  
    return score;
  };

  /* const minimax = (squares, depth, maximizingPlayer) => {
    if (depth === 0 || (checkGameOver(squares) === 1 || checkGameOver(squares) === 2)) {

    }
  }; */
  
  export const getHighestEvalMove = (arr) => {
    let highestEval = -Infinity;
    let bestMoves = [];

    for (const score of arr) {
        if (score.scoreEval > highestEval) {
            highestEval = score.scoreEval;
            bestMoves = [score.move];
        } else if (score.scoreEval === highestEval) {
            bestMoves.push(score.move);
        }
    }

    const random = Math.floor(Math.random() * bestMoves.length);
    return bestMoves[random];
  };