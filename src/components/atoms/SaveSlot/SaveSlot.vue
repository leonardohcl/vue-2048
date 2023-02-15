<template>
  <component
    :is="tag"
    class="save-slot"
    :class="[isEmpty ? 'save-slot--empty' : `border--${theme} glow--${theme}`]"
    @click="$emit('select', slotName)"
  >
    <span class="save-slot--title" :class="{ [`text--${theme}`]: !isEmpty }">
      {{ slotName }}
    </span>
    <div class="save-slot--details" v-if="isEmpty">EMPTY SLOT</div>
    <div class="save-slot--details" v-else>
      <Square inline :value="block" />
      <div class="save-slot--currency">
        <DataChip theme="score" class="justify-center mx-auto" :value="score" />
        <DataChip v-if="isRoguelike" theme="run" :value="run" />
        <DataChip v-if="isRoguelike" theme="coins" :value="coins" />
      </div>
      <span class="save-slot--shape">
        {{ boardWidth }} x {{ boardHeight }}</span
      >
    </div>
  </component>
</template>

<script lang="ts">
  import DataChip from '@/components/electrons/DataChip/DataChip.vue'
  import Square from '@/components/atoms/Square/Square.vue'
  import { MemoryCardMode } from '@/model/Game Utils/MemoryCard'

  export default {
    components: {
      DataChip,
      Square,
    },
    props: {
      tag: { type: String, default: 'li' },
      theme: { type: String, default: 'primary' },
      slotName: { type: String, required: true },
      score: { type: Number, default: 0 },
      block: { type: Number, default: 0 },
      coins: { type: Number, default: 0 },
      boardWidth: { type: Number, default: 0 },
      boardHeight: { type: Number, default: 0 },
      run: { type: Number, default: 0 },
      isEmpty: { type: Boolean, default: false },
      isRoguelike: { type: Boolean, default: false },
    },
    emits: ['select'],
  }
</script>

<style lang="scss">
  .save-slot {
    $slot: &;

    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-width: 2px;
    border-style: solid;
    padding: $default-spacing * 0.5;
    margin-bottom: $default-spacing * 0.5;
    border-radius: $border-radius;
    display: flex;
    box-shadow: 0 0 0 0 $secondary;
    transition: box-shadow 0.1s ease;

    &--title {
      text-transform: uppercase;
      font-weight: bold;
      font-size: 1.1em;
      flex-shrink: 0;
    }

    &--details {
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }

    &--currency {
      display: grid;
      gap: $default-spacing * 0.25;
      justify-content: center;
      align-items: center;
      grid-template-columns: repeat(2, auto);

      .DataChip {
        max-width: unset;
      }

      & > * {
        &:only-child,
        &:first-child:nth-last-child(2),
        &:first-child:nth-last-child(3),
        &:last-child:nth-child(2) {
          grid-column: 1/3;
        }
      }
    }

    &--score {
      font-weight: bold;
    }

    &--coins {
      justify-content: center;
    }

    &--empty {
      font-weight: bold;
      text-align: center;
      color: fade-out($text-color, 0.5);

      #{$slot}--title {
        color: inherit;
      }

      &#{$slot}--load {
        cursor: initial;
        box-shadow: none !important;
      }
    }
  }
</style>
