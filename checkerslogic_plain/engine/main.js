/*----------- Game State Data ----------*/
import { board, cells, selectedPiece, globals } from "./globals.js";
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
  isPieceJumpable,
} from "./jump.js";

import {
  triggerKingPieceMoveEvent,
  triggerKingPieceJumpEvent,
} from "./king.js";

const boardLength = 64;
const middlePieceId = 12;
let redScore = 12;
let blackScore = 12;
let playerPieces = [];
let playerMoveablePieces = [];
let playerJumpablePieces = [];
export let activeCells = [];
let isMultipleJump = false;

function init() {
  checkForWin();

  playerPieces = getPlayerPieces();
  playerMoveablePieces = identifyPlayerMoveablePieces(playerPieces);
  playerJumpablePieces = identifyJumpablePieces(playerPieces);
  let isJumpablePiecesAvailable = playerJumpablePieces.length > 0;

  if (isJumpablePiecesAvailable) {
    playerJumpablePieces.forEach((piece) => {
      signalPieceActive(piece);
      if (piece.classList.contains("king")) {
        piece.addEventListener("click", triggerKingPieceJumpEvent);
      } else piece.addEventListener("click", triggerPieceJumpEvent);
    });
  } else {
    playerMoveablePieces.forEach((piece) => {
      signalPieceActive(piece);
      if (piece.classList.contains("king"))
        piece.addEventListener("click", triggerKingPieceMoveEvent);
      else piece.addEventListener("click", triggerPieceMoveEvent);
    });
  }
}

function triggerPieceMoveEvent(event) {
  resetClick();

  let piece = event.target;
  selectedPiece.id = parseInt(piece.id);
  selectedPiece.indexOfBoard = board.indexOf(selectedPiece.id);
  selectedPiece.isKing = piece.classList.contains("king");
  selectedPiece.seventhSpace = isSeventhSpaceAvailable(selectedPiece.id);
  selectedPiece.ninthSpace = isNinthSpaceAvailable(selectedPiece.id);

  allowCellMoveClickOption();
}

function triggerPieceJumpEvent(event) {
  resetClick();

  let piece = event.target;
  selectedPiece.id = parseInt(piece.id);
  selectedPiece.indexOfBoard = board.indexOf(selectedPiece.id);
  selectedPiece.isKing = piece.classList.contains("king");
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

function allowCellMoveClickOption() {
  if (selectedPiece.seventhSpace) {
    const newBoardIndex = globals.turn
      ? selectedPiece.indexOfBoard + 7
      : selectedPiece.indexOfBoard - 7;

    let cell = cells[newBoardIndex];
    activeCells.push(cell);
    signalCellActive(cell);

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
    signalCellActive(cell);

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
    signalCellActive(cell);

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
    signalCellActive(cell);

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
    signalCellActive(cell);

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
    signalCellActive(cell);

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

function signalPieceActive(piece) {
  piece.style.border = "3px solid #6bda6bbf";
}

function resetSignalPieceActive(piece) {
  piece.style.border = "1px solid #fff";
}

export function signalCellActive(cell) {
  cell.style.backgroundColor = "#4c2c2c";
}

function switchTurn() {
  globals.turn = !globals.turn;
}

export function makeMove(
  pieceId,
  oldBoardIndex,
  newBoardIndex,
  pieceIdToDelete = null
) {
  updateUI(pieceId, oldBoardIndex, newBoardIndex, pieceIdToDelete);
  updateData(pieceId, oldBoardIndex, newBoardIndex, pieceIdToDelete);

  if (pieceIdToDelete !== null) {
    if (isPieceJumpable(pieceId)) {
      isMultipleJump = true;
      let piece = document.getElementById(pieceId);

      signalPieceActive(piece);
      piece.addEventListener("click", triggerPieceJumpEvent);
      piece.click();
    } else isMultipleJump = false;

    updateScore();
  }

  if (!isMultipleJump) {
    updateScore();
    resetClick();
    fullReset();
    switchTurn();
    init();
  }
}

/**
 * I expect king jump to behave a little differently on multiple jumps which is why it has its dedicated move funtion for now
 */
export function makeJump(
  pieceId,
  oldBoardIndex,
  newBoardIndex,
  pieceIdToDelete,
  isMultipleJump = false
) {
  cells[oldBoardIndex].firstElementChild.remove();
  document.getElementById(pieceIdToDelete).remove();

  let tagName = globals.turn ? "p" : "span";
  let className = globals.turn ? "red-piece" : "black-piece";
  className += " king";

  const newPiece = document.createElement(tagName);
  newPiece.className = className;
  newPiece.id = pieceId;

  let cell = cells[newBoardIndex];
  cell.appendChild(newPiece);

  // update data
  board[oldBoardIndex] = null;
  board[newBoardIndex] = pieceId;
  board[board.indexOf(pieceIdToDelete)] = null;

  if (isMultipleJump) {
    signalPieceActive(newPiece);
    newPiece.addEventListener("click", triggerKingPieceJumpEvent);
    newPiece.click();
  } else {
    updateScore();
    resetClick();
    fullReset();
    switchTurn();
    init();
  }
}

function getRedPieces() {
  return document.querySelectorAll("p.red-piece");
}

function getBlackPieces() {
  return document.querySelectorAll("span.black-piece");
}

function getPlayerPieces() {
  return globals.turn ? getRedPieces() : getBlackPieces();
}

function resetSelectedPieceProperties() {
  selectedPiece.id = -1;
  selectedPiece.indexOfBoard = -1;
  selectedPiece.isKing = false;
  selectedPiece.seventhSpace = false;
  selectedPiece.ninthSpace = false;
  selectedPiece.fourtheenthJumpSpace = false;
  selectedPiece.eigtheenthJumpSpace = false;
  selectedPiece.minusFourtheenthJumpSpace = false;
  selectedPiece.minusEigtheenthJumpSpace = false;
}

function updateScore() {
  redScore = getRedPieces().length;
  blackScore = getBlackPieces().length;
}

export function resetClick() {
  resetSelectedPieceProperties();

  activeCells.forEach((cell) => {
    cell.style.backgroundColor = "#BA7A3A";
    cell.onclick = void 0;
    activeCells = [];
  });
}

function fullReset() {
  playerJumpablePieces.forEach((piece) => {
    resetSignalPieceActive(piece);
    if (piece.classList.contains("king"))
      piece.removeEventListener("click", triggerKingPieceJumpEvent);
    else piece.removeEventListener("click", triggerPieceJumpEvent);
  });
  playerMoveablePieces.forEach((piece) => {
    resetSignalPieceActive(piece);
    if (piece.classList.contains("king"))
      piece.removeEventListener("click", triggerKingPieceMoveEvent);
    else piece.removeEventListener("click", triggerPieceMoveEvent);
  });

  playerPieces = [];
  playerMoveablePieces = [];
  playerJumpablePieces = [];
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
