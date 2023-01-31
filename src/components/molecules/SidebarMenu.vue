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
        :item="item"
        :available-coins="availableCoins"
        :allow-use="allowUse"
        :allow-purchase="allowPurchase"
        :active="item === activeItem"
        @use="handleUse"
        @cancel="handleCancel"
        @purchase="handlePurchase"
      />
    </component>
  </div>
</template>

<script lang="ts">
import SidebarItem from "@/components/atoms/SidebarItem.vue";
import Item from "@/model/Game Utils/Item";
import Inventory from "@/model/roguelike/Inventory";
import { defineComponent, computed, PropType } from "@vue/runtime-core";

export default defineComponent({
  components: { SidebarItem },
  props: {
    title: { type: String },
    items: {
      type: Array as PropType<Array<Item>>,
      default: () => new Array<Item>(),
    },
    inventory: { type: Inventory, default: () => null },
    activeItem: { type: Item, required: false },
    allowUse: { type: Boolean, default: false },
    allowPurchase: { type: Boolean, default: false },
    titleTag: { type: String, default: "h3" },
    contentTag: { type: String, default: "div" },
  },
  emits: ["purchase", "use", "cancel"],
  setup(props, { emit }) {
    const availableCoins = computed(() => props.inventory?.wallet.coins ?? 0);

    const handlePurchase = (item: Item) => {
      emit("purchase", item);
    };

    const handleUse = (item: Item) => {
      emit("use", item);
    };
    const handleCancel = (item: Item) => {
      emit("cancel", item);
    };

    return {
      availableCoins,
      handleUse,
      handleCancel,
      handlePurchase,
    };
  },
});
</script>

<style lang="scss">
.sidebar-menu {
  padding: $default-spacing * 0.25;
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
