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
      <SaveSlot
        v-for="slot in slots"
        :key="slot.filename"
        :save="slot"
        @select="handleSelect"
      />
    </ul>
  </b-modal>
</template>

<script>
  import GameMode from '@/model/GameMode'
  import SaveSlot from '@/components/atoms/SaveSlot.vue'
  import { computed, ref } from 'vue'
  import { useStore } from 'vuex'

  export default {
    components: { SaveSlot },
    props: {
      id: { type: String, required: true },
      mode: { type: String, default: '' },
      maxSlots: { type: Number, default: 5 },
      closeAfterSelect: { type: Boolean, default: false },
      gameMode: { type: GameMode, required: true },
    },
    emits: ['selected'],
    setup(props, context) {
      const isOpen = ref(false)
      const store = useStore()
      const saves = computed(() => store.getters.saves(props.gameMode))

      const slots = computed(() => {
        const list = []

        for (let idx = 1; idx <= props.maxSlots; idx++) {
          const filename = `slot-${idx}`
          const existing = saves.value.find((x) => x.filename === filename)
          if (existing) list.push(existing)
          else list.push({ filename, isEmpty: true })
        }

        return list
      })

      const handleSelect = (slot) => {
        context.emit('selected', slot)
        if (props.closeAfterSelect) isOpen.value = false
      }

      return { isOpen, slots, handleSelect }
    },
  }
</script>

<style lang="scss">
  .save-modal {
    &__list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  }
</style>
