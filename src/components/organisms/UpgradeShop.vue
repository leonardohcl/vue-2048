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
      const availableUpgrades = [
        {
          id: 'winningBlock',
          icon: [
            { name: 'fa-regular fa-square' },
            {
              name: 'angles-up',
              class: 'text-light position-absolute',
              style: {
                fontSize: '.5em',
                left: 'unset',
                bottom: 'unset',
                top: '-.25em',
              },
            },
          ],
          name: 'Highest Block',
          max: -1,
          price: 5000,
          type: 'block',
        },
        {
          id: 'width',
          icon: 'arrows-left-right',
          name: 'Board Width',
          price: 2500,
          max: 8,
        },
        {
          id: 'height',
          icon: 'arrows-up-down',
          name: 'Board Height',
          price: 2500,
          max: 8,
        },
        {
          id: 'historySize',
          icon: 'brain',
          name: 'Memory Size',
          price: 5000,
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

<style lang="scss" scoped>
  .upgrade-shop {
    list-style: none;
    padding: 0;
    margin: 0;

    .upgrade {
      margin-bottom: calc($default-spacing/2);
    }
  }
</style>
