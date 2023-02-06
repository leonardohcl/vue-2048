<template>
  <SidebarMenu
    class="upgrade-shop"
    title="Upgrades"
    :coins="game.inventory.wallet.coins"
    :items="upgrades"
    :allow-purchase="!game.isRunning"
    @purchase="handlePurchase"
  />
</template>

<script lang="ts">
import SidebarMenu from "@/components/molecules/SidebarMenu.vue";
import { computed, defineComponent } from "vue";
import UpgradeItem from "@/model/Game Utils/Item/Upgrade/Upgrade";
import WinningBlockUpgrade from "@/model/Game Utils/Item/Upgrade/WinningBlocks";
import MemoryCapacityUpgrade from "@/model/Game Utils/Item/Upgrade/MemoryCapacity";
import WidthUpgrade from "@/model/Game Utils/Item/Upgrade/Width";
import HeightUpgrade from "@/model/Game Utils/Item/Upgrade/Height";
import RoguelikeGameController from "@/model/2048 Roguelike/GameController";

export default defineComponent({
  components: { SidebarMenu },
  props: {
    game: {
      type: RoguelikeGameController,
      required: true,
    },
  },
  setup(props) {
    const upgrades = computed(() => {
      /**
       * These are the upgrades available for the current game design,
       *
       * Their prices take in consideration an average of 20 coins
       * per run in the early game and 40 coins in the late game
       **/
      const list = [
        new WinningBlockUpgrade(),
        new MemoryCapacityUpgrade(),
        new WidthUpgrade(),
        new HeightUpgrade(),
      ];

      return list.map((item) => props.game.inventory.limitedUseItems[item.id]);
    });

    const handlePurchase = (item: UpgradeItem) => {
      props.game.inventory.buyItem(item, props.game);
    };

    return { upgrades, handlePurchase };
  },
});
</script>
