<template>
  <router-view />
  <ElementHighlighter ref="elementHighlighter" />
</template>

<script lang="ts">
import { LOAD_SCORE_MUTATION } from "@/store/ranking";
import { LOAD_GAMES_MUTATION } from "@/store/memory-card";

import { useStore } from "vuex";
import {
  ref,
  defineComponent,
  provide,
  reactive,
  watch,
} from "@vue/runtime-core";
import { Highlighter } from "@/keys";
import ElementHighlighter from "./components/organisms/ElementHighlighter/ElementHighlighter.vue";
import HighlighterFunctions from "@/components/organisms/ElementHighlighter/model/HighlighterFunctions";
export default defineComponent({
  name: "2048",
  components: { ElementHighlighter },
  setup() {
    const store = useStore();
    store.commit(LOAD_SCORE_MUTATION);
    store.commit(LOAD_GAMES_MUTATION);

    const elementHighlighter = ref<InstanceType<
      typeof ElementHighlighter
    > | null>(null);

    const highlighter = reactive(new HighlighterFunctions());

    provide<HighlighterFunctions>(Highlighter, highlighter);

    watch(elementHighlighter, (el) => {
      if (!el) return;
      highlighter.highlight = el.highlight;
      highlighter.dismiss = el.dismiss;
      highlighter.addText = el.addText;
      highlighter.clearText = el.clearText;
      highlighter.removeText = el.removeText;
      highlighter.setConfig = el.setConfig;
      highlighter.setBackgroundCallback = (bgCallback) => {
        highlighter.setConfig({ bgCallback });
      };
    });

    return { elementHighlighter };
  },
});
</script>
