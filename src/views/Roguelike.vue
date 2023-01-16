<template>
  <div class="roguelike">
    <div class="roguelike__title">
      <h1>2048</h1>
      <small class="badge badge-secondary">Roguelike</small>
    </div>
    <div class="roguelike__game">
      <div class="roguelike__left">Lorem ipsum dolor sit amet.</div>
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
          :allow-undo="false"
          restart-text="Give Up"
          @new-game="handleNewGame"
          @restart="game.gameOver = true"
          @win="handleRoundOver"
          @game-over="handleRoundOver"
        />
      </div>
      <div class="roguelike__right border border-secondary rounded">
        <h3 class="text-center text-secondary font-weight-bold m-0">Shop</h3>

        <Shop
          :game="game"
          :disabled="!allowShopping"
          @purchase="handlePurchase"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import GameController from '@/model/2048/GameController'
  import Game from '@/components/organisms/Game.vue'
  import Square from '@/components/atoms/Square.vue'
  import Shop from '@/components/organisms/Shop.vue'
  import { reactive, ref } from 'vue'

  export default {
    components: { Game, Square, Shop },
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

      const handleNewGame = () => {
        allowShopping.value = false
        history.run++
        game.value.start()
      }

      const handleRoundOver = () => {
        allowShopping.value = true
        if (game.value.score > history.bestScore)
          history.bestScore = game.value.score

        if (game.value.board.highestValue > history.highestBlock)
          history.highestBlock = game.value.board.highestValue
      }

      const handlePurchase = purchase => {
        game.value.updateSettings(purchase)
      }

      return {
        game,
        allowShopping,
        history,
        handleNewGame,
        handleRoundOver,
        handlePurchase,
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
  }
</style>
