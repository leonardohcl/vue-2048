<template>
  <component
    :is="tag"
    class="item"
    :class="{
      'item--empty': item.current <= 0,
      'item--active': active,
      'item--disabled': disabled && !active,
      'item--shopping': allowShopping,
    }"
  >
    <v-badge
      :content="`${item.current}/${item.max}`"
      color="secondary"
      @click="handleClick"
    >
      <v-progress-circular
        class="item__icon rounded-circle"
        :model-value="(100 * item.current) / item.max"
        color="secondary"
      >
        <v-icon class="fa-fw" :icon="item.icon" color="grey-lighten-1" />
      </v-progress-circular>
      <v-btn
        v-if="!disabled && active"
        class="item__btn item__btn--cancel"
        icon="fas fa-circle-xmark"
        color="error"
        size="small"
        variant="text"
        @click.stop="$emit('cancel', item.id)"
      />
    </v-badge>
    <div class="item__details">
      {{ item.name }}
    </div>
    <PurchaseButton
      class="item__price"
      :class="{ 'item__price--affordable': canAfford && !disabled }"
      :price="item.price"
      :can-afford="canAfford && allowShopping && item.current < item.max"
      @click="handlePurchase"
    />
  </component>
</template>

<script>
import PurchaseButton from "@/components/atoms/PurchaseButton.vue";
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  components: { PurchaseButton },
  props: {
    item: {
      type: Object,
      required: true,
      validate: (obj) => {
        if (!obj.id || !obj.name || !obj.max || !obj.current || !obj.price)
          return false;
        return true;
      },
    },
    tag: {
      type: String,
      default: "li",
    },
    active: {
      type: Boolean,
      default: false,
    },
    allowShopping: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["purchase", "click", "cancel"],
  setup(props, context) {
    const store = useStore();

    const currentCoins = computed(() => store.getters.currentCoins);

    const canAfford = computed(() => currentCoins.value >= props.item.price);

    const canPurchase = computed(() => {
      return !props.disabled && props.allowShopping && canAfford.value;
    });

    const handleClick = (evt) => {
      if (!props.disabled) context.emit("click", evt);
    };

    const handlePurchase = () => {
      if (canAfford.value)
        context.emit("purchase", props.item.id, props.item.price);
    };

    return {
      canAfford,
      canPurchase,
      handleClick,
      handlePurchase,
    };
  },
};
</script>

<style lang="scss">
.item {
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
  }

  &__btn {
    &--cancel {
      position: absolute;
      left: 0;
      bottom: 0;
      transform: translate(-25%, 25%);
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

  &__details {
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-break: none;
    display: none;
    text-align: center;
    @include screen-above(md) {
      display: block;
    }
  }

  &--empty,
  &--disabled {
    cursor: initial;
    #{$container}__icon {
      color: $bg-secondary !important;
      background: $bg;
      border-color: $bg-secondary;
      background-image: none !important;
    }
  }

  &--active {
    #{$container}__icon {
      animation: glow 0.5s ease-in-out;
      animation-iteration-count: infinite;
      animation-direction: alternate;
    }
  }

  &--shopping {
    cursor: initial;
  }

  .v-badge__badge {
    display: none;

    @include screen-above(sm) {
      display: block;
    }
  }
}

@keyframes glow {
  0% {
    box-shadow: 0 0 6px 0 $secondary;
  }
  100% {
    box-shadow: 0 0 6px 3px $secondary;
  }
}
</style>
