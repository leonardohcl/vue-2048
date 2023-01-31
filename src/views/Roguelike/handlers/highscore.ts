import HighScoreManagerVue from "@/components/organisms/HighScoreManager.vue";
import GameController from "@/model/2048/GameController";
import RoguelikeRankingEntry from "@/model/roguelike/RankingEntry";
import { ref, computed, reactive, ComputedRef, Ref } from 'vue'
import IHandler from "./model/Handler";
import HandlerCallback from "./model/HandlerCallback";
import HandlerSuite, { IHandlerSuite } from "./model/HandlerSuite";

type CallbackAction = "update"

export interface IHighscoreHandler extends IHandler {
    isRankingWorthy: ComputedRef<boolean>
    highscoreManager: Ref<any> | undefined
    haveSubmitedScore: Ref<boolean>
    updateBest: () => void
    getRankingEntry: ({ id, game }: { id: string; game: GameController }) => RoguelikeRankingEntry
}

export default function useHighscoreHandler(game: GameController): IHighscoreHandler {

    const highscoreManager = ref<typeof HighScoreManagerVue>();
    const haveSubmited = ref(false);

    const externalHandlers = reactive(new HandlerSuite())

    const callback = new HandlerCallback<CallbackAction>()

    const isRankingWorthy = computed<boolean>(() => {
        const progress = externalHandlers.progress?.progress
        if (progress)
            return highscoreManager.value?.isRankingWorthy(progress.bestScore);
    });

    const getRankingEntry = ({ id, game }: { id: string; game: GameController }) => {
        const progress = externalHandlers.progress?.progress

        const entry = GameController.getRankingEntry({
            id,
            game,
            name: "",
        }) as RoguelikeRankingEntry;

        if (progress) {
            entry.score = progress.bestScore;
            entry.block = progress.highestBlock;
            entry.run = progress.run;
        }

        return entry;
    };

    const updateBest = () => {
        if (!externalHandlers.progress) return

        const { progress } = externalHandlers.progress
        const progressUpdate: { bestScore?: number, highestBlock?: number, bestRun?: number } = {}

        if (game.score > progress.bestScore) {
            haveSubmited.value = false;
            progressUpdate.bestScore = game.score;
            progressUpdate.bestRun = progress.run
        }

        if (game.board.highestBlock > progress.highestBlock) {
            haveSubmited.value = false;
            progressUpdate.highestBlock = game.board.highestBlock;
        }

        externalHandlers.progress.update(progressUpdate)
    };

    const registerHandlers = ({ progress, state }: IHandlerSuite) => {
        if (progress && !externalHandlers.progress) externalHandlers.progress = progress
        if (state && !externalHandlers.state) {
            state.callback.set("gameOver", updateBest)
            externalHandlers.state = state
        }
    }

    return {
        isRankingWorthy,
        highscoreManager,
        haveSubmitedScore: haveSubmited,
        callback,
        updateBest,
        getRankingEntry,
        registerHandlers
    }
}