<template>
  <PageContainer
    class="roguelike"
    subtitle="Roguelike"
    navigate-to="/"
    :subtitle-options="{ color: 'secondary', size: 'default' }"
  >
    <div class="roguelike__game">
      <div class="roguelike__sidebar--left roguelike__sidebar">
        <InventoryManager
          :inventory="inventory"
          :allow-shopping="allowItemShopping"
          :allow-use="allowItemUse"
          @use="handleUseItem"
          @cancel="handleCancelItem"
          @purchase="handlePurchaseItem"
        />
      </div>
      <div class="roguelike__center">
        <div class="roguelike__status">
          <div
            class="roguelike__status--entry roguelike__status--full-width-entry pa-0"
          >
            <Ranking :ranking-id="rankingId" with-run with-board />

            <v-btn
              prepend-icon="fas fa-fw fa-rotate-left"
              variant="plain"
              size="small"
              color="secondary"
              outlined
              @click="handleStartOver"
            >
              Start Over
            </v-btn>

            <div>
              <MemoryManager
                game-mode="roguelike"
                close-on-load
                @save="handleSave"
                @load="handleLoad"
              />
            </div>
          </div>
          <div class="roguelike__status--entry">
            <DataChip
              prepend-icon="fas fa-fw fa-person-running"
              size="small"
              color="light-green"
              variant="outlined"
            >
              <span class="d-none d-md-inline mr-1">Run:</span>
              {{ progress.run }}
            </DataChip>
          </div>
          <div class="roguelike__status--entry justify-end">
            <DataChip
              append-icon="fas fa-fw fa-coins"
              size="small"
              color="warning"
              variant="outlined"
            >
              {{ inventory.wallet.coins }}
            </DataChip>
          </div>
        </div>
        <Game
          :game="game"
          :ranking-id="rankingId"
          :time-to-idle="1000"
          :emit-moves-interval="15"
          :allow-endless="false"
          :allow-square-selection="allowItemSquareUpdate"
          disable-pause-screen
          restart-text="Give Up"
          @move="saveCurrent"
          @idle="saveCurrent"
          @new-game="handleNewGame"
          @restart="handleRestart"
          @win="handleGameOver"
          @game-over="handleGameOver"
          @square-selected="handleItemUpdateSquares"
        />
        <div class="roguelike__status">
          <div
            class="roguelike__status--entry roguelike__status--full-width-entry roguelike__best"
          >
            <div class="roguelike__best--data">
              <b>Your best:</b>
              <DataChip
                :value="bestRun.run"
                theme="run"
                :chip-options="{ variant: 'tonal', size: 'x-small' }"
              />
              <Square class="mx-2" :value="bestRun.highestBlock" inline />

              <DataChip
                :value="bestRun.score"
                theme="score"
                :chip-options="{ variant: 'tonal' }"
              />
              <DataChip
                :value="bestRun.moves"
                theme="moves"
                :chip-options="{ variant: 'tonal', size: 'x-small' }"
              />
              <DataChip
                :value="bestRun.undos"
                theme="undos"
                :chip-options="{ variant: 'tonal', size: 'x-small' }"
              />
            </div>
            <HighScoreManager
              ref="highscoreManager"
              :ranking-id="rankingId"
              :game="game"
              :disabled="!isRankingWorthy || haveSubmitedScore"
              :get-entry="getRankingEntry"
              @save="haveSubmitedScore = true"
              use-submit
            />
          </div>
        </div>
      </div>
      <div class="roguelike__sidebar--right roguelike__sidebar">
        <UpgradeShop
          :game="game"
          :allow-shopping="allowUpgradeShopping"
          :inventory="inventory"
          @upgrade="handlePurchaseUpgrade"
        />
      </div>
    </div>
  </PageContainer>

  <RewardsManager :game="game" ref="rewardsManager" @loot="handleReward" />
</template>

