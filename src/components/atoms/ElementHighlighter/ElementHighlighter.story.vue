<template>
  <Story
    group="atoms"
    :layout="{ type: 'single', iframe: false }"
    responsive-disabled
    auto-props-disabled
  >
    <div class="playground">
      <div
        v-for="idx in 3"
        :key="idx"
        :id="`block${idx}`"
        class="playground-block"
      >
        {{ idx }}
      </div>
    </div>
    <ElementHighlighter @mounted="setHighlighter" fixed />
    <template #controls>
      <div class="font-weight-bold htw-p-2">Highlight</div>
      <HstCheckbox title="Contained" v-model="config.contained" />
      <HstButtonGroup
        title="Highlight"
        :options="[
          { label: 'Element', value: 'element' },
          { label: 'Relative', value: 'relative' },
        ]"
        v-model="config.highlight"
      />
      <HstButtonGroup
        v-if="config.highlight === 'element'"
        title="Element"
        :options="[
          { label: '1', value: '#block1' },
          { label: '2', value: '#block2' },
          { label: '3', value: '#block3' },
        ]"
        v-model="config.selector"
      />
      <div v-else>
        <HstButtonGroup
          title="Vertical"
          :options="['top', 'center', 'bottom']"
          v-model="config.y"
        />
        <HstButtonGroup
          title="Horizontal"
          :options="['left', 'center', 'right']"
          v-model="config.x"
        />
      </div>
      <HstNumber title="Padding" v-model="config.padding" />
      <HstText title="Background color" v-model="config.color" />
      <HstNumber title="Background opacity" v-model="config.opacity" />
      <HstNumber
        title="Transition duration"
        v-model="config.transitionDuration"
      />

      <div class="htw-p-2 d-flex htw-gap-2">
        <HstButton class="htw-p-2" @click="highlight">Highlight</HstButton>
        <HstButton class="htw-p-2" @click="highlighter.dismiss"
          >Dismiss</HstButton
        >
      </div>
      <div class="font-weight-bold htw-p-2">Dialogs</div>
      <HstText title="Title" v-model="dialog.title" />
      <HstText title="Subtitle" v-model="dialog.subtitle" />
      <HstTextarea title="Content" v-model="dialog.content" />
      <HstText title="Color" v-model="dialog.color" />
      <HstSelect
        title="Variant"
        v-model="dialog.variant"
        :options="['flat', 'elevated', 'tonal', 'outlined', 'text', 'plain']"
      />
      <HstCheckbox title="Append" v-model="dialog.append" />
      <HstCheckbox title="With button" v-model="dialog.withAction" />
      <HstSelect
        title="Vertical alignment"
        v-model="dialog.vertical"
        :options="['center', 'top', 'top-inset', 'bottom-inset', 'bottom']"
      />
      <HstSelect
        title="Horizontal alignment"
        v-model="dialog.horizontal"
        :options="['center', 'left', 'left-inset', 'right-inset', 'right']"
      />
      <div class="htw-p-2 d-flex htw-gap-2">
        <HstButton class="htw-p-2" @click="addText">Add dialog</HstButton>
        <HstButton class="htw-p-2" @click="highlighter.clearText"
          >Clear</HstButton
        >
      </div>
    </template>
  </Story>
</template>

<script setup lang="ts">
  import HighlighterFunctions from './model/HighlighterFunctions'
  import { ref, reactive } from 'vue'
  import ElementHighlighter from './ElementHighlighter.vue'

  const config = reactive<{
    x: number | string
    y: number | string
    contained: boolean
    highlight: string
    selector: string
    padding: number
    opacity: number
    color: string
    transitionDuration: number
  }>({
    x: 'center',
    y: 'center',
    contained: true,
    highlight: 'element',
    selector: '#block1',
    padding: 0,
    opacity: 0.75,
    color: '#000',
    transitionDuration: 200,
  })

  const dialog = reactive<{
    content: string
    append: boolean
    title: string
    subtitle: string
    withAction: boolean
    color: string
    variant: 'flat' | 'elevated' | 'tonal' | 'outlined' | 'text' | 'plain'
    horizontal: 'center' | 'left' | 'left-inset' | 'right-inset' | 'right'
    vertical: 'center' | 'top' | 'top-inset' | 'bottom-inset' | 'bottom'
  }>({
    content: 'this is a dialog text',
    append: false,
    title: '',
    subtitle: '',
    withAction: false,
    color: 'secondary',
    variant: 'elevated',
    horizontal: 'center',
    vertical: 'center',
  })

  const highlighter = ref(new HighlighterFunctions())

  function setHighlighter(el: HighlighterFunctions) {
    highlighter.value = el
  }

  function highlight() {
    const selector =
      config.highlight === 'element'
        ? config.selector
        : { x: config.x, y: config.y }
    highlighter.value.highlight(selector, {
      padding: config.padding,
      transitionDuration: config.transitionDuration,
      bgColor: config.color,
      bgOpacity: config.opacity,
      bgCallbacks: [highlighter.value.dismiss],
      wrapper: config.contained ? '.playground' : '',
    })
  }

  function addText() {
    highlighter.value.addText(
      {
        content: dialog.content,
        append: dialog.append,
        title: dialog.title,
        subtitle: dialog.subtitle,
        actions: dialog.withAction
          ? [
              {
                title: 'Click',
                action: () => {
                  alert('Click!')
                },
              },
            ]
          : [],
        config: {
          color: dialog.color,
          variant: dialog.variant,
        },
      },
      { horizontal: dialog.horizontal, vertical: dialog.vertical }
    )
  }
</script>

<style lang="scss">
  .playground {
    box-sizing: content-box;
    width: 400px;
    height: 400px;
    display: grid;
    margin: 3rem auto;
    grid-template-rows: repeat(4, 1fr);
    grid-template-columns: repeat(4, 1fr);
    border: solid 3px white;

    &-block {
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;

      &:nth-child(1) {
        background-color: $primary;
        grid-row: 2;
      }

      &:nth-child(2) {
        background-color: $secondary;
        grid-column: 4;
        grid-row: 1/3;
      }
      &:nth-child(3) {
        background-color: $danger;
        grid-row: 4;
        grid-column: 2/4;
      }
    }
  }

  .histoire-story-side-panel {
    z-index: 0 !important;
  }

  .histoire-base-split-pane {
    position: relative;
    z-index: 20;
  }
</style>
