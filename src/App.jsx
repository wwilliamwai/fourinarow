import React, { useEffect, useState } from 'react';
import { getHighestEvalIndex, evaluateBoardScore, checkGameOver} from './gameCode.js'
import './App.css';

const MAX_DEPTH = 6;

const Circle = (({onClick, color}) => {
  const pickCircleColor = (color) => {
    if (color === 0) {
      return 'whitesmoke'
    } else if (color === 1) {
      return 'red';
    } else {
      return 'yellow';
    }
  }

  return <div onClick={onClick} className="circle" style={{backgroundColor: pickCircleColor(color)}}/>
}); 

const Square = (({onClick, color}) => { 
  return <div className="square" >
    <Circle onClick={onClick} color={color}/>
  </div>
});


const Board = (({squares, setSquares, isPlayerTurn, setPlayerTurn, isGameOver, setGameOver, updateHistory}) => {
  const rowToNumber = "654321"
  const colToLetter = "ABCDEFG";

  const isMoveDoable = (rowIndex, columnIndex) => {
    if (rowIndex + 1 === squares.length ) {  
      if (squares[rowIndex][columnIndex] !== 0) {
        return false;
      }
    } else if (squares[rowIndex + 1][columnIndex] === 0 || squares[rowIndex][columnIndex] !== 0) {
      return false;
    } 
    return true;
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
    squares[rowIndex][columnIndex] = isPlayerTurn ? 1 : 2; 
  };
  const undoMove = (squares, rowIndex, columnIndex) => {
    squares[rowIndex][columnIndex] = 0;
  };
  const playerMove = ((rowIndex, columnIndex) => {
    if (isGameOver) {
      return;
    }
    if (!isMoveDoable(rowIndex, columnIndex)) {
      return;
    }
    const copySquares = squares.map((row) => row.slice());

    makeMove(copySquares, rowIndex, columnIndex, true);
    updateHistory(colToLetter.charAt(columnIndex) + rowToNumber.charAt(rowIndex));
    setGameOver(checkGameOver(copySquares));
    setSquares(copySquares);
    setPlayerTurn(!isPlayerTurn);
  });

  const minimax = (squares, possibleMoves, depth, maximizingPlayer) => {
    const iterablePossibleMoves = [...possibleMoves];
    const color = maximizingPlayer ? 2 : 1;
    if (depth == MAX_DEPTH || checkGameOver(squares)) {
        return evaluateBoardScore(squares, color);
    }
    const possibleMoveEval = [];
    
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of iterablePossibleMoves) {
            // maximizing player is always yellow. you want isPlayerTurn to be false so it would always make a yellow move
            makeMove(squares, move[0], move[1], false);
            maxEval = Math.max(maxEval, minimax(squares, getAllPossibleMoves(squares), depth + 1, false));
            if (depth === 0) {
              possibleMoveEval.push(maxEval);
            }
            undoMove(squares, move[0], move[1]);
        }
        if (depth > 0) {
          return maxEval;
        }
    } else {
      let minEval = Infinity;
      for (const move of iterablePossibleMoves) {
        makeMove(squares, move[0], move[1], true);
        minEval = Math.min(minEval, minimax(squares, getAllPossibleMoves(squares), depth + 1, true));
        undoMove(squares, move[0], move[1]);
      }
      return minEval;
    }
    const index = getHighestEvalIndex(possibleMoveEval);
    return index
  };

  const aiMove = () => {
    const copySquares = squares.map((row) => row.slice());
    const possibleMoves = getAllPossibleMoves(copySquares);
    const moveIndex = minimax(copySquares, possibleMoves, 0, true);
    const move = possibleMoves[moveIndex];
    makeMove(copySquares, move[0], move[1], isPlayerTurn);
    updateHistory(colToLetter.charAt(move[1]) + rowToNumber.charAt(move[0]));
    setGameOver(checkGameOver(copySquares));
    setSquares(copySquares);
    setPlayerTurn(!isPlayerTurn);
  };

  useEffect(() => {
    if (!isPlayerTurn && isGameOver === 0) {
      aiMove();
    }},[isPlayerTurn, isGameOver]);

    return (
      <> 
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
  const [squares, setSquares] = useState(Array(6).fill().map(() => Array(7).fill(0)));
  const [isPlayerTurn, setPlayerTurn] = useState(true);
  // 0 is nothing, 1 is game won, 2 is draw
  const [isGameOver, setGameOver] = useState(0);
  const [moveHistory, setHistory] = useState([]);

  const updateHistory = (moveLocation) => {
    const copyHistory = moveHistory.slice();
    copyHistory.push(moveLocation);
    setHistory(copyHistory);
  }

  const displayGameOverText = () => {
    if (isGameOver === 0) {
      return "";
    } else if (isGameOver === 1) {
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
      {moveHistory.map((moveLocation, index) => 
        <p className="history-text"key={index}>{index + 1}. {index % 2 === 0 ? <span className="red">Red</span> : <span className="yellow">Yellow</span>} has placed a token on <span className="blue">{moveLocation}</span></p>
      ).reverse()}
      </div>
    </div>
    </>
  )
};

export default Game;