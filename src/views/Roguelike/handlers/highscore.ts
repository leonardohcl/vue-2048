import HighScoreManagerVue from "@/components/organisms/HighScoreManager.vue";
import GameController from "@/model/2048/GameController";
import RoguelikeGameProgress, { IRoguelikeGameProgress } from "@/model/roguelike/interfaces/GameProgress";
import RoguelikeRankingEntry from "@/model/roguelike/RankingEntry";
import { ref, computed, reactive, ComputedRef, Ref } from 'vue'
import IHandler from "./model/Handler";
import HandlerCallback from "./model/HandlerCallback";
import HandlerSuite, { IHandlerSuite } from "./model/HandlerSuite";

type CallbackAction = "update" | "newBest"

export interface IHighscoreHandler extends IHandler {
    bestRun: RoguelikeGameProgress
    isRankingWorthy: ComputedRef
    highscoreManager: Ref
    haveSubmitedScore: Ref
    checkNewBest: () => void
    updateBest: (data: IRoguelikeGameProgress) => void
    getRankingEntry: ({ id, game }: { id: string; game: GameController }) => RoguelikeRankingEntry
}

export default function useHighscoreHandler(game: GameController): IHighscoreHandler {

    const highscoreManager = ref<typeof HighScoreManagerVue>();
    const bestRun = reactive(new RoguelikeGameProgress())

    const haveSubmited = ref(false);

    const externalHandlers = reactive(new HandlerSuite())

    const callback = new HandlerCallback<CallbackAction>()

    const isRankingWorthy = computed(() => {
        const { progress } = externalHandlers.progress ?? {}
        if (progress)
            return highscoreManager.value?.isRankingWorthy(bestRun.score);
        return false
    });

    const getRankingEntry = ({ id, game }: { id: string; game: GameController }) => {

        const entry = GameController.getRankingEntry({
            id,
            game,
            name: "",
        }) as RoguelikeRankingEntry;

        entry.score = bestRun.score;
        entry.block = bestRun.highestBlock;
        entry.run = bestRun.run;
        entry.moves = bestRun.moves;
        entry.undos = bestRun.undos;

        return entry;
    };

    const checkNewBest = () => {
        const { progress } = externalHandlers.progress ?? {}

        if (game.score > bestRun.score) {
            haveSubmited.value = false;

            bestRun.run = progress?.run ?? -1
            bestRun.highestBlock = game.highestBlock
            bestRun.moves = game.highestBlock
            bestRun.score = game.score
            bestRun.undos = game.undos

            callback.run("newBest")
        }
    };

    const updateBest = ({
        run = bestRun.run,
        moves = bestRun.moves,
        score = bestRun.score,
        undos = bestRun.undos,
        highestBlock = bestRun.highestBlock
    }: IRoguelikeGameProgress = {}) => {
        bestRun.run = run
        bestRun.moves = moves
        bestRun.score = score
        bestRun.undos = undos
        bestRun.highestBlock = highestBlock

        callback.run("update")
    }

    const registerHandlers = ({ progress, state }: IHandlerSuite) => {
        if (progress && !externalHandlers.progress) externalHandlers.progress = progress
        if (state && !externalHandlers.state) {
            state.callback.set("gameOver", checkNewBest)
            externalHandlers.state = state
        }
    }

    return {
        bestRun,
        isRankingWorthy,
        highscoreManager,
        haveSubmitedScore: haveSubmited,
        callback,
        updateBest,
        checkNewBest,
        getRankingEntry,
        registerHandlers
    }
}