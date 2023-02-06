import IGameController from "@/model/2048 Standard/interfaces/GameController";
import { IConsumableItem } from "@/model/Game Utils/ConsumableItem";
import { IInventory } from "@/model/Game Utils/Inventory";
import { IRoguelikeGameProgress } from "./GameProgress";

export default interface IRoguelikeGameController extends IGameController {
    run:number
    inventory: IInventory
    bestRun: IRoguelikeGameProgress
    activeItem?: IConsumableItem
    canUseItems:boolean
    canSelectSquares:boolean
}