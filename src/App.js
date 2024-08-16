import { useState } from 'react';
import './App.css';


export default function Board() {
  const [squares, setSquares] = useState(Array(6).fill().map(() => Array(7).fill('whitesmoke')));
  const [isRedTurn, setRedTurn] = useState(true);
  const [isGameOver, setGameOver] = useState(false);

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

    if (checkGameOver(copySquares)) {
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
        )};
      </>
  )
} 
function Square({onClick, color}) { 
  return <div className="square" >
    <Circle onClick={onClick} color={color}/>
  </div>
}
function Circle({onClick, color}) {
  return <div onClick={onClick} className="circle" style={{backgroundColor: color}}/>
} 
function checkGameOver(squares) {
  for(let row = 0; row < squares.length; row++) {
    for(let col = 0; col < squares[0].length; col++) {
      if (isVerticalFour(squares, row, col) || isHorizontalFour(squares, row, col) || isDiagonalFour(squares, row, col)) {
        return true;
      }
    }
  }
  return false;
}
function isVerticalFour(squares, targetRow, targetCol) {
  if (squares[targetRow][targetCol] === 'whitesmoke') {
    return false;
  }
  let count = 0;
  // check vertically if count === 4
  for (let row = targetRow - 3; row <= targetRow + 3; row++) {
    if (row >= 0 && row < squares.length && squares[row][targetCol] === squares[targetRow][targetCol]) {
      count++;
      if (count === 4) {
        return true;
      }
    } else {
    count = 0;
    }
  }
  return false;
}
function isHorizontalFour(squares, targetRow, targetCol) {
  if (squares[targetRow][targetCol] === 'whitesmoke') {
    return false;
  } 
  let count = 0;
  // check horizontally if count == 4
  for (let col = targetCol - 3; col <= targetCol + 3; col++) {
    if (col >= 0 && col < squares[0].length && squares[targetRow][col] === squares[targetRow][targetCol]) {
      count++;
      if (count === 4) {
        return true;
      }
    } else {
      count = 0;
    }
  }
  return false;
}
function isDiagonalFour(squares, targetRow, targetCol) {
  if (squares[targetRow][targetCol] === 'whitesmoke') {
    return false;
  }
  let count = 0;
  // check topleft diagonal if count === 4
  for (let i = -3; i <= 3; i++) {
    if (targetRow + i >= 0 && targetCol + i >= 0 && targetRow + i < squares.length && targetCol + i < squares[0].length 
      && squares[targetRow + i][targetCol + i] === squares[targetRow][targetCol] ) {
        count++;
        if (count === 4) {
          return true;
        }
    } else {
      count = 0;
    }
  }
  for (let i = -3; i <= 3; i++) {
    if (targetRow - i >= 0 && targetCol + i >= 0 && targetRow - i < squares.length && targetCol + i < squares[0].length
      && squares[targetRow - i][targetCol + i] === squares[targetRow][targetCol]) {
        count++;
        if (count === 4) {
          return true;
        }
      } else {
        count = 0;
      }
  }
  return false;
}