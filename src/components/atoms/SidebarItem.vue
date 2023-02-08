<template>
  <component
    :is="tag"
    class="sidebar-item"
    :class="[`sidebar-item__${item.id}`, active && 'sidebar-item--active']"
  >
    <v-badge
      :content="`${item.quantity}/${item.capacity}`"
      color="secondary"
      @click="handleUse"
    >
      <v-progress-circular
        class="sidebar-item__icon rounded-circle"
        :model-value="item.percentageFull"
        color="secondary"
      >
        <Square
          v-if="item.icon === '<Square/>'"
          :value="(item as UpgradeItem).currentValue"
          inline
        />
        <v-icon
          v-else
          class="fa-fw"
          :icon="item.icon"
          :color="isFull ? 'secondary' : 'grey-lighten-1'"
        />
      </v-progress-circular>
      <v-btn
        v-if="active && allowUse"
        class="sidebar-item__btn sidebar-item__btn--cancel"
        icon="fas fa-circle-xmark"
        color="error"
        size="small"
        variant="text"
        @click.stop="handleCancel"
      />
    </v-badge>

    <div class="sidebar-item__details">
      <span class="sidebar-item__name">
        {{ item.name }}
      </span>
      <v-chip
        v-if="isFull"
        class="sidebar-item__price"
        color="secondary"
        size="small"
        >MAX</v-chip
      >
      <PurchaseButton
        v-else
        class="sidebar-item__price"
        :class="{
          'sidebar-item__price--affordable': allowPurchase && canAfford,
        }"
        :price="item.price"
        :can-afford="allowPurchase && canAfford"
        @click="handlePurchase"
      />
    </div>
  </component>
</template>

<script lang="ts">
  import PurchaseButton from './PurchaseButton.vue'
  import Square from './Square.vue'
  import { computed, defineComponent } from 'vue'
  import Item from '@/model/Game Utils/Item/Item'
  import UpgradeItem from '@/model/Game Utils/Item/Upgrade/Upgrade'

  export default defineComponent({
    components: { Square, PurchaseButton },
    props: {
      item: { type: Item, required: true },
      coins: { type: Number, default: 0 },
      active: { type: Boolean, default: false },
      allowUse: { type: Boolean, default: false },
      allowPurchase: { type: Boolean, default: false },
      tag: { type: String, default: 'div' },
    },
    emits: ['purchase', 'use', 'cancel'],
    setup(props, { emit }) {
      const isFull = computed(() => props.item.quantity >= props.item.capacity)

      const canAfford = computed(() => {
        return (
          props.item.quantity < props.item.capacity &&
          props.coins >= props.item.price
        )
      })

      const handlePurchase = () => {
        if (canAfford.value) emit('purchase', props.item)
      }

      const handleUse = () => {
        if (props.item.quantity > 0 && props.allowUse) emit('use', props.item)
      }

      const handleCancel = () => {
        if (props.active) emit('cancel', props.item)
      }

      return {
        isFull,
        canAfford,
        handleUse,
        handleCancel,
        handlePurchase,
      }
    },
  })
</script>

<style lang="scss">
  .sidebar-item {
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
        flex: 0 0 auto;
        width: 2rem;
        height: 2rem;

        @include screen-above(md) {
          width: 3rem;
          height: 3rem;
        }
      }
    }

    &__details {
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
      transform: scale(0.75);

      &--affordable {
        display: flex;
      }
    }

    &__btn {
      &--cancel {
        position: absolute;
        left: 0;
        bottom: 0;
        transform: translate(-30%, 30%);

        @include screen-above(sm) {
          transform: translate(-40%, 40%);
        }
      }
    }

    &--active {
      #{$container}__icon {
        animation: glow 0.5s ease-in-out;
        animation-iteration-count: infinite;
        animation-direction: alternate;
      }
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
