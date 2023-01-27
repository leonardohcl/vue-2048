import Board from './Board'
import { orderBy } from 'lodash'
import SaveFile from './SaveFile'
import { deepCopy } from '../../utils/copy'
import GameSettings from './interfaces/GameSettings'
import GameState from './interfaces/GameState'
import GameProgress from './interfaces/GameProgress'
import Direction from './Direction'
import IBoard from './interfaces/Board'
import RankingEntry from './RankingEntry'

const MOVEMENT_ARRAY = [
  Direction.Up,
  Direction.Down,
  Direction.Right,
  Direction.Left,
]

const MOVEMENT_CONFIG = {
  [Direction.Up]: { sortingField: 'row', sortingOrder: 'asc' },
  [Direction.Down]: { sortingField: 'row', sortingOrder: 'desc' },
  [Direction.Left]: { sortingField: 'col', sortingOrder: 'asc' },
  [Direction.Right]: { sortingField: 'col', sortingOrder: 'desc' },
}

export default class GameController {
  score = 0
  undos = 0
  moves = 0
  width = 4
  height = 4
  updateDelay = 0
  historySize = 0
  winningBlock = 2048
  endless = false
  winner = false
  paused = false
  gameOver = true
  board: Board = new Board(1, 1)
  isWaintingUpdate = false
  history: {
    pointsGained: number
    board: IBoard
  }[] = []

  canMove = {
    [Direction.Up]: true,
    [Direction.Down]: true,
    [Direction.Left]: true,
    [Direction.Right]: true,
  }

  constructor(
    { width, height, winningBlock, historySize, updateDelay } = {
      width: 4,
      height: 4,
      winningBlock: 2048,
      historySize: 2,
      updateDelay: 0,
    }
  ) {
    this.width = width
    this.height = height
    this.winningBlock = winningBlock
    this.historySize = historySize
    this.updateDelay = updateDelay
    this.clearBoard()
  }

  get highestValue() {
    return this.board.highestValue
  }

  static getSaveFile(filename: string, game: GameController) {
    return new SaveFile(
      filename,
      new GameSettings(game),
      new GameState(game),
      new GameProgress(game)
    )
  }

  static getRankingEntry({
    id,
    game,
    name = '',
  }: {
    id: string
    name: string
    game: GameController
  }) {
    return new RankingEntry({
      id,
      name,
      score: game.score,
      height: game.height,
      width: game.width,
      block: game.highestValue,
      moves: game.moves,
      undos: game.undos,
    })
  }

  loadSaveFile(save: SaveFile) {
    this.updateSettings(save.settings)
    this.score = save.progress.score
    this.moves = save.progress.moves
    this.undos = save.progress.undos

    this.loadBoardObject(save.state.board)
    this.history = save.state.history.map((entry) => {
      entry.board = Board.fromObject(entry.board)
      return entry
    })

    this.gameOver = save.state.gameOver
    this.winner = save.state.winner
    this.updateGameState()
  }

  updateSettings(newSettings: GameSettings) {
    this.score = 0
    this.history = []
    this.winner = false
    this.gameOver = true
    this.isWaintingUpdate = false
    const settings = { ...new GameSettings(this), ...newSettings }
    this.width = settings.width
    this.height = settings.height
    this.historySize = settings.historySize
    this.winningBlock = settings.winningBlock
    this.clearBoard()
  }

  updateMoveValidation(dir: Direction) {
    const { nextBoard } = this.getBoardAfterMovement(dir, false)
    this.canMove[dir] =
      nextBoard.filledSquares.length != this.board.filledSquares.length ||
      nextBoard.filledSquares.some((sqr) => {
        const matching = this.board.getSquare(sqr.row, sqr.col)
        return matching ? matching.value != sqr.value : true
      })
  }

  updateValidMoves() {
    MOVEMENT_ARRAY.forEach((move) => this.updateMoveValidation(move))
  }

  activateEndless() {
    this.winner = false
    this.endless = true
  }

  isWinner() {
    if (this.endless) return false
    return !this.winner && this.board.highestValue >= this.winningBlock
  }

  isGameOver() {
    return (
      !this.canMove[Direction.Up] &&
      !this.canMove[Direction.Down] &&
      !this.canMove[Direction.Right] &&
      !this.canMove[Direction.Left]
    )
  }

