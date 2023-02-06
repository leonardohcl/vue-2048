
import HighScoreManagerVue from '@/components/organisms/HighScoreManager.vue';
import RoguelikeGameController from '@/model/2048 Roguelike/GameController';
import { ref, computed, watch } from 'vue'

export default function useHighscoreHandler(game: RoguelikeGameController) {

    const highscoreManager = ref<typeof HighScoreManagerVue>();

    const haveSubmited = ref(false);

    const isRankingWorthy = computed(() => {
        return highscoreManager.value?.isRankingWorthy(game.bestRun.score);
    });

    watch(game.bestRun, (newBest, oldBest) => {
        haveSubmited.value = newBest != oldBest
    })

    return {
        isRankingWorthy,
        highscoreManager,
        haveSubmitedScore: haveSubmited
    }
}