import sleep from "@/utils/sleep";
import Game from "../2048/Game";
import { MoveDirection } from "../2048/interfaces/Game";

const MOVEMENTS = [
  MoveDirection.Up,
  MoveDirection.Down,
  MoveDirection.Left,
  MoveDirection.Right,
];

function getRandomMovement(game: Game) {
  const moves = MOVEMENTS.filter((dir) => game.canMove[dir]);
  const idx = Math.floor(Math.random() * moves.length);
  return moves[idx];
}

class DirectionTracker {
  points = 0;
}

class ScenarioTracker {
  tracker;
  constructor() {
    this.tracker = {
      [MoveDirection.Up]: new DirectionTracker(),
      [MoveDirection.Down]: new DirectionTracker(),
      [MoveDirection.Left]: new DirectionTracker(),
      [MoveDirection.Right]: new DirectionTracker(),
    };
  }

  reset() {
    this.tracker = {
      [MoveDirection.Up]: new DirectionTracker(),
      [MoveDirection.Down]: new DirectionTracker(),
      [MoveDirection.Left]: new DirectionTracker(),
      [MoveDirection.Right]: new DirectionTracker(),
    };
  }

  add(dir: MoveDirection, finalScore: number) {
    this.tracker[dir].points = (this.tracker[dir].points + finalScore) / 2;
  }

  getAverageBestScenario() {
    const results = {
      [MoveDirection.Up]: this.tracker[MoveDirection.Up].points,
      [MoveDirection.Right]: this.tracker[MoveDirection.Right].points,
      [MoveDirection.Left]: this.tracker[MoveDirection.Left].points,
      [MoveDirection.Down]: this.tracker[MoveDirection.Down].points,
    };

    const bestVertical =
      results[MoveDirection.Up] > results[MoveDirection.Down]
        ? MoveDirection.Up
        : MoveDirection.Down;
    const bestHorizontal =
      results[MoveDirection.Left] > results[MoveDirection.Right]
        ? MoveDirection.Left
        : MoveDirection.Right;

    return results[bestVertical] > results[bestHorizontal]
      ? bestVertical
      : bestHorizontal;
  }
}

export default abstract class MonteCarloTreeSearch {
  static async playGame(
    game: Game,
    scenarios: number,
    lookAheadTimeout: number,
    shouldStop = () => false
  ) {
    game.start();
    while (!game.winner && !game.gameOver) {
      const chosenDir = await MonteCarloTreeSearch.getNextMove(
        game,
        scenarios,
        lookAheadTimeout
      );
      await game.move(chosenDir);

      await sleep(100);
      if (shouldStop()) return;
    }
  }

  static async getNextMove(
    game: Game,
    scenarios: number,
    lookAheadTimeout: number
  ) {
    const validMoves = MOVEMENTS.filter((dir) => game.canMove[dir]);
    const tracker = new ScenarioTracker();

    for (let moveIdx = 0; moveIdx < validMoves.length; moveIdx++) {
      for (let i = 0; i < scenarios / validMoves.length; i++) {
        const score = await MonteCarloTreeSearch.playScenario(
          game,
          validMoves[moveIdx],
          lookAheadTimeout
        );
        tracker.add(validMoves[moveIdx], score);
      }
    }

    return tracker.getAverageBestScenario();
  }

  static async playScenario(
    game: Game,
    firstMoveDir: MoveDirection,
    lookAheadTimeout: number
  ) {
    const scenario = new Game({
      width: game.width,
      height: game.height,
      winningBlock: game.winningBlock,
    });
    scenario.start();
    scenario.loadBoardPreset(game.board.flat);
    scenario.move(firstMoveDir);

    let stop = false
    setTimeout(() => stop = true, lookAheadTimeout)
    while (!scenario.winner && !scenario.gameOver) {
      const dir = getRandomMovement(game);
      await scenario.move(dir);
      await sleep(1)
      if (stop) break;
    }

    return scenario.score;
  }
}
