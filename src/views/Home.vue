<template>
  <PageContainer
    class="home"
    :subtitle="gameMode === 'roguelike' ? 'Roguelike' : ''"
    :subtitleOptions="{
      color: theme,
      style:
        gameMode === 'roguelike'
          ? { transform: 'scale(1.5) translateY(-10px)' }
          : null,
    }"
  >
    <div class="home__hud">
      <v-btn-toggle v-model="gameMode" class="w-100 d-flex">
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
          @click="handleLoad('last')"
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
        @load="(slot) => handleLoad(slot.filename)"
      />
    </div>
  </PageContainer>
</template>

<script>
import PageContainer from "@/components/atoms/PageContainer.vue";
import MemoryManager from "@/components/organisms/MemoryManager.vue";

import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  components: {
    PageContainer,
    MemoryManager,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const gameModes = [
      { text: "Default", value: "regular" },
      { text: "Roguelike", value: "roguelike" },
    ];
    const gameMode = ref("regular");

    const theme = computed(() =>
      gameMode.value === "roguelike" ? "secondary" : "primary"
    );

    const lastGame = computed(() => store.getters.lastGame(gameMode.value));

    const handleLoad = (slot) => {
      router.push({
        name: gameMode.value,
        query: { load: slot },
      });
    };

    return { gameModes, gameMode, theme, lastGame, handleLoad };
  },
};
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
