import SaveFile from '../../2048 Standard/SaveFile'
import MOCK_GAME from '../../../mocks/game.json'
import GameController from '../../2048 Standard/GameController'
import GameSettings from '../../2048 Standard/partials/GameSettings'
import GameState from '../../2048 Standard/partials/GameState'
import GameProgress from '../../2048 Standard/partials/GameProgress'

/** Encodes a string as base64 format */
global.btoa = (str) => Buffer.from(str, 'binary').toString('base64')

/** Decodes a base64 encoded string */
global.atob = (str) => Buffer.from(str, 'base64').toString('binary')

const MOCK_FILENAME = 'test'
const MOCK_SETTINGS = new GameSettings(MOCK_GAME)
const MOCK_STATE = new GameState(MOCK_GAME)
const MOCK_PROGRESS = new GameProgress(MOCK_GAME)

describe('SaveFile.ts', () => {
  test('must create save correctly', () => {
    const save = new SaveFile(
      MOCK_FILENAME,
      MOCK_SETTINGS,
      MOCK_STATE,
      MOCK_PROGRESS
    )
    expect(save.filename).toBe(MOCK_FILENAME)
    expect(save.settings).toEqual(MOCK_SETTINGS)
    expect(save.state).toEqual(MOCK_STATE)
    expect(save.progress).toEqual(MOCK_PROGRESS)
  })

  test('must restore from base64 string correctly', () => {
    const save = GameController.getSaveFile(MOCK_FILENAME, MOCK_GAME)
    const saveStr = save.toString()
    const loaded = SaveFile.fromString(saveStr)
    expect(loaded).toEqual(save)
  }) 
})
