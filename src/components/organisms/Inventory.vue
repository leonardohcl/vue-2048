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
      const availableItems = [
        {
          id: 'breakBlock',
          name: 'Break Block',
          icon: 'hammer',
          max: 3,
          blocksRequired: 1,
          price: 100,
        },
        {
          id: 'upgradeBlock',
          name: 'Upgrade Block',
          icon: 'square-plus',
          max: 2,
          blocksRequired: 1,
          price: 1000,
        },
        {
          id: 'shrinkBlock',
          name: 'Shrink Block',
          icon: 'square-minus',
          max: 5,
          blocksRequired: 1,
          price: 250,
        },
        {
          id: 'moveBlock',
          name: 'Move Block',
          icon: 'hand',
          max: 3,
          blocksRequired: 2,
          price: 500,
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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 0;
    gap: $default-spacing * 0.5;
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
  }
</style>
