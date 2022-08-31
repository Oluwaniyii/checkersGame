import { board, cells, globals } from "./globals.js";

export function updateUI(
  pieceId,
  oldBoardIndex,
  newBoardIndex,
  pieceIdToDelete
) {
  if (pieceIdToDelete) document.getElementById(pieceIdToDelete).remove();
  cells[oldBoardIndex].firstElementChild.remove();

  let tagName = globals.turn ? "p" : "span";
  let className = globals.turn ? "red-piece" : "black-piece";

  const newPiece = document.createElement(tagName);
  newPiece.className = className;
  newPiece.id = pieceId;

  let cell = cells[newBoardIndex];
  cell.appendChild(newPiece);
}

export function updateData(
  pieceId,
  oldBoardIndex,
  newBoardIndex,
  pieceIdToDelete = null
) {
  if (pieceIdToDelete) board[board.indexOf(pieceIdToDelete)] = null;
  board[oldBoardIndex] = null;
  board[newBoardIndex] = pieceId;
}
