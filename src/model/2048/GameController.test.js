import GameController, {
  GameProgress,
  GameSettings,
  GameState,
} from './GameController'
import LEGAL_MOVEMENTS from '../../mocks/legal-movements.json'
import MOCK_GAME from '../../mocks/game.json'

describe('GameController.js', () => {
  test('must create game correctly', () => {
    const game = new GameController()
    expect(game.width).toBe(4)
    expect(game.height).toBe(4)
    expect(game.gameOver).toBe(true)
    expect(game.winner).toBe(false)
    expect(game.canMove.up).toBe(true)
    expect(game.canMove.right).toBe(true)
    expect(game.canMove.down).toBe(true)
    expect(game.canMove.left).toBe(true)
    expect(game.score).toBe(0)
    expect(game.board.emptySquares.length).toBe(16)
  })

  test('must start game correctly', () => {
    const game = new GameController()
    game.start()
    expect(game.gameOver).toBe(false)
    expect(game.score).toBe(0)
    expect(game.board.filledSquares.length).toBe(2)
  })

  test('must make the right movements', async () => {
    const game = new GameController()
    const directions = ['up', 'down', 'right', 'left']

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

  test('must load board correctly', () => {
    const game = new GameController()
    const MOCK_BOARD = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]
    game.start()
    game.loadBoardPreset(MOCK_BOARD)    
    expect(game.board.flat).toEqual(MOCK_BOARD)
    expect(game.canMove.right).toBe(false)
    expect(game.canMove.down).toBe(false)
  })

  test('must allow only valid movements', () => {
    const game = new GameController()
    game.start()
    game.loadBoardPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2])    
    expect(game.canMove.right).toBe(false)
    expect(game.canMove.down).toBe(false)
    game.start()
    game.loadBoardPreset([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(game.canMove.left).toBe(false)
    expect(game.canMove.up).toBe(false)
  })

  test('must spawn block after moving', async () => {
    const game = new GameController()
    game.spawnBlock = jest.fn()
    game.start()
    game.loadBoardPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2])
    await game.move('right')
    expect(game.spawnBlock).toHaveBeenCalled()
  })

  test('must update score correctly', async () => {
    const game = new GameController()
    game.start()
    game.loadBoardPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2])
    await game.move('right')
    expect(game.score).toBe(4)
  })

  test('must set game state to win if reached 2048 block', async () => {
    const game = new GameController(4, 4, 100)
    game.start()
    game.loadBoardPreset([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1024, 0, 1024,
    ])

    await game.move('right')
    expect(game.winner).toBe(true)
  })

  test("must set game state to game over if can't make any movement", () => {
    const game = new GameController()
    game.start()
    game.loadBoardPreset([2, 8, 4, 2, 4, 2, 16, 8, 8, 16, 2, 4, 2, 4, 8, 2])
    
    expect(game.canMove.up).toBe(false)
    expect(game.canMove.down).toBe(false)
    expect(game.canMove.left).toBe(false)
    expect(game.canMove.right).toBe(false)
    expect(game.gameOver).toBe(true)
  })

  test('must store only the right limit of boards for history', async () => {
    const game = new GameController()
    game.start()
    game.loadBoardPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2])
    await game.move('right', false)
    expect(game.history.length).toBe(1)
    await game.move('up', false)
    expect(game.history.length).toBe(2)
    await game.move('left', false)
    expect(game.history.length).toBe(2)
  })

  test('must undo moves correctly', async () => {
    const game = new GameController()
    game.start()
    game.loadBoardPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2])
    await game.move('right', false)
    await game.move('up', false)
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
    await game.move('down')
    expect(game.moves).toBe(0)
    await game.move('right')
    expect(game.moves).toBe(1)
  })

  test('must count undos right', async () => {
    const game = new GameController()
    game.start()
    game.loadBoardPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2])
    await game.undo()
    expect(game.undos).toBe(0)
    await game.move('right')
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
})
