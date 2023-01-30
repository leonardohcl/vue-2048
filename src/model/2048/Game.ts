import { orderBy } from "lodash"
import Board from "./Board"
import Direction from "./Direction"
import { IGame, onUpdateSquareFn } from "./interfaces/Game"

const SORTING_CONFIG = {
    [Direction.Up]: { field: 'row', order: 'asc' },
    [Direction.Down]: { field: 'row', order: 'desc' },
    [Direction.Left]: { field: 'col', order: 'asc' },
    [Direction.Right]: { field: 'col', order: 'desc' },
}


export default class Game implements IGame {
    score = 0
    winner = false
    gameOver = true
    winningBlock: number
    width: number
    height: number
    board: Board

    canMove = {
        [Direction.Up]: true,
        [Direction.Down]: true,
        [Direction.Left]: true,
        [Direction.Right]: true,
    }

    constructor({ width = 4, height = 4, winningBlock = 2048 } = {}) {
        this.width = width
        this.height = height
        this.winningBlock = winningBlock
        this.board = new Board(this.width, this.height)
    }

    clearBoard() {
        this.board = new Board(this.width, this.height)
    }

    loadBoardPreset(flatBoard: number[]) {
        this.board.loadPreset(flatBoard)
        this.updateGameState()
    }

    getNextBoard(dir: Direction, onUpdateSquare: onUpdateSquareFn = () => { }) {
        const nextBoard = new Board(this.width, this.height)
        let pointsGained = 0

        const squares = orderBy(
            this.board.filledSquares,
            SORTING_CONFIG[dir].field,
            SORTING_CONFIG[dir].order as 'asc' | 'desc'
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
                onUpdateSquare(sqr, { nextRow, nextCol })
            }
        })

        return { nextBoard, pointsGained }
    }

    updateMoveValidation(dir: Direction) {
        const { nextBoard } = this.getNextBoard(dir, () => {})
        this.canMove[dir] =
            nextBoard.filledSquares.length != this.board.filledSquares.length ||
            nextBoard.filledSquares.some((sqr) => {
                const matching = this.board.getSquare(sqr.row, sqr.col)
                return matching ? matching.value != sqr.value : true
            })
    }

    updateValidMoves() {
        const directions = [Direction.Down, Direction.Up, Direction.Left, Direction.Right]
        directions.forEach((direction) => this.updateMoveValidation(direction))
    }

    spawnBlock(board: Board) {
        const options = board.emptySquares

        if (options.length === 0) return

        const selectedIndex = Math.floor(Math.random() * options.length)

        options[selectedIndex].setSpawn()
        if (Math.random() > 0.1) options[selectedIndex].setValue(2)
        else options[selectedIndex].setValue(4)
    }

    move(dir: Direction, shouldSpawnAfter = true) {
        if (!this.canMove[dir]) return Promise.resolve({ success: false, pointsGained: 0 })
        const { nextBoard, pointsGained } = this.getNextBoard(dir)
        this.score += pointsGained
        if (shouldSpawnAfter) this.spawnBlock(nextBoard)
        this.board = nextBoard
        this.updateGameState()
        return Promise.resolve({ success: true, pointsGained })
    }


    isWinner() {
        return this.board.highestValue >= this.winningBlock
    }

    isGameOver() {
        return (
            !this.canMove[Direction.Up] &&
            !this.canMove[Direction.Down] &&
            !this.canMove[Direction.Right] &&
            !this.canMove[Direction.Left]
        )
    }

    updateGameState() {
        if (this.isWinner()) this.winner = true

        this.updateValidMoves()

        if (this.isGameOver()) this.gameOver = true
    }

    start() {
        this.winner = false
        this.gameOver = false
        this.score = 0
        this.clearBoard()
        this.spawnBlock(this.board)
        this.spawnBlock(this.board)
    }

}