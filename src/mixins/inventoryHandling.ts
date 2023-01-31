import GameController from "@/model/2048/GameController";
import Square from "@/model/2048/Square";
import ConsumableItem from "@/model/Game Utils/ConsumableItem";
import Inventory from "@/model/roguelike/Inventory";
import { UPDATE_BALANCE } from "@/store/wallet";
import { ref, computed } from "vue";
import { useStore } from "vuex";

export default function useInventoryHandling(game: GameController, inventory: Inventory) {
    const store = useStore()
    const allowUse = computed(() => !game.gameOver && !game.winner)
    const allowShopping = computed(() => game.gameOver || game.winner)
    const allowSquareUpdate = ref(false)

    const setUsing = (isUsing: boolean) => {
        if (isUsing) {
            game.paused = true;
            allowSquareUpdate.value = true;
        } else {
            if (inventory.activeItem) {
                inventory.activeItem.squaresSelected = []
                inventory.activeItem = undefined;
            }
            allowSquareUpdate.value = false;
            game.paused = false;
            game.cleanCustomStates();
        }
    };

    const handleUse = (item: ConsumableItem) => {
        if (inventory.activeItem) return;

        inventory.activeItem = item;
        setUsing(true);
        item.prepareGame(game);
    };

    const handlePurchase = ({ id, price }: { id: "breakBlock" | "shrinkBlock" | "upgradeBlock" | "moveBlock", price: number }) => {
        store.commit(UPDATE_BALANCE, -price);
        inventory.bag[id]++
    };

    const handleCancel = () => {
        setUsing(false);
    };

    const handleUpdate = (sqr: Square) => {
        const activeItem = inventory.activeItem;

        if (!activeItem) return;

        if (!activeItem.squareIsValid(sqr)) return;

        activeItem.squaresSelected.push(sqr);
        sqr.customStates.selected = true;

        const consumed = activeItem.consume();

        if (consumed) {
            setUsing(false);
        } else {
            activeItem.prepareGame(game);
        }
    };


    return {
        allowItemUse: allowUse,
        allowItemShopping: allowShopping,
        allowItemSquareUpdate: allowSquareUpdate,
        setUsingItem: setUsing,
        handleUseItem: handleUse,
        handleCancelItem: handleCancel,
        handlePurchaseItem: handlePurchase,
        handleItemUpdateSquares: handleUpdate
    }
}