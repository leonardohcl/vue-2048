const getPossibleMovementsUpwards = (sqr, sqrList) => {
  return sqrList.filter(
    (pos) =>
      pos.row < sqr.row &&
      pos.col == sqr.col &&
      !pos.merged &&
      (pos.value == 0 || pos.value == sqr.value)
  )
}

const getPossibleMovementsDownwards = (sqr, sqrList) => {
  return sqrList.filter(
    (pos) =>
      pos.row > sqr.row &&
      pos.col == sqr.col &&
      !pos.merged &&
      (pos.value == 0 || pos.value == sqr.value)
  )
}

const getPossibleMovementsToTheRight = (sqr, sqrList) => {
  return sqrList.filter(
    (pos) =>
      pos.row == sqr.row &&
      pos.col > sqr.col &&
      !pos.merged &&
      (pos.value == 0 || pos.value == sqr.value)
  )
}

const getPossibleMovementsToTheLeft = (sqr, sqrList) => {
  return sqrList.filter(
    (pos) =>
      pos.row == sqr.row &&
      pos.col < sqr.col &&
      !pos.merged &&
      (pos.value == 0 || pos.value == sqr.value)
  )
}

export default class Square {
  merged = false
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

  static getMovementToTheRight(sqr, sqrList) {
    const movementCandidates = getPossibleMovementsToTheRight(sqr, sqrList)

    if (movementCandidates.length == 0) return null

    movementCandidates.sort((a, b) => b.col - a.col)
    return movementCandidates[0]
  }

  static getMovementToTheLeft(sqr, sqrList) {
    const movementCandidates = getPossibleMovementsToTheLeft(sqr, sqrList)

    if (movementCandidates.length == 0) return null

    movementCandidates.sort((a, b) => a.col - b.col)
    return movementCandidates[0]
  }

  static getMovementDownwards(sqr, sqrList) {
    const movementCandidates = getPossibleMovementsDownwards(sqr, sqrList)

    if (movementCandidates.length == 0) return null

    movementCandidates.sort((a, b) => b.row - a.row)
    return movementCandidates[0]
  }

  static getMovementUpwards(sqr, sqrList) {
    const movementCandidates = getPossibleMovementsUpwards(sqr, sqrList)

    if (movementCandidates.length == 0) return null

    movementCandidates.sort((a, b) => a.row - b.row)
    return movementCandidates[0]
  }
}
