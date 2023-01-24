<template>
  <b-modal
    :id="id"
    class="save-modal"
    :title="`Memory Card${mode ? ` [${mode.toUpperCase()} GAME]` : ''}`"
    v-model="isOpen"
    centered
    hide-footer
  >
    <ul class="save-modal__list">
      <li
        v-for="slot in slots"
        :key="slot.filename"
        @click="handleClick(slot)"
        class="save-modal__slot"
        :class="[
          slot.isEmpty && 'save-modal__slot--empty',
          `save-modal__slot--${mode}`,
        ]"
      >
        <span class="save-modal__slot--title">
          {{ slot.filename }}
        </span>
        <div class="save-modal__slot--details" v-if="slot.isEmpty">
          EMPTY SLOT
        </div>
        <div class="save-modal__slot--details" v-else>
          <Square inline :data="{ value: slot.progress.highestValue }" />
          <span class="save-modal__slot--score">
            Score: {{ slot.progress.score }}</span
          >
          <span class="save-modal__slot--shape">
            {{ slot.settings.width }} x {{ slot.settings.height }}</span
          >
        </div>
      </li>
    </ul>
  </b-modal>
</template>

<script>
  import GameMode from '@/model/GameMode'
  import Square from '@/components/atoms/Square.vue'
  import { computed, ref } from 'vue'
  import { useStore } from 'vuex'

  export default {
    components: { Square },
    props: {
      id: { type: String, required: true },
      mode: { type: String, default: '' },
      maxSlots: { type: Number, default: 5 },
      closeAfterSelect: { type: Boolean, default: false },
      gameMode: { type: GameMode, default: 'regular' },
    },
    emits: ['selected'],
    setup(props, context) {
      const isOpen = ref(false)
      const store = useStore()
      const saves = computed(() => store.getters.saves(props.gameMode))

      const slots = computed(() => {
        const list = []

        for (let idx = 1; idx <= props.maxSlots; idx++) {
          const filename = `Slot ${idx}`
          const existing = saves.value.find((x) => x.filename === filename)
          if (existing) list.push(existing)
          else list.push({ filename, isEmpty: true })
        }

        return list
      })

      const handleClick = (slot) => {
        context.emit('selected', slot)
        if (props.closeAfterSelect) isOpen.value = false
      }

      return { isOpen, slots, handleClick }
    },
  }
</script>

<style lang="scss" scoped>
  .save-modal {
    &__list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    &__slot {
      $slot: &;

      cursor: pointer;
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
  }
</style>
