import RoguelikeGameController from "@/model/2048 Roguelike/GameController";
import GameController from "@/model/2048 Standard/GameController";

export interface INavbarFunctions {
    setGame?: (game?: GameController | RoguelikeGameController, { showSettings }?: { showSettings: boolean }) => void
}

function throwMissingReference() {
    throw new Error("Reference to Navbar method not set")
}

export default class NavbarFunctions {
    setGame

    constructor({ setGame = () => { throwMissingReference } }: INavbarFunctions = {}) {
        this.setGame = setGame
    }
}