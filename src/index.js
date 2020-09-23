import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, isWinningSquare) {
    let className = 'square';
    if (isWinningSquare) {
      className += ' winning-square';
    }

    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        className={className}
      />
    );
  }

  render() {
    return (
      <div>
        <div className='board-row'>
          {this.renderSquare(0, isWinningSquare(0, this.props.winningSquares))}
          {this.renderSquare(1, isWinningSquare(1, this.props.winningSquares))}
          {this.renderSquare(2, isWinningSquare(2, this.props.winningSquares))}
        </div>
        <div className='board-row'>
          {this.renderSquare(3, isWinningSquare(3, this.props.winningSquares))}
          {this.renderSquare(4, isWinningSquare(4, this.props.winningSquares))}
          {this.renderSquare(5, isWinningSquare(5, this.props.winningSquares))}
        </div>
        <div className='board-row'>
          {this.renderSquare(6, isWinningSquare(6, this.props.winningSquares))}
          {this.renderSquare(7, isWinningSquare(7, this.props.winningSquares))}
          {this.renderSquare(8, isWinningSquare(8, this.props.winningSquares))}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastSquare: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // history.lastSquare = i;
    this.setState({
      history: history.concat([{
        squares: squares,
        lastSquare: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    // Restore game state to a previous turn
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  iToXPosition(i) {
    return i % 3;
  }

  iToYPosition(i) {
    return Math.floor(i / 3);
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move
          + ' (' + this.iToXPosition(history[move].lastSquare) + ', '
          + this.iToYPosition(history[move].lastSquare)
          + ')' :
        'Go to game start';
      return (
        <li key = {move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }


    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={calculateWinningSquares(current.squares)}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateWinningSquares(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

function isWinningSquare(square, winningSquares) {
  console.log('winning squares: ' + winningSquares);

  if (winningSquares === null) {
    return false;
  }

  return winningSquares.includes(square);
}
