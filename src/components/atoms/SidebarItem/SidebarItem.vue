<template>
  <component
    :is="tag"
    class="sidebar-item"
    :class="[`sidebar-item__${id}`, active && 'sidebar-item--active']"
  >
    <v-badge
      :content="`${quantity}/${capacity}`"
      color="secondary"
      @click="handleUse"
    >
      <v-progress-circular
        class="sidebar-item__icon rounded-circle"
        :model-value="percentageFull"
        color="secondary"
      >
        <Square v-if="blockIcon >= 0" :value="blockIcon" inline />
        <v-icon
          v-else
          class="fa-fw"
          :icon="icon"
          :color="isFull ? 'secondary' : 'grey-lighten-1'"
        />
      </v-progress-circular>
      <v-btn
        v-if="active"
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
        {{ name }}
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
        :price="price"
        :can-afford="allowPurchase && canAfford"
        @click="handlePurchase"
      />
    </div>
  </component>
</template>

<script lang="ts" setup>
  import PurchaseButton from '@/components/electrons/PurchaseButton/PurchaseButton.vue'
  import { computed } from 'vue'
import Square from '../Square/Square.vue';

  const props = defineProps({
    id: { type: String, required: true },
    name: { type: String, default: '' },
    icon: { type: String, default: 'fas fa-fw fa-star' },
    quantity: { type: Number, default: 0 },
    capacity: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    active: { type: Boolean, default: false },
    allowUse: { type: Boolean, default: false },
    enoughCoins: { type: Boolean, default: false },
    allowPurchase: { type: Boolean, default: false },
    blockIcon: { type: Number, default: -1 },
    tag: { type: String, default: 'div' },
  })

  const emit = defineEmits(['purchase', 'use', 'cancel'])

  const percentageFull = computed(() => (props.quantity / props.capacity) * 100)

  const isFull = computed(() => props.quantity >= props.capacity)

  const canAfford = computed(() => {
    return props.quantity < props.capacity && props.enoughCoins
  })

  const handlePurchase = () => {
    if (canAfford.value) emit('purchase')
  }

  const handleUse = () => {
    if (props.quantity > 0 && props.allowUse) emit('use')
  }

  const handleCancel = () => {
    if (props.active) emit('cancel')
  }
</script>

<style lang="scss">
  .sidebar-item {
    $container: &;

    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    &__icon {
      width: 3em !important;
      height: 3em !important;
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

      }

      .square {
        flex: 0 0 auto;
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
        position: absolute !important;
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
