<template>
  <PageContainer
    class="roguelike"
    subtitle="Roguelike"
    navigate-to="/"
    :subtitle-options="{ class: 'badge-secondary' }"
  >
    <div class="roguelike__game">
      <div class="roguelike__sidebar--left roguelike__sidebar">
        <h3
          class="roguelike__sidebar--title text-center text-secondary font-weight-bold"
        >
          Items
        </h3>
        <Inventory
          :inventory="inventory"
          :active-item="activeItem.id"
          :allow-shopping="allowShopping"
          @purchase="handlePurchase"
          @cancel="setUsingItemState(false)"
          @use="handleUseItem"
        />
      </div>
      <div class="roguelike__center">
        <div class="roguelike__status">
          <div
            class="roguelike__status--entry roguelike__status--full-width-entry d-flex justify-content-between pb-0"
          >
            <Ranking :ranking-id="rankingId" with-run with-board />

            <Btn
              icon="rotate-left"
              text="Start Over"
              outlined
              size="sm"
              @click="handleStartOver"
              theme="secondary"
            />

            <div>
              <MemoryManager
                game-mode="roguelike"
                close-on-load
                @save="handleSaveGame"
                @load="handleLoadGame"
              />
            </div>
          </div>
          <div class="roguelike__status--entry">Run: {{ history.run }}</div>
          <div class="roguelike__status--entry justify-content-end">
            <span class="badge-light badge-pill">
              {{ currentCoins }} <FontAwesomeIcon icon="coins" class="ml-1" />
            </span>
          </div>
        </div>
        <Game
          :game="game"
          :ranking-id="rankingId"
          :time-to-idle="1000"
          :emit-moves-interval="15"
          :allow-endless="false"
          :allow-square-selection="allowSquareSelection"
          disable-pause-screen
          restart-text="Give Up"
          @move="saveCurrentGame"
          @idle="saveCurrentGame"
          @new-game="handleNewGame"
          @restart="handleRestart"
          @win="handleRoundOver"
          @game-over="handleRoundOver"
          @square-selected="handleSquareSelected"
        />
        <div class="roguelike__status">
          <div
            class="roguelike__status--entry roguelike__status--full-width-entry justify-content-between"
          >
            <div class="d-flex align-items-center">
              Best:
              <Square class="mx-2" :value="history.highestBlock" inline />
            </div>
            <div>Best Score: {{ history.bestScore }}</div>
            <HighScoreManager
              ref="highscoreManager"
              :ranking-id="rankingId"
              :game="game"
              :disabled="!isRankingWorthy || haveSubmitedScore"
              use-submit
              @submit-score="saveScore"
            />
          </div>
        </div>
      </div>
      <div
        class="roguelike__sidebar--right roguelike__sidebar"
        :class="{ 'roguelike__sidebar--active': displayUpgrades }"
      >
        <h3
          class="roguelike__sidebar--title text-center text-secondary font-weight-bold"
        >
          Upgrades
        </h3>
        <Btn
          fab
          class="roguelike__sidebar--toggle"
          :icon="displayUpgrades ? 'times' : ['fa-chess-board', 'angles-up']"
          :theme="displayUpgrades ? 'danger' : 'primary'"
          @click="displayUpgrades = !displayUpgrades"
        />
        <UpgradeShop
          :game="game"
          :allow-shopping="allowShopping"
          @upgrade="handleUpgrade"
        />
      </div>
    </div>
  </PageContainer>

  <RewardsManager
    :game="game"
    ref="rewardsManager"
    @reward-earned="handleReward"
  />
</template>

