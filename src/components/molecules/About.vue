<template>
  <v-btn v-bind="buttonAttrs" @click="isOpen = true">
    <slot />
  </v-btn>
  <v-dialog v-model="isOpen" max-width="350">
    <v-card title="About" prepend-icon="fas fa-fw fa-circle-info">
      <v-card-text>

        <p class="text-justify mb-3">
          This game was developed as a study on the Vue framework, specifically
          Vue3 with composition API and typescript; game development and game
          design.
        </p>
        <p class="text-justify mb-4">
          You can find the full code for it on
          <a href="https://github.com/leonardohcl/vue-2048">GitHub</a>
        </p>
        <p class="font-weight-thin font-italic">
            version 1.0.1
        </p>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          variant="text"
          prepend-icon="fas fa-fw fa-times"
          @click="isOpen = false"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import useDialogCommands from '@/composables/dialogCommands'
  import LooseObject from '@/utils/LooseObject'
  import { defineComponent, computed } from 'vue'
  export default defineComponent({
    props: {
      buttonOptions: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props) {
      const buttonAttrs = computed<LooseObject>(() => ({
        variant: 'plain',
        prependIcon: 'fas fa-fw fa-circle-info',
        ...props.buttonOptions,
      }))

      return {
        buttonAttrs,
        ...useDialogCommands(),
      }
    },
  })
</script>
