<template>
  <SidebarMenu
    class="upgrade-shop"
    title="Upgrades"
    :items="upgrades"
    :allow-purchase="allowShopping"
    @purchase="handlePurchase"
  />
</template>

<script lang="ts">
import SidebarMenu from "@/components/molecules/SidebarMenu.vue";
import GameController from "@/model/2048/GameController";
import { computed, defineComponent, reactive } from "vue";
import UPGRADES from "./Upgrades";
import GameSettings from "@/model/2048/interfaces/GameSettings";
import Item from "@/model/Game Utils/Item";

export default defineComponent({
  components: { SidebarMenu },
  props: {
    game: {
      type: GameController,
      required: true,
    },
    allowShopping: {
      type: Boolean,
      default: false,
    },
  },
  emit: ["upgrade"],
  setup({ game }, context) {
    const upgrades = computed(() => {
      const available = reactive(UPGRADES);
      const gameSettings = new GameSettings(game);

      return available.map((upgrade) => {
        upgrade.setCurrentValue(gameSettings[upgrade.id]);
        return upgrade;
      });
    });

    const handlePurchase = (item: Item) => {
      context.emit("upgrade", {
        price: item.currentPrice,
        upgrade: { [item.id]: item.nextValue },
      });
    };

    return { upgrades, handlePurchase };
  },
});
</script>
