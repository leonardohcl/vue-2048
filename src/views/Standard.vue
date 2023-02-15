<template>
  <div class="regular">
    <div class="regular__container">
      <Game
        :game="game"
        :emit-moves-interval="15"
        :time-to-idle="1000"
        @idle="game.saveCurrent()"
        @move="game.saveCurrent()"
        @new-game="game.start()"
        @restart="game.restart()"
        @set-endless="game.activateEndless()"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import PageContainer from '@/components/organisms/PageContainer.vue'
  import Game from '@/components/organisms/Game.vue'

  import { defineComponent } from 'vue'

  import { reactive } from 'vue'
  import { useRoute } from 'vue-router'

  import GameController from '@/model/2048 Standard/GameController'
  import { SlotName } from '@/model/Game Utils/MemoryCard'
  import useNavbar from '@/composables/navbar'
  import Tutorials from '@/assets/tutorials'
import useTutorialHandler from '@/composables/tutorialRoutine'

  export default defineComponent({
    components: {
      PageContainer,
      Game,
    },
    setup() {
      const game = reactive<GameController>(
        new GameController({
          width: 4,
          height: 4,
          winningBlock: 2048,
          historySize: 2,
          updateDelay: 100,
        })
      )

      const tutorialHandler = useTutorialHandler([
        Tutorials.StandardMode,
        Tutorials.StandardGameplay,
        Tutorials.Controls,
      ])

      const navbar = useNavbar()
      navbar?.setGame(game as GameController)
      navbar?.setTutorialHandler(tutorialHandler)

      const handleSaveGame = (slotName: SlotName) => {
        game.save(slotName)
      }

      const handleLoadGame = (slotName: SlotName) => {
        game.load(slotName)
      }

      const route = useRoute()

      if (route.query.load) game.load(route.query.load as SlotName)

      return {
        game: game as GameController,
        handleSaveGame,
        handleLoadGame,
      }
    },
  })
</script>

<style lang="scss">
  .regular {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    &__container {
      flex-basis: 100%;
      min-width: 200px;
      max-width: 450px;
    }

    &__hud {
      display: flex;
      justify-content: center;
      &__container {
        flex-basis: 100%;
        min-width: 200px;
        max-width: 450px;
      }

      &__hud {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
    }
  }
</style>
