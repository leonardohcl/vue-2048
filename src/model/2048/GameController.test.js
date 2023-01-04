import GameController from './GameController'
import LegalMovements from './legal-movements.json'

describe('GameController.js', () => {
  test('must create game correctly', () => {
    const game = new GameController()
    expect(game.size).toBe(4)
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
        game.board.loadPreset(LegalMovements[dir][scenario].before)
        await game.move(dir, false)
        expect(game.board.flat).toEqual(LegalMovements[dir][scenario].after)
      }
    }
  })

  test('must allow only valid movements', () => {
    const game = new GameController()
    game.start()
    game.board.loadPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2])
    game.updateGameState()
    expect(game.canMove.right).toBe(false)
    expect(game.canMove.down).toBe(false)
    game.start()
    game.board.loadPreset([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    game.updateGameState()
    expect(game.canMove.left).toBe(false)
    expect(game.canMove.up).toBe(false)
  })

  test('must spawn block after moving', async () => {
    const game = new GameController()
    game.spawnBlock = jest.fn()
    game.start()
    game.board.loadPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2])
    await game.move('right')
    expect(game.spawnBlock).toHaveBeenCalled()
  })

  test('must update score correctly', async () => {
    const game = new GameController()
    game.start()
    game.board.loadPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2])
    await game.move('right')
    expect(game.score).toBe(4)
  })

  test('must set game state to win if reached 2048 block', async () => {
    const game = new GameController(4, 100)
    game.start()
    game.board.loadPreset([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1024, 0, 1024,
    ])

    await game.move('right')
    expect(game.winner).toBe(true)
  })

  test("must set game state to game over if can't make any movement", () => {
    const game = new GameController()
    game.start()
    game.board.loadPreset([2, 8, 4, 2, 4, 2, 16, 8, 8, 16, 2, 4, 2, 4, 8, 2])
    game.updateGameState()
    expect(game.canMove.up).toBe(false)
    expect(game.canMove.down).toBe(false)
    expect(game.canMove.left).toBe(false)
    expect(game.canMove.right).toBe(false)
    expect(game.gameOver).toBe(true)
  })

  test('must store only the right limit of boards for history', async () => {
    const game = new GameController()
    game.start()
    game.board.loadPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2])
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
    game.board.loadPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2])
    await game.move('right', false)
    await game.move('up', false)
    await game.undo()
    expect(game.board.flat).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4])
    expect(game.history.length).toBe(1)
    await game.undo()
    expect(game.board.flat).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2])
    expect(game.history.length).toBe(0)
  })
})
