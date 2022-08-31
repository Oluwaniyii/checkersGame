/*----------- Game State Data ----------*/
import { board, cells, globals } from "./globals.js";
import { updateUI, updateData } from "./fn.js";
import {
  isSeventhSpaceAvailable,
  isNinthSpaceAvailable,
  identifyPlayerMoveablePieces,
} from "./move.js";

import {
  identifyJumpablePieces,
  isFourtheenthJumpAvailable,
  isMinusFourtheenthJumpAvailable,
  isEighteenthJumpAvailable,
  isMinusEighteenthJumpAvailable,
} from "./jump.js";

const redTurnText = document.querySelectorAll(".red-turn-text");
const blackTurntext = document.querySelectorAll(".black-turn-text");
const divider = document.querySelector("#divider");

const boardLength = 64;
const middlePieceId = 12;
let redScore = 12;
let blackScore = 12;
let playerPieces;
let playerMoveablePieces = [];
let playerJumpablePieces = [];
let activeCells = [];

let selectedPiece = {
  id: -1,
  indexOfBoard: -1,
  isKing: false,
  seventhSpace: false,
  ninthSpace: false,
  fourtheenthJumpSpace: false,
  eigtheenthJumpSpace: false,
  minusFourtheenthJumpSpace: false,
  minusEigtheenthJumpSpace: false,
};

function init() {
  checkForWin();

  playerPieces = getPlayerPieces();
  playerMoveablePieces = identifyPlayerMoveablePieces(playerPieces);
  playerJumpablePieces = identifyJumpablePieces(playerPieces);

  if (playerJumpablePieces.length) {
    playerJumpablePieces.forEach((piece) => {
      signalPieceMoveable(piece);
      piece.addEventListener("click", triggerPieceJumpEvent);
    });
  } else {
    playerMoveablePieces.forEach((piece) => {
      signalPieceMoveable(piece);
      piece.addEventListener("click", triggerPieceClickEvent);
    });
  }
}

function triggerPieceClickEvent(event) {
  reset();

  let piece = event.target;
  selectedPiece.id = parseInt(piece.id);
  selectedPiece.indexOfBoard = board.indexOf(selectedPiece.id);
  selectedPiece.seventhSpace = isSeventhSpaceAvailable(selectedPiece.id);
  selectedPiece.ninthSpace = isNinthSpaceAvailable(selectedPiece.id);

  allowCellsClickOption();
}

function triggerPieceJumpEvent(event) {
  reset();

  let piece = event.target;
  selectedPiece.id = parseInt(piece.id);
  selectedPiece.indexOfBoard = board.indexOf(selectedPiece.id);
  selectedPiece.fourtheenthJumpSpace = isFourtheenthJumpAvailable(
    selectedPiece.id
  );
  selectedPiece.eigtheenthJumpSpace = isEighteenthJumpAvailable(
    selectedPiece.id
  );
  selectedPiece.minusFourtheenthJumpSpace = isMinusFourtheenthJumpAvailable(
    selectedPiece.id
  );
  selectedPiece.minusEigtheenthJumpSpace = isMinusEighteenthJumpAvailable(
    selectedPiece.id
  );

  allowCellsJumpOption();
}

function allowCellsClickOption() {
  if (selectedPiece.seventhSpace) {
    const newBoardIndex = globals.turn
      ? selectedPiece.indexOfBoard + 7
      : selectedPiece.indexOfBoard - 7;

    let cell = cells[newBoardIndex];
    activeCells.push(cell);
    signalCellClickable(cell);

    cell.onclick = () => {
      makeMove(selectedPiece.id, selectedPiece.indexOfBoard, newBoardIndex);
    };
  }

  if (selectedPiece.ninthSpace) {
    const newBoardIndex = globals.turn
      ? selectedPiece.indexOfBoard + 9
      : selectedPiece.indexOfBoard - 9;

    let cell = cells[newBoardIndex];
    activeCells.push(cell);
    signalCellClickable(cell);

    cell.onclick = () => {
      makeMove(selectedPiece.id, selectedPiece.indexOfBoard, newBoardIndex);
    };
  }
}

