import { board, cells, globals } from "./globals.js";

export function updateUI(pieceId, oldBoardIndex, newBoardIndex) {
  let cell = cells[newBoardIndex];
  cells[oldBoardIndex].firstElementChild.remove();

  let tagName = globals.turn ? "p" : "span";
  let className = globals.turn ? "red-piece" : "black-piece";

  const newPiece = document.createElement(tagName);
  newPiece.className = className;
  newPiece.id = pieceId;

  cell.appendChild(newPiece);
}

export function updateData(pieceId, oldBoardIndex, newBoardIndex) {
  board[oldBoardIndex] = null;
  board[newBoardIndex] = pieceId;
}
