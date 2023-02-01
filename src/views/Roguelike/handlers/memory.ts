import GameController from "@/model/2048/GameController";
import RoguelikeSaveFile from "@/model/roguelike/RogueSaveFile";
import { computed, reactive } from "vue";
import { ADD_GAME_ACTION, SAVE_LAST_GAME_ACTION } from "@/store/memory-card";
import GameMode from "@/model/GameMode";
import HandlerCallback from "./model/HandlerCallback";
import IHandler from "./model/Handler";
import HandlerSuite, { IHandlerSuite } from "./model/HandlerSuite";
import { useStore } from "vuex";
import Inventory from "@/model/roguelike/Inventory";

type CallbackAction = "save" | "load"

export interface IMemoryHandler extends IHandler {
    callback: HandlerCallback<CallbackAction>
    handleSave: (slot: RoguelikeSaveFile) => void
    handleLoad: (slot: RoguelikeSaveFile) => void
    saveCurrent: () => void
    getCurrentSaveFile: (filename: string) => RoguelikeSaveFile
}

export default function useMemoryHandler(game: GameController): IMemoryHandler {
    const store = useStore()

    const callback = new HandlerCallback<CallbackAction>()
    const externalHandlers = new HandlerSuite()

    const getCurrentSaveFile = (filename: string) => {
        const save = GameController.getSaveFile(filename, game) as RoguelikeSaveFile;

        const { progress } = externalHandlers.progress ?? {}
        if (progress) {
            save.progress.run = progress.run
        }

        const { bestRun } = externalHandlers.highscore ?? {}

        if (bestRun) {
            save.bestRun = bestRun
        }

        const inventory = externalHandlers.inventory?.inventory
        if (inventory) {
            save.inventory = inventory
        }

        return new RoguelikeSaveFile(
            save.filename,
            save.settings,
            save.state,
            save.progress,
            save.inventory,
            save.bestRun
        );
    };

    const handleSave = (slot: RoguelikeSaveFile) => {
        store.dispatch(ADD_GAME_ACTION, {
            save: getCurrentSaveFile(slot.filename),
            gameMode: GameMode.Roguelike,
        });
        callback.run("save")
    };

    const saveCurrent = () => {
        store.dispatch(SAVE_LAST_GAME_ACTION, {
            save: getCurrentSaveFile("last-game"),
            gameMode: GameMode.Roguelike,
        });
    };

    const handleLoad = (slot: RoguelikeSaveFile) => {
        game.loadSaveFile(slot);

        externalHandlers.progress?.update(slot.progress)
        externalHandlers.highscore?.updateBest(slot.bestRun)

        externalHandlers.inventory?.setBag(slot.inventory.bag)
        callback.run("load", { slot })
    };

    const registerHandlers = ({ progress, inventory, state, upgrade, highscore }: IHandlerSuite) => {
        if (progress && !externalHandlers.progress) externalHandlers.progress = progress
        if (highscore && !externalHandlers.highscore) externalHandlers.highscore = highscore
        if (inventory && !externalHandlers.inventory) {
            inventory.callback.set("purchase", saveCurrent)
            inventory.callback.set("consume", saveCurrent)
            externalHandlers.inventory = inventory
        }
        if (state && !externalHandlers.state) {
            state.callback.set("gameOver", saveCurrent)
            externalHandlers.state = state
        }
        if (upgrade && !externalHandlers.upgrade) {
            upgrade?.callback.set("purchase", saveCurrent)
            externalHandlers.upgrade = upgrade
        }
    }


    return {
        callback,
        handleSave,
        handleLoad,
        saveCurrent,
        getCurrentSaveFile,
        registerHandlers
    }
}