function allowCellsJumpOption() {
  if (selectedPiece.fourtheenthJumpSpace) {
    let newBoardIndex = globals.turn
      ? selectedPiece.indexOfBoard + 14
      : selectedPiece.indexOfBoard - 14;

    let cell = cells[newBoardIndex];

    let pieceIdToDelete = globals.turn
      ? board[selectedPiece.indexOfBoard + 7]
      : board[selectedPiece.indexOfBoard - 7];

    activeCells.push(cell);
    signalCellClickable(cell);

    cell.onclick = () => {
      makeMove(
        selectedPiece.id,
        selectedPiece.indexOfBoard,
        newBoardIndex,
        pieceIdToDelete
      );
    };
  }

  if (selectedPiece.eigtheenthJumpSpace) {
    let newBoardIndex = globals.turn
      ? selectedPiece.indexOfBoard + 18
      : selectedPiece.indexOfBoard - 18;

    let cell = cells[newBoardIndex];

    let pieceIdToDelete = globals.turn
      ? board[selectedPiece.indexOfBoard + 9]
      : board[selectedPiece.indexOfBoard - 9];

    activeCells.push(cell);
    signalCellClickable(cell);

    cell.onclick = () => {
      makeMove(
        selectedPiece.id,
        selectedPiece.indexOfBoard,
        newBoardIndex,
        pieceIdToDelete
      );
    };
  }

  if (selectedPiece.minusFourtheenthJumpSpace) {
    let newBoardIndex = globals.turn
      ? selectedPiece.indexOfBoard - 14
      : selectedPiece.indexOfBoard + 14;

    let cell = cells[newBoardIndex];

    let pieceIdToDelete = globals.turn
      ? board[selectedPiece.indexOfBoard - 7]
      : board[selectedPiece.indexOfBoard + 7];

    activeCells.push(cell);
    signalCellClickable(cell);

    cell.onclick = () => {
      makeMove(
        selectedPiece.id,
        selectedPiece.indexOfBoard,
        newBoardIndex,
        pieceIdToDelete
      );
    };
  }

  if (selectedPiece.minusEigtheenthJumpSpace) {
    let newBoardIndex = globals.turn
      ? selectedPiece.indexOfBoard - 18
      : selectedPiece.indexOfBoard + 18;

    let cell = cells[newBoardIndex];

    let pieceIdToDelete = globals.turn
      ? board[selectedPiece.indexOfBoard - 9]
      : board[selectedPiece.indexOfBoard + 9];

    activeCells.push(cell);
    signalCellClickable(cell);

    cell.onclick = () => {
      makeMove(
        selectedPiece.id,
        selectedPiece.indexOfBoard,
        newBoardIndex,
        pieceIdToDelete
      );
    };
  }
}

function signalPieceMoveable(piece) {
  piece.style.border = "3px solid #6bda6bbf";
}

function resetSignalPieceMoveable(piece) {
  piece.style.border = "1px solid #fff";
}

function signalCellClickable(cell) {
  cell.style.backgroundColor = "#4c2c2c";
}

function switchTurn() {
  globals.turn = !globals.turn;

  if (globals.turn) {
    for (let i = 0; i < redTurnText.length; i++) {
      redTurnText[i].style.color = "lightGrey";
      blackTurntext[i].style.color = "black";
    }
  } else {
    for (let i = 0; i < blackTurntext.length; i++) {
      blackTurntext[i].style.color = "lightGrey";
      redTurnText[i].style.color = "black";
    }
  }
}

export function makeMove(
  pieceId,
  oldBoardIndex,
  newBoardIndex,
  pieceIdToDelete = null
) {
  updateUI(pieceId, oldBoardIndex, newBoardIndex, pieceIdToDelete);
  updateData(pieceId, oldBoardIndex, newBoardIndex, pieceIdToDelete);

  if (pieceIdToDelete) updateScore();

  playerPieces.forEach((p) => resetSignalPieceMoveable(p));
  playerMoveablePieces.forEach((piece) => {
    piece.removeEventListener("click", triggerPieceClickEvent);
  });
  playerMoveablePieces = [];
  reset();
  switchTurn();
  init();
}

function getRedPieces() {
  return document.querySelectorAll("p.red-piece");
}

function getBlackPieces() {
  return document.querySelectorAll("span.black-piece");
}

function getPlayerPieces() {
  let redsPieces = getRedPieces();
  let blacksPieces = getBlackPieces();

  return globals.turn ? redsPieces : blacksPieces;
}

function resetSelectedPieceProperties() {
  selectedPiece = {
    id: -1,
    indexOfBoard: -1,
    isKing: false,
    seventhSpace: false,
    ninthSpace: false,
    fourtheenthJumpSpace: false,
    eigtheenthJumpSpace: false,
    minusFourtheenthJumpSpace: false,
    minusEigtheenthJumpSpace: false,
  };
}

function updateScore() {
  redScore = getRedPieces().length;
  blackScore = getBlackPieces().length;
}

function reset() {
  resetSelectedPieceProperties();
  activeCells.forEach((cell) => {
    cell.style.backgroundColor = "#BA7A3A";
    cell.onclick = void 0;
    activeCells = [];
  });
  activeCells.forEach((cell) => {
    cell.style.backgroundColor = "#BA7A3A";
    cell.onclick = void 0;
    activeCells = [];
  });
}

function checkForWin() {
  let playerPieces = globals.turn ? getRedPieces() : getBlackPieces();
  let playerScore = globals.turn ? redScore : blackScore;
  let loser = globals.turn ? "Red" : "Black";

  if (
    playerScore === 0 ||
    (identifyPlayerMoveablePieces(playerPieces).length === 0 &&
      identifyJumpablePieces(playerPieces).length === 0)
  ) {
    if (confirm(loser + " Lost")) document.location.reload();
  }
}

init();
