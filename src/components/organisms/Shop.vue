<template>
  <ul class="shop">
    <ShopItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      :disabled="disabled"
      @update="handlePurchase"
    />

  </ul>
</template>

<script>
  import GameController from '@/model/2048/GameController'
  import ShopItem from '@/components/molecules/ShopItem.vue'
  import { computed } from 'vue'

  export default {
    components: { ShopItem },
    props: {
      game: {
        type: GameController,
        required: true,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    setup(props, context) {
      const attrs = [
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
          type: 'block',
        },
        { id: 'width', icon: 'arrows-left-right', name: 'Board Width', max: 8 },
        { id: 'height', icon: 'arrows-up-down', name: 'Board Height', max: 8 },
        { id: 'historySize', icon: 'brain', name: 'Memory Size', max: 5 },
      ]

      const items = computed(() =>
        attrs.map((attr) => ({ ...attr, current: props.game[attr.id] }))
      )

      const handlePurchase = (item) => context.emit('purchase', item)

      return { items, handlePurchase }
    },
  }
</script>

<style lang="scss" scoped>
  .shop {
    list-style: none;
    padding: calc($default-spacing/2);
    margin: 0;

    &-item {
      margin-bottom: calc($default-spacing/2);
    }
  }
</style>
