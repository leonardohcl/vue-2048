<template>
  <nav class="navbar">
    <div class="navbar__left">
      <v-scroll-y-reverse-transition group>
        <v-btn
          prepend-icon="fas fa-home"
          v-if="!isHome"
          v-bind="btnConfig"
          @click="$router.push('/')"
        >
          <span class="d-none d-sm-inline"> Home </span>
        </v-btn>
        <Leaderboard
          v-if="game && display.leaderboard"
          :game="game"
          :button-options="btnConfig"
          :with-board="isRoguelike"
          :with-run="isRoguelike"
        >
          <span class="d-none d-sm-inline"> Leaderboard </span>
        </Leaderboard>
      </v-scroll-y-reverse-transition>
    </div>
    <div class="navbar__right">
      <v-scroll-y-reverse-transition group>
        <MemoryManager
          v-if="game"
          :game="game"
          :allow-load="display.load"
          :allow-save="display.save"
          :load-button-options="btnConfig"
          :save-button-options="btnConfig"
          close-on-load
        >
          <template #load-button>
            <span class="d-none d-sm-inline"> Load Game </span>
          </template>

          <template #save-button>
            <span class="d-none d-sm-inline"> Save Game </span>
          </template>
        </MemoryManager>

        <Settings
          v-if="game && display.settings"
          :game="game"
          :button-options="btnConfig"
        >
          <span class="d-none d-sm-inline"> Settings </span>
        </Settings>
      </v-scroll-y-reverse-transition>
    </div>
  </nav>
</template>

<script lang="ts">
import RoguelikeGameController from "@/model/2048 Roguelike/GameController";
import GameController from "@/model/2048 Standard/GameController";
import LooseObject from "@/utils/LooseObject";
import Leaderboard from "../Leaderboard.vue";
import { defineComponent, ref, reactive, computed } from "vue";
import { useRoute } from "vue-router";
import Settings from "../Settings.vue";
import MemoryManager from "../MemoryManager.vue";
export default defineComponent({
  components: { Settings, Leaderboard, MemoryManager },
  setup() {
    const route = useRoute();

    const isHome = computed(() => route.name === "home");

    const btnConfig: LooseObject<string> = {
      variant: "text",
      size: "small",
    };

    const game = ref<GameController | RoguelikeGameController>();

    const isRoguelike = computed(
      () => game.value instanceof RoguelikeGameController
    );
    const display = reactive<LooseObject>({
      settings: true,
      leaderboard: true,
      load: true,
      save: true,
    });

    const setGame = (
      newGame?: GameController | RoguelikeGameController,
      {
        showSettings = true,
        showLeaderboard = true,
        showSave = true,
        showLoad = true,
      } = {}
    ) => {
      game.value = newGame;
      display.settings = showSettings;
      display.leaderboard = showLeaderboard;
      display.save = showSave;
      display.load = showLoad;
    };

    return {
      game,
      isHome,
      isRoguelike,
      display,
      btnConfig,
      setGame,
    };
  },
});
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
