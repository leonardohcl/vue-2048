<template>
  <div class="roguelike">
    <div class="roguelike__title">
      <h1>2048</h1>
      <small class="badge badge-secondary">Roguelike</small>
    </div>
    <div class="roguelike__game">
      <div class="roguelike__left roguelike__sidebar">
        <h3 class="text-center text-secondary font-weight-bold">Items</h3>
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
          <div class="roguelike__status--entry">Run: {{ history.run }}</div>
          <div class="roguelike__status--entry justify-content-center">
            Best:
            <Square
              class="mx-2"
              :data="{ value: history.highestBlock }"
              inline
            />
          </div>
          <div class="roguelike__status--entry justify-content-end">
            Best Score: {{ history.bestScore }}
          </div>
        </div>
        <Game
          :game="game"
          :allow-endless="false"
          :allow-square-selection="allowSquareSelection"
          disable-pause-screen
          restart-text="Give Up"
          @new-game="handleNewGame"
          @restart="handleRestart"
          @win="handleRoundOver"
          @game-over="handleRoundOver"
          @square-selected="handleSquareSelected"
        />
      </div>
      <div class="roguelike__right roguelike__sidebar">
        <h3 class="text-center text-secondary font-weight-bold">Upgrades</h3>

        <UpgradeShop
          :game="game"
          :allow-shopping="allowShopping"
          @upgrade="handleUpgrade"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import GameController from '@/model/2048/GameController'
  import Item from '@/model/items/Item'
  import Game from '@/components/organisms/Game.vue'
  import Square from '@/components/atoms/Square.vue'
  import UpgradeShop from '@/components/organisms/UpgradeShop.vue'
  import Inventory from '@/components/organisms/Inventory.vue'
  import { reactive, ref } from 'vue'

  export default {
    components: { Game, Square, UpgradeShop, Inventory },
    setup() {
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

      const inventory = ref({})

      const allowSquareSelection = ref(false)

      const activeItem = reactive({
        id: '',
        blocksRequired: 0,
        selectedSquares: [],
      })

      const handleNewGame = () => {
        allowShopping.value = false
        history.run++
        game.value.start()
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

      const handleRestart = () => {
        game.value.gameOver = true
        setUsingItemState(false)
      }

      const handleRoundOver = () => {
        allowShopping.value = true
        if (game.value.score > history.bestScore)
          history.bestScore = game.value.score

        if (game.value.board.highestValue > history.highestBlock)
          history.highestBlock = game.value.board.highestValue
      }

      const handleUpgrade = (purchase) => {
        game.value.updateSettings(purchase)
      }

      const handlePurchase = (itemId) => {
        inventory.value[itemId]
          ? inventory.value[itemId]++
          : (inventory.value[itemId] = 1)
      }

      const handleUseItem = (item) => {
        if (!inventory.value[item.id]) return
        activeItem.id = item.id
        activeItem.blocksRequired = item.blocksRequired
        Item.prepare(Item[item.id], game.value)
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
            Item[itemId],
            game.value,
            activeItem.selectedSquares
          )
          if (!success) return (activeItem.selectedSquares = [])
          inventory.value[itemId]--
          setUsingItemState(false)
        }
      }

      return {
        game,
        allowShopping,
        history,
        inventory,
        activeItem,
        allowSquareSelection,
        handleNewGame,
        handleRestart,
        handleRoundOver,
        handleUpgrade,
        handlePurchase,
        handleSquareSelected,
        handleUseItem,
        setUsingItemState,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .roguelike {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 100vw;
    min-height: 100vh;

    &__title {
      position: relative;
      margin-bottom: 2rem;

      .badge {
        position: absolute;
        right: -5%;
        bottom: 0;
      }
    }

    &__status {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      font-weight: bold;

      &--entry {
        display: flex;
        padding: 1rem 0;
        align-items: center;
      }
    }

    &__game {
      width: 100%;
      display: grid;
      justify-content: center;
      gap: $default-spacing;
      grid-template-columns: min(33%, 250px) auto min(33%, 250px);
    }

    &__sidebar {
      padding: calc($default-spacing/2);
      border: solid 3px $bg-secondary;
      border-radius: $border-radius;
    }
  }
</style>
