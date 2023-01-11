<template>
  <div class="home">
    <h1>2048</h1>
    <div class="home__hud">
      <div class="home__hud--left"><Ranking /></div>
      <div class="home__hud--right">
        <Settings
          :game="game"
          @open="handleSettingsOpen"
          @close="handleSettingsClose"
          @update="handleSettingsUpdate"
        />
      </div>
    </div>
    <Game :game="game" />
  </div>
</template>

<script>
  import Game from '@/components/organisms/Game.vue'
  import Ranking from '@/components/organisms/Ranking.vue'
  import Settings from '@/components/organisms/Settings.vue'
  import GameController from '@/model/2048/GameController'

  import { ref } from 'vue'

  export default {
    components: { Game, Ranking, Settings },
    name: 'Home',
    setup() {
      const game = ref(new GameController(4, 4, 2, 100))

      const handleSettingsOpen = () => {
        game.value.paused = true
      }

      const handleSettingsClose = () => {
        game.value.paused = false
      }

      const handleSettingsUpdate = (newSettings) => {
        game.value.updateSettings(newSettings)
      }

      return {
        game,
        handleSettingsOpen,
        handleSettingsClose,
        handleSettingsUpdate,
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
