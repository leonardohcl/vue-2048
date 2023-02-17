<template>
  <Transition name="fade">
    <div v-if="display" class="element-highlighter" :style="containerStyle">
      <div
        class="element-highlighter__background element-highlighter__top"
        :style="topStyle"
        @click="handleBackgroudClick"
      />
      <div
        class="element-highlighter__background element-highlighter__left"
        :style="leftStyle"
        @click="handleBackgroudClick"
      />
      <div
        class="element-highlighter__background element-highlighter__bottom"
        :style="bottomStyle"
        @click="handleBackgroudClick"
      />
      <div
        class="element-highlighter__background element-highlighter__right"
        :style="rightStyle"
        @click="handleBackgroudClick"
      />
      <div class="element-highlighter__window" :style="windowStyle">
        <Transition name="fade">
          <div
            v-if="dialogs.length"
            class="element-highlighter__dialog-container"
            :class="dialogContainerClasses"
            :style="dialogContainerStyles"
          >
            <div class="element-highlighter__dialog-container--content">
              <TransitionGroup name="scroll-y-reverse">
                <DialogBox
                  v-for="dialog in dialogs"
                  :key="dialog.id"
                  class="element-highlighter__dialog"
                  :dialog="dialog.config"
                  :actions="dialog.actions"
                  :style="dialog.style"
                />
              </TransitionGroup>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
  import HighlighterConfig, {
    IHighlighterConfig,
  } from './model/HighlighterConfig'
  import HighlighterMemory, {
    HighlighterEntry,
    IHighlighterEntry,
  } from './model/HighlighterMemory'
  import {
    nextTick,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
  } from 'vue'
  import DialogBox from '@/components/atoms/DialogBox/DialogBox.vue'
  import useDialogHandler from './handlers/dialog'
  import useStyle from './handlers/style'

  const display = ref(false)

  const config = reactive(
    new HighlighterConfig({
      resizeStagger: 500,
      transitionDuration: 200,
      bgCallback: undefined,
      bgColor: 'black',
      bgOpacity: 0.9,
      dialogsAllowed: 0,
    })
  )

  const memory = reactive(
    new HighlighterMemory({
      selector: 'body',
      padding: 0,
      bgColor: config.bgColor,
      bgOpacity: config.bgOpacity,
      wrapper: '',
    })
  )

  //styles handler
  const {
    containerStyle,
    bottomStyle,
    rightStyle,
    leftStyle,
    topStyle,
    windowStyle,
    updateStyles,
  } = useStyle()

  // dialog handler
  const {
    dialogs,
    dialogContainerStyles,
    dialogContainerClasses,
    addText,
    clearText,
    removeText,
    controlDialogs,
    setDialogPosition,
  } = useDialogHandler(config)

  function updateTransition(duration: number) {
    const properties = [
      'top',
      'left',
      'right',
      'bottom',
      'width',
      'height',
      'background-color',
      'opacity',
    ]
    const transition = properties
      .map((prop) => `${prop} ${duration}ms`)
      .join(', ')
    if (containerStyle.transition === transition) return false
    containerStyle.animationDuration = `${duration}ms`
    containerStyle.transition = transition
    windowStyle.transition = transition
    leftStyle.transition = transition
    rightStyle.transition = transition
    bottomStyle.transition = transition
    topStyle.transition = transition
    return true
  }

  async function highlight(
    selector: string | { x: number | string; y: number | string },
    {
      transitionDuration = config.transitionDuration,
      wrapper = '',
      shouldDisplay = true,
      padding = 0,
      bgColor = config.bgColor,
      bgOpacity = config.bgOpacity,
      bgCallbacks = [],
    }: IHighlighterEntry = {}
  ) {
    if (!selector) return
    let rect: {
      width: number
      height: number
      left: number | string
      top: number | string
    } = {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
    }
    if (typeof selector === 'string') {
      const el = document.querySelector(selector as string)
      if (!el) return
      const { width, height, top, left } = el.getBoundingClientRect()
      rect = { width, height, top, left }
    } else {
      rect = { width: 0, height: 0, top: selector.y, left: selector.x }
    }

    memory.lastHighlight = new HighlighterEntry({
      selector,
      wrapper,
      transitionDuration,
      padding,
      bgColor,
      bgOpacity,
      bgCallbacks,
    })
    memory.shouldDisplay = shouldDisplay

    const haveUpdated = updateTransition(transitionDuration)
    const previousDisplayValue = display.value
    display.value = shouldDisplay
    if (haveUpdated || previousDisplayValue != display.value) await nextTick()
    updateStyles({
      rect,
      wrapper,
      padding,
      bgColor,
      bgOpacity,
    })
    return new Promise<void>((resolve) =>
      setTimeout(async () => {
        resolve()
      }, transitionDuration)
    )
  }

  async function dismiss({
    x = 'center',
    y = 'center',
    transitionDuration = config.transitionDuration,
  }: {
    x?: 'center' | 'left' | 'right'
    y?: 'top' | 'center' | 'bottom'
    transitionDuration?: number
  } = {}) {
    if (!display.value) return
    const haveUpdated = updateTransition(transitionDuration)
    if (haveUpdated) await nextTick()
    updateStyles()
    clearText()
    await highlight(
      { x, y },
      {
        transitionDuration: 200,
        shouldDisplay: false,
        bgOpacity: 0,
        wrapper: memory.lastHighlight.wrapper,
      }
    )
    display.value = false
    await nextTick()
    return new Promise<void>((resolve) =>
      setTimeout(async () => {
        resolve()
      }, transitionDuration)
    )
  }

  function setConfig({
    resizeStagger = config.resizeStagger,
    transitionDuration = config.transitionDuration,
    bgColor = config.bgColor,
    bgOpacity = config.bgOpacity,
    bgCallback = config.bgCallback,
    dialogsAllowed = config.dialogsAllowed,
  }: IHighlighterConfig = {}) {
    config.resizeStagger = resizeStagger
    config.transitionDuration = transitionDuration
    config.bgCallback = bgCallback
    config.bgColor = bgColor
    config.bgOpacity = bgOpacity
    config.dialogsAllowed = dialogsAllowed

    controlDialogs()
  }

  function handleBackgroudClick(evt: MouseEvent) {
    if (config.bgCallback) config.bgCallback(evt)
    memory.lastHighlight.bgCallbacks?.forEach((fn) => fn())
  }

  function refreshPosition() {
    if (!display.value) return
    clearTimeout(memory.refreshTimeout)
    memory.refreshTimeout = setTimeout(() => {
      highlight(memory.lastHighlight.selector, {
        transitionDuration: 200,
        shouldDisplay: memory.shouldDisplay,
        wrapper: memory.lastHighlight.wrapper,
        padding: memory.lastHighlight.padding,
        bgColor: memory.lastHighlight.bgColor,
        bgOpacity: memory.lastHighlight.bgOpacity,
        bgCallbacks: memory.lastHighlight.bgCallbacks,
      })
    }, config.resizeStagger)
  }

  const emit = defineEmits(['mounted'])

  onMounted(() => {
    window.addEventListener('resize', refreshPosition)
    window.addEventListener('scroll', refreshPosition)

    emit('mounted', {
      highlight,
      dismiss,
      addText,
      clearText,
      removeText,
      setConfig,
    })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', refreshPosition)
    window.removeEventListener('scroll', refreshPosition)
  })

  updateStyles()
  setDialogPosition({ vertical: 'top-inset', horizontal: 'right' })
