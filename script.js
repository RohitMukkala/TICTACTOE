let board = ["", "", "", "", "", "", "", "", ""];
let player = "O"; // Default player to "O"
let bot = "X";
let currentPlayer;
let mode = ""; // "vsBot" or "1v1"

function selectMode(selectedMode) {
  mode = selectedMode;
  document.getElementById("mode-selection").style.display = "none";
  if (mode === "vsBot") {
    document.getElementById("initial-question").style.display = "block";
  } else if (mode === "1v1") {
    document.getElementById("player-selection").style.display = "block";
  }
}

function start1v1(selectedPlayer) {
  player = selectedPlayer; // Set the selected player (X or O)
  currentPlayer = player; // Current player starts as the chosen player
  document.getElementById("player-selection").style.display = "none";
  document.getElementById("game-container").style.display = "block";
}

function startGame(playerGoesFirst) {
  currentPlayer = playerGoesFirst ? player : bot;
  document.getElementById("initial-question").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  if (currentPlayer === bot) {
    botMove();
  }
}

function makeMove(position) {
  if (board[position - 1] !== "" || checkWinner()) return;

  board[position - 1] = currentPlayer;
  document.getElementById(`cell-${position}`).textContent = currentPlayer;

  if (checkWinner()) {
    document.getElementById("result").textContent = `${currentPlayer} wins!`;
    return;
  }

  if (board.every((cell) => cell !== "")) {
    document.getElementById("result").textContent = "Draw!";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch players for 1v1 mode

  if (mode === "vsBot" && currentPlayer === bot) {
    botMove();
  }
}

function botMove() {
  let bestMove = minimax(board, true).index;
  makeMove(bestMove + 1);
}

function minimax(newBoard, isMaximizing) {
  let emptyCells = newBoard
    .map((cell, index) => (cell === "" ? index : null))
    .filter((cell) => cell !== null);

  if (checkWinner(newBoard, bot)) {
    return { score: 10 };
  } else if (checkWinner(newBoard, player)) {
    return { score: -10 };
  } else if (emptyCells.length === 0) {
    return { score: 0 };
  }

  let moves = [];
  for (let i of emptyCells) {
    let move = {};
    move.index = i;
    newBoard[i] = isMaximizing ? bot : player;

    let result = minimax(newBoard, !isMaximizing);
    move.score = result.score;

    newBoard[i] = "";
    moves.push(move);
  }

  if (isMaximizing) {
    return moves.reduce(
      (best, move) => (move.score > best.score ? move : best),
      { score: -Infinity }
    );
  } else {
    return moves.reduce(
      (best, move) => (move.score < best.score ? move : best),
      { score: Infinity }
    );
  }
}

function checkWinner(boardState = board, mark = currentPlayer) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winPatterns.some((pattern) =>
    pattern.every((index) => boardState[index] === mark)
  );
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X"; // Default to "X" at the start of a new game
  mode = "";
  document.querySelectorAll(".cell").forEach((cell) => (cell.textContent = ""));
  document.getElementById("result").textContent = "";
  document.getElementById("mode-selection").style.display = "block";
  document.getElementById("initial-question").style.display = "none";
  document.getElementById("player-selection").style.display = "none";
  document.getElementById("game-container").style.display = "none";
}
