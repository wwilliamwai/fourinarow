import { useState } from 'react';
import './App.css';

function Circle({onClick, color}) {
  return <div onClick={onClick} className="circle" style={{backgroundColor: color}}/>
} 
function Square({onClick, color}) { 
  return <div className="square" >
    <Circle onClick={onClick} color={color}/>
  </div>
}
function Board({squares, setSquares, isRedTurn, setRedTurn, isGameOver, setGameOver, updateHistory}) {
  const rowToNumber = "654321"
  const colToLetter = "ABCDEFG";
  let winningTokens = [];

  function handleClick(rowIndex, columnIndex) {
    if (isGameOver) {
      return;
    }
    if (rowIndex + 1 === squares.length ) {  
      if (squares[rowIndex][columnIndex] !== 'whitesmoke') {
        return;
      }
    } else if (squares[rowIndex + 1][columnIndex] === 'whitesmoke' || squares[rowIndex][columnIndex] !== 'whitesmoke') {
      return;
    }
    const copySquares = squares.map((row) => row.slice());
    copySquares[rowIndex][columnIndex] = isRedTurn ? 'red' : 'yellow'; 
    updateHistory(colToLetter.charAt(columnIndex) + rowToNumber.charAt(rowIndex));
    if (checkGameOver(copySquares, winningTokens)) {

      winningTokens.forEach((location) => {
        copySquares[location[0]][location[1]] = "lightgreen";
      });
      setGameOver(true);
    }
    setSquares(copySquares);
    setRedTurn(!isRedTurn);
    }
    return (
      <> 
        {squares.map((row, rowIndex) => 
        (
          <div key={rowIndex} className="row">
            {row.map((square, columnIndex) => 
            <Square key={rowIndex.toString() + columnIndex.toString()} class="square" onClick={() => handleClick(rowIndex, columnIndex)} color={squares[rowIndex][columnIndex]}/>
            )}
          </div>
        )
        )}
      </>
  )
} 
export default function Game() {
  const [squares, setSquares] = useState(Array(6).fill().map(() => Array(7).fill('whitesmoke')));
  const [isRedTurn, setRedTurn] = useState(true);
  const [isGameOver, setGameOver] = useState(false);
  const [moveHistory, setHistory] = useState([]);

  const updateHistory = (moveLocation) => {
    const copyHistory = moveHistory.slice();
    copyHistory.push(moveLocation);
    setHistory(copyHistory);
  }

  return (
    <>
    <div className="game">
      {isGameOver ? isRedTurn ? <h1 className="game-over yellow">Yellow Wins!</h1> : <h1 className="game-over red">Red Wins!</h1> : "" }
      {!isGameOver ? isRedTurn ? <h1 className="next-player">Next Player: <span className="red">Red</span></h1> : <h1 className="next-player">Next Player: <span className="yellow">Yellow</span></h1> : ""}
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
        <Board squares={squares} setSquares={setSquares} isRedTurn={isRedTurn} setRedTurn={setRedTurn} isGameOver={isGameOver} setGameOver={setGameOver} updateHistory={updateHistory}/>
      </div>
      <div className="history-container">
      {moveHistory.map((moveLocation, index) => 
        <p className="history-text"key={index}>{index + 1}. {index % 2 == 0 ? <span className="red">Red</span> : <span className="yellow">Yellow</span>} has placed a token on <span className="blue">{moveLocation}</span></p>
      ).reverse()}
      </div>
    </div>
    </>
  )
}
function checkGameOver(squares, winningTokens) {
  for(let row = 0; row < squares.length; row++) {
    for(let col = 0; col < squares[0].length; col++) {
      if (isVerticalFour(squares, row, col, winningTokens) || isHorizontalFour(squares, row, col, winningTokens) || isDiagonalFour(squares, row, col, winningTokens)) {
        console.log("the game is over")
        return true;
      }
    }
  }
  return false;
}
function isVerticalFour(squares, targetRow, targetCol, winningTokens) {
  if (squares[targetRow][targetCol] === 'whitesmoke') {
    return false;
  }
  let count = 0;
  // check vertically if count === 4
  for (let row = targetRow - 3; row <= targetRow + 3; row++) {
    if (row >= 0 && row < squares.length && squares[row][targetCol] === squares[targetRow][targetCol]) {
      winningTokens.push([row, targetCol]);
      count++;
      if (count === 4) {
        console.log("vertical win");
        return true;
      }
    } else {
    winningTokens.length = 0;
    count = 0;
    }
  }
  return false;
}
function isHorizontalFour(squares, targetRow, targetCol, winningTokens) {
  if (squares[targetRow][targetCol] === 'whitesmoke') {
    return false;
  } 
  let count = 0;
  // check horizontally if count == 4
  for (let col = targetCol - 3; col <= targetCol + 3; col++) {
    if (col >= 0 && col < squares[0].length && squares[targetRow][col] === squares[targetRow][targetCol]) {
      winningTokens.push([targetRow, col]);
      count++;
      if (count === 4) {
        console.log("horizontal win");
        return true;
      }
    } else {
      winningTokens.length = 0;
      count = 0;
    }
  }
  return false;
}
function isDiagonalFour(squares, targetRow, targetCol, winningTokens) {
  if (squares[targetRow][targetCol] === 'whitesmoke') {
    return false;
  }
  let count = 0;
  // check topleft diagonal if count === 4
  for (let i = -3; i <= 3; i++) {
    if (targetRow + i >= 0 && targetCol + i >= 0 && targetRow + i < squares.length && targetCol + i < squares[0].length 
      && squares[targetRow + i][targetCol + i] === squares[targetRow][targetCol] ) {
        winningTokens.push([targetRow + i,targetCol + i])
        count++;
        if (count === 4) {
          console.log("diagonal win");
          return true;
        }
    } else {
      winningTokens.length = 0;
      count = 0;
    }
  }
  winningTokens.length = 0;
  count = 0;
  for (let i = -3; i <= 3; i++) {
    if (targetRow - i >= 0 && targetCol + i >= 0 && targetRow - i < squares.length && targetCol + i < squares[0].length
      && squares[targetRow - i][targetCol + i] === squares[targetRow][targetCol]) {
        winningTokens.push([targetRow - i,targetCol + i])
        count++;
        if (count === 4) {
          console.log("diagonal win");
          return true;
        }
      } else {
        winningTokens.length = 0;
        count = 0;
      }
  }
  return false;
}
