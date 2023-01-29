<template>
  <ul class="upgrade-shop">
    <Upgrade
      v-for="upgrade in upgrades"
      :key="upgrade.id"
      :upgrade="upgrade"
      :disabled="!allowShopping"
      @purchase="handlePurchase"
    />
  </ul>
</template>

<script>
import GameController from "@/model/2048/GameController";
import Upgrade from "@/components/molecules/Upgrade.vue";
import { computed, reactive } from "vue";
import {
  UpgradeHeight,
  UpgradeHistorySize,
  UpgradeWidth,
  UpgradeWinningBlock,
} from "@/model/upgrades/Upgrade";

export default {
  components: { Upgrade },
  props: {
    game: {
      type: GameController,
      required: true,
    },
    allowShopping: {
      type: Boolean,
      default: true,
    },
  },
  emit: ["upgrade"],
  setup(props, context) {
    const upgradeConfig = reactive({
      /**
       * The prices take in consideration an average of 20 coins
       * per run in the early game and 40 coins in the late game
       **/
      winningBlock: new UpgradeWinningBlock(),
      width: new UpgradeWidth(),
      height: new UpgradeHeight(),
      historySize: new UpgradeHistorySize(),
    });

    const upgrades = computed(() => {
      const available = [
        upgradeConfig.winningBlock,
        upgradeConfig.historySize,
        upgradeConfig.width,
        upgradeConfig.height,
      ];
      return available.map((upgrade) => {
        upgrade.currentValue = props.game[upgrade.id];
        upgrade.updateRank();
        return upgrade;
      });
    });

    const handlePurchase = ({ price, upgrade }) => {
      context.emit("upgrade", {
        price,
        upgrade,
      });
    };

    return { upgrades, handlePurchase };
  },
};
</script>

<style lang="scss">
.upgrade-shop {
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
</style>
