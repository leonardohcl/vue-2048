<template>
  <component
    :is="tag"
    class="save-slot"
    :class="[save.isEmpty && 'save-slot--empty', `save-slot--${mode}`]"
    @click="$emit('select', save)"
  >
    <span class="save-slot--title">
      {{ save.filename.replace('-', ' ') }}
    </span>
    <div class="save-slot--details" v-if="save.isEmpty">EMPTY SLOT</div>
    <div class="save-slot--details" v-else>
      <div class="save-slot--progress" v-if="save.progress.run >= 0">
        <span class="badge badge-dark">Run {{ save.progress.run }}</span>
      </div>
      <Square inline :value="save.progress.highestValue" />
      <div class="save-slot--currency">
        <span class="save-slot--score">
          Score: {{ save.progress.bestScore || save.progress.score }}
        </span>
        <span
          class="save-slot--coins badge badge-warning badge-pill"
          v-if="save.inventory"
        >
          {{ save.inventory.coins }}
          <FontAwesomeIcon icon="coins" />
        </span>
      </div>
      <span class="save-slot--shape">
        {{ save.settings.width }} x {{ save.settings.height }}</span
      >
    </div>
  </component>
</template>

<script>
  import SaveFile from '@/model/2048/SaveFile'
  import RoguelikeSaveFile from '@/model/roguelike/RogueSaveFile'
  import Square from '@/components/atoms/Square.vue'

  export default {
    components: {
      Square,
    },
    props: {
      tag: { type: String, default: 'li' },
      save: { type: [SaveFile, RoguelikeSaveFile], required: true },
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
    border: solid 2px $secondary;
    padding: calc($default-spacing/2);
    margin-bottom: calc($default-spacing/2);
    border-radius: $border-radius;
    display: flex;
    box-shadow: 0 0 0 0 $secondary;
    transition: box-shadow 0.1s ease;

    &:hover {
      box-shadow: 0 0 9px 3px $secondary;
    }

    &--title {
      text-transform: uppercase;
      font-weight: bold;
      color: $secondary;
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
      display: flex;
      flex-direction: column;
      align-items: end;
    }

    &--score {
      font-weight: bold;
    }

    &--empty {
      border-color: $bg-secondary;
      color: $bg-secondary;
      font-weight: bold;
      text-align: center;

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
