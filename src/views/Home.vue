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
    <Game :game="game" emit-moves @move="movementListener" />
  </div>
</template>

<script>
  import Game from '@/components/organisms/Game.vue'
  import Ranking from '@/components/organisms/Ranking.vue'
  import Settings from '@/components/organisms/Settings.vue'
  import MemoryManager from '@/components/organisms/MemoryManager.vue'
  import GameController from '@/model/2048/GameController'

  import { ref } from 'vue'
  import { useStore } from 'vuex'

  import {
    ADD_GAME_MUTATION,
    SAVE_LAST_GAME_MUTATION,
  } from '@/store/memory-card'

  export default {
    components: { Game, Ranking, Settings, MemoryManager },
    name: 'Home',
    setup() {
      const store = useStore()
      const autoMemory = {
        moveUntilSave: 5,
        moveCountdown: 5,
        idleTimeUntilSave: 5000,
        idleSaveTimeout: null,
      }

      const game = ref()

      if (store.getters.lastGame) game.value = store.getters.lastGame.getGame()
      else game.value = new GameController(4, 4, 2, 100)

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
        store.commit(ADD_GAME_MUTATION, save)
      }

      const handleLoadGame = (save) => {
        game.value = save.getGame()
      }

      return {
        game,
        handleSettingsOpen,
        handleSettingsClose,
        handleSettingsUpdate,
        handleSaveGame,
        handleLoadGame,
        movementListener,
      }
    },
  }
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
