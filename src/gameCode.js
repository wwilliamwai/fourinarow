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
}

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