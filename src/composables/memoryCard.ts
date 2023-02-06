import RoguelikeGameController from "@/model/2048 Roguelike/GameController"
import GameController from "@/model/2048 Standard/GameController"
import { useStore } from "vuex"
import { computed } from 'vue'
import { ADD_GAME_ACTION } from "@/store/memory-card"
import GameMode from "@/model/Game Utils/GameMode"
import SaveFile from "@/model/2048 Standard/SaveFile"
import RoguelikeSaveFile from "@/model/2048 Roguelike/RogueSaveFile"

export const enum SlotName {
    LastGame = 'lastGame',
    Slot1 = 'slot1',
    Slot2 = 'slot2',
    Slot3 = 'slot3',
    Slot4 = 'slot4',
    Slot5 = 'slot5',
}

export const SLOT_NAMES = [
    SlotName.LastGame,
    SlotName.Slot1,
    SlotName.Slot2,
    SlotName.Slot3,
    SlotName.Slot4,
    SlotName.Slot5
]


export type DefaultMemoryCard<Type> = {
    [key in SlotName]: Type | undefined
}

export default function useMemoryCard(game: GameController | RoguelikeGameController) {
    const gameMode = game instanceof RoguelikeGameController ? GameMode.Roguelike : GameMode.Standard
    const saveType = gameMode === GameMode.Roguelike ? RoguelikeSaveFile : SaveFile

    const store = useStore()

    const slots = computed<DefaultMemoryCard<SaveFile | RoguelikeSaveFile>>(() => {
        return store.getters.slots(gameMode)
    })

    const save = (slot: SlotName) => {

        store.dispatch(ADD_GAME_ACTION, {
            slot,
            save: game.getSaveFile(),
        });
    };

    const saveCurrent = () => {
        store.dispatch(ADD_GAME_ACTION, {
            slot: SlotName.LastGame,
            save: game.getSaveFile(),
        });
    };


    return {
        slots,
        save,
        saveCurrent,
    }

}
