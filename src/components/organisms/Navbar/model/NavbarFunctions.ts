import { ITutorialHandler } from '@/composables/tutorialRoutine'
import RoguelikeGameController from '@/model/2048 Roguelike/GameController'
import GameController from '@/model/2048 Standard/GameController'

export interface INavbarFunctions {
  setGame?: (
    game?: GameController | RoguelikeGameController,
    settings?: { showSettings: boolean }
  ) => void
  setTutorialHandler?: (handler: ITutorialHandler) => void
}

function throwMissingReference() {
  throw new Error('Reference to Navbar method not set')
}

export default class NavbarFunctions {
  setGame
  setTutorialHandler

  constructor({
    setGame = () => throwMissingReference(),
    setTutorialHandler = () => throwMissingReference(),
  }: INavbarFunctions = {}) {
    this.setGame = setGame
    this.setTutorialHandler = setTutorialHandler
  }
}
