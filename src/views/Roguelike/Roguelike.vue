<template>
  <div class="roguelike">
    <div class="roguelike__sidebar--left roguelike__sidebar">
      <InventoryManager
        :inventory="game.inventory"
        :allow-shopping="game.canShop"
        :allow-use="game.canUseItems"
        @use="game.activateItem"
        @cancel="game.deactivateItem"
        @purchase="game.inventory.buyItem"
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
              @save="memoryCard.save"
              @load="game.load"
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
            {{ game.run }}
          </DataChip>
        </div>
        <div class="roguelike__status--entry justify-end">
          <DataChip
            append-icon="fas fa-fw fa-coins"
            size="small"
            color="warning"
            variant="outlined"
          >
            {{ game.inventory.wallet.coins }}
          </DataChip>
        </div>
      </div>
      <Game
        :game="game"
        :ranking-id="rankingId"
        :time-to-idle="1000"
        :emit-moves-interval="15"
        :allow-endless="false"
        :allow-square-selection="game.canSelectSquares"
        disable-pause-screen
        restart-text="Give Up"
        @move="memoryCard.saveCurrent"
        @idle="memoryCard.saveCurrent"
        @new-game="handleNewGame"
        @restart="handleRestart"
        @win="handleGameOver"
        @game-over="handleGameOver"
        @square-selected="game.selectSquare"
      />
      <div class="roguelike__status">
        <div
          class="roguelike__status--entry roguelike__status--full-width-entry roguelike__best"
        >
          <div class="roguelike__best--data">
            <b>Your best:</b>
            <DataChip
              :value="game.bestRun.run"
              theme="run"
              :chip-options="{ variant: 'tonal', size: 'x-small' }"
            />
            <Square class="mx-2" :value="game.bestRun.highestBlock" inline />

            <DataChip
              :value="game.bestRun.score"
              theme="score"
              :chip-options="{ variant: 'tonal' }"
            />
            <DataChip
              :value="game.bestRun.moves"
              theme="moves"
              :chip-options="{ variant: 'tonal', size: 'x-small' }"
            />
            <DataChip
              :value="game.bestRun.undos"
              theme="undos"
              :chip-options="{ variant: 'tonal', size: 'x-small' }"
            />
          </div>
          <HighScoreManager
            ref="highscoreManager"
            :ranking-id="rankingId"
            :game="game"
            :disabled="!isRankingWorthy || haveSubmitedScore"
            @save="haveSubmitedScore = true"
            use-submit
          />
        </div>
      </div>
    </div>
    <div class="roguelike__sidebar--right roguelike__sidebar">
      <UpgradeShop
        :game="game"
        :allow-shopping="game.canShop"
        :inventory="game.inventory"
        @upgrade="game.buyUpgrade"
      />
    </div>
    <RewardsManager :game="game" ref="rewardsManager" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

import Game from "@/components/organisms/Game.vue";
import Square from "@/components/atoms/Square.vue";
import UpgradeShop from "@/components/organisms/UpgradeShop/UpgradeShop.vue";
import InventoryManager from "@/components/organisms/InventoryManager/InventoryManager.vue";
import RewardsManager from "@/components/organisms/RewardsManager.vue";
import MemoryManager from "@/components/organisms/MemoryManager.vue";
import Ranking from "@/components/organisms/Ranking.vue";
import HighScoreManager from "@/components/organisms/HighScoreManager.vue";
import DataChip from "@/components/atoms/DataChip/DataChip.vue";

import RoguelikeGameController from "@/model/2048 Roguelike/GameController";
import useMemoryCard, { SlotName } from "@/composables/memoryCard";
import useHighscoreHandler from "./handlers/highscore";
import useStateHandler from "./handlers/state";
import RoguelikeSaveFile from "@/model/2048 Roguelike/RogueSaveFile";
import memoryCard from "@/store/memory-card";

export default defineComponent({
  components: {
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
    const rankingId = "roguelike";

    // game
    const game = new RoguelikeGameController({
      width: 3,
      height: 3,
      winningBlock: 64,
      updateDelay: 100,
      historySize: 0,
    });

    const memoryCard = useMemoryCard(game);

    const route = useRoute();

    if (route.query.load) {
      const slot = route.query.load;
      let save = memoryCard.slots.value[slot as SlotName];
      if (save) game.load(save as RoguelikeSaveFile);
    }

    const { haveSubmitedScore, isRankingWorthy, highscoreManager } =
      useHighscoreHandler(game);

    const { handleNewGame, handleRestart, handleGameOver, handleStartOver } =
      useStateHandler(game);

    return {
      game,
      rankingId,
      memoryCard,
      // State
      handleNewGame,
      handleRestart,
      handleGameOver,
      handleStartOver,
      // Highscore
      isRankingWorthy,
      highscoreManager,
      haveSubmitedScore,
    };
  },
});
</script>

<style lang="scss">
.roguelike {
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
