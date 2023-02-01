<template>
  <router-view />
  <ElementHighlighter ref="elementHighlighter" />
</template>

<script lang="ts">
import { LOAD_SCORE_MUTATION } from "@/store/ranking";
import { LOAD_GAMES_MUTATION } from "@/store/memory-card";

import { useStore } from "vuex";
import { ref, defineComponent, provide, onMounted } from "@vue/runtime-core";
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

    onMounted(() => {
      if (!elementHighlighter.value) return;

      const highlighter = elementHighlighter.value;

      const highlight = highlighter.highlight;

      const dissmiss = highlighter.dismiss;

      const setConfig = highlighter.setConfig

      const setBackgroundCallback = (bgCallback: (evt: MouseEvent) => void) => {
        setConfig({ bgCallback });
      };

      return provide<HighlighterFunctions>(Highlighter, {
        highlight,
        dissmiss,
        setConfig,
        setBackgroundCallback,
      });
    });

    return { elementHighlighter };
  },
});
</script>
