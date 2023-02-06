import GameController from "@/model/2048 Standard/GameController";
import ConsumableItem from "../Game Utils/ConsumableItem";
import { SquareConsumableMeta } from "../Game Utils/Consumables/interfaces/Square";
import Inventory from "../Game Utils/Inventory";
import IRoguelikeGameController from "./interfaces/GameController";
import RoguelikeGameProgress from "./interfaces/GameProgress";
import RoguelikeRankingEntry from "./RankingEntry";
import Square from "@/model/2048/Square"
import GameRewards from "./GameRewards";
import Item from "../Game Utils/Item";
import RoguelikeSaveFile from "./RogueSaveFile";

const x = new GameController()

export default class RoguelikeGameController extends GameController implements IRoguelikeGameController {

    private _run = 0
    private _inventory = new Inventory()
    private _bestRun = new RoguelikeGameProgress()
    private _activeItem?: ConsumableItem


    get run() { return this._run }
    get inventory() { return this._inventory }
    get bestRun() { return this._bestRun }
    get activeItem() { return this._activeItem }

    get canUseItems() {
        return !this.activeItem && !this.gameOver && !this.winner
    }

    get canShop() {
        return this.gameOver
    }

    get canSelectSquares() {
        return this.activeItem !== undefined
    }

    get rewards() {
        return this.winner || this.gameOver ? GameRewards.calculate(this) : undefined
    }

    private clearConsumableMeta() {
        this.board.squares.forEach(sqr => {
            sqr.setMeta(SquareConsumableMeta.Selected, false)
            sqr.setMeta(SquareConsumableMeta.Selectable, false)
        })
    }

    private setActiveItem(item?: ConsumableItem) {
        this._activeItem = item
    }

    reset() {
        super.reset()
        this._run = 0
        this._inventory.reset()
        this._bestRun = new RoguelikeGameProgress()
        this._activeItem = undefined
        this.updateSettings({
            width: 3,
            height: 3,
            historySize: 0,
            winningBlock: 64,
        })
    }

    getSaveFile() {
        const save = super.getSaveFile() as RoguelikeSaveFile;

        save.progress.run = this.run
        save.bestRun = this.bestRun
        save.inventory = this.inventory

        return save
    };

    load(save: RoguelikeSaveFile) {
        super.load(save)
        this._run = save.progress.run
        this._bestRun = new RoguelikeGameProgress(save.bestRun)
        this._inventory = new Inventory(save.inventory)
        this._activeItem = undefined
    }

    activateEndless() {
        throw new Error("Roguelike mode can't be set as endless")
    }

    activateItem(item: ConsumableItem) {
        if (!this._inventory.bag[item.id])
            throw new Error("GameController: not enough items in the inventory to use it")
        this.setActiveItem(item)
        item.prepareGame(this)
    }

    deactivateItem() {
        this._activeItem = undefined
        this.clearConsumableMeta()
    }

    selectSquare(sqr: Square) {
        if (!this._activeItem)
            throw new Error("GameController: can't select squares without an active item")


        this._activeItem.selectSquare(sqr)

        if (!this._activeItem.canConsume) {
            this._activeItem.prepareGame(this)
            return
        }

        this._activeItem.consume()
        this.deactivateItem()
    }

    processRunPerfomance() {
        if (this._score <= this._bestRun.score) return
        this._bestRun = new RoguelikeGameProgress({
            score: this._score,
            highestBlock: this.highestBlock,
            moves: this._moves,
            run: this._run,
            undos: this._undos
        })

    };

    cancelItem() {
        this._activeItem = undefined
        this.clearConsumableMeta()
    }

    buyUpgrade(upgrade: Item) {
        if (upgrade.quantity >= upgrade.capacity)
            throw new Error("GameController: upgraded is already at its max value")

        this._inventory.wallet.spend(upgrade.currentPrice)
        this.updateSettings({ [upgrade.id]: upgrade.value })
    }

    updateGameState() {
        super.updateGameState()

        if (this.gameOver || this.winner) {
            if (this.rewards) this.inventory.wallet.add(this.rewards.totalEarned)
        }
    }

    getRankingEntry() {

        const entry = super.getRankingEntry() as RoguelikeRankingEntry;

        entry.score = this.bestRun.score;
        entry.block = this.bestRun.highestBlock;
        entry.run = this.bestRun.run;
        entry.moves = this.bestRun.moves;
        entry.undos = this.bestRun.undos;

        return entry;
    };
}