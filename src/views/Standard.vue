<template>
  <div class="regular">
    <div class="regular__container">
      <div class="regular__hud">
        <div class="regular__hud--left">
          <Ranking :ranking-id="rankingId" />
        </div>
        <div class="regular__hud--right">
          <MemoryManager
            :save-button-options="{ disabled: game.gameOver }"
            close-on-load
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
      <Game
        :game="game"
        :rankingId="rankingId"
        :emit-moves-interval="15"
        :time-to-idle="1000"
        @idle="saveCurrentGame"
        @move="saveCurrentGame"
        @new-game="handleNewGame"
        @restart="handleNewGame"
        @win="handleGameOver"
        @game-over="handleGameOver"
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

<script>
import PageContainer from "@/components/atoms/PageContainer.vue";
import Game from "@/components/organisms/Game.vue";
import Ranking from "@/components/organisms/Ranking.vue";
import Settings from "@/components/organisms/Settings.vue";
import MemoryManager from "@/components/organisms/MemoryManager.vue";
import HighScoreManager from "@/components/organisms/HighScoreManager.vue";
import GameController from "@/model/2048/GameController";
import { defineComponent } from "vue";

import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

import { ADD_GAME_ACTION, SAVE_LAST_GAME_ACTION } from "@/store/memory-card";

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
    const store = useStore();

    const highScoreManager = ref();

    const game = ref(
      new GameController({
        width: 4,
        height: 4,
        winningBlock: 2048,
        historySize: 2,
        updateDelay: 100,
      })
    );

    const rankingId = computed(
      () => `${game.value.width}x${game.value.height}`
    );

    const saveCurrentGame = () => {
      const save = GameController.getSaveFile("last-game", game.value);
      store.dispatch(SAVE_LAST_GAME_ACTION, { save });
    };

    const handleSettingsOpen = () => {
      game.value.paused = true;
    };

    const handleSettingsClose = () => {
      game.value.paused = false;
    };

    const handleSettingsUpdate = (newSettings) => {
      game.value.updateSettings(newSettings);
    };

    const handleNewGame = () => {
      game.value.start();
    };

    const handleSaveGame = (slot) => {
      const save = GameController.getSaveFile(slot.filename, game.value);
      store.dispatch(ADD_GAME_ACTION, { save });
    };

    const handleLoadGame = (save) => {
      game.value.loadSaveFile(save);
    };

    const handleGameOver = () => {
      highScoreManager.value?.triggerDialog();
    };

    const route = useRoute();

    if (route.query.load) {
      const slot = route.query.load;
      let save;
      if (slot === "last") {
        save = store.getters.lastGame();
      } else {
        const saves = store.getters.saves();
        save = saves.find((s) => s.filename === slot);
      }
      if (save) handleLoadGame(save);
    }

    return {
      game,
      rankingId,
      highScoreManager,
      handleSettingsOpen,
      handleSettingsClose,
      handleSettingsUpdate,
      handleNewGame,
      handleGameOver,
      handleSaveGame,
      handleLoadGame,
      saveCurrentGame,
    };
  },
});
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
