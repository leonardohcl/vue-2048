<template>
  <li class="upgrade rounded border border-secondary">
    <div class="upgrade__icon rounded text-secondary">
      <FontAwesomeLayers v-if="Array.isArray(upgrade.icon)" class="fa-2x w-100">
        <FontAwesomeIcon
          v-for="icon in upgrade.icon"
          :key="icon.name"
          :icon="icon.name"
          :class="icon.class"
          :style="icon.style"
          fixed-width
        />
      </FontAwesomeLayers>
      <FontAwesomeIcon v-else class="fa-2x" :icon="upgrade.icon" fixed-width />
    </div>
    <div class="upgrade__details">
      <span class="upgrade__name">{{ upgrade.name }}</span>
      <BlockEqualizer
        v-if="upgrade.type === 'block'"
        :allow-decrease="false"
        :current="upgrade.current"
        :disabled="disabled || !canAfford"
        @increase="handleUpdate"
      />
      <BarEqualizer
        v-else-if="upgrade.max > 0"
        :max="upgrade.max"
        :current="upgrade.current"
        :allow-decrease="false"
        :disabled="disabled || !canAfford"
        @increase="handleUpdate"
      />
      <div
        class="upgrade__price--container"
        v-if="upgrade.max !== upgrade.current"
      >
        <PriceIndicator
          class="upgrade__price"
          :price="upgrade.price"
          :can-afford="canAfford && !disabled"
        />
      </div>
    </div>
  </li>
</template>

<script>
  import BarEqualizer from '@/components/atoms/BarEqualizer.vue'
  import BlockEqualizer from '@/components/atoms/BlockEqualizer.vue'
  import PriceIndicator from '@/components/atoms/PriceIndicator.vue'
  import { computed } from 'vue'
  import { useStore } from 'vuex'

  export default {
    components: {
      BarEqualizer,
      BlockEqualizer,
      PriceIndicator,
    },
    emits: ['update'],
    props: {
      upgrade: {
        type: Object,
        required: true,
        validate: (obj) => {
          if (!obj.id || !obj.name || !obj.max || !obj.current || !obj.price)
            return false
          return true
        },
      },
      disabled: { type: Boolean, default: false },
    },
    setup(props, context) {
      const store = useStore()

      const currentCoins = computed(() => store.getters.currentCoins)

      const canAfford = computed(
        () => currentCoins.value >= props.upgrade.price
      )

      const handleUpdate = () => {
        if (canAfford.value)
          context.emit(
            'update',
            {
              [props.upgrade.id]:
                props.type === 'block'
                  ? props.upgrade.current * 2
                  : props.upgrade.current + 1,
            },
            props.upgrade.price
          )
      }

      return { canAfford, handleUpdate }
    },
  }
</script>

<style lang="scss" scoped>
  .upgrade {
    $container: &;

    display: flex;
    align-items: center;
    width: 100%;

    transition: background-color 0.2s;
    background-color: fade-out($bg-secondary, 0.75);
    padding: calc($default-spacing/4);

    &__icon {
      width: 3em;
      height: 3em;
      background: $bg;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      transition: box-shadow 0.2s;
      box-shadow: 0 0 0 0 $secondary;

      @include screen-above(md) {
        display: none;
      }
      @include screen-above(lg) {
        display: flex;
      }
    }

    &__details {
      padding: 0 calc($default-spacing/4);
      flex: 3;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    &__name {
      display: block;
      font-weight: bold;
    }

    &__price {
      &--container {
        width: 100%;
        text-align: right;
      }
    }
  }
</style>
