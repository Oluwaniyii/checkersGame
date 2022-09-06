import { board, cells, selectedPiece, globals } from "./globals.js";

export function updateUI(
  pieceId,
  oldBoardIndex,
  newBoardIndex,
  pieceIdToDelete
) {
  if (pieceIdToDelete !== null)
    document.getElementById(pieceIdToDelete).remove();
  cells[oldBoardIndex].firstElementChild.remove();

  /**
   * When a piece gets to the opponet's last role, crown it king
   */
  if (globals.turn && newBoardIndex > 55) selectedPiece.isKing = true;
  if (!globals.turn && newBoardIndex < 8) selectedPiece.isKing = true;

  let tagName = globals.turn ? "p" : "span";
  let className = globals.turn ? "red-piece" : "black-piece";
  className += selectedPiece.isKing ? " king" : "";

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
  if (pieceIdToDelete !== null) board[board.indexOf(pieceIdToDelete)] = null;
  board[oldBoardIndex] = null;
  board[newBoardIndex] = pieceId;
}
