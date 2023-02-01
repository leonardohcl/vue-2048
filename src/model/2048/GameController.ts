import Board from './Board'
import SaveFile from './SaveFile'
import { deepCopy } from '../../utils/copy'
import GameSettings, { IGameSettings } from './interfaces/GameSettings'
import GameState from './interfaces/GameState'
import GameProgress from './interfaces/GameProgress'
import Direction from './Direction'
import IBoard from './interfaces/Board'
import RankingEntry from './RankingEntry'
import Game from './Game'
import { onUpdateSquareFn } from './interfaces/Game'

const rememberMoves: onUpdateSquareFn = (sqr, { nextRow, nextCol }) => {
  sqr.setMove({
    vertical: sqr.row - nextRow,
    horizontal: sqr.col - nextCol,
    reverse: false,
  })
}

export default class GameController extends Game {
  undos = 0
  moves = 0
  updateDelay = 0
  historySize = 0
  endless = false
  winner = false
  paused = false
  gameOver = true
  isWaintingUpdate = false
  history: {
    pointsGained: number
    board: IBoard
  }[] = []

  constructor({ width = 4, height = 4, winningBlock = 2048, historySize = 2, updateDelay = 0 } = {}) {
    super({ width, height, winningBlock })
    this.historySize = historySize
    this.updateDelay = updateDelay
  }

  get highestBlock() {
    return this.board.highestBlock
  }

  getNextBoard(dir: Direction, onUpdateSquare: onUpdateSquareFn = rememberMoves) {
    return super.getNextBoard(dir, onUpdateSquare)
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
      block: game.highestBlock,
      moves: game.moves,
      undos: game.undos,
    })
  }

  loadSaveFile(save: SaveFile) {
    this.updateSettings(save.settings)
    this.score = save.progress.score ?? 0 
    this.moves = save.progress.moves ?? 0
    this.undos = save.progress.undos ?? 0

    this.loadBoardObject(save.state.board)
    this.history = save.state.history.map((entry) => {
      entry.board = Board.fromObject(entry.board)
      return entry
    })

    this.gameOver = save.state.gameOver
    this.winner = save.state.winner
    this.updateGameState()
  }

  updateSettings(newSettings: IGameSettings) {
    this.score = 0
    this.history = []
    this.winner = false
    this.gameOver = true
    this.isWaintingUpdate = false
    const settings = { ...new GameSettings(this), ...newSettings }
    this.width = settings.width || 4
    this.height = settings.height || 4
    this.historySize = settings.historySize || 0
    this.winningBlock = settings.winningBlock || 2048
    this.clearBoard()
  }

  activateEndless() {
    this.winner = false
    this.endless = true
  }

  loadBoardObject(board: IBoard) {
    this.board = Board.fromObject(board)
    this.updateGameState()
  }

  addToHistory(board: Board, pointsGained: number) {
    if (this.historySize < 1) return
    this.history.push({ board: deepCopy(board), pointsGained })
    if (this.history.length > this.historySize) {
      this.history = this.history.splice(1)
    }
  }

  cleanCustomStates() {
    this.board.squares.forEach((sqr) => {
      sqr.customStates = []
    })
  }

  isWinner() {
    if (this.endless) return false
    return !this.winner && super.isWinner()
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
    if (this.isWaintingUpdate || !this.canMove[dir]) return { success: false, pointsGained: 0 }

    this.isWaintingUpdate = true

    const { nextBoard, pointsGained } = this.getNextBoard(dir)


    return new Promise<{ success: boolean, pointsGained: number }>(resolve => {
      setTimeout(() => {

        this.addToHistory(this.board, pointsGained)
        this.score += pointsGained
        this.moves++

        if (shouldSpawnAfter) this.spawnBlock(nextBoard)

        this.board = nextBoard
        this.updateGameState()

        this.isWaintingUpdate = false

        resolve({ success: true, pointsGained })
      }, this.updateDelay)
    })


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
    super.start()
    this.endless = false
    this.moves = 0
    this.undos = 0
    this.history = []
  }
}
