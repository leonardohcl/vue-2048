<template>
  <Transition name="fade">
    <div class="element-highlighter" :style="containerStyle" v-if="display">
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
      <div class="element-highlighter__window" :style="windowStyle" />
    </div>
  </Transition>
</template>

<script lang="ts">
import HighlighterConfig, {
  IHighlighterConfig,
} from "./model/HighlighterConfig";
import HighlighterMemory from "./model/HighlighterMemory";
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";

export default {
  setup() {
    const display = ref(false);
    const leftStyle = reactive({
      width: "0",
      transition: "",
      backgroundColor: "",
      opacity: 1,
    });
    const rightStyle = reactive({
      width: "0",
      transition: "",
      backgroundColor: "",
      opacity: 1,
    });
    const topStyle = reactive({
      height: "0",
      transition: "",
      backgroundColor: "",
      opacity: 1,
    });
    const bottomStyle = reactive({
      height: "0",
      transition: "",
      backgroundColor: "",
      opacity: 1,
    });
    const windowStyle = reactive({
      width: "100vw",
      height: "100vh",
      transition: "",
    });
    const containerStyle = reactive({
      width: "100vw",
      height: "100vh",
      transition: "",
      animationDuration: "",
    });

    const config = reactive(
      new HighlighterConfig({
        resizeStagger: 250,
        transitionDuration: 200,
        bgCallback: undefined,
        bgColor: "black",
        bgOpacity: 0.75,
      })
    );

    const memory = reactive(new HighlighterMemory({
        selector: "body",
        padding: 0,
        bgColor: config.bgColor,
        bgOpacity: config.bgOpacity,
      }));

    const getPageSize = () => ({
      height: Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      ),
      width: Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.body.clientWidth,
        document.documentElement.clientWidth
      ),
    });

    const updateTransition = (duration: number) => {
      const properties = ["width", "height", "background-color", "opacity"];
      const transition = properties
        .map((prop) => `${prop} ${duration}ms`)
        .join(", ");

      if (containerStyle.transition === transition) return false;

      containerStyle.animationDuration = `${duration}ms`;
      containerStyle.transition = transition;
      windowStyle.transition = transition;
      leftStyle.transition = transition;
      rightStyle.transition = transition;
      bottomStyle.transition = transition;
      topStyle.transition = transition;

      return true;
    };

    const updateStyles = ({
      page = getPageSize(),
      el = document.body.getBoundingClientRect(),
      padding = 0,
      bgColor = config.bgColor,
      bgOpacity = config.bgOpacity,
    } = {}) => {
      containerStyle.width = `${page.width}px`;
      containerStyle.height = `${page.height}px`;

      windowStyle.width = `${el.width + 2 * padding}px`;
      windowStyle.height = `${el.height + 2 * padding}px`;

      leftStyle.width = `${el.left - padding}px`;
      rightStyle.width = `${page.width - el.left - el.width - padding}px`;
      topStyle.height = `${el.top - padding}px`;
      bottomStyle.height = `${page.height - el.top - el.height - padding}px`;

      const styles = [leftStyle, rightStyle, topStyle, bottomStyle];
      styles.forEach((style) => {
        style.opacity = bgOpacity;
        style.backgroundColor = bgColor;
      });
    };

    const highlight = async (
      selector: string,
      {
        transitionDuration = config.transitionDuration,
        shouldDisplay = true,
        padding = 0,
        bgColor = config.bgColor,
        bgOpacity = config.bgOpacity,
      } = {}
    ) => {
      if (!selector) return;

      const el = document.querySelector(selector);
      if (!el) return;

      memory.lastHighlight = { selector, padding, bgColor, bgOpacity };

      const haveUpdated = updateTransition(transitionDuration);

      const previousDisplayValue = display.value;
      display.value = shouldDisplay;

      if (haveUpdated || previousDisplayValue != display.value)
        await nextTick();

      updateStyles({
        el: el.getBoundingClientRect(),
        padding,
        bgColor,
        bgOpacity,
      });

      return new Promise<void>((resolve) =>
        setTimeout(async () => {
          resolve();
        }, transitionDuration)
      );
    };

    const dismiss = async ({
      transitionDuration = config.transitionDuration,
    } = {}) => {
      if (!display.value) return;

      const haveUpdated = updateTransition(transitionDuration);
      if (haveUpdated) await nextTick();

      updateStyles();

      display.value = false;
      await nextTick();

      return new Promise<void>((resolve) =>
        setTimeout(async () => {
          resolve();
        }, transitionDuration)
      );
    };

    const setConfig = ({
      resizeStagger = config.resizeStagger,
      transitionDuration = config.transitionDuration,
      bgCallback = config.bgCallback,
      bgColor = config.bgColor,
      bgOpacity = config.bgOpacity,
    }: IHighlighterConfig = {}) => {
      config.resizeStagger = resizeStagger;
      config.transitionDuration = transitionDuration;
      config.bgCallback = bgCallback;
      config.bgColor = bgColor;
      config.bgOpacity = bgOpacity;
    };

    const handleBackgroudClick = (evt: MouseEvent) => {
      if (config.bgCallback) config.bgCallback(evt);
    };

    const refreshPosition = () => {
      clearTimeout(memory.refreshTimeout);
      memory.refreshTimeout = setTimeout(() => {
        highlight(memory.lastHighlight.selector, {
          transitionDuration: 0,
          shouldDisplay: display.value,
          padding: memory.lastHighlight.padding,
          bgColor: memory.lastHighlight.bgColor,
          bgOpacity: memory.lastHighlight.bgOpacity,
        });
      }, config.resizeStagger);
    };

    onMounted(() => {
      window.addEventListener("resize", refreshPosition);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", refreshPosition);
    });

    return {
      display,
      leftStyle,
      rightStyle,
      topStyle,
      bottomStyle,
      windowStyle,
      containerStyle,
      config,
      highlight,
      dismiss,
      setConfig,
      handleBackgroudClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.element-highlighter {
  position: absolute;
  z-index: $hud-z-index + 1;
  top: 0;
  left: 0;
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
    pointer-events: none;
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
