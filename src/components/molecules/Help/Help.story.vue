<template>
  <Story
    group="molecules"
    :layout="{ type: 'single', iframe: false }"
    responsive-disabled
    auto-props-disabled
  >
    <Help :tutorial-handler="tutorialHandler">
      {{ state.text }}
    </Help>
    <ElementHighlighter @mounted="setupHighlighter" />

    <template #controls>
        <HstText title="Text" v-model="state.text"/>
    </template>
  </Story>
</template>

<script setup lang="ts">
  import Help from './Help.vue'
  import { reactive, provide } from 'vue'
  import ElementHighlighter from '@/components/atoms/ElementHighlighter/ElementHighlighter.vue'
  import HighlighterFunctions from '@/components/atoms/ElementHighlighter/model/HighlighterFunctions'
  import { Highlighter } from '@/keys'
  import useTutorialHandler from '@/composables/tutorialRoutine'
  import StandardGameplayTutorial from '@/assets/tutorials/standard-gameplay'
  import RoguelikeGameplayTutorial from '@/assets/tutorials/roguelike-gameplay'

  const state = reactive({ text: 'help' })

  const highlighter = reactive(new HighlighterFunctions())

  function setupHighlighter(el: HighlighterFunctions) {
    highlighter.highlight = el.highlight
    highlighter.dismiss = el.dismiss
    highlighter.addText = el.addText
    highlighter.clearText = el.clearText
    highlighter.removeText = el.removeText
    highlighter.setConfig = el.setConfig
  }

  provide(Highlighter, highlighter)

  const tutorials = [
    { ...StandardGameplayTutorial, title: 'Standard' },
    { ...RoguelikeGameplayTutorial, title: 'Roguelike' },
  ]
  const tutorialHandler = useTutorialHandler(tutorials, highlighter)
</script>

<style lang="scss">
  .histoire-story-side-panel {
    z-index: 0 !important;
  }

  .histoire-base-split-pane {
    position: relative;
    z-index: 20;
  }
</style>
