const cells = Array.from(document.querySelectorAll('.cell'));
const statusElement = document.querySelector('#game-status');
const resetButton = document.querySelector('#reset-button');
const resetScoreButton = document.querySelector('#reset-score-button');
const turnDot = document.querySelector('.turn-dot');
const startingPlayerElement = document.querySelector('#starting-player');
const scoreElements = {
  X: document.querySelector('#score-x'),
  O: document.querySelector('#score-o'),
};

// Cada terna representa una combinación que permite ganar.
const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// El arreglo conserva una posición por cada casilla del tablero.
let board = Array(9).fill('');
let currentPlayer = 'X';
let nextStartingPlayer = 'X';
let gameOver = false;
const scores = { X: 0, O: 0 };

function setStatus(message, player = currentPlayer) {
  const playerClass = player === 'X' ? 'player-x' : 'player-o';
  statusElement.innerHTML = message.replace(player, `<span class="${playerClass}">${player}</span>`);
  turnDot.style.backgroundColor = player === 'X' ? 'var(--coral)' : 'var(--teal)';
}

function findWinningLine() {
  return winningLines.find(([first, second, third]) =>
    board[first] && board[first] === board[second] && board[first] === board[third]
  );
}

function renderBoard() {
  cells.forEach((cell, index) => {
    const mark = board[index];
    cell.textContent = mark;
    cell.classList.toggle('mark-x', mark === 'X');
    cell.classList.toggle('mark-o', mark === 'O');
    cell.disabled = Boolean(mark) || gameOver;
    cell.setAttribute('aria-label', `Casilla ${index + 1}, ${mark || 'vacía'}`);
  });
}

function renderScores() {
  Object.entries(scores).forEach(([player, score]) => {
    scoreElements[player].textContent = score;
  });
}

function handleCellClick(event) {
  const index = Number(event.currentTarget.dataset.index);
  if (gameOver || board[index]) return;

  board[index] = currentPlayer;
  const winningLine = findWinningLine();

  if (winningLine) {
    gameOver = true;
    scores[currentPlayer] += 1;
    renderScores();
    winningLine.forEach((winningIndex) => cells[winningIndex].classList.add('is-winner'));
    setStatus(`¡Ganó ${currentPlayer}!`, currentPlayer);
  } else if (board.every(Boolean)) {
    gameOver = true;
    setStatus('Empate. ¡Buena partida!');
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setStatus(`Turno de ${currentPlayer}`);
  }

  renderBoard();
}

function initializeGame() {
  board = Array(9).fill('');
  currentPlayer = nextStartingPlayer;
  startingPlayerElement.textContent = `Inicia ${currentPlayer}`;
  nextStartingPlayer = currentPlayer === 'X' ? 'O' : 'X';
  gameOver = false;
  cells.forEach((cell) => cell.classList.remove('is-winner'));
  setStatus(`Turno de ${currentPlayer}`);
  renderBoard();
}

function resetScores() {
  scores.X = 0;
  scores.O = 0;
  renderScores();
}

cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', initializeGame);
resetScoreButton.addEventListener('click', resetScores);

initializeGame();
renderScores();