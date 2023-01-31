import GameController from "@/model/2048/GameController";
import IHandler from "./model/Handler";
import HandlerCallback from "./model/HandlerCallback";

type CallbackAction = "start" | "end" | "newGame" | "restart" | "gameOver" | "startOver"
type VoidFunction = () => void

export interface IStateHandler extends IHandler {
    callback: HandlerCallback<CallbackAction>
    startRun: VoidFunction
    endRun: VoidFunction
    handleNewGame: VoidFunction
    handleRestart: VoidFunction
    handleGameOver: VoidFunction
    handleStartOver: VoidFunction
}

export default function useStateHandler(game: GameController): IStateHandler {
    const callback = new HandlerCallback<CallbackAction>()

    const startRun = () => {
        game.start();
        callback.run("start")
    };

    const endRun = () => {
        callback.run("end")
    };

    const handleNewGame = () => {
        startRun();
        callback.run("newGame")
    };

    const handleRestart = () => {
        game.gameOver = true;
        callback.run("restart")
    };

    const handleGameOver = () => {
        endRun();
        callback.run("gameOver")
    };

    const handleStartOver = () => {
        game.updateSettings({
            width: 3,
            height: 3,
            historySize: 0,
            winningBlock: 64,
        });
        
        callback.run("startOver")
    };

    const registerHandlers = () => {}

    return {
        callback,
        startRun,
        endRun,
        handleNewGame,
        handleRestart,
        handleGameOver,
        handleStartOver,
        registerHandlers
    }
}