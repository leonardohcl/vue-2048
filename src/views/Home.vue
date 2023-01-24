<template>
  <div class="home">
    <h1>2048</h1>
    <div class="home__hud">
      <div class="home__hud--left"><Ranking /></div>
      <div class="home__hud--right">
        <MemoryManager
          :save-button-options="{ disabled: game.gameOver }"
          :close-on-load="true"
          @save="handleSaveGame"
          @load="handleLoadGame"
        />
        <Settings
          :game="game"
          @open="handleSettingsOpen"
          @close="handleSettingsClose"
          @update="handleSettingsUpdate"
        />
      </div>
    </div>
    <Game
      :game="game"
      emit-moves
      @move="movementListener"
      @new-high-score="handleNewHighScore"
      @new-game="game.start()"
      @restart="game.start()"
      @set-endless="game.activateEndless()"
    />
  </div>
  <HighScoreManager ref="highScoreManager" :game="game" />
</template>

<script>
  import Game from '@/components/organisms/Game.vue'
  import Ranking from '@/components/organisms/Ranking.vue'
  import Settings from '@/components/organisms/Settings.vue'
  import MemoryManager from '@/components/organisms/MemoryManager.vue'
  import HighScoreManager from '@/components/organisms/HighScoreManager.vue'
  import GameController from '@/model/2048/GameController'
  import { defineComponent } from 'vue'

  import { ref } from 'vue'
  import { useStore } from 'vuex'

  import {
    ADD_GAME_ACTION,
    SAVE_LAST_GAME_MUTATION,
  } from '@/store/memory-card'

  export default defineComponent({
    components: { Game, Ranking, Settings, MemoryManager, HighScoreManager },
    name: 'Home',
    setup() {
      const store = useStore()
      const autoMemory = {
        moveUntilSave: 5,
        moveCountdown: 5,
        idleTimeUntilSave: 3000,
        idleSaveTimeout: null,
      }
      const highScoreManager = ref(null)

      const game = ref(
        new GameController({
          width: 4,
          height: 4,
          winningBlock: 2048,
          historySize: 2,
          updateDelay: 100,
        })
      )

      if (store.getters.lastGame)
        game.value.loadSaveFile(store.getters.lastGame)

      const saveCurrentGame = () => {
        const save = GameController.getSaveFile('last-game', game.value)
        store.commit(SAVE_LAST_GAME_MUTATION, save)
      }

      const movementListener = () => {
        autoMemory.moveCountdown--
        if (autoMemory.moveCountdown == 0) {
          autoMemory.moveCountdown = autoMemory.moveUntilSave
          saveCurrentGame(game.value)
        }

        if (autoMemory.idleSaveTimeout) clearTimeout(autoMemory.idleSaveTimeout)
        autoMemory.idleSaveTimeout = setTimeout(() => {
          autoMemory.moveCountdown = autoMemory.moveUntilSave
          saveCurrentGame()
        }, autoMemory.idleTimeUntilSave)
      }

      const handleSettingsOpen = () => {
        game.value.paused = true
      }

      const handleSettingsClose = () => {
        game.value.paused = false
      }

      const handleSettingsUpdate = (newSettings) => {
        game.value.updateSettings(newSettings)
      }

      const handleSaveGame = (slot) => {
        const save = GameController.getSaveFile(slot.filename, game.value)
        store.dispatch(ADD_GAME_ACTION, save)
      }

      const handleLoadGame = (save) => {
        game.value.loadSaveFile(save)
      }

      const handleNewHighScore = () => {
        if (highScoreManager.value) highScoreManager.value.saveScore()
      }

      return {
        game,
        highScoreManager,
        handleSettingsOpen,
        handleSettingsClose,
        handleSettingsUpdate,
        handleNewHighScore,
        handleSaveGame,
        handleLoadGame,
        movementListener,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .home {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 100vw;
    min-height: 100vh;

    h1 {
      font-size: 3rem;
      margin: 0 0 0.25em;
    }

    &__hud {
      display: flex;
      justify-content: space-between;
      width: 100%;
      min-width: 200px;
      max-width: 400px;
    }
  }
</style>
