<template>
  <Story group="atoms" :layout="{ type: 'grid' }">
    <Variant
      v-for="value in values"
      :key="value"
      :title="`${value ? value : 'Empty'} Block`"
    >
      <div class="ma-2" style="height: 34px; width: 34px">
        <Square
          v-bind="sqr"
          :value="value"
          :inline="state.inline"
          :transition-duration="state.transitionDuration"
          @click="handleClick"
        />
      </div>
    </Variant>
    <template #controls>
      <HstNumber
        title="Transition duration"
        v-model="state.transitionDuration"
      />
      <HstCheckbox title="Inline" v-model="state.inline" />
      <HstCheckbox title="Selectable" v-model="state.selectable" />
      <HstCheckbox title="Selected" v-model="state.selected" />
      <HstCheckbox title="Locked" v-model="state.locked" />
      <div class="htw-p-2 htw-gap-2 d-flex">
        <HstButton
          class="htw-p-2"
          @click="animateState(SquareStateMeta.Spawned)"
        >
          Animate Spawn
        </HstButton>
        <HstButton
          class="htw-p-2"
          @click="animateState(SquareStateMeta.Merged)"
        >
          Animate Merge
        </HstButton>
      </div>
    </template>
  </Story>
</template>
<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue'
  import Square from './Square.vue'
  import SquareClass from '@/model/2048/Square'
  import { SquareStateMeta } from '@/model/2048/interfaces/Square'
  import { logEvent } from 'histoire/client'
  import { SquareConsumableMeta } from '@/model/Game Utils/Item/interfaces/Square'

  const sqr = ref(new SquareClass(0, 0))

  const values = [
    0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
    65536,
  ]

  const state = reactive({
    transitionDuration: 200,
    inline: false,
    selectable: false,
    selected: false,
    locked: false,
  })

  watch(state, (nextState) => {
    sqr.value.setMeta(SquareConsumableMeta.Selectable, nextState.selectable)
    sqr.value.setMeta(SquareConsumableMeta.Selected, nextState.selected)
    sqr.value.setMeta(SquareStateMeta.Locked, nextState.locked)
  })

  function resetAnimations() {
    sqr.value.setMeta(SquareConsumableMeta.Selectable, state.selectable)
    sqr.value.setMeta(SquareConsumableMeta.Selected, state.selected)
    sqr.value.setMeta(SquareStateMeta.Locked, state.locked)
  }

  function animateState(animation: SquareStateMeta) {
    sqr.value.setMeta(animation, true)
    setTimeout(() => {
      sqr.value = new SquareClass(0, 0)
      resetAnimations()
    }, state.transitionDuration)
  }

  function handleClick(data: any) {
    logEvent('click', { emitted: data })
  }
</script>
