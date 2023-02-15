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

      <Transition name="scroll-x">
        <v-btn
          v-if="lastGame"
          size="large"
          block
          :color="theme"
          @click="handleLoadLast"
        >
          Continue
        </v-btn>
      </Transition>

      <v-btn
        tag="router-link"
        size="large"
        block
        :color="theme"
        :to="`/${gameMode}`"
      >
        New Game
      </v-btn>

      <v-btn
        v-bind="{
          prependIcon: '',
          text: 'Load Game',
          color: theme,
          block: true,
          size: 'large',
          variant: 'elevated',
        }"
      >
        Load Game
        <v-dialog activator="parent" width="400">
          <MemoryCard :memory-card="memoryCard" @select="handleLoad" />
        </v-dialog>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
  import GameMode from '@/model/Game Utils/GameMode'
  import PageContainer from '@/components/organisms/PageContainer.vue'

  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import MemoryCardClass, { SlotName } from '@/model/Game Utils/MemoryCard'
  import SaveFile from '@/model/Game Utils/SaveFile/SaveFile'
  import RoguelikeSaveFile from '@/model/Game Utils/SaveFile/RoguelikeSaveFile'
  import useTutorialHandler from '@/composables/tutorialRoutine'
  import Tutorials from '@/assets/tutorials'
  import useNavbar from '@/composables/navbar'
  import MemoryCard from '@/components/molecules/MemoryCard/MemoryCard.vue'

  export default {
    components: {
      PageContainer,
      MemoryCard,
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
        [GameMode.Standard]: new MemoryCardClass<SaveFile>(GameMode.Standard),
        [GameMode.Roguelike]: new MemoryCardClass<RoguelikeSaveFile>(
          GameMode.Roguelike
        ),
      }

      const memoryCard = computed(() => memoryCards[gameMode.value])

      const lastGame = computed(() => memoryCard.value.lastGame)

      const tutorialHandler = useTutorialHandler([
        { ...Tutorials.StandardGameplay, title: 'Standard Mode' },
        { ...Tutorials.RoguelikeGameplay, title: 'Roguelike Mode' },
      ])

      const navbar = useNavbar()
      navbar?.setTutorialHandler(tutorialHandler)

      const handleLoad = (slotName: SlotName) => {
        router.push({
          name: gameMode.value as GameMode,
          query: { load: slotName },
        })
      }

      const handleLoadLast = () => {
        handleLoad(SlotName.LastGame)
      }

      return {
        gameModes,
        gameMode,
        theme,
        memoryCard,
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
    align-items: center;
    flex: 1 1 100%;

    &__hud {
      flex-basis: 100%;
      width: 100%;
      max-width: 400px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      gap: $default-spacing;
    }
  }
</style>
