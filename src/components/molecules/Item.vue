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
    <div class="item__icon--container">
      <div class="item__icon" @click="handleClick">
        <FontAwesomeIcon class="fa-2x" :icon="item.icon" fixed-width />
      </div>
      <span class="badge badge-dark badge-pill item__capacity">
        {{ item.current }}/{{ item.max }}
      </span>
      <PriceIndicator
        class="item__price"
        :price="item.price"
        :can-afford="canAfford && allowShopping"
      />
    </div>
    <Btn
      v-if="allowShopping && item.current < item.max"
      :disabled="!canPurchase"
      class="item__btn item__btn--purchase"
      icon="fa-plus-square"
      is-icon
      outlined
      @click="handlePurchase"
    />
    <Btn
      v-if="!disabled && active"
      class="item__btn item__btn--cancel"
      icon="fa-circle-xmark"
      is-icon
      outlined
      theme="danger"
      @click="$emit('cancel', item.id)"
    />

    <div class="item__details">
      {{ item.name }}
    </div>
  </component>
</template>

<script>
  import Btn from '@/components/atoms/Btn.vue'
  import PriceIndicator from '@/components/atoms/PriceIndicator.vue'
  import { computed } from 'vue'
  import { useStore } from 'vuex'

  export default {
    components: { Btn, PriceIndicator },
    props: {
      item: {
        type: Object,
        required: true,
        validate: (obj) => {
          if (!obj.id || !obj.name || !obj.max || !obj.current || !obj.price)
            return false
          return true
        },
      },
      tag: {
        type: String,
        default: 'li',
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
    emits: ['purchase', 'click'],
    setup(props, context) {
      const store = useStore()

      const currentCoins = computed(() => store.getters.currentCoins)

      const canAfford = computed(() => currentCoins.value >= props.item.price)

      const canPurchase = computed(() => {
        return !props.disabled && props.allowShopping && canAfford.value
      })

      const handleClick = (evt) => {
        if (!props.disabled) context.emit('click', evt)
      }

      const handlePurchase = () => {
        if (canAfford.value)
          context.emit('purchase', props.item.id, props.item.price)
      }

      return {
        canAfford,
        canPurchase,
        handleClick,
        handlePurchase,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .item {
    $container: &;

    padding: 0;
    position: relative;
    cursor: pointer;

    &__icon {
      font-size: 0.75em;
      color: $secondary;
      border-radius: 50%;
      padding: 1em;
      border: 3px solid $secondary;
      background: $bg;

      @include screen-above(sm) {
        font-size: 1em;
      }

      @include screen-above(md) {
        font-size: 0.9em;
        background-image: linear-gradient(
          45deg,
          fade-out($bg-secondary, 0.25) 0%,
          fade-out($secondary, 0.9) 100%
        );
      }

      &--container {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }

    &__capacity {
      position: absolute;
      left: 0;
      top: -0.5em;

      @include screen-above(md) {
        top: unset;
        bottom: 0;
      }
    }

    &__price {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -0.5em;

      @include screen-above(md) {
        display: block;
        bottom: 0;
        left: unset;
      }
    }

    &__btn {
      position: absolute;
      font-size: 1.5rem;
      &--purchase {
        top: -0.5em;
        right: -0.5em;

        @include screen-above(md) {
          top: 0;
          right: 0;
        }
      }
      &--cancel {
        left: -0.5em;
        bottom: -0.5em;
        @include screen-above(md) {
          left: 0;
          top: 0;
        }
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

      #{$container} {
        &__price {
          display: block;
        }
      }
    }

    &:hover {
      #{$container} {
        &__icon {
          color: lighten($secondary, 20%);
          background-image: linear-gradient(
            45deg,
            fade-out($secondary, 0.5) 0%,
            fade-out($bg-secondary, 0.25) 100%
          );
        }
      }
    }

    @include screen-above(md) {
      font-size: 1rem;
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
