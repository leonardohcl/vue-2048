import GameController from "@/model/2048/GameController";
import RoguelikeSaveFile from "@/model/roguelike/RogueSaveFile";
import { useStore } from "vuex";
import { computed, reactive } from "vue";
import { ADD_GAME_ACTION, SAVE_LAST_GAME_ACTION } from "@/store/memory-card";
import { SET_COINS } from "@/store/wallet";
import GameMode from "@/model/GameMode";
import HandlerCallback from "./model/HandlerCallback";
import IHandler from "./model/Handler";
import HandlerSuite, { IHandlerSuite } from "./model/HandlerSuite";

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
    const currentCoins = computed(() => store.getters.currentCoins);

    const callback = new HandlerCallback<CallbackAction>()
    const externalHandlers = reactive<any>(new HandlerSuite())

    const getCurrentSaveFile = (filename: string) => {
        const save = GameController.getSaveFile(filename, game) as RoguelikeSaveFile;

        const progress = externalHandlers.progress?.progress
        if (progress) {
            save.progress.run = progress.run;
            save.progress.score = progress.score;
            save.progress.bestScore = progress.bestScore;
            save.progress.highestBlock = progress.highestBlock;
        }

        const inventory = externalHandlers.inventory?.inventory
        if (inventory) {
            save.inventory = { ...inventory, wallet: { coins: currentCoins.value } }
        }

        return new RoguelikeSaveFile(
            save.filename,
            save.settings,
            save.state,
            save.progress,
            save.inventory
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
        externalHandlers.progress?.update({
            run: slot.progress.run || 0,
            highestBlock: slot.progress.highestBlock,
            bestScore: slot.progress.bestScore
        })

        externalHandlers.inventory?.setBag(slot.inventory.bag)

        store.commit(SET_COINS, slot.inventory.wallet.coins || 0);
        callback.run("load")
    };

    const registerHandlers = ({ progress, inventory, state, upgrade }: IHandlerSuite) => {
        if (progress && !externalHandlers.progress) externalHandlers.progress = progress
        if (inventory && !externalHandlers.inventory) {
            inventory.callback.set("consume", saveCurrent)
            inventory.callback.set("use", saveCurrent)
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