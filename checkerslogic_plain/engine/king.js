import { board, cells, selectedPiece, globals } from "./globals.js";
import {
  activeCells,
  makeMove,
  signalCellActive,
  resetClick,
  makeJump,
} from "./main.js";
import { isSpaceAvailable } from "./move.js";

/**
 *  - The king can move in 4 different directions 7, 9, -7, -9
 *  - The king piece can move over multiple cells in a chosen direction meaning, all cells in a direction should be moveable except there is a block
 *  - We have 3 types of block, unjumpable enemy block, an ally piece, or the last cell
 *  - The highest number of cells is the square-root of total board cells, in this case 64, 8
 */
const maxNumberOfCells = 8;

export function isKingMovable(pieceId) {
  const angles = [7, -7, 9, -9];
  let boardIndex = board.indexOf(pieceId);
  let isMoveable = false;

  /**
   * Declare a king piece as moveable if just one move space is available
   */
  angles.forEach((angle) => {
    let currentCellIndex = boardIndex;
    let maxCellIndex = currentCellIndex + maxNumberOfCells * angle;
    let newCurrentCellIndex = currentCellIndex + angle;

    if (angle < 0) {
      // angle is negative value
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
  resetClick();

  const piece = e.target;
  selectedPiece.id = parseInt(piece.id);
  selectedPiece.indexOfBoard = board.indexOf(selectedPiece.id);
  selectedPiece.isKing = piece.classList.contains("king");
  const angles = [7, -7, 9, -9];

  let openCells = [];

  angles.forEach((angle) => {
    let currentCellIndex = selectedPiece.indexOfBoard;
    let maxCellIndex = currentCellIndex + maxNumberOfCells * angle;
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
    signalCellActive(cells[cellIndex]);

    cells[cellIndex].onclick = () => {
      makeMove(selectedPiece.id, selectedPiece.indexOfBoard, cellIndex);
    };
  });
}

export function isKingJumpable(
  pieceId,
  position = null,
  angles = [7, 9, -7, -9]
) {
  let boardIndex = position || board.indexOf(pieceId);
  let isJumpable = false;

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

/**
 * A king can move in all angles including reverse direction
 * Note that we are calculating all possible multipleJumps before hand
 * therefore when a king "is jumpable" from a certain angle like 'right top'
 * you don't want include calculations of the same direction otherwise isMultipleJump will always be true
 */
export function triggerKingPieceJumpEvent(e) {
  resetClick();
  selectedPiece.id = parseInt(e.target.id);
  selectedPiece.indexOfBoard = board.indexOf(selectedPiece.id);
  selectedPiece.isKing = true;
  let angles = [7, 9, -7, -9];

  for (let i = 0; i < angles.length; i++) {
    let angle = angles[i];
    let currentCellIndex = selectedPiece.indexOfBoard;
    let isJumpable = false;
    let deleteId;
    let jumpableCellIndexes = [];
    let isMultipleJump = false;

    if (angle < 0) {
      // angle is negative value
      while (currentCellIndex > 0) {
        const status = isSpaceJumpable(currentCellIndex, angle);

        if (status > 2) break;
        if (isJumpable && status !== 2) break;

        if (status === 1) {
          isJumpable = true;
          deleteId = board[currentCellIndex + angle];
        }

        if (isJumpable && status === 2) {
          jumpableCellIndexes.push(currentCellIndex + angle);
        }

        currentCellIndex += angle;
      }
    } else {
      while (currentCellIndex <= 63) {
        const status = isSpaceJumpable(currentCellIndex, angle);

        if (status > 2) break;
        if (isJumpable && status !== 2) break;

        if (status === 1) {
          isJumpable = true;
          deleteId = board[currentCellIndex + angle];
        }

        if (isJumpable && status === 2) {
          jumpableCellIndexes.push(currentCellIndex + angle);
        }

        currentCellIndex += angle;
      }
    }

    isMultipleJump = checkMultipleJumps(jumpableCellIndexes, angle);

    if (isMultipleJump) {
      for (let i = 0; i < jumpableCellIndexes.length; i++) {
        let jci = jumpableCellIndexes[i]; // jci = jumpableCellIndex

        if (isKingJumpable(null, jci, filterAngles(angle))) {
          let cell = cells[jci];
          activeCells.push(cell);
          signalCellActive(cell);
          cell.onclick = () => {
            makeJump(
              selectedPiece.id,
              selectedPiece.indexOfBoard,
              jci,
              deleteId,
              true
            );
          };
        }
      }
    } else {
      for (let i = 0; i < jumpableCellIndexes.length; i++) {
        let jci = jumpableCellIndexes[i];
        let cell = cells[jci];
        activeCells.push(cell);
        signalCellActive(cell);
        cell.onclick = () => {
          makeJump(selectedPiece.id, selectedPiece.indexOfBoard, jci, deleteId);
        };
      }
    }
  }
}

function isSpaceJumpable(index, angle, s = false) {
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

function filterAngles(usedDirection) {
  let angles = [7, 9, -7, -9];
  let angleToRemove;

  switch (usedDirection) {
    case 7:
      angleToRemove = -7;
      break;
    case 9:
      angleToRemove = -9;
      break;
    case -7:
      angleToRemove = 7;
      break;
    case -9:
      angleToRemove = 9;
      break;
  }

  return angles.filter((angle) => angle !== angleToRemove);
}

function checkMultipleJumps(jumpableCellIndexes, angle) {
  let isMultipleJump = false;
  let angles = filterAngles(angle);

  for (let i = 0; i < jumpableCellIndexes.length; i++) {
    if (isKingJumpable(null, jumpableCellIndexes[i], angles))
      isMultipleJump = true;
  }

  return isMultipleJump;
}
