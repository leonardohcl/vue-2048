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
        @idle="memoryCard.saveCurrent"
        @move="memoryCard.saveCurrent"
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

<script lang="ts">
import PageContainer from "@/components/atoms/PageContainer.vue";
import Game from "@/components/organisms/Game.vue";
import Ranking from "@/components/organisms/Ranking.vue";
import Settings from "@/components/organisms/Settings.vue";
import MemoryManager from "@/components/organisms/MemoryManager.vue";
import HighScoreManager from "@/components/organisms/HighScoreManager.vue";

import { defineComponent } from "vue";

import { ref, reactive, computed } from "vue";
import { useRoute } from "vue-router";

import GameController from "@/model/2048 Standard/GameController";
import useMemoryCard, { SlotName } from "@/composables/memoryCard";
import { IGameSettings } from "@/model/2048 Standard/partials/GameSettings";
import SaveFile from "@/model/2048 Standard/SaveFile";

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
    const highScoreManager = ref();

    const game = reactive(
      new GameController({
        width: 4,
        height: 4,
        winningBlock: 2048,
        historySize: 2,
        updateDelay: 100,
      })
    );

    const memoryCard = useMemoryCard(game as GameController);

    const rankingId = computed(() => `${game.width}x${game.height}`);

    const handleSettingsOpen = () => {
      game.pause(true);
    };

    const handleSettingsClose = () => {
      game.pause(false);
    };

    const handleSettingsUpdate = (newSettings: IGameSettings) => {
      game.updateSettings(newSettings);
    };

    const handleNewGame = () => {
      game.start();
    };

    const handleSaveGame = ({ key: slotName }: { key: SlotName }) => {
      memoryCard.save(slotName);
    };

    const handleLoadGame = ({ slot }: { slot: SaveFile }) => {
      game.load(slot);
    };

    const handleGameOver = () => {
      highScoreManager.value?.triggerDialog();
    };

    const route = useRoute();

    if (route.query.load) {
      const slot = route.query.load;
      let save = memoryCard.slots.value[slot as SlotName];
      if (save) game.load(save);
    }

    return {
      game,
      rankingId,
      highScoreManager,
      memoryCard,
      handleSettingsOpen,
      handleSettingsClose,
      handleSettingsUpdate,
      handleNewGame,
      handleGameOver,
      handleSaveGame,
      handleLoadGame,
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
