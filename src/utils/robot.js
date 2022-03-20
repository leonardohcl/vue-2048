export const moves = {
  NONE: -1,
  LEFT: 0,
  UP: 1,
  DOWN: 2,
  RIGHT: 3,
};

export const intToMove = val => {
  switch (val) {
    case moves.LEFT:
      return moves.LEFT;
    case moves.UP:
      return moves.UP;
    case moves.DOWN:
      return moves.DOWN;
    case moves.RIGHT:
      return moves.RIGHT;
  }
  return moves.RIGHT;
};

export const moveToString = move => {
  switch (move) {
    case moves.UP:
      return "up";
    case moves.LEFT:
      return "left";
    case moves.RIGHT:
      return "right";
    case moves.DOWN:
      return "down";
    default:
      return "";
  }
};
