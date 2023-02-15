<template>
  <div class="sidebar-menu">
    <component
      v-if="title"
      :is="titleTag"
      class="sidebar-menu__title text-center text-secondary font-weight-bold"
    >
      {{ title }}
    </component>
    <component :is="contentTag" class="sidebar-menu__content">
      <SidebarItem
        v-for="item in items"
        :key="item.id"
        :id="item.id"
        :name="item.name"
        :capacity="item.capacity"
        :quantity="item.quantity"
        :icon="item.icon"
        :price="item.price"
        :block-icon="getItemBlock(item)"
        :enough-coins="getEnoughCoins(item)"
        :allow-use="allowUse"
        :allow-purchase="allowPurchase"
        :active="item === activeItem"
        @use="handleUse(item)"
        @cancel="handleCancel(item)"
        @purchase="handlePurchase(item)"
      />
    </component>
  </div>
</template>

<script lang="ts" setup>
  import SidebarItem from '@/components/atoms/SidebarItem/SidebarItem.vue'
  import ConsumableItem from '@/model/Game Utils/Item/ConsumableItem'
  import Item from '@/model/Game Utils/Item/Item'
  import WinningBlockUpgrade from '@/model/Game Utils/Item/Upgrade/WinningBlocks'

  const props = defineProps({
    title: { type: String },
    items: {
      default: () => new Array<Item>(),
    },
    coins: { type: Number, required: true },
    activeItem: { type: Item, required: false },
    allowUse: { type: Boolean, default: false },
    allowPurchase: { type: Boolean, default: false },
    titleTag: { type: String, default: 'h3' },
    contentTag: { type: String, default: 'div' },
  })

  const emit = defineEmits(['purchase', 'use', 'cancel'])

  function handlePurchase(item: Item) {
    emit('purchase', item)
  }

  function handleUse(item: Item) {
    emit('use', item)
  }
  function handleCancel(item: Item) {
    emit('cancel', item)
  }

  function getEnoughCoins(item: Item) {
    return item.price <= props.coins
  }

  function getItemBlock(item: Item) {
    if (item instanceof WinningBlockUpgrade)
      return (item as WinningBlockUpgrade).currentValue
    return -1
  }
</script>

<style lang="scss">
  .sidebar-menu {
    flex-basis: 10%;

    @include screen-above(md) {
      flex-basis: 25%;
      padding: $default-spacing * 0.5 $default-spacing * 0.25;
      max-width: 300px;
      border: solid 3px $bg-secondary;
      border-radius: $border-radius;
    }

    @include screen-above(lg) {
      flex-basis: 30%;
    }

    &__title {
      display: none;
      margin-bottom: $default-spacing;
      @include screen-above(md) {
        display: block;
      }
    }

    &__content {
      display: grid;
      list-style: none;
      padding: 0;
      margin: 0;
      gap: $default-spacing * 0.5;

      @include screen-above(md) {
        gap: $default-spacing * 0.75;
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
</style>
