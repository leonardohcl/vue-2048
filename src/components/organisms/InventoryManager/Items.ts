import { BreakBlock, UpgradeBlock, ShrinkBlock, MoveBlock } from "@/model/Game Utils/ConsumableItem";
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