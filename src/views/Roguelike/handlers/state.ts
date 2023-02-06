import { computed, ref } from 'vue'
import RoguelikeGameController from "@/model/2048 Roguelike/GameController";

export default function useStateHandler(game: RoguelikeGameController) {
    const isRunInterval = ref(false)
    const isRunActive = computed(() => !isRunInterval.value && !game.winner && !game.gameOver)

    const startRun = () => {
        game.start();        
        isRunInterval.value = false
    };

    const endRun = () => {
        game.deactivateItem()
        isRunInterval.value = true
        game.processRunPerfomance()
    };

    const handleNewGame = () => {
        startRun();
    };

    const handleRestart = () => {
        endRun()
    };

    const handleGameOver = () => {
        endRun();
    };

    const handleStartOver = () => {
        game.reset()
    };

    const registerHandlers = () => { }

    return {
        isRunActive,
        startRun,
        endRun,
        handleNewGame,
        handleRestart,
        handleGameOver,
        handleStartOver,
        registerHandlers
    }
}