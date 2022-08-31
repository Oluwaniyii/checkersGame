/*----------- Game State Data ----------*/
import { board, cells, globals } from "./globals.js";
import { updateUI, updateData } from "./fn.js";
import {
  isSeventhSpaceAvailable,
  isNinthSpaceAvailable,
  identifyPlayerMoveablePieces,
} from "./move.js";

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
let activeJumpCells = [];

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
  //   checkForWin();
  playerPieces = getPlayerPieces();
  playerMoveablePieces = identifyPlayerMoveablePieces(playerPieces);

  playerMoveablePieces.forEach((piece) => {
    signalPieceMoveable(piece);
    allowPieceClickOption(piece);
  });
}

function allowPieceClickOption(piece) {
  piece.addEventListener("click", triggerPieceClickEvent);
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

/********************************** */
/********************************** */
/********************************** */
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

function resetSignalCellClickable(cell) {}

const resetActiveCells = () => {
  activeCells.forEach((cell) => {
    cell.style.backgroundColor = "#BA7A3A";
    cell.onclick = void 0;
    activeCells = [];
  });
};

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

/*
function checkForWin() {
  let playerPieces = globals.turn ? getRedPieces() : getBlackPieces();
  let playerScore = globals.globals.turn ? redScore : blackScore;
  let loser = globals.globals.turn ? "Red" : "Black";

  if (
    playerScore === 0 ||
    (identifyPlayerMoveablePieces(playerPieces).length === 0 &&
      identifyJumpablePieces(playerPieces).length === 0)
  ) {
    if (confirm(loser + " Lost")) document.location.reload();
  }
}
*/

function reset() {
  resetSelectedPieceProperties();
  resetActiveCells();
}

export function makeMove(pieceId, oldBoardIndex, newBoardIndex) {
  updateUI(pieceId, oldBoardIndex, newBoardIndex);
  updateData(pieceId, oldBoardIndex, newBoardIndex);

  updateScore();
  playerPieces.forEach((p) => resetSignalPieceMoveable(p));
  reset();
  playerMoveablePieces.forEach((piece) => {
    piece.removeEventListener("click", triggerPieceClickEvent);
  });
  playerMoveablePieces = [];
  switchTurn();
  init();
}

init();
