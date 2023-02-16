<template>
  <Navbar @mounted="setupNavbar" />
  <PageContainer>
    <router-view v-slot="{ Component, route }">
      <Transition :name="getTransitionName(route.meta)">
        <component :is="Component" />
      </Transition>
    </router-view>
  </PageContainer>
  <ElementHighlighter @mounted="setupHighlighter" />
</template>

<script lang="ts" setup>
import { provide, reactive } from "vue";
import { Highlighter, Navbar as NavbarKey } from "@/keys";
import ElementHighlighter from "./components/atoms/ElementHighlighter/ElementHighlighter.vue";
import HighlighterFunctions from "@/components/atoms/ElementHighlighter/model/HighlighterFunctions";
import PageContainer from "./components/organisms/PageContainer.vue";
import LooseObject from "./utils/LooseObject";
import Navbar from "./components/organisms/Navbar/Navbar.vue";
import NavbarFunctions from "./components/organisms/Navbar/model/NavbarFunctions";

const highlighter = reactive(new HighlighterFunctions());
const navbar = reactive(new NavbarFunctions());

provide<HighlighterFunctions>(Highlighter, highlighter);
provide<NavbarFunctions>(NavbarKey, navbar);

function getTransitionName(meta: LooseObject) {
  const prefix = "page-swap-";
  let animation;
  if (meta.previousPage)
    if (meta.conditionalEnterFrom)
      animation =
        meta.conditionalEnterFrom(meta.previousTransitionDirection) || "fade";
    else animation = meta.enterFrom || "fade";
  else animation = "fade";
  return prefix + animation;
}

function setupNavbar(el: NavbarFunctions) {
  navbar.setGame = el.setGame;
  navbar.setTutorialHandler = el.setTutorialHandler;
}

function setupHighlighter(el: HighlighterFunctions) {
  highlighter.highlight = el.highlight;
  highlighter.dismiss = el.dismiss;
  highlighter.addText = el.addText;
  highlighter.clearText = el.clearText;
  highlighter.removeText = el.removeText;
  highlighter.setConfig = el.setConfig;
}
</script>

<style lang="scss">
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