<script>
  import PageContainer from '@/components/atoms/PageContainer.vue'
  import GameController from '@/model/2048/GameController'
  import InventoryTracker from '@/model/roguelike/Inventory'
  import MemoryManager from '@/components/organisms/MemoryManager.vue'
  import HighScoreManager from '@/components/organisms/HighScoreManager.vue'
  import Ranking from '@/components/organisms/Ranking.vue'
  import Item from '@/model/items/Item'
  import Game from '@/components/organisms/Game.vue'
  import Square from '@/components/atoms/Square.vue'
  import UpgradeShop from '@/components/organisms/UpgradeShop.vue'
  import Inventory from '@/components/organisms/Inventory.vue'
  import RewardsManager from '@/components/organisms/RewardsManager.vue'
  import Btn from '@/components/atoms/Btn.vue'
  import { reactive, ref, computed } from 'vue'
  import { useStore } from 'vuex'
  import { SET_COINS, UPDATE_BALANCE } from '@/store/wallet'
  import { ADD_GAME_ACTION, SAVE_LAST_GAME_ACTION } from '@/store/memory-card'
  import RogueSaveFile from '@/model/roguelike/RogueSaveFile'
  import { useRoute } from 'vue-router'

  export default {
    components: {
      PageContainer,
      Game,
      Square,
      Btn,
      UpgradeShop,
      Inventory,
      RewardsManager,
      MemoryManager,
      Ranking,
      HighScoreManager,
    },
    setup() {
      const store = useStore()

      const currentCoins = computed(() => store.getters.currentCoins)

      const rankingId = 'roguelike'

      const rewardsManager = ref()

      const highscoreManager = ref()

      const ignoreRewards = ref(false)

      const game = ref(
        new GameController({
          width: 3,
          height: 3,
          winningBlock: 64,
          updateDelay: 100,
          historySize: 0,
        })
      )

      const allowShopping = ref(true)

      const history = reactive({
        run: 0,
        bestScore: 0,
        highestBlock: 0,
      })

      const inventory = ref(new InventoryTracker())

      const allowSquareSelection = ref(false)

      const activeItem = reactive({
        id: '',
        blocksRequired: 0,
        selectedSquares: [],
        type: null,
      })

      const startRun = () => {
        allowShopping.value = false
        ignoreRewards.value = false
        history.run++
        game.value.start()
      }

      const endRun = () => {
        allowShopping.value = true
        ignoreRewards.value = false
        setUsingItemState(false)
      }

      const getLootFromBoard = () => {
        if (rewardsManager.value && !ignoreRewards.value)
          rewardsManager.value.lootRewards()
      }

      const setUsingItemState = (isUsing) => {
        if (isUsing) {
          game.value.paused = true
          allowSquareSelection.value = true
        } else {
          activeItem.id = ''
          allowSquareSelection.value = false
          game.value.paused = false
          game.value.cleanCustomStates()
          activeItem.selectedSquares = []
          activeItem.blocksRequired = 0
        }
      }

      const updateBestPerformance = () => {
        if (game.value.score > history.bestScore) {
          haveSubmitedScore.value = false
          history.bestScore = game.value.score
        }

        if (game.value.board.highestValue > history.highestBlock) {
          haveSubmitedScore.value = false
          history.highestBlock = game.value.board.highestValue
        }
      }

      const handleNewGame = () => {
        startRun()
      }

      const handleRestart = () => {
        game.value.gameOver = true
      }

      const getCurrentSaveFile = (filename) => {
        const save = GameController.getSaveFile(filename, game.value)

        save.progress.highestValue = history.highestBlock
        save.score = history.bestScore

        return new RogueSaveFile(
          save.filename,
          save.settings,
          save.state,
          { ...save.progress, run: history.run, bestScore: history.bestScore },
          { ...inventory.value, coins: currentCoins.value }
        )
      }

      const handleSaveGame = (slot) => {
        store.dispatch(ADD_GAME_ACTION, {
          save: getCurrentSaveFile(slot.filename),
          gameMode: 'roguelike',
        })
      }

      const saveCurrentGame = () => {
        store.dispatch(SAVE_LAST_GAME_ACTION, {
          save: getCurrentSaveFile('last-game'),
          gameMode: 'roguelike',
        })
      }

      const handleLoadGame = (slot) => {
        ignoreRewards.value = true
        game.value.loadSaveFile(slot)
        history.run = slot.progress.run || 0
        history.highestBlock = slot.progress.highestValue
        history.bestScore = slot.progress.bestScore
        inventory.value = slot.inventory
        store.commit(SET_COINS, slot.inventory.coins || 0)
      }

      const handleRoundOver = () => {
        endRun()
        getLootFromBoard()
        updateBestPerformance()
        saveCurrentGame()
      }

      const handleUpgrade = (purchase, price) => {
        store.commit(UPDATE_BALANCE, -price)
        game.value.updateSettings(purchase)
        saveCurrentGame()
      }

      const handlePurchase = (itemId, price) => {
        store.commit(UPDATE_BALANCE, -price)
        inventory.value[itemId]
          ? inventory.value[itemId]++
          : (inventory.value[itemId] = 1)

        saveCurrentGame()
      }

      const handleUseItem = (item) => {
        if (!inventory.value[item.id]) return
        activeItem.id = item.id
        activeItem.blocksRequired = item.blocksRequired
        activeItem.type = item.type
        Item.prepare(item.type, game.value)
        setUsingItemState(true)
      }

      const handleSquareSelected = (sqr) => {
        if (!activeItem.id) return
        if (sqr.customStates.selected || !sqr.customStates.selectable) return
        activeItem.selectedSquares.push(sqr)
        sqr.customStates.selected = true

        if (activeItem.selectedSquares.length >= activeItem.blocksRequired) {
          const itemId = activeItem.id
          const success = Item.apply(
            activeItem.type,
            game.value,
            activeItem.selectedSquares
          )
          if (!success) return (activeItem.selectedSquares = [])
          inventory.value[itemId]--
          setUsingItemState(false)
        }
      }

      const handleReward = (amount) => {
        store.commit(UPDATE_BALANCE, amount)
      }

      const handleStartOver = () => {
        game.value.updateSettings({
          width: 3,
          height: 3,
          historySize: 0,
          winningBlock: 64,
        })

        store.commit(SET_COINS, 0)

        inventory.value = new InventoryTracker()

        history.run = 0
        history.bestScore = 0
        history.highestBlock = 0
      }

      const haveSubmitedScore = ref(false)

      const isRankingWorthy = computed(() => {
        if (!highscoreManager.value) return false
        return highscoreManager.value.isRankingWorthy(history.bestScore)
      })

      const saveScore = () => {
        if (!highscoreManager.value) return

        haveSubmitedScore.value = true
        const highscoreEntry = GameController.getRankingEntry({
          id: rankingId,
          game: game.value,
        })

        highscoreEntry.score = history.bestScore
        highscoreEntry.block = history.highestBlock
        highscoreEntry.run = history.run

        highscoreManager.value.saveScore(highscoreEntry)
      }

      const displayUpgrades = ref(false)

      const route = useRoute()

      if (route.query.load) {
        const slot = route.query.load
        let save
        if (slot === 'last') {
          save = store.getters.lastGame('roguelike')
        } else {
          const saves = store.getters.saves('roguelike')
          save = saves.find((s) => s.filename === slot)
        }
        if (save) handleLoadGame(save)
      }

      return {
        game,
        history,
        rankingId,
        inventory,
        activeItem,
        currentCoins,
        allowShopping,
        rewardsManager,
        displayUpgrades,
        isRankingWorthy,
        highscoreManager,
        haveSubmitedScore,
        allowSquareSelection,
        handleNewGame,
        handleRestart,
        handleRoundOver,
        handleReward,
        handleUpgrade,
        handlePurchase,
        handleSquareSelected,
        handleUseItem,
        handleSaveGame,
        handleLoadGame,
        handleStartOver,
        setUsingItemState,
        saveCurrentGame,
        saveScore,
      }
    },
  }
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
      }
    }

    &__game {
      width: 100%;
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;

      .game {
        padding: $default-spacing;
      }

      @include screen-above(md) {
        display: grid;
        justify-content: center;
        gap: $default-spacing;
        grid-template-columns: min(25%, 250px) auto min(25%, 250px);

        .game {
          padding: $default-spacing * 0.5;
        }
      }

      @include screen-above(xl) {
        grid-template-columns: min(33%, 300px) auto min(33%, 300px);
      }
    }

    &__sidebar {
      $sidebar-container: &;

      padding: $default-spacing * 0.5;

      position: absolute;

      &--title {
        margin-bottom: $default-spacing;
      }

      &--left {
        position: absolute;
        top: 4.3rem + $default-spacing;
        transform: translateX(-50%);
        left: 0;
        z-index: $hud-z-index;
        #{$sidebar-container}--title {
          display: none;
        }

        @include screen-above(sm) {
          transform: none;
        }
        @include screen-above(md) {
          position: initial;
          height: 100%;
          #{$sidebar-container}--title {
            display: block;
          }
        }
      }

      &--right {
        position: fixed;
        top: 0;
        left: 100%;
        background: $bg;
        z-index: $hud-z-index;
        transition: left 0.5s ease-in-out;
        width: 100vw;
        height: 100vh;

        &#{$sidebar-container}--active {
          left: 0;
        }

        #{$sidebar-container}--toggle {
          position: fixed;
          bottom: $default-spacing;
          right: $default-spacing;

          .fa-layers {
            width: 100%;
            height: 100%;
            .fa-chess-board {
              font-size: 1.5em;
            }
            .fa-angles-up {
              position: relative;
              color: white;
              top: 0;
              left: 0.5em;
            }
          }

          @include screen-above(md) {
            display: none;
          }
        }

        @include screen-above(md) {
          position: initial;
          width: 100%;
          height: 100%;
        }
      }

      @include screen-above(md) {
        border: solid 3px $bg-secondary;
        border-radius: $border-radius;
      }
    }
  }
</style>