  spawnBlock(board: Board) {
    const options = board.emptySquares

    if (options.length === 0) return

    const selectedIndex = Math.floor(Math.random() * options.length)

    options[selectedIndex].setSpawn()
    if (Math.random() > 0.1) options[selectedIndex].setValue(2)
    else options[selectedIndex].setValue(4)
  }

  loadBoardPreset(flatBoard: number[]) {
    this.board.loadPreset(flatBoard)
    this.updateGameState()
  }

  loadBoardObject(board: IBoard) {
    this.board = Board.fromObject(board)
    this.updateGameState()
  }

  clearBoard() {
    this.board = new Board(this.width, this.height)
  }

  addToHistory(board: Board, pointsGained: number) {
    if (this.historySize < 1) return
    this.history.push({ board: deepCopy(board), pointsGained })
    if (this.history.length > this.historySize) {
      this.history = this.history.splice(1)
    }
  }

  getBoardAfterMovement(dir: Direction, rememberMoves = true) {
    const nextBoard = new Board(this.width, this.height)
    let pointsGained = 0
    const squares = orderBy(
      this.board.filledSquares,
      MOVEMENT_CONFIG[dir].sortingField,
      MOVEMENT_CONFIG[dir].sortingOrder as 'asc' | 'desc'
    )

    squares.forEach((sqr) => {
      nextBoard.updateSquare(sqr.row, sqr.col, sqr.value)
      const [nextRow, nextCol] = nextBoard.getSquareValidMovement(
        sqr.row,
        sqr.col,
        dir
      )
      if (nextRow !== null && nextCol !== null) {
        nextBoard.updateSquare(sqr.row, sqr.col, 0)
        pointsGained += nextBoard.updateSquare(nextRow, nextCol, sqr.value)
        if (rememberMoves)
          sqr.setMove({
            vertical: sqr.row - nextRow,
            horizontal: sqr.col - nextCol,
            reverse: false,
            spawn: false,
          })
      }
    })

    return { nextBoard, pointsGained }
  }

  cleanCustomStates() {
    this.board.squares.forEach((sqr) => {
      sqr.customStates = []
    })
  }

  updateGameState() {
    if (this.isWinner()) this.winner = true

    this.updateValidMoves()

    if (this.isGameOver()) this.gameOver = true
  }

  updateBoard(nextBoard: Board, pointsGained: number, spawnBlock: boolean) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.score += pointsGained
        if (spawnBlock) this.spawnBlock(nextBoard)
        this.board = nextBoard
        this.updateGameState()
        this.isWaintingUpdate = false
        resolve()
      }, this.updateDelay)
    })
  }

  revertBoard(previousBoard: IBoard, pointsGained: number) {
    this.isWaintingUpdate = true

    const board = Board.fromObject(previousBoard)
    board.filledSquares.forEach((sqr) => sqr.setMove({ reverse: true }))

    this.score -= pointsGained
    this.board = board
    this.updateValidMoves()

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.board.filledSquares.forEach((sqr) =>
          sqr.setMove({ reverse: false, horizontal: 0, vertical: 0 })
        )
        this.isWaintingUpdate = false
        resolve()
      }, this.updateDelay)
    })
  }

  async move(dir: Direction, shouldSpawnAfter = true) {
    if (this.isWaintingUpdate || !this.canMove[dir]) return

    this.isWaintingUpdate = true

    const { nextBoard, pointsGained } = this.getBoardAfterMovement(dir)
    this.addToHistory(this.board, pointsGained)

    this.moves++
    await this.updateBoard(nextBoard, pointsGained, shouldSpawnAfter)
  }

  async undo() {
    if (this.isWaintingUpdate) return false
    const previousState = this.history.pop()
    if (!previousState) return
    this.moves--
    this.undos++
    this.isWaintingUpdate = true
    await this.revertBoard(previousState.board, previousState.pointsGained)
    return true
  }

  start() {
    this.endless = false
    this.score = 0
    this.moves = 0
    this.undos = 0
    this.history = []
    this.gameOver = false
    this.winner = false
    this.clearBoard()
    this.spawnBlock(this.board)
    this.spawnBlock(this.board)
    this.updateGameState()
  }
}
