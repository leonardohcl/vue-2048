import Game from "./Game";
import LEGAL_MOVEMENTS from "../../mocks/legal-movements.json";
import { MoveDirection } from "./interfaces/Game";

describe("Game.ts", () => {
  test("must create game correctly", () => {
    const game = new Game();
    expect(game.width).toBe(4);
    expect(game.height).toBe(4);
    expect(game.winningBlock).toBe(2048);
    expect(game.gameOver).toBe(false);
    expect(game.winner).toBe(false);
    expect(game.canMove.up).toBe(true);
    expect(game.canMove.right).toBe(true);
    expect(game.canMove.down).toBe(true);
    expect(game.canMove.left).toBe(true);
    expect(game.score).toBe(0);
    expect(game.board.emptySquares.length).toBe(16);
  });

  test("must start game correctly", () => {
    const game = new Game();
    game.start();
    expect(game.gameOver).toBe(false);
    expect(game.winner).toBe(false);
    expect(game.score).toBe(0);
    expect(game.board.filledSquares.length).toBe(2);
  });

  test("must load board correctly", () => {
    const game = new Game();
    const MOCK_BOARD = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2];
    game.start();
    game.loadBoardPreset(MOCK_BOARD);
    expect(game.board.flat).toEqual(MOCK_BOARD);
    expect(game.canMove.right).toBe(false);
    expect(game.canMove.down).toBe(false);
  });

  test("must make the right movements", async () => {
    const game = new Game();
    const directions = [
      MoveDirection.Up,
      MoveDirection.Down,
      MoveDirection.Right,
      MoveDirection.Left,
    ];

    for (let idx = 0; idx < directions.length; idx++) {
      for (let scenario = 0; scenario < 1; scenario++) {
        const dir = directions[idx];
        game.start();
        game.loadBoardPreset(LEGAL_MOVEMENTS[dir][scenario].before);
        await game.move(dir, false);
        expect(game.board.flat).toEqual(LEGAL_MOVEMENTS[dir][scenario].after);
      }
    }
  });

  test("must allow only valid movements", () => {
    const game = new Game();
    game.start();
    game.loadBoardPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]);
    expect(game.canMove.right).toBe(false);
    expect(game.canMove.down).toBe(false);
    game.start();
    game.loadBoardPreset([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(game.canMove.left).toBe(false);
    expect(game.canMove.up).toBe(false);
  });

  test("must spawn block after moving", async () => {
    const game = new Game();
    game.spawnBlock = jest.fn();
    game.start();
    game.loadBoardPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2]);
    await game.move(MoveDirection.right);
    expect(game.spawnBlock).toHaveBeenCalled();
  });

  test("must update score correctly", async () => {
    const game = new Game();
    game.start();
    game.loadBoardPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2]);
    await game.move(MoveDirection.Right);
    expect(game.score).toBe(4);
  });

  test("must set game state to win if reached specified winning block", async () => {
    const defaultGame = new Game();
    defaultGame.start();
    defaultGame.loadBoardPreset([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1024, 0, 1024,
    ]);

    await defaultGame.move(MoveDirection.Right);
    expect(defaultGame.winner).toBe(true);

    const modifiedGame = new Game({winningBlock: 512});
    modifiedGame.start();
    modifiedGame.loadBoardPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 256, 0, 256]);
    await modifiedGame.move(MoveDirection.Right);
    expect(modifiedGame.winner).toBe(true);
  });

  test("must set game state to game over if can't make any movement", () => {
    const game = new Game();
    game.start();
    game.loadBoardPreset([2, 8, 4, 2, 4, 2, 16, 8, 8, 16, 2, 4, 2, 4, 8, 2]);

    expect(game.canMove.up).toBe(false);
    expect(game.canMove.down).toBe(false);
    expect(game.canMove.left).toBe(false);
    expect(game.canMove.right).toBe(false);
    expect(game.gameOver).toBe(true);
  });
});
