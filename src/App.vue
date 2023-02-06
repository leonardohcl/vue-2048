<template>
  <PageContainer>
    <router-view v-slot="{ Component, route }">
      <Transition :name="getTransitionName(route.meta)">
        <component :is="Component" />
      </Transition>
    </router-view>
  </PageContainer>
  <ElementHighlighter ref="elementHighlighter" />
</template>

<script lang="ts">
  import { LOAD_SCORE_MUTATION } from '@/store/ranking'

  import { useStore } from 'vuex'
  import {
    ref,
    defineComponent,
    provide,
    reactive,
    watch,
  } from '@vue/runtime-core'
  import { Highlighter, RoguelikeMemoryCard, StandardMemoryCard } from '@/keys'
  import ElementHighlighter from './components/organisms/ElementHighlighter/ElementHighlighter.vue'
  import HighlighterFunctions from '@/components/organisms/ElementHighlighter/model/HighlighterFunctions'
  import PageContainer from './components/atoms/PageContainer.vue'
  import LooseObject from './utils/LooseObject'
  import MemoryCard from './model/Game Utils/MemoryCard'
  import GameMode from './model/Game Utils/GameMode'
import SaveFile from './model/Game Utils/SaveFile/SaveFile'
import RoguelikeSaveFile from './model/Game Utils/SaveFile/RoguelikeSaveFile'
  export default defineComponent({
    name: '2048',
    components: { ElementHighlighter, PageContainer },
    setup() {
      const store = useStore()
      store.commit(LOAD_SCORE_MUTATION)

      const elementHighlighter = ref<InstanceType<
        typeof ElementHighlighter
      > | null>(null)

      const highlighter = reactive(new HighlighterFunctions())

      const memoryCard = new MemoryCard<SaveFile>(GameMode.Standard)
      const roguelikeMemoryCard = new MemoryCard<RoguelikeSaveFile>(GameMode.Roguelike)
      provide<MemoryCard<SaveFile>>(StandardMemoryCard, memoryCard)
      provide<MemoryCard<RoguelikeSaveFile>>(RoguelikeMemoryCard, roguelikeMemoryCard)

      const getTransitionName = (meta: LooseObject) => {
        const prefix = 'page-swap-'
        let animation
        if (meta.previousPage)
          if (meta.conditionalEnterFrom)
            animation =
              meta.conditionalEnterFrom(meta.previousTransitionDirection) ||
              'fade'
          else animation = meta.enterFrom || 'fade'
        else animation = 'fade'
        return prefix + animation
      }

      provide<HighlighterFunctions>(Highlighter, highlighter)

      watch(elementHighlighter, (el) => {
        if (!el) return
        highlighter.highlight = el.highlight
        highlighter.dismiss = el.dismiss
        highlighter.addText = el.addText
        highlighter.clearText = el.clearText
        highlighter.removeText = el.removeText
        highlighter.setConfig = el.setConfig
        highlighter.setBackgroundCallback = (bgCallback) => {
          highlighter.setConfig({ bgCallback })
        }
      })

      return { elementHighlighter, getTransitionName }
    },
  })
</script>

<style lang="scss">
  .page-swap {
    &-right,
    &-left,
    &-bottom,
    &-top,
    &-fade {
      height: fit-content;

      &-enter-active,
      &-leave-active {
        position: absolute;
        top: 0;
        transition: top $page-animation-duration $page-animation-ease,
          transform $page-animation-duration $page-animation-ease,
          opacity $page-animation-duration $page-animation-ease;
      }

      &-enter-from,
      &-leave-to {
        opacity: 0;
      }

      &-leave-from,
      &-enter-to {
        opacity: 1;
      }
    }

    &-right {
      &-enter-from {
        transform: translateX(100vw);
      }

      &-leave-to {
        transform: translateX(-100vw);
      }
    }

    &-left {
      &-enter-from {
        transform: translateX(-100vw);
      }

      &-leave-to {
        transform: translateX(100vw);
      }
    }

    &-bottom {
      &-enter-from {
        transform: translateY(100vh);
      }

      &-leave-to {
        transform: translateY(-100vh);
      }
    }
    &-top {
      &-enter-from {
        transform: translateY(-100vh);
      }

      &-leave-to {
        transform: translateY(100vh);
      }
    }
  }
</style>
