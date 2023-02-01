import GameController from "@/model/2048/GameController";
import RoguelikeGameProgress, { IRoguelikeGameProgress } from "@/model/roguelike/interfaces/GameProgress";
import { reactive } from "vue"
import IHandler from "./model/Handler";
import HandlerCallback from "./model/HandlerCallback";
import HandlerSuite, { IHandlerSuite } from "./model/HandlerSuite";

type CallbackAction = "update"

export interface IProgressHandler extends IHandler {
    progress: { run: number }
    callback: HandlerCallback<CallbackAction>
    reset: () => void,
    update: (data: IRoguelikeGameProgress) => void
}

export default function useProgressHandler(game: GameController): IProgressHandler {
    const progress = reactive({
        run: 0,
    });

    const callback = new HandlerCallback<CallbackAction>()

    const externalHandlers = reactive(new HandlerSuite())

    const reset = () => {
        progress.run = 0
    }

    const update = ({
        run = progress.run,
    }: IRoguelikeGameProgress) => {
        progress.run = run
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