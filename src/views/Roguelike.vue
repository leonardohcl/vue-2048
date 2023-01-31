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
                @save="handleSaveGame"
                @load="handleLoadGame"
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
              {{ history.run }}
            </DataChip>
          </div>
          <div class="roguelike__status--entry justify-end">
            <DataChip
              append-icon="fas fa-fw fa-coins"
              size="small"
              color="warning"
              variant="outlined"
            >
              {{ currentCoins }}
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
          @move="saveCurrentGame"
          @idle="saveCurrentGame"
          @new-game="handleNewGame"
          @restart="handleRestart"
          @win="handleRoundOver"
          @game-over="handleRoundOver"
          @square-selected="handleItemUpdateSquares"
        />
        <div class="roguelike__status">
          <div
            class="roguelike__status--entry roguelike__status--full-width-entry justify-content-between"
          >
            <div class="d-flex align-center">
              Best:
              <Square class="mx-2" :value="history.highestBlock" inline />
            </div>
            <div>Best Score: {{ history.bestScore }}</div>
            <HighScoreManager
              ref="highscoreManager"
              :ranking-id="rankingId"
              :game="game"
              :disabled="!isRankingWorthy || haveSubmitedScore"
              :get-entry="getScore"
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
          @upgrade="handlePurchaseUpgrade"
        />
      </div>
    </div>
  </PageContainer>

  <RewardsManager :game="game" ref="rewardsManager" @loot="handleReward" />
</template>

<script>
import PageContainer from "@/components/atoms/PageContainer.vue";
import GameController from "@/model/2048/GameController";
import Inventory, { Bag } from "@/model/roguelike/Inventory";
import useInventoryHandling from "@/mixins/inventoryHandling";
import MemoryManager from "@/components/organisms/MemoryManager.vue";
import HighScoreManager from "@/components/organisms/HighScoreManager.vue";
import Ranking from "@/components/organisms/Ranking.vue";
import Game from "@/components/organisms/Game.vue";
import Square from "@/components/atoms/Square.vue";
import UpgradeShop from "@/components/organisms/UpgradeShop/UpgradeShop.vue";
import useUpgradeHandling from "@/mixins/upgradeHandling";
import InventoryManager from "@/components/organisms/InventoryManager/InventoryManager.vue";
import RewardsManager from "@/components/organisms/RewardsManager.vue";
import DataChip from "@/components/atoms/DataChip/DataChip.vue";
import { reactive, ref, computed } from "vue";
import { useStore } from "vuex";
import { SET_COINS, UPDATE_BALANCE } from "@/store/wallet";
import { ADD_GAME_ACTION, SAVE_LAST_GAME_ACTION } from "@/store/memory-card";
import RogueSaveFile from "@/model/roguelike/RogueSaveFile";
import { useRoute } from "vue-router";

