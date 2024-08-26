const EMPTY = 0;
const PLAYER_PIECE = 1;
const AI_PIECE = 2;

const gameIsGoing = 0;
const gameWon = 1;
const gameDrawn = 2;

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

export const didPieceWin = (squares, color) => {

    // horizontal 
    for (let row = 0; row < squares.length; row++) {
        for (let col = 0; col < squares[0].length - 3; col++ ) {
            if (squares[row][col] === color && squares[row][col + 1] === color && squares[row][col + 2] === color 
                && squares[row][col + 3] === color) {
                return true;
            }
        }
    }

    // vertical score
    for (let col = 0; col < squares[0].length; col++) {
        for (let row = 0; row < squares.length - 3; row++) {
            if (squares[row][col] === color && squares[row + 1][col] === color && squares[row + 2][col] === color 
                && squares[row + 3][col] === color) {
                return true;
            }
        }
    }
    // downward diagonal
    for (let row = 0; row < squares.length - 3; row++) {
        for (let col = 0; col < squares[0].length - 3; col++) {
            if (squares[row][col] === color && squares[row + 1][col + 1] === color && squares[row + 2][col + 2] === color 
                && squares[row + 3][col + 3] === color) {
                    return true;
                }
        }
    }
    // upward diagonal
    for (let row = 3; row < squares.length; row++) {
        for (let col = 0; col < squares.length - 3; col++) {
            if (squares[row][col] === color && squares[row - 1][col + 1] === color && squares[row - 2][col + 2] === color 
                && squares[row - 3][col + 3] === color) {
                    return true;
                }
        }
    }
    return false;
};

export const checkGameOver = (squares) => {
    if (isAllSquaresFilled(squares)) {
        return gameDrawn;
    } else if (didPieceWin(squares, PLAYER_PIECE)) {
        return gameWon;
    } else if (didPieceWin(squares, AI_PIECE)) {
        return gameWon;
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
        score += 5;
    } else if (playerPieceNum == 2 && emptyPieceNum === 2) {
        score += 2;
    }

    if (opponentPieceNum === 3 && emptyPieceNum === 1) {
        score -= 4;
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
    score += centerCount * 3;

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

  