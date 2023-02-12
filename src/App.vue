<template>
  <Navbar ref="navbar" />
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
import {
  ref,
  defineComponent,
  provide,
  reactive,
  onMounted,
} from "@vue/runtime-core";
import { Highlighter, Navbar as NavbarKey } from "@/keys";
import ElementHighlighter from "./components/organisms/ElementHighlighter/ElementHighlighter.vue";
import HighlighterFunctions from "@/components/organisms/ElementHighlighter/model/HighlighterFunctions";
import PageContainer from "./components/organisms/PageContainer.vue";
import LooseObject from "./utils/LooseObject";
import Navbar from "./components/organisms/Navbar/Navbar.vue";
import NavbarFunctions from "./components/organisms/Navbar/model/NavbarFunctions";

export default defineComponent({
  name: "2048",
  components: { ElementHighlighter, PageContainer, Navbar },
  setup() {
    const elementHighlighter = ref<InstanceType<typeof ElementHighlighter>>();

    const highlighter = reactive(new HighlighterFunctions());

    const navbar = ref<InstanceType<typeof Navbar>>();
    const navbarFunctions = reactive(new NavbarFunctions());

    provide<HighlighterFunctions>(Highlighter, highlighter);
    provide<NavbarFunctions>(NavbarKey, navbarFunctions);

    const getTransitionName = (meta: LooseObject) => {
      const prefix = "page-swap-";
      let animation;
      if (meta.previousPage)
        if (meta.conditionalEnterFrom)
          animation =
            meta.conditionalEnterFrom(meta.previousTransitionDirection) ||
            "fade";
        else animation = meta.enterFrom || "fade";
      else animation = "fade";
      return prefix + animation;
    };

    onMounted(() => {
      if (elementHighlighter.value) {
        highlighter.highlight = elementHighlighter.value.highlight;
        highlighter.dismiss = elementHighlighter.value.dismiss;
        highlighter.addText = elementHighlighter.value.addText;
        highlighter.clearText = elementHighlighter.value.clearText;
        highlighter.removeText = elementHighlighter.value.removeText;
        highlighter.setConfig = elementHighlighter.value.setConfig;
        highlighter.setBackgroundCallback = (bgCallback) => {
          highlighter.setConfig({ bgCallback });
        };
      }

      if (navbar.value) {
        navbarFunctions.setGame = navbar.value.setGame;
        navbarFunctions.setTutorialHandler = navbar.value.setTutorialHandler;
      }
    });

    return { navbar, elementHighlighter, getTransitionName };
  },
});
</script>

<style lang="scss">
html {
  overflow-y: auto;
}

body {
  font-size: $text-size;
  font-family: "Roboto", sans-serif;
  background-color: $bg;
  color: $text-color;
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {
  html {
    transform: rotate(-90deg);
    transform-origin: left top;
    width: 100vh;
    overflow-x: hidden;
    position: absolute;
    top: 100%;
    left: 0;
  }

  body,
  .page {
    width: 100vh;
    height: 100vw;
  }
}

.page-swap {
  &-right,
  &-left,
  &-bottom,
  &-top,
  &-fade {
    &-enter-active,
    &-leave-active {
      position: absolute !important;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      transition: transform $page-animation-duration $page-animation-ease,
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
      transform: translateX(100%);
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
