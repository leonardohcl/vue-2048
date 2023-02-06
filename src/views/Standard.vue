<template>
  <div class="regular">
    <div class="regular__container">
      <div class="regular__hud">
        <div class="regular__hud--left">
          <Ranking :ranking-id="rankingId" />
        </div>
        <div class="regular__hud--right">
          <MemoryManager :game="game" close-on-load />
          <Settings :game="game" />
        </div>
      </div>
      <Game
        :game="game"
        :rankingId="rankingId"
        :emit-moves-interval="15"
        :time-to-idle="1000"
        @idle="game.saveCurrent()"
        @move="game.saveCurrent()"
        @new-game="game.start()"
        @restart="game.restart()"
        @set-endless="game.activateEndless()"
      />
      <HighScoreManager
        :game="game"
        :ranking-id="rankingId"
        ref="highScoreManager"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import PageContainer from '@/components/atoms/PageContainer.vue'
  import Game from '@/components/organisms/Game.vue'
  import Ranking from '@/components/organisms/Ranking.vue'
  import Settings from '@/components/organisms/Settings.vue'
  import MemoryManager from '@/components/organisms/MemoryManager.vue'
  import HighScoreManager from '@/components/organisms/HighScoreManager.vue'

  import { defineComponent } from 'vue'

  import { ref, reactive, computed } from 'vue'
  import { useRoute } from 'vue-router'

  import GameController from '@/model/2048 Standard/GameController'
  import { SlotName } from '@/model/Game Utils/MemoryCard'

  export default defineComponent({
    components: {
      PageContainer,
      Game,
      Ranking,
      Settings,
      MemoryManager,
      HighScoreManager,
    },
    setup() {
      const highScoreManager = ref()

      const game = reactive<GameController>(
        new GameController({
          width: 4,
          height: 4,
          winningBlock: 2048,
          historySize: 2,
          updateDelay: 100,
        })
      )

      const rankingId = computed(() => `${game.width}x${game.height}`)

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
        rankingId,
        highScoreManager,
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
</style>
