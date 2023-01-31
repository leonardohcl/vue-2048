import RoguelikeGameProgress, { IRoguelikeGameProgress } from "@/model/roguelike/interfaces/GameProgress";
import { reactive } from "vue"
import IHandler from "./model/Handler";
import HandlerCallback from "./model/HandlerCallback";
import HandlerSuite, { IHandlerSuite } from "./model/HandlerSuite";

type CallbackAction = "update"

export interface IProgressHandler extends IHandler {
    progress: RoguelikeGameProgress
    callback: HandlerCallback<CallbackAction>
    reset: () => void,
    update: (data: IRoguelikeGameProgress) => void
}

export default function useProgressHandler(): IProgressHandler {
    const progress = reactive(new RoguelikeGameProgress());

    const callback = new HandlerCallback<CallbackAction>()

    const externalHandlers = reactive(new HandlerSuite())

    const reset = () => {
        progress.bestScore = 0
        progress.highestBlock = 0
        progress.moves = 0
        progress.run = 0
        progress.score = 0
        progress.undos = 0
    }

    const update = ({
        bestScore = progress.bestScore,
        highestBlock = progress.highestBlock,
        moves = progress.moves,
        run = progress.run,
        score = progress.score,
        undos = progress.undos,
    }: IRoguelikeGameProgress) => {
        progress.bestScore = bestScore
        progress.highestBlock = highestBlock
        progress.moves = moves
        progress.run = run
        progress.score = score
        progress.undos = undos
        callback.run("update")
    }

    const registerHandlers = ({ state }: IHandlerSuite) => {
        if (state && !externalHandlers.state) {
            state.callback.set("start", () => { progress.run++ })
            state.callback.set("startOver", reset)
            externalHandlers.state = state
        }

    }

    return { progress, callback, update, reset, registerHandlers }
}