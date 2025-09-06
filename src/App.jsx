import React, { useEffect, useState } from 'react';
import { didPieceWin, scorePosition, checkGameOver} from './gameCode.js';
import './App.css';

const EMPTY = 0;
const PLAYER_PIECE = 1;
const AI_PIECE = 2;

const gameIsGoing = 0;
const gameWon = 1;


const Circle = (({onClick, color}) => {
  const pickCircleColor = (color) => {
    if (color === EMPTY) {
      return 'whitesmoke'
    } else if (color === PLAYER_PIECE) {
      return 'red';
    } else {
      return 'yellow';
    }
  }

  return <div onClick={onClick} className="circle" style={{backgroundColor: pickCircleColor(color)}}/>
}); 

const Square = (({onClick, color}) => { 
  return <div onClick={onClick} className="square" >
    <Circle onClick={onClick} color={color}/>
  </div>
});

const CursorTracker = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = React.useState(true);

  useEffect(() => {
    const updatePosition = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('click', hideOnCursor);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('click', hideOnCursor);
    };
  }, []);

  const hideOnCursor = () => {
    setVisible(false);
    setTimeout(() => {setVisible(true)}, 300);
  };

  return (
    <div onClick={hideOnCursor} className="onCursor" style={{display: visible ? "inline" : "none", left: position.x, backgroundColor: "red"}}></div>
  );
};

const Board = (({squares, setSquares, isPlayerTurn, setPlayerTurn, isGameOver, setGameOver, updateHistory}) => {
  const rowToNumber = "654321"
  const colToLetter = "ABCDEFG";

  const isMoveDoable = (squares, rowIndex, columnIndex) => {
    // if you're on the very bottom row, but there's already a circle there
    if (rowIndex + 1 === squares.length) {
      if (squares[rowIndex][columnIndex] !== EMPTY) {  
        return false;
      } 
    // if the square under is empty, or the square you're trying to take is already filled
    }else if (squares[rowIndex + 1][columnIndex] === EMPTY || squares[rowIndex][columnIndex] !== EMPTY) {
      return false;
    } 
    return true;
  };

  const getNextOpenRow = (squares, rowIndex, columnIndex) => {
    rowIndex = 0;
    // if the top circle is full, then just return it (even though its unopen);
    if (squares[rowIndex][columnIndex] !== EMPTY) {
      return rowIndex;
    }
    while (rowIndex < squares.length && squares[rowIndex][columnIndex] == EMPTY) {
      rowIndex++; 
    }
    return rowIndex -1;
  };

  const getAllPossibleMoves = (board) => {
  const moves = [];
  for (let col = 0; col < board[0].length; col++) {
    for (let row = board.length - 1; row >= 0; row--) {
      if (board[row][col] === EMPTY) {
        moves.push([row, col]); // only the lowest empty
        break;
      }
    }
  }
  return moves;
};

  const makeMove = (squares, rowIndex, columnIndex, isPlayerTurn) => {
    squares[rowIndex][columnIndex] = isPlayerTurn ? PLAYER_PIECE : AI_PIECE; 
  };
  const undoMove = (squares, rowIndex, columnIndex) => {
    squares[rowIndex][columnIndex] = EMPTY;
  };
  const playerMove = ((rowIndex, columnIndex) => {
    if (isGameOver || !isPlayerTurn) {
      return;
    }
    const copySquares = squares.map((row) => row.slice());
    const openRow = getNextOpenRow(copySquares, rowIndex, columnIndex);
    if (!isMoveDoable(copySquares, openRow, columnIndex)) {
      return;
    }

    makeMove(copySquares, openRow, columnIndex, isPlayerTurn);
    updateHistory(colToLetter.charAt(columnIndex) + rowToNumber.charAt(openRow), isPlayerTurn);
    setGameOver(checkGameOver(copySquares));
    setSquares(copySquares);
    setPlayerTurn(!isPlayerTurn);
  });

  const minimax = (squares, depth, alpha, beta, maximizingPlayer) => {

    // Base case
    const status = checkGameOver(squares);
    if (depth === 0 || status != 0) {
        if (status !== 0) {
            if (didPieceWin(squares, AI_PIECE)) {
                return { move: [], score: 999999999 }; // AI wins
            } else if (didPieceWin(squares, PLAYER_PIECE)) {
                return { move: [], score: -999999999 }; // Player wins
            } else {
                return { move: [], score: 0 }; // Draw
            }
        } else {
          return { move: [], score: scorePosition(squares) }; // Evaluation if game was still going
        }
    }
  
    const possibleMoves = getAllPossibleMoves(squares);
    // checking the best possible move from the ai's point of view
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        let bestMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

        for (const move of possibleMoves) {
            const copySquares = squares.map(row => row.slice());
            makeMove(copySquares, move[0], move[1], false);
            const scoreEval = minimax(copySquares, depth - 1, alpha, beta, false).score;

            if (scoreEval > maxEval) {
                maxEval = scoreEval;
                bestMove = move;
            }
            /* alpha = Math.max(alpha, maxEval);
            if (alpha >= beta) {
              break;
            } */
        }
        return { move: bestMove, score: maxEval };
    // checking the best
    } else {
        let minEval = Infinity;
        let bestMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

        for (const move of possibleMoves) {
            const copySquares = squares.map(row => row.slice());
            makeMove(copySquares, move[0], move[1], true);
            const scoreEval = minimax(copySquares, depth - 1, alpha, beta, true).score;

            if (scoreEval < minEval) {
                minEval = scoreEval;
                bestMove = move;
            }
            /* beta = Math.min(beta, minEval);
            if (alpha >= beta) {
              break; */
            }
        return { move: bestMove, score: minEval };
      }
    };
const pickBestMove = (squares, color, possibleMoves) => {
  let bestScore = -10000;
  let bestMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

  for (const move of possibleMoves) {
    makeMove(squares, move[0], move[1], false);
    const score = scorePosition(squares, color);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
  
    }
    undoMove(squares, move[0], move[1]);
  } 
  return bestMove;
};

  const aiMove = () => {
    const copySquares = squares.map((row) => row.slice());
    
    // const move = pickBestMove(squares, AI_PIECE, getAllPossibleMoves(squares));
    const move = minimax(copySquares, 3, -Infinity, Infinity, true).move;

    // not player's turn, so it sets move and history for ai
    makeMove(copySquares, move[0], move[1], /* isPlayerTurn = */ false); // always AI
    updateHistory(colToLetter.charAt(move[1]) + rowToNumber.charAt(move[0]), /* isPlayerTurn */ false);
    setGameOver(checkGameOver(copySquares));
    setSquares(copySquares);
    setPlayerTurn(!isPlayerTurn);
  };

  useEffect(() => {
    if (!isPlayerTurn && isGameOver === gameIsGoing) {
      setTimeout(aiMove, 500);
    }}, [isPlayerTurn, isGameOver,]); 

    return (
      <> 
        <CursorTracker/>
        {squares.map((row, rowIndex) => 
        (
          <div key={rowIndex} className="row">
            {row.map((square, columnIndex) => 
            <Square key={rowIndex.toString() + columnIndex.toString()} class="square" onClick={() => playerMove(rowIndex, columnIndex)} color={squares[rowIndex][columnIndex]}/>
            )}
          </div>
        )
        )}
      </>
  );
}); 


