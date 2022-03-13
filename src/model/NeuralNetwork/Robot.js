import Game from "../2048/GameController"
import NeuralNetwork from "./NeuralNetwork";

const moves = {
    NONE: -1,
    LEFT: 0,
    UP: 1,
    DOWN: 2,
    RIGHT: 3
}

const intToMove = (val) => {
    switch (val) {
        case moves.LEFT:
            return moves.LEFT
        case moves.UP:
            return moves.UP
        case moves.DOWN:
            return moves.DOWN
        case moves.RIGHT:
            return moves.RIGHT
    }
    return moves.RIGHT
}

export default class Robot {
    constructor(innerLayers = [], game = new Game(), config = {
        useBias: true,
        useBatchNormalization: true
    }) {
        this._game = game;
        this._brain = new NeuralNetwork([this._game.size * this._game.size, ...innerLayers, 4], config.useBias, config.useBatchNormalization)
    }

    get boardSize() {
        return this._game.boardSize
    }

    get board() {
        return this._game.board
    }

    async play() {
        this._game.start()
        let move;
        do {
            move = this._getNextMove();
            switch (move) {
                case moves.UP:
                    await this._game.move("up");
                    break;
                case moves.LEFT:
                    await this._game.move("left");
                    break;
                case moves.RIGHT:
                    await this._game.move("right");
                    break;
                case moves.DOWN:
                    await this._game.move("down");
                    break;
            }
        } while (!this._game.isGameOver && move != moves.NONE)

        return this._game.score
    }

    _getNextMove() {
        if (this._game.isGameOver) return moves.NONE
        const input = [this._game.board.squares.map(sqr => sqr.value)]
        const [decisions] = this._brain.processInput(input)
        let move = moves.NONE,
            discardedMoves = []
        do {
            let selectedMove = this._getMove(decisions, discardedMoves);
            if (this._moveIsValid(selectedMove))
                move = selectedMove
            else
                discardedMoves.push(selectedMove)

        } while (move === moves.NONE && discardedMoves.length < 4)

        return move;
    }

    _moveIsValid(move) {
        switch (move) {
            case moves.LEFT:
                return this._game.canMoveLeft
            case moves.UP:
                return this._game.canMoveUp
            case moves.DOWN:
                return this._game.canMoveDown
            case moves.RIGHT:
                return this._game.canMoveRight
        }
    }

    _getMove(decision, ignore = []) {
        let bestIndex = -1,
            bestValue = -Infinity;
        decision.forEach((prob, idx) => {
            if (prob >= bestValue && !ignore.includes(idx)) {
                bestValue = prob
                bestIndex = idx
            }
        });

        return intToMove(bestIndex)
    }

}