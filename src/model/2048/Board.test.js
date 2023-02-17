import Board from './Board'
import { MoveDirection } from './interfaces/Game'

const preset = [0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]

describe('Board.ts', () => {
  test('must create board correctly', () => {
    ;[
      [3, 3],
      [4, 4],
      [3, 4],
    ].forEach((size) => {
      const board = new Board(size[0], size[1])
      expect(board.width).toBe(size[0])
      expect(board.height).toBe(size[1])
      expect(board.squares.length).toBe(size[0] * size[1])
    })
  })

  test('must create board with preset correctly', () => {
    const board = new Board(4, 4, preset)
    preset.forEach((val, idx) => {
      expect(board.squares[idx].value).toBe(val)
    })
    expect(board.emptySquares.length).toBe(14)
    expect(board.filledSquares.length).toBe(2)
  })

  test('must load preset after creation correctly', () => {
    const board = new Board(4, 4)
    expect(board.emptySquares.length).toBe(16)
    board.loadPreset(preset)
    preset.forEach((val, idx) => {
      expect(board.squares[idx].value).toEqual(val)
    })
  })

  test('must parse coordinates to index correctly', () => {
    const squareBoard = new Board(5, 5)
    expect(squareBoard.getCoordFromIdx(17)).toEqual({ row: 3, col: 2 })
    expect(squareBoard.getCoordFromIdx(24)).toEqual({ row: 4, col: 4 })
    expect(squareBoard.getCoordFromIdx(4)).toEqual({ row: 0, col: 4 })
    expect(squareBoard.getCoordFromIdx(11)).toEqual({ row: 2, col: 1 })
    expect(squareBoard.getCoordFromIdx(33)).toEqual({ row: -1, col: -1 })

    const rectangleBoard = new Board(5, 6)
    expect(rectangleBoard.getCoordFromIdx(17)).toEqual({ row: 3, col: 2 })
    expect(rectangleBoard.getCoordFromIdx(24)).toEqual({ row: 4, col: 4 })
    expect(rectangleBoard.getCoordFromIdx(4)).toEqual({ row: 0, col: 4 })
    expect(rectangleBoard.getCoordFromIdx(11)).toEqual({ row: 2, col: 1 })
    expect(rectangleBoard.getCoordFromIdx(25)).toEqual({ row: 5, col: 0 })
    expect(rectangleBoard.getCoordFromIdx(33)).toEqual({ row: -1, col: -1 })
  })

  test('must parse index to coordinates correctly', () => {
    const squareBoard = new Board(5, 5)
    expect(squareBoard.getIdxFromCoord(3, 2)).toEqual(17)
    expect(squareBoard.getIdxFromCoord(4, 4)).toEqual(24)
    expect(squareBoard.getIdxFromCoord(0, 4)).toEqual(4)
    expect(squareBoard.getIdxFromCoord(2, 1)).toEqual(11)
    expect(squareBoard.getIdxFromCoord(5, 0)).toEqual(-1)

    const rectangleBoard = new Board(5, 6)
    expect(rectangleBoard.getIdxFromCoord(3, 2)).toEqual(17)
    expect(rectangleBoard.getIdxFromCoord(4, 4)).toEqual(24)
    expect(rectangleBoard.getIdxFromCoord(0, 4)).toEqual(4)
    expect(rectangleBoard.getIdxFromCoord(2, 1)).toEqual(11)
    expect(rectangleBoard.getIdxFromCoord(5, 0)).toEqual(25)
    expect(rectangleBoard.getIdxFromCoord(5, 6)).toEqual(-1)
  })

  test('must get highest block correctly', () => {
    const board = new Board(4, 4)
    expect(board.highestBlock).toBe(0)
    const withPreset = new Board(4, 4, preset)
    expect(withPreset.highestBlock).toBe(4)
  })

  test('must get square correctly', () => {
    const board = new Board(4, 4)
    const sqr = board.getSquare(1, 3)
    expect(sqr === board.squares[2]).toBe(false)
    expect(sqr === board.squares[7]).toBe(true)
  })

  test('must get square neighbor correctly', () => {
    const board = new Board(4, 4)
    let neighbor

    // Valid neighbors
    neighbor = board.getSquareNeighbor(1, 1, MoveDirection.Up)
    expect(neighbor === board.squares[1]).toBe(true)
    neighbor = board.getSquareNeighbor(1, 1, MoveDirection.Right)
    expect(neighbor === board.squares[6]).toBe(true)
    neighbor = board.getSquareNeighbor(1, 1, MoveDirection.Down)
    expect(neighbor === board.squares[9]).toBe(true)
    neighbor = board.getSquareNeighbor(1, 1, MoveDirection.Left)
    expect(neighbor === board.squares[4]).toBe(true)

    // Edge neighbors (no-neighbor to that direction)
    neighbor = board.getSquareNeighbor(0, 0, MoveDirection.Up)
    expect(neighbor).toBe(undefined)
    neighbor = board.getSquareNeighbor(3, 3, MoveDirection.Right)
    expect(neighbor).toBe(undefined)
    neighbor = board.getSquareNeighbor(3, 3, MoveDirection.Down)
    expect(neighbor).toBe(undefined)
    neighbor = board.getSquareNeighbor(0, 0, MoveDirection.Left)
    expect(neighbor).toBe(undefined)
  })

  test('must get square valid movement correctly', () => {
    const board = new Board(
      4,
      4,
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]
    )

    // Free moves
    expect(board.getSquareValidMovement(3, 3, MoveDirection.Up)).toEqual({
      row: 0,
      col: 3,
    })
    expect(board.getSquareValidMovement(0, 0, MoveDirection.Right)).toEqual({
      row: 0,
      col: 3,
    })
    expect(board.getSquareValidMovement(0, 0, MoveDirection.Down)).toEqual({
      row: 3,
      col: 0,
    })
    expect(board.getSquareValidMovement(3, 3, MoveDirection.Left)).toEqual({
      row: 3,
      col: 0,
    })

    // Can't move
    expect(board.getSquareValidMovement(0, 0, MoveDirection.Up)).toEqual({})
    expect(board.getSquareValidMovement(3, 3, MoveDirection.Right)).toEqual({})
    expect(board.getSquareValidMovement(3, 3, MoveDirection.Down)).toEqual({})
    expect(board.getSquareValidMovement(0, 0, MoveDirection.Left)).toEqual({})

    // will merge
    board.loadPreset([0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0])
    expect(board.getSquareValidMovement(2, 1, MoveDirection.Up)).toEqual({
      row: 0,
      col: 1,
    })
    expect(board.getSquareValidMovement(2, 1, MoveDirection.Right)).toEqual({
      row: 2,
      col: 3,
    })
    board.loadPreset([0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0])
    expect(board.getSquareValidMovement(1, 2, MoveDirection.Down)).toEqual({
      row: 3,
      col: 2,
    })
    expect(board.getSquareValidMovement(1, 2, MoveDirection.Left)).toEqual({
      row: 1,
      col: 0,
    })

    // won't merge
    board.loadPreset([0, 4, 0, 0, 0, 0, 0, 0, 0, 2, 0, 4, 0, 0, 0, 0])
    expect(board.getSquareValidMovement(2, 1, MoveDirection.Up)).toEqual({
      row: 1,
      col: 1,
    })
    expect(board.getSquareValidMovement(2, 1, MoveDirection.Right)).toEqual({
      row: 2,
      col: 2,
    })
    board.loadPreset([0, 0, 0, 0, 4, 0, 2, 0, 0, 0, 0, 0, 0, 0, 4, 0])
    expect(board.getSquareValidMovement(1, 2, MoveDirection.Down)).toEqual({
      row: 2,
      col: 2,
    })
    expect(board.getSquareValidMovement(1, 2, MoveDirection.Left)).toEqual({
      row: 1,
      col: 1,
    })
  })

  test('must generate identical snapshot with no object reference', () => {
    const board = new Board(4, 4, preset)
    const clone = board.getSnapshot()
    expect(board == clone).toBe(false)
    expect(clone.squares == board.squares).toBe(false)
    expect(clone.squares.map((x) => x.value)).toEqual(
      board.squares.map((x) => x.value)
    )
  })
})
