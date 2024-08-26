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

  const isMoveDoable = (rowIndex, columnIndex) => {
    if (rowIndex + 1 === squares.length ) {  
      if (squares[rowIndex][columnIndex] !== EMPTY) {
        return false;
      }
    } else if (squares[rowIndex + 1][columnIndex] === EMPTY || squares[rowIndex][columnIndex] !== EMPTY) {
      return false;
    } 
    return true;
  };

  const getNextOpenRow = (rowIndex, columnIndex) => {
    rowIndex = 0;
    // if the top circle is full, then just return it (even though its unopen);
    if (squares[rowIndex][columnIndex] !== EMPTY) {
      return 0;
    }
    while (rowIndex < squares.length && squares[rowIndex][columnIndex] == EMPTY) {
      rowIndex++; 
    }
    return rowIndex -1;
  };

  const getAllPossibleMoves = (squares) => {
    const possibleMoves = [];
    for (let row = 0; row < squares.length; row++) {
      for (let col = 0; col < squares[0].length; col++) {
        if (isMoveDoable(row, col)) {
          possibleMoves.push([row, col]);
        }
      }
    }
    return possibleMoves;
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
    const openRow = getNextOpenRow(rowIndex, columnIndex);
    if (!isMoveDoable(openRow, columnIndex)) {
      return;
    }
    const copySquares = squares.map((row) => row.slice());

    makeMove(copySquares, openRow, columnIndex, isPlayerTurn);
    updateHistory(colToLetter.charAt(columnIndex) + rowToNumber.charAt(openRow), isPlayerTurn);
    setGameOver(checkGameOver(copySquares));
    setSquares(copySquares);
    setPlayerTurn(!isPlayerTurn);
  });

  const minimax = (squares, depth, alpha, beta, maximizingPlayer) => {
    const possibleMoves = getAllPossibleMoves(squares);

    // Base case
    if (depth === 0 || checkGameOver(squares) !== 0) {
        if (checkGameOver(squares) !== 0) {
            if (didPieceWin(squares, AI_PIECE)) {
              console.log("ai won");
                return { move: [], score: 1000000000 }; // AI wins
            } else if (didPieceWin(squares, PLAYER_PIECE)) {
              console.log("player won");
                return { move: [], score: -1000000000 }; // Player wins
            } else {
                console.log("there was a draw");
                return { move: [], score: 0 }; // Draw
            }
        } else {
          console.log(" this is the evaluation of the dpeth 0: " + scorePosition(squares, AI_PIECE));
          return { move: [], score: scorePosition(squares, AI_PIECE) }; // Evaluation if game was still going
        }
    }
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
            alpha = Math.max(alpha, maxEval);
            if (alpha >= beta) {
              break;
            }
        }
        console.log(`on depth ${depth} we have a maxEval of ${maxEval} and we are doing move [${bestMove[0]}, ${bestMove[1]}]`);
        return { move: bestMove, score: maxEval };
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
            beta = Math.min(beta, minEval);
            if (alpha >= beta) {
              break;
            }
        }
        console.log(`on depth ${depth} we have a minEval of ${minEval} and we are doing move [${bestMove[0]}, ${bestMove[1]}]`);
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
    
    const move = pickBestMove(squares, AI_PIECE, getAllPossibleMoves(squares));
    //const move = minimax(copySquares, 5, -Infinity, Infinity, true).move;

    makeMove(copySquares, move[0], move[1], isPlayerTurn);
    updateHistory(colToLetter.charAt(move[1]) + rowToNumber.charAt(move[0], isPlayerTurn));
    setGameOver(checkGameOver(copySquares));
    setSquares(copySquares);
    setPlayerTurn(!isPlayerTurn);
  };

  useEffect(() => {
    if (!isPlayerTurn && isGameOver === gameIsGoing) {
      setTimeout(aiMove, 500);
    }},[isPlayerTurn, isGameOver]); 

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