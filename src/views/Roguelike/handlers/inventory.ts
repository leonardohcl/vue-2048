import GameController from "@/model/2048/GameController";
import Square from "@/model/2048/Square";
import ConsumableItem from "@/model/Game Utils/ConsumableItem";
import Inventory, { IBag, Bag, IWallet, Wallet } from "@/model/roguelike/Inventory";
import RoguelikeSaveFile from "@/model/roguelike/RogueSaveFile";
import { ref, computed, reactive, ComputedRef, Ref } from "vue";
import IHandler from "./model/Handler";
import HandlerCallback from "./model/HandlerCallback";
import HandlerSuite, { IHandlerSuite } from "./model/HandlerSuite";

type ConsumableId = "breakBlock" | "shrinkBlock" | "upgradeBlock" | "moveBlock"
type CallbackAction = "purchase" | "use" | "consume" | "cancel"

export interface IInventoryHandler extends IHandler {
    inventory: Inventory,
    allowItemUse: ComputedRef<boolean>
    allowItemShopping: ComputedRef<boolean>
    allowItemSquareUpdate: Ref<boolean>
    callback: HandlerCallback<CallbackAction>
    setUsingItem: (isUsing: boolean) => void,
    handleUseItem: (item: ConsumableItem) => void,
    handleCancelItem: () => void,
    handlePurchaseItem: ({ id, price }: { id: ConsumableId, price: number }) => void,
    handleItemUpdateSquares: (sqr: Square) => void
    resetInventory: () => void,
    setBag: (data: IBag) => void
    setWallet: (data: IWallet) => void
}

export default function useInventoryHandler(
    game: GameController
): IInventoryHandler {
    const inventory = reactive(new Inventory());

    const allowUse = computed(() => !game.gameOver && !game.winner)
    const allowShopping = computed(() => game.gameOver || game.winner)
    const allowSquareUpdate = ref(false)

    const callback = new HandlerCallback<CallbackAction>()

    const externalHandlers = reactive<any>(new HandlerSuite())

    const reset = () => {
        inventory.bag = new Bag()
        inventory.wallet = new Wallet()
        inventory.activeItem = undefined
    }

    const setBag = ({
        breakBlock = inventory.bag.breakBlock,
        moveBlock = inventory.bag.moveBlock,
        upgradeBlock = inventory.bag.upgradeBlock,
        shrinkBlock = inventory.bag.shrinkBlock
    }: IBag = {}) => {
        inventory.bag.breakBlock = breakBlock
        inventory.bag.moveBlock = moveBlock
        inventory.bag.upgradeBlock = upgradeBlock
        inventory.bag.shrinkBlock = shrinkBlock
    }

    const setWallet = ({ coins = inventory.wallet.coins }: IWallet = {}) => {
        inventory.wallet.coins = coins
    }

    const updateCoins = (amount: number) => {
        inventory.wallet.coins += amount
    }

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
        callback.run("use")
    };

    const handlePurchase = ({ id, price }: { id: ConsumableId, price: number }) => {
        inventory.bag[id]++
        updateCoins(-price)
        callback.run("purchase")
    };

    const handleCancel = () => {
        setUsing(false);
        callback.run("cancel")
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
            callback.run("consume")

        } else {
            activeItem.prepareGame(game);
        }
    };

    const registerHandlers = ({ state, upgrade, reward, memory }: IHandlerSuite) => {
        if (state && !externalHandlers.state) {
            state.callback.set("end", () => { setUsing(false) })
            state.callback.set("startOver", reset)
            externalHandlers.state = state
        }
        if (upgrade && !externalHandlers.upgrade) {
            upgrade.callback.set("purchase", ({ price }) => { updateCoins(-price) })
            externalHandlers.upgrade = upgrade
        }
        if (reward && !externalHandlers.reward) {
            reward.callback.set("reward", ({ reward }) => { updateCoins(reward) })
            externalHandlers.reward = reward
        }
        if (memory && !externalHandlers.memory) {
            memory.callback.set("load", ({ slot }) => {
                const savedInventory = (slot as RoguelikeSaveFile).inventory || new Inventory()
                setWallet({ coins: savedInventory.wallet?.coins ?? 0 })
            })
        }
    }

    return {
        inventory,
        callback,
        allowItemUse: allowUse,
        allowItemShopping: allowShopping,
        allowItemSquareUpdate: allowSquareUpdate,
        setBag,
        setWallet,
        resetInventory: reset,
        setUsingItem: setUsing,
        handleUseItem: handleUse,
        handleCancelItem: handleCancel,
        handlePurchaseItem: handlePurchase,
        handleItemUpdateSquares: handleUpdate,
        registerHandlers
    }
}