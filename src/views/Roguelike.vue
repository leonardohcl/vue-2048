<template>
  <div class="roguelike">
    <div class="roguelike__hud">
      <div class="roguelike__sidebar--left roguelike__sidebar">
        <InventoryManager :game="game" />
      </div>
      <div class="roguelike__hud--main">
        <div class="roguelike__status">
          <!-- <div
          class="roguelike__status--entry roguelike__status--full-width-entry pa-0"
        >
          <v-btn
            prepend-icon="fas fa-fw fa-rotate-left"
            variant="plain"
            size="small"
            color="secondary"
            outlined
            @click="game.reset()"
          >
            Start Over
          </v-btn>

          <div>
            <MemoryManager :game="game" close-on-load />
          </div>
        </div> -->
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
          :time-to-idle="1000"
          :emit-moves-interval="15"
          :allow-endless="false"
          :allow-square-selection="
            game.isRunning && game.activeItem !== undefined
          "
          disable-pause-screen
          restart-text="Give Up"
          @move="game.saveCurrent()"
          @idle="game.saveCurrent()"
          @new-game="game.start()"
          @restart="handleRunEnd(true)"
          @win="handleRunEnd"
          @game-over="handleRunEnd"
          @square-selected="handleSquareSelected"
        />
      </div>
      <div class="roguelike__sidebar--right roguelike__sidebar">
        <UpgradeShop
          :game="game"
          :allow-shopping="!game.isRunning"
          :inventory="game.inventory"
        />
      </div>
    </div>

    <div class="roguelike__best">
      <b class="roguelike__best--title">Best:</b>
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
    <RewardsManager :game="game" ref="rewardsManager" />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import Game from "@/components/organisms/Game.vue";
import Square from "@/components/atoms/Square.vue";
import UpgradeShop from "@/components/organisms/UpgradeShop.vue";
import InventoryManager from "@/components/organisms/InventoryManager.vue";
import RewardsManager from "@/components/organisms/RewardsManager.vue";
import MemoryManager from "@/components/organisms/MemoryManager.vue";
import Leaderboard from "@/components/organisms/Leaderboard.vue";
import DataChip from "@/components/atoms/DataChip/DataChip.vue";
import RoguelikeGameController from "@/model/2048 Roguelike/GameController";
import SquareType from "@/model/2048/Square";
import { SlotName } from "@/model/Game Utils/MemoryCard";
import { Highlighter, Navbar } from "@/keys";

export default defineComponent({
  components: {
    Game,
    Square,
    UpgradeShop,
    InventoryManager,
    RewardsManager,
    MemoryManager,
    Leaderboard,
    DataChip,
  },
  setup() {
    const rewardsManager = ref();

    const game = reactive(
      new RoguelikeGameController({
        width: 3,
        height: 3,
        winningBlock: 64,
        updateDelay: 100,
        historySize: 0,
      })
    );

    const navbar = inject(Navbar);
    navbar?.setGame(game as RoguelikeGameController, { showSettings: false });

    const handleSaveGame = (slotName: SlotName) => {
      game.save(slotName);
    };

    const highlighter = inject(Highlighter);

    const handleSquareSelected = (sqr: SquareType) => {
      const consumed = game.selectSquare(sqr);
      if (consumed) highlighter?.dismiss();
    };

    const handleRunEnd = (forceEnd = false) => {
      if (forceEnd) game.endRun();
      rewardsManager.value?.open();
    };

    const route = useRoute();

    if (route.query.load) {
      game.load(route.query.load as SlotName);
    }

    return {
      game: game as RoguelikeGameController,
      handleRunEnd,
      handleSquareSelected,
      handleSaveGame,
      rewardsManager,
    };
  },
});
</script>

<style lang="scss">
.roguelike {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: $default-spacing * 0.25;

  @include screen-above(sm) {
    align-items: stretch;
  }

  @include screen-above(md) {
    gap: $default-spacing * 0.5;
  }

  &__hud {
    padding: 0 2rem;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;

    @include screen-above(sm) {
      gap: $default-spacing * 0.5;
    }

    &--main {
      width: 100%;
      max-width: 400px;
    }
  }

  &__status {
    display: flex;
    justify-content: space-between;
    padding: $default-spacing * 0.25 0;
  }

  &__sidebar {
    display: flex;
    z-index: $hud-z-index + 1;
    top: 2rem;
    position: absolute;

    @include screen-above(sm) {
      position: initial !important;
    }

    &--left {
      left: -1rem;

      @include screen-above(sm) {
        justify-content: flex-end;
      }
    }

    &--right {
      right: -1rem;
      @include screen-above(sm) {
        justify-content: flex-start;
      }
    }
  }

  &__best {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0 $default-spacing * 0.5;
    padding: 0 2rem;

    @include screen-above(sm) {
      flex-wrap: nowrap;
    }

    &--title {
      display: block;
      width: 100%;
      justify-self: flex-start;

      @include screen-above(sm) {
        width: unset;
      }
    }

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
