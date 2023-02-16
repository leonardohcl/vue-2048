<template>
  <v-btn v-bind="buttonAttrs">
    <slot />
    <v-menu activator="parent">
      <v-list>
        <v-list-item
          v-for="tutorial in tutorialHandler.tutorials"
          :key="tutorial.title"
          @click="handleClick(tutorial)"
        >
          <v-list-item-title>{{ tutorial.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script lang="ts">
  import { ITutorialHandler } from '@/composables/tutorialRoutine'
  import LooseObject from '@/utils/LooseObject'
  import { computed, defineComponent, PropType } from 'vue'
  import { ITutorial } from '@/model/Game Utils/Tutorial'
  export default defineComponent({
    props: {
      tutorialHandler: {
        type: Object as PropType<ITutorialHandler>,
        default: () => [],
      },
      buttonOptions: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props) {
      const buttonAttrs = computed<LooseObject>(() => ({
        variant: 'plain',
        prependIcon: 'far fa-fw fa-question-circle',
        ...props.buttonOptions,
      }))

      const handleClick = (selected: ITutorial) => {
        props.tutorialHandler.start(selected)
      }

      return { buttonAttrs, handleClick }
    },
  })
</script>
