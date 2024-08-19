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
            if (square === 0) {
                return false;
            }
        }
    }
    return true;
});

export const checkGameOver = (squares) => {
    if (isAllSquaresFilled(squares)) {
        return 2;
    }
    const winningLines = getAllWinningLines(squares);
    for (const line of winningLines) {
        if (line.filter((square) => square !== 0 && square === line[0]).length === 4) {
            return 1;
        }
    }
    return 0;
} 
const evaluateLine = (line, maximizingPlayer) => {
    let maxPlayerCount = line.filter(square => square === maximizingPlayer).length;
    let minPlayerCount = line.filter(square => square !== maximizingPlayer && square !== 0).length;
  
    if (maxPlayerCount === 4) return 100000;
    if (minPlayerCount === 4) return 100000;
    if (maxPlayerCount === 3 && minPlayerCount === 0) return 100;
    if (maxPlayerCount === 2 && minPlayerCount === 0) return 10;
  
    if (minPlayerCount === 3 && maxPlayerCount === 0) return -100;
    if (minPlayerCount === 2 && maxPlayerCount === 0) return -10;
  
    return 0;
  };

  export const evaluateBoardScore = (squares, maximizingPlayer) => {
    let score = 0;
    
    let allWinningLines = getAllWinningLines(squares);
    for (let line of allWinningLines) {
      score += evaluateLine(line, maximizingPlayer);
    }

    let centerColumn = squares.map((row) => row[Math.floor(squares[0].length /2)]);
    let centerCount = centerColumn.filter(piece => piece === maximizingPlayer).length;
    score += centerCount * 5;
  
    return score;
  };
  
  export const getHighestEvalIndex = (arr) => {
    let highestEval = -Infinity;
    let highestIndicies = [];

    arr.forEach((score, index) => {
        if (score > highestEval) {
            highestEval = score;
            highestIndicies.length = 0;
            highestIndicies.push(index);
        } else if (score === highestEval) {
            highestIndicies.push(index);
        } 
    });
    const random = parseInt(Math.random() * highestIndicies.length);
    return highestIndicies[random];
  };