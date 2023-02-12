<template>
  <nav class="navbar">
    <div class="navbar__left">
      <TransitionGroup name="scroll-y-reverse">
        <v-btn
          v-if="!isHome"
          key="home"
          prepend-icon="fas fa-home"
          v-bind="btnConfig"
          @click="$router.push('/')"
        >
          <span class="d-none d-sm-inline"> Home </span>
        </v-btn>
        <Leaderboard
          v-if="game && display.leaderboard"
          key="leaderboard"
          :game="game"
          :button-options="btnConfig"
          :with-board="isRoguelike"
          :with-run="isRoguelike"
        >
          <span class="d-none d-sm-inline"> Leaderboard </span>
        </Leaderboard>
        <MemoryManager
          v-if="game"
          key="memory-save"
          :game="game"
          :allow-load="false"
          :allow-save="display.save"
          :save-button-options="btnConfig"
        >
          <template #save-button>
            <span class="d-none d-sm-inline"> Save Game </span>
          </template>
        </MemoryManager>
        <MemoryManager
          v-if="game"
          key="memory-load"
          :game="game"
          :allow-load="display.load"
          :allow-save="false"
          :load-button-options="btnConfig"
          close-on-load
        >
          <template #load-button>
            <span class="d-none d-sm-inline"> Load Game </span>
          </template>
        </MemoryManager>
      </TransitionGroup>
    </div>
    <div class="navbar__right">
      <TransitionGroup name="scroll-y-reverse">
        <Settings
          v-if="game && display.settings"
          key="settings"
          :game="game"
          :button-options="btnConfig"
        >
          <span class="d-none d-sm-inline"> Settings </span>
        </Settings>

        <Help
          v-if="tutorialHandler && tutorialHandler.tutorials.length"
          key="help"
          :tutorial-handler="tutorialHandler"
          :button-options="btnConfig"
        >
          <span class="d-none d-sm-inline"> Help </span>
        </Help>
      </TransitionGroup>
      <About :button-options="btnConfig">
        <span class="d-none d-sm-inline"> About </span>
      </About>
    </div>
  </nav>
</template>

<script lang="ts">
  import RoguelikeGameController from '@/model/2048 Roguelike/GameController'
  import GameController from '@/model/2048 Standard/GameController'
  import LooseObject from '@/utils/LooseObject'
  import Leaderboard from '../Leaderboard.vue'
  import { defineComponent, ref, reactive, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import Settings from '../Settings.vue'
  import MemoryManager from '../MemoryManager.vue'
  import Help from '@/components/organisms/Help.vue'
  import About from '@/components/molecules/About.vue'
  import { ITutorialHandler } from '@/composables/tutorialRoutine'

  export default defineComponent({
    components: { Settings, Leaderboard, MemoryManager, Help, About },
    setup() {
      const route = useRoute()

      const isHome = computed(() => route.name === 'home')

      const btnConfig: LooseObject<string> = {
        variant: 'text',
        size: 'small',
      }

      const game = ref<GameController | RoguelikeGameController>()

      const isRoguelike = computed(
        () => game.value instanceof RoguelikeGameController
      )

      const display = reactive<LooseObject>({
        settings: true,
        leaderboard: true,
        load: true,
        save: true,
      })

      const setGame = (
        newGame?: GameController | RoguelikeGameController,
        {
          showSettings = true,
          showLeaderboard = true,
          showSave = true,
          showLoad = true,
        } = {}
      ) => {
        game.value = newGame
        display.settings = showSettings
        display.leaderboard = showLeaderboard
        display.save = showSave
        display.load = showLoad
      }

      const tutorialHandler = ref<ITutorialHandler>()

      const setTutorialHandler = (handler?: ITutorialHandler) => {
        tutorialHandler.value = handler
      }

      return {
        game,
        isHome,
        isRoguelike,
        display,
        btnConfig,
        tutorialHandler,
        setGame,
        setTutorialHandler,
      }
    },
  })
</script>

<style lang="scss">
  .navbar {
    padding: $default-spacing * 0.25;
    display: flex;
    justify-content: space-between;

    &__left,
    &__right {
      display: flex;
      gap: $default-spacing * 0.25;
    }
  }
</style>
