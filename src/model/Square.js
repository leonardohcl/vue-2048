const getPossibleMovementsUpwards = (sqr, sqrList) => {
  return sqrList.filter(
    (pos) =>
    pos.row < sqr.row &&
    pos.col == sqr.col
  )
}

const getPossibleMovementsDownwards = (sqr, sqrList) => {
  return sqrList.filter(
    (pos) =>
    pos.row > sqr.row &&
    pos.col == sqr.col
  )
}

const getPossibleMovementsToTheRight = (sqr, sqrList) => {
  return sqrList.filter(
    (pos) =>
    pos.row == sqr.row &&
    pos.col > sqr.col
  )
}

const getPossibleMovementsToTheLeft = (sqr, sqrList) => {
  return sqrList.filter(
    (pos) =>
    pos.row == sqr.row &&
    pos.col < sqr.col
  )
}

const getMovementToTheRight = (sqr, sqrList) => {
  const movementCandidates = getPossibleMovementsToTheRight(sqr, sqrList)
  return selectedMove(sqr, movementCandidates.sort((a, b) => a.col - b.col));
}

const getMovementToTheLeft = (sqr, sqrList) => {
  const movementCandidates = getPossibleMovementsToTheLeft(sqr, sqrList)
  return selectedMove(sqr, movementCandidates.sort((a, b) => b.col - a.col));
}

const getMovementDownwards = (sqr, sqrList) => {
  const movementCandidates = getPossibleMovementsDownwards(sqr, sqrList)
  return selectedMove(sqr, movementCandidates.sort((a, b) => a.row - b.row));
}

const getMovementUpwards = (sqr, sqrList) => {
  const movementCandidates = getPossibleMovementsUpwards(sqr, sqrList)
  return selectedMove(sqr, movementCandidates.sort((a, b) => b.row - a.row));
}

const selectedMove = (sqr, movements) => {
  let selectedMove = null;
  movements.some(move => {
    if (move.value === 0) selectedMove = move;
    else if (move.value === sqr.value && !move.merged) {
      selectedMove = move;
      return true;
    } else if (move.value > sqr.value || move.value < sqr.value) return true;
  });

  return selectedMove;
}

export default class Square {
  merged = false
  previousValue = null
  nextValue = null  

  constructor(row, col, value = 0) {
    this.value = value
    this.row = row
    this.col = col
  }

  get isEmpty() {
    return this.value === 0
  }

  merge() {
    this.merged = true
    this.setValue(this.value + this.value)
  }

  mergeComplete() {
    this.merged = false
  }

  setValue(value) {
    this.value = value
  }

  static getMovement(sqr, sqrList, dir) {
    switch (dir) {
      case "left":
        return getMovementToTheLeft(sqr, sqrList);
      case "right":
        return getMovementToTheRight(sqr, sqrList);
      case "up":
        return getMovementUpwards(sqr, sqrList);
      case "down":
        return getMovementDownwards(sqr, sqrList);
    }
  }
}