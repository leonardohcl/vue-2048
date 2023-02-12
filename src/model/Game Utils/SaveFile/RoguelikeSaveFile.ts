import RoguelikeGameController from "@/model/2048 Roguelike/GameController";
import IRoguelikeGameController from "@/model/2048 Roguelike/interfaces/GameController";
import Board from "@/model/2048/Board";
import { IInventorySnapshot } from "../Inventory";
import { IRoguelikeGameProgress } from "./interfaces/GameProgress";
import SaveFile, { ISaveFile } from "./SaveFile";

export interface IRoguelikeSaveFile extends ISaveFile {
  inventory: IInventorySnapshot;
  progress: IRoguelikeGameProgress;
  bestRun: IRoguelikeGameProgress;
}

export default class RoguelikeSaveFile
  extends SaveFile
  implements IRoguelikeSaveFile
{
  inventory: IInventorySnapshot;
  progress: IRoguelikeGameProgress;
  bestRun;

  constructor(game: IRoguelikeGameController) {
    super(game);
    this.progress = {
      run: game.run,
      highestBlock: game.highestBlock,
      moves: game.moves,
      score: game.score,
      undos: game.undos,
    };
    this.bestRun = game.bestRun;
    this.inventory = game.inventorySnapshot ?? { bag: {}, coins: 0 };
  }
}
