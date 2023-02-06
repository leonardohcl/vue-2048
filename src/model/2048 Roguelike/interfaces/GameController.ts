import IGameController from "@/model/2048 Standard/interfaces/GameController";
import { IInventory } from "@/model/Game Utils/Inventory";
import { IConsumableItem } from "@/model/Game Utils/Item/ConsumableItem";
import { IItem } from "@/model/Game Utils/Item/Item";
import { IRoguelikeGameProgress } from "./GameProgress";

export default interface IRoguelikeGameController extends IGameController {
    run:number
    inventory: IInventory
    bestRun: IRoguelikeGameProgress
    activeItem?: IItem
}