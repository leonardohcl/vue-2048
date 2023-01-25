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
  import Inventory from '@/model/roguelike/Inventory'
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
      const items = computed(() =>
        Inventory.availableItems.map((item) => ({
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

<style lang="scss">
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
