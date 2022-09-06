import { board, cells, globals } from "./globals.js";
import { isKingMovable } from "./king.js";

/**
 *
 *  A piece can only move to the next seventh or ninth space
 * The back piece in actual moves backwards
 */
export function isPieceMovable(pieceId) {
  return isSeventhSpaceAvailable(pieceId) || isNinthSpaceAvailable(pieceId);
}

export function isSeventhSpaceAvailable(pieceId) {
  let pieceBoardIndex = board.indexOf(pieceId);
  let move = globals.turn ? +7 : -7;

  return isSpaceAvailable(pieceBoardIndex + move);
}

export function isNinthSpaceAvailable(pieceId) {
  let pieceBoardIndex = board.indexOf(pieceId);
  let move = globals.turn ? +9 : -9;

  return isSpaceAvailable(pieceBoardIndex + move);
}

export function isSpaceAvailable(spaceIndex) {
  return (
    board[spaceIndex] === null &&
    cells[spaceIndex].classList.contains("noPieceHere") === false
  );
}

export function identifyPlayerMoveablePieces(playerPieces) {
  let moveablePieces = [];

  for (let i = 0; i < playerPieces.length; i++) {
    let piece = playerPieces[i];
    let pieceId = parseInt(piece.getAttribute("id"));
    let isKing = piece.classList.contains("king");

    if (isKing) {
      if (isKingMovable(pieceId)) {
        moveablePieces.push(piece);
      }
    } else {
      if (isPieceMovable(pieceId)) {
        moveablePieces.push(piece);
      }
    }
  }

  return moveablePieces;
}
