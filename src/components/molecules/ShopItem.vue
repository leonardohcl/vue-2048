<template>
  <li class="shop-item rounded border border-secondary">
    <div class="shop-item__icon rounded text-secondary">
      <FontAwesomeLayers v-if="Array.isArray(item.icon)" class="fa-2x w-100">
        <FontAwesomeIcon
          v-for="icon in item.icon"
          :key="icon.name"
          :icon="icon.name"
          :class="icon.class"
          :style="icon.style"
          fixed-width
        />
      </FontAwesomeLayers>
      <FontAwesomeIcon v-else class="fa-2x" :icon="item.icon" fixed-width />
    </div>
    <div class="shop-item__details">
      <span class="shop-item__name">{{ item.name }}</span>
      <BlockEqualizer
        v-if="item.type === 'block'"
        :allow-decrease="false"
        :current="item.current"
        @increase="$emit('update', { [item.id]: item.current * 2 })"

      />
      <BarEqualizer
        v-else-if="item.max > 0"
        :max="item.max"
        :current="item.current"
        :allow-decrease="false"
        :disabled="disabled"
        @increase="$emit('update', { [item.id]: item.current + 1 })"
      />
    </div>
  </li>
</template>

<script>
  import BarEqualizer from '@/components/atoms/BarEqualizer.vue'
  import BlockEqualizer from '@/components/atoms/BlockEqualizer.vue'
  export default {
    components: {
      BarEqualizer,
      BlockEqualizer,
    },
    emits: ['update'],
    props: {
      item: {
        type: Object,
        required: true,
        validate: (obj) => {
          if (!obj.id || !obj.name || !obj.max || !obj.current) return false
          return true
        },
      },
      disabled: { type: Boolean, default: false },
    },
  }
</script>

<style lang="scss" scoped>
  .shop-item {
    $container: &;

    display: flex;
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
  }
</style>
