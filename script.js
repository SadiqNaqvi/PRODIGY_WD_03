const gameBoard = document.getElementById("gameBoard");
const resetContainer = document.getElementById("resetContainer");
const inputs = document.querySelectorAll(".inputs");
const playerXCount = document.getElementById("playerX");
const playerOCount = document.getElementById("playerO");
const tieCount = document.getElementById("tieCount");

let player = 1;
let playerVsAi = 1;

const winningCombos = [
  // Rows
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  // Columns
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  // Diagonals
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
];

let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

const restartGame = () => {
  resetContainer.style.display = "none";
  inputs.forEach((input) => {
    input.classList.remove("X", "O");
  });
  gameBoard.classList.remove("tie", "X", "O");
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
};

const announceWinner = (result) => {
  resetContainer.style.display = "block";
  gameBoard.classList.add(result);
  if (result === "X")
    playerXCount.innerText = `${parseInt(playerXCount.innerText) + 1}`;
  else if (result === "O")
    playerOCount.innerText = `${parseInt(playerOCount.innerText) + 1}`;
  else tieCount.innerText = `${parseInt(tieCount.innerText) + 1}`;
  setTimeout(restartGame, 3000);
};

// Function to check if the board is full (i.e., no more moves possible)
const isBoardFull = () => {
  for (let row of board) {
    for (let cell of row) {
      if (cell === "") {
        return false; // If any cell is empty, the board is not full
      }
    }
  }
  return true; // If no empty cells, the board is full
};

const checkWin = () => {
  for (let combination of winningCombos) {
    const [a, b, c] = combination;
    if (
      board[a[0]][a[1]] !== "" &&
      board[a[0]][a[1]] === board[b[0]][b[1]] &&
      board[a[0]][a[1]] === board[c[0]][c[1]]
    ) {
      return board[a[0]][a[1]]; // Return the winning player's mark
    }
  }

  // If no winner, check for a tie
  if (isBoardFull()) {
    return "tie"; // Return 'tie' if the board is full and no winner
  }

  // If no winner and no tie, return null
  return null;
};

const changePlayer = () => {
  const playerX = document.getElementById("playerXContainer");
  const playerO = document.getElementById("playerOContainer");
  if (player) {
    playerX.classList.add("active");
    playerO.classList.remove("active");
  } else {
    playerO.classList.add("active");
    playerX.classList.remove("active");
  }
  player = !player;
};

const makeMove = (input, row, col) => {
  const inputVal = player ? "O" : "X";
  input.classList.add(inputVal);
  board[parseInt(row)][parseInt(col)] = inputVal;
  changePlayer();
  const result = checkWin();
  result && announceWinner(result);
};

const aiMove = () => {
  if (gameBoard.classList.length) {
    setTimeout(aiMove, 3200);
    return;
  }

  const row = Math.floor(Math.random() * 3);
  const col = Math.floor(Math.random() * 3);
  if (board[row][col] !== "") {
    aiMove();
    return;
  }
  const input = Array.from(inputs).find((el) => el.id === `${row}${col}`);
  setTimeout(() => {
    makeMove(input, row, col);
  }, 200);
};

inputs.forEach((input) => {
  input.addEventListener("click", () => {
    let [row, col] = input.id.split("");
    row = parseInt(row);
    col = parseInt(col);
    board[row][col] === "" && makeMove(input, row, col);
    playerVsAi && aiMove();
  });
});

const startGame = () => {
  document.getElementById("playerChoiceContainer").style.display = "none";
};

resetContainer.addEventListener("click", restartGame);

document.getElementById("playerVsPlayer").addEventListener("click", () => {
  playerVsAi = 0;
  startGame();
});

document.getElementById("playerVsAi").addEventListener("click", startGame);
