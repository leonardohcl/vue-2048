import GameController from "@/model/2048/GameController";
import { IGameSettings } from "@/model/2048/interfaces/GameSettings";
import { computed, ComputedRef } from 'vue'
import IHandler from "./model/Handler";
import HandlerCallback from "./model/HandlerCallback";

type CallbackAction = "purchase"

export interface IUpgradeHandler extends IHandler {
    callback: HandlerCallback<CallbackAction>
    allowUpgradeShopping: ComputedRef<boolean>
    handlePurchaseUpgrade: ({ price, upgrade }: { price: number, upgrade: IGameSettings }) => void
}

export default function useUpgradeHandler(game: GameController): IUpgradeHandler {
    const allowShopping = computed(() => game.gameOver || game.winner)

    const callback = new HandlerCallback<CallbackAction>()

    const handlePurchase = ({ price, upgrade }: { price: number, upgrade: IGameSettings }) => {
        game.updateSettings(upgrade);
        callback.run("purchase", { price })
    };

    const registerHandlers = () => {}


    return {
        callback,
        allowUpgradeShopping: allowShopping,
        handlePurchaseUpgrade: handlePurchase,
        registerHandlers
    }

}