const Game = () => {
  // 0 is white, 1 is player, 2 is ai
  const [squares, setSquares] = useState(Array(6).fill().map(() => Array(7).fill(EMPTY)));
  const [isPlayerTurn, setPlayerTurn] = useState(Math.random() < 0.5 ? true : false);
  // 0 is nothing, 1 is game won, 2 is draw
  const [isGameOver, setGameOver] = useState(0);
  const [moveHistory, setHistory] = useState([]);

  const updateHistory = (moveLocation, isPlayerTurn) => {
    const color = isPlayerTurn ? 1 : 2;
    const copyHistory = moveHistory.slice();
    copyHistory.push([moveLocation, color]);
    setHistory(copyHistory);
  }

  const displayGameOverText = () => {
    if (isGameOver === gameIsGoing) {
      return "";
    } else if (isGameOver === gameWon) {
      return isPlayerTurn ? <h1 className="game-over yellow">Yellow Wins!</h1> : <h1 className="game-over red">Red Wins!</h1>;
    } else {
      return <h1 className="game-over">Game was a Draw!</h1>;
    }
  };

  const displayNextPlayer = () => {
    if (isGameOver !== 0) {
      return "";
    } else {
      return isPlayerTurn ? <h1 className = "next-player">Next Player: <span className="red">Red</span></h1> : <h1 className="next-player">Next Player: <span className="yellow">Yellow</span></h1>;
    }
  };

  const displayHistoryText = () => moveHistory.map((history, index) => <p className="history-text"key={index}>{index + 1} 
    {history[1] === 1 ? <span className="red"> Red</span> : <span className="yellow"> Yellow</span>} has placed a token on
    <span className="blue"> {history[0]}</span></p>).reverse();

  return (
    <>
    <div className="game">
      {displayGameOverText()}
      {displayNextPlayer()}
      <div className="number-col">
        <p>6</p>
        <p>5</p>
        <p>4</p>
        <p>3</p>
        <p>2</p>
        <p>1</p>
      </div>
      <div className="letter-row">
        <p className="letter">A</p>
        <p className="letter">B</p>
        <p className="letter">C</p>
        <p className="letter">D</p>
        <p className="letter">E</p>
        <p className="letter">F</p>
        <p className="letter">G</p>
      </div>
      <div className="board">
         <Board squares={squares} setSquares={setSquares} isPlayerTurn={isPlayerTurn} setPlayerTurn={setPlayerTurn} isGameOver={isGameOver} setGameOver={setGameOver} updateHistory={updateHistory}/>
      </div>
      <div className="history-container">
      {displayHistoryText()}
      </div>
    </div>
    </>
  )
};

export default Game;