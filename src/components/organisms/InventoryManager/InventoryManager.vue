<template>
  <SidebarMenu
    class="inventory"
    title="Items"
    :items="items"
    :disabled="!allowShopping"
    :active-item="inventory.activeItem"
    :allow-purchase="allowShopping"
    :allow-use="allowUse"
    :inventory="inventory"
    @use="handleUse"
    @cancel="handleCancel"
    @purchase="handlePurchase"
  />
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import Inventory from "@/model/roguelike/Inventory";
import SidebarMenu from "@/components/molecules/SidebarMenu.vue";
import ITEMS from "./Items";
import ConsumableItem from "@/model/Game Utils/ConsumableItem";

export default defineComponent({
  components: { SidebarMenu },
  props: {
    inventory: { type: Inventory, required: true },
    allowShopping: {
      type: Boolean,
      default: false,
    },
    allowUse: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["purchase", "cancel", "use"],
  setup({ inventory }, context) {
    const availableItems = reactive(ITEMS);

    const items = computed(() =>
      availableItems.map((item) => {
        item.setCurrentValue(inventory.bag[item.id]);
        return item;
      })
    );

    const handlePurchase = (item: ConsumableItem) => {
      context.emit("purchase", {
        price: item.currentPrice,
        id: item.id,
      });
    };

    const handleUse = (item: ConsumableItem) => {
      context.emit("use", item);
    };

    const handleCancel = () => {
      context.emit("cancel");
    };

    return {
      items,
      handleUse,
      handleCancel,
      handlePurchase,
    };
  },
});
</script>
