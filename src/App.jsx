import React, { useState } from 'react';
import { checkGameOver} from './gameCode.js'
import './App.css';

const MAX_DEPTH = 2;

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

const evaluateLine = (line, maximizingPlayer) => {
  let maxPlayerCount = line.filter(square => square === maximizingPlayer).length;
  let minPlayerCount = line.filter(square => square !== minimizingPlayer && square !== 0).length;

  if (maxPlayerCount === 4) return 100000;
  if (minPlayerCount === 4) return 100000;
  if (maxPlayerCount === 3 && minPlayerCount === 0) return 100;
  if (maxPlayerCount === 2 && minPlayerCount === 0) return 10;

  if (minPlayerCount === 3 && maxPlayerCount === 0) return -100;
  if (minPlayerCount === 2 && maxPlayerCount === 0) return -10;

  return 0;
};
const evaluateBoardScore = (squares, maximizingPlayer) => {
  let score = 0;
  
  let allPotentialFours = getAllPotentialFours();
  for (let line of allPotentialFours) {
    score += evaluateLine(line, maximizingPlayer);
  }

  return score;
};

const Board = (({squares, setSquares, isPlayerTurn, setPlayerTurn, isGameOver, setGameOver, updateHistory}) => {
  const rowToNumber = "654321"
  const colToLetter = "ABCDEFG";
  let possibleMoves = [];

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

  const fillPossibleMoves = (squares) => {
    for (let row = 0; row < squares.length; row++) {
      for (let col = 0; col < squares[0].length; col++) {
        if (isMoveDoable(row, col)) {
          possibleMoves.push([row, col]);
        }
      }
    }
  };

  const makeMove = (squares, rowIndex, columnIndex) => {
    squares[rowIndex][columnIndex] = isPlayerTurn ? 1 : 2; 
  }
  const playerMove = ((rowIndex, columnIndex) => {
    if (isGameOver) {
      return;
    }
    if (!isMoveDoable(rowIndex, columnIndex)) {
      return;
    }
    const copySquares = squares.map((row) => row.slice());
    makeMove(copySquares, rowIndex, columnIndex);
    updateHistory(colToLetter.charAt(columnIndex) + rowToNumber.charAt(rowIndex));
    setGameOver(checkGameOver(copySquares));
    setSquares(copySquares);
    setPlayerTurn(!isPlayerTurn);
  });

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