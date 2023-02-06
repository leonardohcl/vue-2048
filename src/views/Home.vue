<template>
  <div class="home">
    <div class="home__hud">
      <v-btn-toggle v-model="gameMode" class="w-100 d-flex" mandatory>
        <v-btn
          v-for="mode in gameModes"
          :key="mode.value"
          :value="mode.value"
          :color="theme"
          size="small"
          class="flex-fill"
        >
          {{ mode.text }}
        </v-btn>
      </v-btn-toggle>

      <v-slide-x-transition>
        <v-btn
          v-if="lastGame"
          size="large"
          block
          :color="theme"
          @click="handleLoadLast"
        >
          Continue
        </v-btn>
      </v-slide-x-transition>

      <v-btn
        tag="router-link"
        size="large"
        block
        :color="theme"
        :to="`/${gameMode}`"
      >
        New Game
      </v-btn>

      <MemoryManager
        :game-mode="gameMode"
        :theme="theme"
        :allow-save="false"
        :load-button-options="{
          text: 'Load Game',
          color: theme,
          block: true,
          size: 'large',
          variant: 'elevated',
        }"
        @load="handleLoad"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import GameMode from '@/model/Game Utils/GameMode'
  import PageContainer from '@/components/atoms/PageContainer.vue'
  import MemoryManager from '@/components/organisms/MemoryManager.vue'

  import { computed, inject, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import MemoryCard, { SlotName } from '@/model/Game Utils/MemoryCard'
  import { RoguelikeMemoryCard, StandardMemoryCard } from '@/keys'

  export default {
    components: {
      PageContainer,
      MemoryManager,
    },
    setup() {
      const router = useRouter()
      const route = useRoute()

      const gameModes = [
        { text: 'Standard', value: GameMode.Standard },
        { text: 'Roguelike', value: GameMode.Roguelike },
      ]

      const gameMode = ref(
        (route.meta.previousGameMode as GameMode) || GameMode.Standard
      )

      const theme = computed(() =>
        gameMode.value === GameMode.Standard ? 'primary' : 'secondary'
      )

      const memoryCards = {
        [GameMode.Standard]: inject(StandardMemoryCard),
        [GameMode.Roguelike]: inject(RoguelikeMemoryCard),
      }

      const memoryCard = computed(
        () => memoryCards[gameMode.value] ?? new MemoryCard(gameMode.value)
      )

      const lastGame = computed(() => memoryCard.value.lastGame)

      const handleLoad = ({ slotName }: { slotName: SlotName }) => {
        router.push({
          name: gameMode.value as GameMode,
          query: { load: slotName },
        })
      }

      const handleLoadLast = () => {
        handleLoad({ slotName: SlotName.LastGame })
      }

      return {
        gameModes,
        gameMode,
        theme,
        lastGame,
        handleLoad,
        handleLoadLast,
      }
    },
  }
</script>

<style lang="scss">
  .home {
    width: 100%;
    display: flex;
    justify-content: center;

    &__hud {
      flex-basis: 100%;
      min-width: 200px;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      gap: $default-spacing;
    }
  }
</style>
