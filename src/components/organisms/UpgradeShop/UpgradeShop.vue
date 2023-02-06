<template>
  <SidebarMenu
    class="upgrade-shop"
    title="Upgrades"
    :items="upgrades"
    :allow-purchase="allowShopping"
    :inventory="inventory"
    @purchase="handlePurchase"
  />
</template>

<script lang="ts">
import SidebarMenu from "@/components/molecules/SidebarMenu.vue";
import GameController from "@/model/2048 Standard/GameController";
import { computed, defineComponent, reactive } from "vue";
import UPGRADES from "./Upgrades";
import GameSettings from "@/model/2048 Standard/partials/GameSettings";
import Item from "@/model/Game Utils/Item";
import Inventory from "@/model/Game Utils/Inventory";

export default defineComponent({
  components: { SidebarMenu },
  props: {
    game: {
      type: GameController,
      required: true,
    },
    inventory: { type: Inventory, required: true },
    allowShopping: {
      type: Boolean,
      default: false,
    },
  },
  emit: ["upgrade"],
  setup({ game }, context) {
    const upgrades = computed<Item[]>(() => {
      const available = reactive(UPGRADES);
      const gameSettings = new GameSettings(game);

      return available.map((upgrade) => {
        upgrade.setValue(gameSettings[upgrade.id] || 0);
        return (upgrade as any) as Item;
      });
    });

    const handlePurchase = (item: Item) => {
      context.emit("upgrade", item);
    };

    return { upgrades, handlePurchase };
  },
});
</script>
