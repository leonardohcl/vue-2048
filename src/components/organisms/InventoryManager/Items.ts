import { BreakBlock } from "@/model/Game Utils/Consumables/BreakBlock";
import { MoveBlock } from "@/model/Game Utils/Consumables/MoveBlock";
import { ShrinkBlock } from "@/model/Game Utils/Consumables/ShrinkBlock";
import { UpgradeBlock } from "@/model/Game Utils/Consumables/UpgradeBlock";

/**
 * These are the consumable items available for the current game design,
 * 
 * Their prices take in consideration an average of 20 coins
 * per run in the early game and 40 coins in the late game
 **/
export default [
    new BreakBlock({ defaultPrice: 40 }),
    new UpgradeBlock({ defaultPrice: 240 }),
    new ShrinkBlock({ defaultPrice: 80 }),
    new MoveBlock({defaultPrice: 400})
]