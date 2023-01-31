import GameController from "@/model/2048/GameController";
import useHighscoreHandler, { IHighscoreHandler } from "../highscore";
import useInventoryHandler, { IInventoryHandler } from "../inventory";
import useMemoryHandler, { IMemoryHandler } from "../memory";
import useProgressHandler, { IProgressHandler } from "../progress";
import useRewardHandler, { IRewardHandler } from "../reward";
import useStateHandler, { IStateHandler } from "../state";
import useUpgradeHandler, { IUpgradeHandler } from "../upgrade";

export interface IHandlerSuite {
    highscore?: IHighscoreHandler
    inventory?: IInventoryHandler
    memory?: IMemoryHandler
    progress?: IProgressHandler
    reward?: IRewardHandler
    state?: IStateHandler
    upgrade?: IUpgradeHandler
}

export default class HandlerSuite implements IHandlerSuite {
    highscore?: IHighscoreHandler
    inventory?: IInventoryHandler
    memory?: IMemoryHandler
    progress?: IProgressHandler
    reward?: IRewardHandler
    state?: IStateHandler
    upgrade?: IUpgradeHandler

}

export class GameHandlerSuite extends HandlerSuite {
    highscore: IHighscoreHandler
    inventory: IInventoryHandler
    memory: IMemoryHandler
    progress: IProgressHandler
    reward: IRewardHandler
    state: IStateHandler
    upgrade: IUpgradeHandler

    constructor(game: GameController) {
        super()
        this.highscore = useHighscoreHandler(game)
        this.inventory = useInventoryHandler(game)
        this.memory = useMemoryHandler(game)
        this.progress = useProgressHandler()
        this.reward = useRewardHandler()
        this.state = useStateHandler(game)
        this.upgrade = useUpgradeHandler(game)

        this.highscore.registerHandlers(this)
        this.inventory.registerHandlers(this)
        this.memory.registerHandlers(this)
        this.progress.registerHandlers(this)
        this.reward.registerHandlers(this)
        this.state.registerHandlers(this)
        this.upgrade.registerHandlers(this)
    }
}
