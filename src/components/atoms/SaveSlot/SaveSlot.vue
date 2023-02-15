<template>
  <component
    :is="tag"
    class="save-slot"
    :class="[
      !save ? 'save-slot--empty' : `border--${theme} glow--${theme}`,
      `save-slot--${mode}`,
    ]"
    @click="$emit('select', slotName)"
  >
    <span class="save-slot--title" :class="{ [`text--${theme}`]: save }">
      {{ slotName }}
    </span>
    <div class="save-slot--details" v-if="!save">EMPTY SLOT</div>
    <div class="save-slot--details" v-else>
      <Square
        inline
        :value="
          roguelikeSave
            ? roguelikeSave.bestRun.highestBlock
            : save.progress.highestBlock
        "
      />
      <div class="save-slot--currency">
        <DataChip
          theme="score"
          class="justify-center mx-auto"
          :value="roguelikeSave?.bestRun?.score || save.progress.score"
        />
        <DataChip
          v-if="roguelikeSave"
          theme="run"
          :value="roguelikeSave?.progress.run"
        />
        <DataChip
          v-if="roguelikeSave"
          theme="coins"
          :value="roguelikeSave.inventory.coins"
        />
      </div>
      <span class="save-slot--shape">
        {{ save.settings.width }} x {{ save.settings.height }}</span
      >
    </div>
  </component>
</template>

<script lang="ts">
  import DataChip from '@/components/electrons/DataChip/DataChip.vue'
  import SaveFile from '@/model/Game Utils/SaveFile/SaveFile'
  import RoguelikeSaveFile from '@/model/Game Utils/SaveFile/RoguelikeSaveFile'
  import Square from '@/components/atoms/Square/Square.vue'
  import { computed } from '@vue/runtime-core'
  import { MemoryCardMode } from '@/model/Game Utils/MemoryCard'

  export default {
    components: {
      DataChip,
      Square,
    },
    props: {
      tag: { type: String, default: 'li' },
      theme: { type: String, default: 'primary' },
      mode: { default: MemoryCardMode.Load },
      slotName: { type: String, required: true },
      save: { type: [SaveFile, RoguelikeSaveFile] },
    },
    emits: ['select'],
    setup(props) {
      const roguelikeSave = computed(() => {
        return props.save instanceof RoguelikeSaveFile
          ? (props.save as RoguelikeSaveFile)
          : null
      })
      return { roguelikeSave }
    },
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
