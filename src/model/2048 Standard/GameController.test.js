import GameController from './GameController'
import LEGAL_MOVEMENTS from '../../mocks/legal-movements.json'
import MOCK_GAME from '../../mocks/game.json'
import { MoveDirection } from '../2048/interfaces/Game'
import GameProgress from './partials/GameProgress'
import GameState from './partials/GameState'
import GameSettings from './partials/GameSettings'
import { deepCopy } from '../../utils/copy'

const moveBoardInCircle = async (game) => {
  await game.move(MoveDirection.Up)
  await game.move(MoveDirection.Right)
  await game.move(MoveDirection.Down)
  await game.move(MoveDirection.Left)
}

describe('GameController.ts', () => {
  test('must create game correctly', () => {
    const game = new GameController()
    expect(game.width).toBe(4)
    expect(game.height).toBe(4)
    expect(game.winningBlock).toBe(2048)
    expect(game.gameOver).toBe(false)
    expect(game.winner).toBe(false)
    expect(game.paused).toBe(true)
    expect(game.canMove.up).toBe(true)
    expect(game.canMove.right).toBe(true)
    expect(game.canMove.down).toBe(true)
    expect(game.canMove.left).toBe(true)
    expect(game.score).toBe(0)
    expect(game.historySize).toBe(2)
    expect(game.updateDelay).toBe(0)
    expect(game.board.emptySquares.length).toBe(16)
  })

  test('must start game correctly', () => {
    const game = new GameController()
    game.start()
    expect(game.gameOver).toBe(false)
    expect(game.score).toBe(0)
    expect(game.history.length).toBe(0)
    expect(game.paused).toBe(false)
    expect(game.endless).toBe(false)
    expect(game.moves).toBe(0)
    expect(game.undos).toBe(0)
    expect(game.board.filledSquares.length).toBe(2)
  })

  test('must make the right movements', async () => {
    const game = new GameController()
    const directions = [
      MoveDirection.Up,
      MoveDirection.Down,
      MoveDirection.Right,
      MoveDirection.Left,
    ]

    for (let idx = 0; idx < directions.length; idx++) {
      for (let scenario = 0; scenario < 1; scenario++) {
        const dir = directions[idx]
        game.start()
        game.loadBoardPreset(LEGAL_MOVEMENTS[dir][scenario].before)
        await game.move(dir, false)
        expect(game.board.flat).toEqual(LEGAL_MOVEMENTS[dir][scenario].after)
      }
    }
  })

  test('must set game ignore win if set to endless mode', async () => {
    const game = new GameController()
    game.start()
    game.loadBoardPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1024, 0, 1024])

    await game.move(MoveDirection.Right)
    expect(game.winner).toBe(true)
    game.activateEndless()
    expect(game.winner).toBe(false)
    expect(game.endless).toBe(true)
  })

  test('must store only the right limit of boards for history', async () => {
    const game = new GameController()
    game.start()
    game.loadBoardPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2])
    await game.move(MoveDirection.Right, false)
    expect(game.history.length).toBe(1)
    await game.move(MoveDirection.Up, false)
    expect(game.history.length).toBe(2)
    await game.move(MoveDirection.Left, false)
    expect(game.history.length).toBe(2)
  })

  test('must undo moves correctly', async () => {
    const game = new GameController()
    game.start()
    game.loadBoardPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2])
    await game.move(MoveDirection.Right, false)
    await game.move(MoveDirection.Up, false)
    await game.undo()
    expect(game.board.flat).toEqual([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
    ])
    expect(game.history.length).toBe(1)
    await game.undo()
    expect(game.board.flat).toEqual([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2,
    ])
    expect(game.history.length).toBe(0)
  })

  test('must count moves right', async () => {
    const game = new GameController()
    game.start()
    game.loadBoardPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2])
    await game.move(MoveDirection.Down)
    expect(game.moves).toBe(0)
    await game.move(MoveDirection.Right)
    expect(game.moves).toBe(1)
  })

  test('must count undos right', async () => {
    const game = new GameController()
    game.start()
    game.loadBoardPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2])
    await game.undo()
    expect(game.undos).toBe(0)
    await game.move(MoveDirection.Right)
    await game.undo()
    expect(game.undos).toBe(1)
  })

  test('must create game save file correctly', () => {
    const save = GameController.getSaveFile('test', MOCK_GAME)
    expect(save.filename).toBe('test')
    expect(save.progress).toEqual(new GameProgress(MOCK_GAME))
    expect(save.state).toEqual(new GameState(MOCK_GAME))
    expect(save.settings).toEqual(new GameSettings(MOCK_GAME))
  })

  describe('must load game correctly', () => {

    test('regular load', async () => {
      const game = new GameController()
      game.start()

      await moveBoardInCircle(game)
      const save = GameController.getSaveFile('test', game)

      const loadedGame = new GameController()

      loadedGame.loadSaveFile(save)

      expect(deepCopy(loadedGame)).toEqual(deepCopy(game))

    })

    test('load save from after undo', async () => {
      const game = new GameController()

      game.start()
      await moveBoardInCircle(game)
      await game.undo()

      const save = GameController.getSaveFile('test', game)

      const loadedGame = new GameController()    
      loadedGame.loadSaveFile(save)      
      
      expect(deepCopy(loadedGame)).toEqual(deepCopy(game))
    })
  })
})