<script lang="ts">
import PageContainer from "@/components/atoms/PageContainer.vue";
import GameController from "@/model/2048/GameController";
import MemoryManager from "@/components/organisms/MemoryManager.vue";
import HighScoreManager from "@/components/organisms/HighScoreManager.vue";
import Ranking from "@/components/organisms/Ranking.vue";
import Game from "@/components/organisms/Game.vue";
import Square from "@/components/atoms/Square.vue";
import UpgradeShop from "@/components/organisms/UpgradeShop/UpgradeShop.vue";
import InventoryManager from "@/components/organisms/InventoryManager/InventoryManager.vue";
import RewardsManager from "@/components/organisms/RewardsManager.vue";
import DataChip from "@/components/atoms/DataChip/DataChip.vue";
import { ref, defineComponent } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import RoguelikeSaveFile from "@/model/roguelike/RogueSaveFile";
import { GameHandlerSuite } from "./handlers/model/HandlerSuite";

export default defineComponent({
  components: {
    PageContainer,
    Game,
    Square,
    UpgradeShop,
    InventoryManager,
    RewardsManager,
    MemoryManager,
    Ranking,
    HighScoreManager,
    DataChip,
  },
  setup() {
    const store = useStore();

    const rankingId = "roguelike";

    // game
    const game = ref(
      new GameController({
        width: 3,
        height: 3,
        winningBlock: 64,
        updateDelay: 100,
        historySize: 0,
      })
    );

    // handlers

    const handlers = new GameHandlerSuite(game.value);

    const route = useRoute();

    if (route.query.load) {
      const slot = route.query.load;
      let save;
      if (slot === "last") {
        save = store.getters.lastGame("roguelike");
      } else {
        const saves = store.getters.saves("roguelike");
        save = saves.find((s: RoguelikeSaveFile) => s.filename === slot);
      }
      if (save) handlers.memory?.handleLoad(save);
    }

    // cherry picking from handlers

    const {
      inventory,
      allowItemSquareUpdate,
      allowItemShopping,
      allowItemUse,
      handleUseItem,
      handleCancelItem,
      handlePurchaseItem,
      handleItemUpdateSquares,
    } = handlers.inventory;

    const { handleSave, handleLoad, saveCurrent } = handlers.memory;

    const {
      bestRun,
      haveSubmitedScore,
      isRankingWorthy,
      highscoreManager,
      getRankingEntry,
    } = handlers.highscore;

    const { handleNewGame, handleRestart, handleGameOver, handleStartOver } =
      handlers.state;

    const { rewardsManager, handleReward } = handlers.reward;

    const { allowUpgradeShopping, handlePurchaseUpgrade } = handlers.upgrade;

    const { progress } = handlers.progress;

    return {
      game,
      rankingId,
      // Reward
      rewardsManager,
      handleReward,
      // State
      handleNewGame,
      handleRestart,
      handleGameOver,
      handleStartOver,
      // Highscore
      bestRun,
      isRankingWorthy,
      highscoreManager,
      haveSubmitedScore,
      getRankingEntry,
      // Upgrades
      allowUpgradeShopping,
      handlePurchaseUpgrade,
      // Inventory
      inventory,
      allowItemShopping,
      allowItemUse,
      allowItemSquareUpdate,
      handleUseItem,
      handleCancelItem,
      handlePurchaseItem,
      handleItemUpdateSquares,
      // Memory
      handleSave,
      handleLoad,
      saveCurrent,
      // Progess
      progress,
    };
  },
});
</script>

<style lang="scss">
.roguelike {
  overflow: hidden;

  &__status {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    font-weight: bold;

    &--entry {
      display: flex;
      padding: 1rem 0;
      align-items: center;
    }

    &--full-width-entry {
      grid-column: 1/3;
      justify-content: space-between;
    }
  }

  &__game {
    width: 100%;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;

    @include screen-above(sm) {
      align-items: stretch;
    }

    @include screen-above(md) {
      gap: $default-spacing * 0.5;
    }
  }

  &__sidebar {
    display: flex;
    z-index: $hud-z-index + 1;
    position: absolute;
    top: 6rem + $default-spacing;

    @include screen-above(sm) {
      position: initial !important;
      transform: none !important;
      top: unset;
    }

    &--left {
      position: absolute;
      transform: translateX(-50%);
      left: 0;

      @include screen-above(sm) {
        justify-content: flex-end;
      }
    }

    &--right {
      position: absolute;
      right: 0;
      transform: translateX(50%);
      @include screen-above(sm) {
        justify-content: flex-start;
      }
    }
  }

  &__best {
    display: flex;
    flex-direction: column;
    gap: $default-spacing * 0.5;
    &--data {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $default-spacing * 0.5;
      width: 100%;
    }
  }
}
</style>
