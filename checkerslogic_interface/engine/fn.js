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

  let img;
  let className = globals.turn ? "piece dark-piece" : "piece light-piece";
  className += selectedPiece.isKing ? " king" : "";

  if (globals.turn)
    img = selectedPiece.isKing ? "carrombrownkinggold.png" : "carrombrown.png";
  else
    img = selectedPiece.isKing ? "carromcreamkinggold.png" : "carromcream.png";

  const newPiece = document.createElement("div");
  const newPieceImg = document.createElement("img");
  newPieceImg.className = "piece-img";
  newPieceImg.src = `../assets/${img}`;
  newPiece.id = pieceId;
  newPiece.className = className;
  newPiece.appendChild(newPieceImg);

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