</script>

<style lang="scss">
  .element-highlighter {
    position: fixed;
    z-index: 999;
    display: grid;
    opacity: 1;
    grid-template-columns: repeat(3, min-content);
    grid-template-rows: repeat(3, min-content);
    pointer-events: none;
    overflow: hidden;

    &__background {
      pointer-events: all;
    }

    &__window {
      position: relative;
      pointer-events: none;
    }

    &__dialog {
      width: max-content;
      height: max-content;
      pointer-events: all;
      &-container {
        position: absolute;
        z-index: $hud-z-index + 2;
        pointer-events: none;
        overflow: visible;

        &--content {
          display: flex;
          flex-direction: column;
          align-items: inherit;
          justify-content: inherit;
          gap: $default-spacing * 0.25;
          padding: $default-spacing * 0.5;
          width: 100%;
          pointer-events: none;
        }

        &--h {
          &-left {
            right: 100%;
            align-items: flex-end;

            &-inset {
              left: 0;
            }
          }

          &-center {
            display: flex;
            align-items: center;
            width: 100%;
          }

          &-right {
            left: 100%;

            &-inset {
              right: 0;
              align-items: flex-end;
            }
          }
        }

        &--v {
          &-top {
            bottom: 100%;

            &-inset {
              top: 0;
            }
          }

          &-center {
            display: flex;
            justify-content: center;
            height: 100%;
          }

          &-bottom {
            top: 100%;

            &-inset {
              bottom: 0;
            }
          }
        }
      }
    }

    &__left {
      grid-column: 1/2;
    }

    &__right {
      grid-column: 3/4;
    }

    &__top {
      grid-row: 1/2;
    }
    &__bottom {
      grid-row: 3/4;
    }

    &__left,
    &__right {
      grid-row: 1/4;
    }

    &__top,
    &__bottom {
      grid-column: 2/3;
    }

    @include transition-animation(fade);
  }
</style>
