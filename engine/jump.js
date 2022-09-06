import { board, cells, globals } from "./globals.js";
import { isKingJumpable } from "./king.js";

export function identifyJumpablePieces(playerPieces) {
  let jumpablePieces = [];

  for (let i = 0; i < playerPieces.length; i++) {
    let piece = playerPieces[i];
    let pieceId = parseInt(piece.getAttribute("id"));
    let isKing = piece.classList.contains("king");

    if (isKing) {
      if (isKingJumpable(pieceId)) {
        jumpablePieces.push(piece);
      }
    } else {
      if (isPieceJumpable(pieceId)) jumpablePieces.push(piece);
    }
  }

  return jumpablePieces;
}

export function isPieceJumpable(pieceId) {
  let isPieceJumpable = false;

  if (isFourtheenthJumpAvailable(pieceId)) isPieceJumpable = true;
  if (isMinusFourtheenthJumpAvailable(pieceId)) isPieceJumpable = true;
  if (isFourtheenthJumpAvailable(pieceId)) isPieceJumpable = true;
  if (isEighteenthJumpAvailable(pieceId)) isPieceJumpable = true;
  if (isMinusEighteenthJumpAvailable(pieceId)) isPieceJumpable = true;

  return isPieceJumpable;
}

export function isFourtheenthJumpAvailable(pieceId) {
  let isPieceJumpable = false;
  let pieceBoardIndex = board.indexOf(pieceId);

  if (globals.turn) {
    if (
      board[pieceBoardIndex + 14] === null &&
      cells[pieceBoardIndex + 14].classList.contains("noPieceHere") === false &&
      board[pieceBoardIndex + 7] !== null &&
      board[pieceBoardIndex + 7] >= 12
    ) {
      isPieceJumpable = true;
    }
  } else {
    if (
      board[pieceBoardIndex - 14] === null &&
      cells[pieceBoardIndex - 14].classList.contains("noPieceHere") === false &&
      board[pieceBoardIndex - 7] !== null &&
      board[pieceBoardIndex - 7] < 12
    ) {
      isPieceJumpable = true;
    }
  }

  return isPieceJumpable;
}

export function isMinusFourtheenthJumpAvailable(pieceId) {
  let isPieceJumpable = false;
  let pieceBoardIndex = board.indexOf(pieceId);

  if (globals.turn) {
    if (
      board[pieceBoardIndex - 14] === null &&
      cells[pieceBoardIndex - 14].classList.contains("noPieceHere") === false &&
      board[pieceBoardIndex - 7] !== null &&
      board[pieceBoardIndex - 7] >= 12
    ) {
      isPieceJumpable = true;
    }
  } else {
    if (
      board[pieceBoardIndex + 14] === null &&
      cells[pieceBoardIndex + 14].classList.contains("noPieceHere") === false &&
      board[pieceBoardIndex + 7] !== null &&
      board[pieceBoardIndex + 7] < 12
    ) {
      isPieceJumpable = true;
    }
  }

  return isPieceJumpable;
}

export function isEighteenthJumpAvailable(pieceId) {
  let isPieceJumpable = false;
  let pieceBoardIndex = board.indexOf(pieceId);

  if (globals.turn) {
    if (
      board[pieceBoardIndex + 18] === null &&
      cells[pieceBoardIndex + 18].classList.contains("noPieceHere") === false &&
      board[pieceBoardIndex + 9] !== null &&
      board[pieceBoardIndex + 9] >= 12
    ) {
      isPieceJumpable = true;
    }
  } else {
    if (
      board[pieceBoardIndex - 18] === null &&
      cells[pieceBoardIndex - 18].classList.contains("noPieceHere") === false &&
      board[pieceBoardIndex - 9] !== null &&
      board[pieceBoardIndex - 9] < 12
    ) {
      isPieceJumpable = true;
    }
  }

  return isPieceJumpable;
}

export function isMinusEighteenthJumpAvailable(pieceId) {
  let isPieceJumpable = false;
  let pieceBoardIndex = board.indexOf(pieceId);

  if (globals.turn) {
    if (
      board[pieceBoardIndex - 18] === null &&
      cells[pieceBoardIndex - 18].classList.contains("noPieceHere") === false &&
      board[pieceBoardIndex - 9] !== null &&
      board[pieceBoardIndex - 9] >= 12
    ) {
      isPieceJumpable = true;
    }
  } else {
    if (
      board[pieceBoardIndex + 18] === null &&
      cells[pieceBoardIndex + 18].classList.contains("noPieceHere") === false &&
      board[pieceBoardIndex + 9] !== null &&
      board[pieceBoardIndex + 9] < 12
    ) {
      isPieceJumpable = true;
    }
  }

  return isPieceJumpable;
}
