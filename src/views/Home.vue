<template>
  <PageContainer
    class="home"
    :subtitle="gameMode === 'roguelike' ? 'Roguelike' : ''"
    :subtitleOptions="{ class: `badge-${theme}` }"
  >
    <div class="home__hud">
      <BFormRadioGroup
        class="align-self-right"
        size="sm"
        buttons
        v-model="gameMode"
        :options="gameModes"
        :button-variant="`outline-${theme}`"
        alig
      />
      <Btn
        text="Continue"
        size="lg"
        :theme="theme"
        block
        v-if="lastGame"
        @click="handleLoad('last')"
      />
      <Btn
        text="New Game"
        size="lg"
        :theme="theme"
        block
        tag="router-link"
        :to="`/${gameMode}`"
      />
      <MemoryManager
        :game-mode="gameMode"
        :allow-save="false"
        :load-button-options="{
          text: 'Load Game',
          size: 'lg',
          theme,
          isIcon: false,
          outlined: false,
          block: true,
        }"
        @load="(slot) => handleLoad(slot.filename)"
      />
    </div>
  </PageContainer>
</template>

<script>
  import PageContainer from '@/components/atoms/PageContainer.vue'
  import MemoryManager from '@/components/organisms/MemoryManager.vue'
  import { BFormRadioGroup } from 'bootstrap-vue'
  import Btn from '@/components/atoms/Btn.vue'

  import { computed, ref } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'

  export default {
    components: {
      PageContainer,
      BFormRadioGroup,
      Btn,
      MemoryManager,
    },
    setup() {
      const store = useStore()
      const router = useRouter()

      const gameModes = [
        { text: 'Default', value: 'regular' },
        { text: 'Roguelike', value: 'roguelike' },
      ]
      const gameMode = ref('regular')

      const theme = computed(() =>
        gameMode.value === 'roguelike' ? 'secondary' : 'primary'
      )

      const lastGame = computed(() => store.getters.lastGame(gameMode.value))

      const handleLoad = (slot) => {
        router.push({
          name: gameMode.value,
          query: { load: slot },
        })
      }

      return { gameModes, gameMode, theme, lastGame, handleLoad }
    },
  }
</script>

<style lang="scss">
  .home {
    .page__title {
      font-size: 5rem;
    }

    &__hud {
      width: 100%;
      min-width: 200px;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      gap: $default-spacing;
    }
  }
</style>
