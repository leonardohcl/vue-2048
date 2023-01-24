<template>
  <ul class="inventory" :class="{ 'inventory--shopping': allowShopping }">
    <Item
      v-for="item in items"
      :key="item.id"
      :item="item"
      :disabled="activeItem !== '' && item.id !== activeItem"
      :allow-shopping="allowShopping"
      :active="item.id === activeItem"
      @purchase="handlePurchase"
      @cancel="handleCancel"
      @click="handleUseItem(item)"
    />
  </ul>
</template>

<script>
  import Item from '@/components/molecules/Item.vue'
  import { computed } from 'vue'
  export default {
    components: { Item },
    props: {
      inventory: { type: Object, required: true },
      activeItem: { type: String, default: '' },
      allowShopping: {
        type: Boolean,
        default: true,
      },
    },
    emits: ['purchase', 'cancel', 'use'],
    setup(props, context) {
      /**
       * These prices take in consideration an average of 20 coins
       * per run in the early game and 40 coins in the late game
       **/
      const availableItems = [
        {
          id: 'breakBlock',
          name: 'Break Block',
          icon: 'hammer',
          max: 3,
          blocksRequired: 1,
          price: 40,
        },
        {
          id: 'upgradeBlock',
          name: 'Upgrade Block',
          icon: 'square-plus',
          max: 2,
          blocksRequired: 1,
          price: 240,
        },
        {
          id: 'shrinkBlock',
          name: 'Shrink Block',
          icon: 'square-minus',
          max: 5,
          blocksRequired: 1,
          price: 80,
        },
        {
          id: 'moveBlock',
          name: 'Move Block',
          icon: 'hand',
          max: 3,
          blocksRequired: 2,
          price: 400,
        },
      ]

      const items = computed(() =>
        availableItems.map((item) => ({
          ...item,
          current: props.inventory[item.id] || 0,
        }))
      )

      const handlePurchase = (itemId, price) => {
        context.emit('purchase', itemId, price)
      }
      const handleCancel = (itemId) => {
        context.emit('cancel', itemId)
      }
      const handleUseItem = (item) => {
        if (!props.allowShopping) {
          context.emit('use', item)
        }
      }

      return {
        items,
        handlePurchase,
        handleCancel,
        handleUseItem,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .inventory {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: $default-spacing * 0.75;
    align-items: center;
    justify-content: center;
    list-style: none;

    .item {
      flex: 1;
    }

    &--shopping {
      .item {
        cursor: initial;
      }
    }

    @include screen-above(sm) {
      gap: $default-spacing * 1.5;
    }

    @include screen-above(md) {
      display: grid;
      gap: $default-spacing * 0.5;
    }

    @include screen-above(lg) {
      gap: $default-spacing * 0.75;
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
