<template>
  <v-btn v-bind="buttonAttrs">
    <slot />
    <v-menu activator="parent">
      <v-list>
        <v-list-item
          v-for="item in tutorials"
          :key="item.title"
          @click="handleClick(item)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script lang="ts">
import useTutorialRoutine from "@/composables/tutorialRoutine";
import LooseObject from "@/utils/LooseObject";
import { computed, defineComponent } from "vue";
import { ITutorial, ITutorialStep } from "@/model/Game Utils/Tutorial";
export default defineComponent({
  props: {
    tutorials: { type: Array<ITutorial>, default: () => [] },
    buttonOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const buttonAttrs = computed<LooseObject>(() => ({
      variant: "plain",
      prependIcon: "far fa-fw fa-question-circle",
      ...props.buttonOptions,
    }));

    const tutorial = useTutorialRoutine();

    const handleClick = (selected: ITutorial) => {
      tutorial.start(selected);
    };

    return { buttonAttrs, handleClick };
  },
});
</script>
