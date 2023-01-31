import GameController from "@/model/2048/GameController";
import { IGameSettings } from "@/model/2048/interfaces/GameSettings";
import { UPDATE_BALANCE } from "@/store/wallet";
import { useStore } from "vuex";
import { computed } from 'vue'

export default function useUpgradeHandling(game: GameController) {
    const store = useStore()

    const allowShopping = computed(() => game.gameOver || game.winner)

    const handlePurchase = ({ price, upgrade }: { price: number, upgrade: IGameSettings }) => {
        game.updateSettings(upgrade);
        store.commit(UPDATE_BALANCE, -price);
        // saveCurrentGame();
    };

    return {
        allowUpgradeShopping: allowShopping,
        handlePurchaseUpgrade: handlePurchase
    }

}