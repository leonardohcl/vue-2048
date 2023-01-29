<template>
  <li class="upgrade" position="bottom end">
    <v-badge :content="`${upgrade.rank}/${upgrade.maxRank}`" color="secondary">
      <v-progress-circular
        class="upgrade__icon rounded-circle"
        :model-value="upgradeProgress"
        color="secondary"
      >
        <Square v-if="upgrade.type === 'block'" :value="upgrade.currentValue" />
        <v-icon
          v-else
          class="fa-fw"
          :icon="upgrade.icon"
          :color="isMax ? 'secondary' : 'grey-lighten-1'"
        />
      </v-progress-circular>
    </v-badge>
    <div class="upgrade__details">
      <span class="upgrade__name">{{ upgrade.name }}</span>
      <v-chip class="upgrade__price" v-if="isMax" color="secondary" size="small"
        >MAX</v-chip
      >
      <PurchaseButton
        v-else
        class="upgrade__price"
        :class="{ 'upgrade__price--affordable': canAfford && !disabled }"
        :price="currentPrice"
        :can-afford="canAfford && !disabled"
        @click="handlePurchase"
      />
    </div>
  </li>
</template>

<script>
import Square from "@/components/atoms/Square.vue";
import { Upgrade } from "@/model/upgrades/Upgrade";
import PurchaseButton from "@/components/atoms/PurchaseButton.vue";
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    Square,
    PurchaseButton,
  },
  emits: ["purchase"],
  props: {
    upgrade: {
      type: Upgrade,
      required: true,
      validate: (obj) => {
        if (!obj.id || !obj.name || !obj.max || !obj.current || !obj.price)
          return false;
        return true;
      },
    },
    disabled: { type: Boolean, default: false },
  },
  setup(props, context) {
    const store = useStore();

    const currentCoins = computed(() => store.getters.currentCoins);

    const currentPrice = computed(
      () =>
        props.upgrade.price[props.upgrade.rank] ||
        props.upgrade.defaultPrice ||
        0
    );

    const upgradeProgress = computed(
      () => 100 * (props.upgrade.rank / props.upgrade.maxRank)
    );

    const canAfford = computed(() => currentCoins.value >= currentPrice.value);

    const isMax = computed(() => props.upgrade.rank >= props.upgrade.maxRank);
    const handlePurchase = () => {
      context.emit("purchase", {
        price: currentPrice.value,
        upgrade: {
          [props.upgrade.id]: props.upgrade.getNextValue(
            props.upgrade.currentValue
          ),
        },
      });
    };

    return { canAfford, isMax, currentPrice, upgradeProgress, handlePurchase };
  },
};
</script>

<style lang="scss">
.upgrade {
  $container: &;

  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  &__icon {
    width: 3em;
    height: 3em;
    background: $bg;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    box-shadow: 0 0 0 0 $secondary;

    @include screen-above(md) {
      width: 5rem;
      height: 5rem;
    }
    i {
      font-size: 1.2em;
      margin: 0 2px 2px 0;

      @include screen-above(sm) {
        font-size: 1.5em;
      }
      @include screen-above(md) {
        font-size: 2em;
      }
    }

    .square {
      width: 1rem;
      height: 1rem;

      @include screen-above(sm) {
        width: 2rem;
        height: 2rem;
      }
      @include screen-above(md) {
        width: 3rem;
        height: 3rem;
      }
    }
  }

  &__details {
    padding: 0 $default-spacing * 0.25;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  &__name {
    display: none;
    flex-shrink: 0;
    width: 100%;
    font-size: 0.9em;
    text-align: center;
    font-weight: bold;
    grid-column: 1/3;

    @include screen-above(md) {
      display: initial;
    }
  }

  &__price {
    display: none;
    transform: scale(0.75);

    &--affordable {
      display: flex;
    }

    @include screen-above(sm) {
      display: flex;
    }
    @include screen-above(md) {
      transform: none;
    }
  }

  .v-badge__badge {
    display: none;

    @include screen-above(sm) {
      display: block;
    }
  }
}
</style>
