import { board, cells, selectedPiece, globals } from "./globals.js";
import { activeCells, makeMove, signalCellClickable, reset } from "./main.js";
import { isSpaceAvailable } from "./move.js";

export function isKingMovable(pieceId) {
  const angles = [7, -7, 9, -9];
  let boardIndex = board.indexOf(pieceId);
  let isMoveable = false;

  /**
   * Abiding with the rule of fail / return fast
   * I recogonise a king as moveable if just one move space is available
   */
  angles.forEach((angle) => {
    let currentCellIndex = boardIndex;
    let maxCellIndex = currentCellIndex + 8 * angle;
    let newCurrentCellIndex = currentCellIndex + angle;

    if (angle < 0) {
      while (!isMoveable && newCurrentCellIndex > maxCellIndex) {
        let isCellAvailable = isSpaceAvailable(newCurrentCellIndex);

        if (isCellAvailable) isMoveable = true;
        else break;

        newCurrentCellIndex += angle;
      }
    } else {
      while (!isMoveable && newCurrentCellIndex <= maxCellIndex) {
        let isCellAvailable = isSpaceAvailable(newCurrentCellIndex);

        if (isCellAvailable) isMoveable = true;
        else break;

        newCurrentCellIndex += angle;
      }
    }
  });

  return isMoveable;
}

export function triggerKingPieceMoveEvent(e) {
  reset();

  const piece = e.target;
  selectedPiece.id = parseInt(piece.id);
  selectedPiece.indexOfBoard = board.indexOf(selectedPiece.id);
  selectedPiece.isKing = piece.classList.contains("king");
  const angles = [7, -7, 9, -9];

  let openCells = [];

  angles.forEach((angle) => {
    let currentCellIndex = selectedPiece.indexOfBoard;
    let maxCellIndex = currentCellIndex + 8 * angle;
    let newCellIndex = currentCellIndex + angle;

    if (angle < 0) {
      while (newCellIndex > maxCellIndex) {
        let isCellAvailable = isSpaceAvailable(newCellIndex);

        if (isCellAvailable) openCells.push(newCellIndex);
        else break;

        newCellIndex += angle;
      }
    } else {
      while (newCellIndex <= maxCellIndex) {
        let isCellAvailable = isSpaceAvailable(newCellIndex);

        if (isCellAvailable) openCells.push(newCellIndex);
        else break;

        newCellIndex += angle;
      }
    }
  });

  openCells.forEach((cellIndex) => {
    activeCells.push(cells[cellIndex]);
    signalCellClickable(cells[cellIndex]);

    cells[cellIndex].onclick = () => {
      makeMove(selectedPiece.id, selectedPiece.indexOfBoard, cellIndex);
    };
  });
}