export default {
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
    const currentCoins = computed(() => store.getters.currentCoins);

    const rankingId = "roguelike";

    // refs
    const rewardsManager = ref();
    const highscoreManager = ref();

    // flags
    const ignoreRewards = ref(false);

    // trackers
    const history = reactive({
      run: 0,
      bestScore: 0,
      highestBlock: 0,
    });

    const inventory = ref(new Inventory());

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

    // mixins
    const inventoryHandling = useInventoryHandling(game.value, inventory.value);
    const { setUsingItem } = inventoryHandling;

    const upgradeHandling = useUpgradeHandling(game.value);

    const startRun = () => {
      ignoreRewards.value = false;
      history.run++;
      game.value.start();
    };

    const endRun = () => {
      ignoreRewards.value = false;
      setUsingItem(false);
    };

    const getLoot = () => {
      if (history.run === 0) return;
      if (rewardsManager.value && !ignoreRewards.value)
        rewardsManager.value.lootRewards();
    };

    const updateBestPerformance = () => {
      if (game.value.score > history.bestScore) {
        haveSubmitedScore.value = false;
        history.bestScore = game.value.score;
      }

      if (game.value.board.highestValue > history.highestBlock) {
        haveSubmitedScore.value = false;
        history.highestBlock = game.value.board.highestValue;
      }
    };

    const handleNewGame = () => {
      startRun();
    };

    const handleRestart = () => {
      game.value.gameOver = true;
    };

    const getCurrentSaveFile = (filename) => {
      const save = GameController.getSaveFile(filename, game.value);

      save.progress.highestValue = history.highestBlock;
      save.score = history.bestScore;

      return new RogueSaveFile(
        save.filename,
        save.settings,
        save.state,
        { ...save.progress, run: history.run, bestScore: history.bestScore },
        { ...inventory.value, coins: currentCoins.value }
      );
    };

    const handleSaveGame = (slot) => {
      store.dispatch(ADD_GAME_ACTION, {
        save: getCurrentSaveFile(slot.filename),
        gameMode: "roguelike",
      });
    };

    const saveCurrentGame = () => {
      store.dispatch(SAVE_LAST_GAME_ACTION, {
        save: getCurrentSaveFile("last-game"),
        gameMode: "roguelike",
      });
    };

    const handlePurchaseUpgrade = ({ price, upgrade }) => {
      upgradeHandling.handlePurchaseUpgrade({ price, upgrade });
      saveCurrentGame();
    };

    const handleLoadGame = (slot) => {
      ignoreRewards.value = true;
      game.value.loadSaveFile(slot);
      history.run = slot.progress.run || 0;
      history.highestBlock = slot.progress.highestValue;
      history.bestScore = slot.progress.bestScore;
      inventory.value.bag = new Bag(slot.inventory.bag);
      store.commit(SET_COINS, slot.inventory.coins || 0);
    };

    const handleRoundOver = () => {
      endRun();
      if (!ignoreRewards.value) getLoot();
      updateBestPerformance();
      saveCurrentGame();
    };

    const handleReward = (amount) => {
      store.commit(UPDATE_BALANCE, amount);
    };

    const handleStartOver = () => {
      game.value.updateSettings({
        width: 3,
        height: 3,
        historySize: 0,
        winningBlock: 64,
      });

      store.commit(SET_COINS, 0);

      inventory.value = new Inventory();

      history.run = 0;
      history.bestScore = 0;
      history.highestBlock = 0;
    };

    const haveSubmitedScore = ref(false);

    const isRankingWorthy = computed(() => {
      if (!highscoreManager.value) return false;
      return highscoreManager.value.isRankingWorthy(history.bestScore);
    });

    const getScore = ({ id, game }) => {
      const entry = GameController.getRankingEntry({
        id,
        game,
      });

      entry.score = history.bestScore;
      entry.block = history.highestBlock;
      entry.run = history.run;

      return entry;
    };

    const route = useRoute();

    if (route.query.load) {
      const slot = route.query.load;
      let save;
      if (slot === "last") {
        save = store.getters.lastGame("roguelike");
      } else {
        const saves = store.getters.saves("roguelike");
        save = saves.find((s) => s.filename === slot);
      }
      if (save) handleLoadGame(save);
    }

    return {
      game,
      history,
      rankingId,
      inventory,
      currentCoins,
      rewardsManager,
      isRankingWorthy,
      highscoreManager,
      haveSubmitedScore,
      handleNewGame,
      handleRestart,
      handleRoundOver,
      handleReward,
      handleSaveGame,
      handleLoadGame,
      handleStartOver,
      saveCurrentGame,
      getScore,
      ...inventoryHandling,
      handlePurchaseUpgrade,
      allowUpgradeShopping: upgradeHandling.allowUpgradeShopping,
    };
  },
};
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

      @include screen-above(sm){
        justify-content: flex-end;
      }
    }
    
    &--right {
      position: absolute;
      right: 0;
      transform: translateX(50%);
      @include screen-above(sm){
        justify-content: flex-start;
      }
    }
  }
}
</style>
