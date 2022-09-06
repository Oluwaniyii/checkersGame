import { board, cells, selectedPiece, globals } from "./globals.js";
import {
  activeCells,
  makeMove,
  signalCellClickable,
  reset,
  makeJump,
} from "./main.js";
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

export function isKingJumpable(pieceId) {
  let boardIndex = board.indexOf(pieceId);
  let isJumpable = false;

  let angles = [7, 9, -7, -9];

  for (let i = 0; i < angles.length; i++) {
    let angle = angles[i];
    let currentCellIndex = boardIndex;

    if (angle < 0) {
      while (currentCellIndex > 1) {
        const status = isSpaceJumpable(currentCellIndex, angle);

        if (status > 2) break;

        if (status === 1) isJumpable = true;

        currentCellIndex += angle;
      }
    } else {
      while (currentCellIndex <= 64) {
        const status = isSpaceJumpable(currentCellIndex, angle);

        if (status > 2) break;

        if (status === 1) isJumpable = true;

        currentCellIndex += angle;
      }
    }
  }

  return isJumpable;
}

export function triggerKingPieceJumpEvent(e) {
  reset();

  selectedPiece.id = parseInt(e.target.id);
  selectedPiece.indexOfBoard = board.indexOf(selectedPiece.id);
  selectedPiece.isKing = true;

  let angles = [7, 9, -7, -9];

  for (let i = 0; i < angles.length; i++) {
    let angle = angles[i];
    let currentCellIndex = selectedPiece.indexOfBoard;
    let isJumpable = false;
    let deleteId;

    if (angle < 0) {
      while (currentCellIndex > 1) {
        const status = isSpaceJumpable(currentCellIndex, angle);

        if (status > 2) break;

        if (status === 1) {
          isJumpable = true;
          deleteId = board[currentCellIndex + angle];
        }

        if (isJumpable && status === 2) {
          let newBoardIndex = currentCellIndex + angle;
          let cell = cells[newBoardIndex];

          activeCells.push(cell);
          signalCellClickable(cell);
          cell.onclick = () => {
            makeJump(
              selectedPiece.id,
              selectedPiece.indexOfBoard,
              newBoardIndex,
              deleteId
            );
          };
        }

        currentCellIndex += angle;
      }
    } else {
      while (currentCellIndex <= 64) {
        const status = isSpaceJumpable(currentCellIndex, angle);

        if (status > 2) break;

        if (status === 1) {
          isJumpable = true;
          deleteId = board[currentCellIndex + angle];
        }

        if (isJumpable && status === 2) {
          let newBoardIndex = currentCellIndex + angle;
          let cell = cells[newBoardIndex];

          activeCells.push(cell);
          signalCellClickable(cell);
          cell.onclick = () => {
            makeJump(
              selectedPiece.id,
              selectedPiece.indexOfBoard,
              newBoardIndex,
              deleteId
            );
          };
        }

        currentCellIndex += angle;
      }
    }
  }
}

function isSpaceJumpable(index, angle) {
  let status = 5;
  let nextColumn = index + angle;
  let thirdColumn = index + angle + angle;

  if (globals.turn) {
    /**
     * ally piece detected => blocked
     */
    if (board[nextColumn] !== null && board[nextColumn] < 12) status = 4;

    /* enemy piece detected but no jump space behind => blocked
     */
    if (board[nextColumn] >= 12 && board[thirdColumn] !== null) status = 3;

    /**
     * empty cell detected
     */
    if (
      board[nextColumn] === null &&
      cells[nextColumn].classList.contains("noPieceHere") === false
    )
      status = 2;

    /**
     * enemy piece detected with space behind
     */
    if (
      board[nextColumn] !== null &&
      board[nextColumn] >= 12 &&
      board[thirdColumn] === null &&
      cells[thirdColumn].classList.contains("noPieceHere") === false
    )
      status = 1;
  } else {
    /**
     * ally piece detected => blocked
     */
    if (board[nextColumn] !== null && board[nextColumn] >= 12) status = 4;

    /**
     * enemy piece detected but no space behind => blocked
     */
    if (board[nextColumn] < 12 && board[thirdColumn] !== null) status = 3;

    /**
     * empty cell detected
     */
    if (
      board[nextColumn] === null &&
      cells[nextColumn].classList.contains("noPieceHere") === false
    )
      status = 2;

    /**
     * enemy piece detected with space behind
     */
    if (
      board[nextColumn] !== null &&
      board[nextColumn] < 12 &&
      board[thirdColumn] === null &&
      cells[thirdColumn].classList.contains("noPieceHere") === false
    )
      status = 1;
  }

  return status;
}
