<template>
  <ul class="upgrade-shop">
    <Upgrade
      v-for="upgrade in upgrades"
      :key="upgrade.id"
      :upgrade="upgrade"
      :disabled="!allowShopping"
      @update="handlePurchase"
    />
  </ul>
</template>

<script>
  import GameController from '@/model/2048/GameController'
  import Upgrade from '@/components/molecules/Upgrade.vue'
  import { computed } from 'vue'

  export default {
    components: { Upgrade },
    props: {
      game: {
        type: GameController,
        required: true,
      },
      allowShopping: {
        type: Boolean,
        default: true,
      },
    },
    setup(props, context) {
      /**
       * These prices take in consideration an average of 20 coins
       * per run in the early game and 40 coins in the late game
       **/
      const availableUpgrades = [
        {
          id: 'winningBlock',
          icon: [
            { icon: ['far', 'square'] },
            {
              icon: 'angles-up',
              transform: 'shrink-8 right-5',
              class: 'text-light',
            },
          ],
          name: 'Highest Block',
          max: 65536,
          price: { 64: 45, 128: 175, 256: 325, 512: 415, default: 500 },
          type: 'block',
        },
        {
          id: 'width',
          icon: 'arrows-left-right',
          name: 'Board Width',
          price: [0, 0, 0, 150, 350, 600, 750, 900],
          max: 8,
        },
        {
          id: 'height',
          icon: 'arrows-up-down',
          name: 'Board Height',
          price: [0, 0, 0, 150, 350, 600, 750, 900],
          max: 8,
        },
        {
          id: 'historySize',
          icon: 'brain',
          name: 'Memory Size',
          price: [500, 750, 750, 1000, 1000],
          max: 5,
        },
      ]

      const upgrades = computed(() =>
        availableUpgrades.map((up) => ({ ...up, current: props.game[up.id] }))
      )

      const handlePurchase = (upgrade, price) =>
        context.emit('upgrade', upgrade, price)

      return { upgrades, handlePurchase }
    },
  }
</script>

<style lang="scss">
  .upgrade-shop {
    list-style: none;
    padding: 0;
    margin: 0;

    @include screen-above(sm) {
      display: grid;
      gap: $default-spacing * 0.5;
      grid-template-columns: repeat(2, 1fr);
    }

    @include screen-above(md) {
      grid-template-columns: auto;
    }
  }
</style>
