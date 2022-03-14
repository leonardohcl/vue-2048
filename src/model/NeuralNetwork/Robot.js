import Game from "../2048/GameController"
import NeuralNetwork from "./NeuralNetwork";
import WeightedRoulette from "./WeighedRoulette";

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

    get brain() {
        return this._brain;
    }

    async play(highestBlock = 2048) {
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
        } while (!this._game.isGameOver && move != moves.NONE && this._game.board.highestValue < highestBlock)

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

    crossover(robot, crossoverPoint, mutationProbability = 0) {
        this._brain.crossover(robot.brain, crossoverPoint, mutationProbability)
    }

    static async getTrained(innerLayers, populationSize, generationCount, mutationProbability, withElitism = true, generationCallback = () => null, elementCallback = () => null) {
        const game = new Game(4, 0)
        const robots = new Array(populationSize).fill(0).map(() => new Robot(innerLayers, game))
        var bestRobot, bestScore = -Infinity,
            scores = new Array(populationSize).fill(0),
            goatRobot, goatScore = -Infinity;

        for (let gen = 1; gen <= generationCount; gen++) {
            bestRobot = null;
            bestScore = -Infinity;

            // Get fitness
            for (let i = 0; i < robots.length; i++) {
                scores[i] = await robots[i].play();
                if (scores[i] > bestScore) {
                    bestScore = scores[i];
                    bestRobot = robots[i];

                    if (scores[i] > goatScore) {
                        goatRobot = robots[i]
                        goatScore = scores[i]
                    }
                }
                elementCallback({
                    element: i,
                    elementCount: robots.length 
                })
            }
            const roulette = new WeightedRoulette(scores);


            // Breed and mutate
            for (let i = 0; i < robots.length; i++) {
                if (withElitism && robots[i] === bestRobot) continue;
                const breedingRobot = robots[roulette.getIndex()]
                const crossoverPoint = Math.random()
                robots[i].crossover(breedingRobot, crossoverPoint, mutationProbability)
            }

            generationCallback({
                bestScore,
                scores,
                generation: gen,
                generationCount: generationCount
            })
        }

        return goatRobot
    }

}