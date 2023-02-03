<template>
  <v-fade-transition>
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
        <v-fade-transition>
          <div
            v-if="dialogs.length"
            class="element-highlighter__dialog-container"
            :class="dialogContainerClasses"
            :style="dialogContainerStyles"
          >
            <div class="element-highlighter__dialog-container--content">
              <v-scroll-y-reverse-transition group>
                <DialogBox
                  v-for="dialog in dialogs"
                  :key="dialog.id"
                  class="element-highlighter__dialog"
                  :dialog="dialog.config"
                  :actions="dialog.actions"
                  :style="dialog.style"
                />
              </v-scroll-y-reverse-transition>
            </div>
          </div>
        </v-fade-transition>
      </div>
    </div>
  </v-fade-transition>
</template>

<script lang="ts">
import HighlighterConfig, {
  IHighlighterConfig,
} from "./model/HighlighterConfig";
import HighlighterMemory, {
  HighlighterEntry,
  IHighlighterEntry,
} from "./model/HighlighterMemory";
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import DialogBox from "@/components/atoms/DialogBox/DialogBox.vue";
import useDialogHandler from "./handlers/dialog";
import { getPageSize } from "@/utils/viewport";

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
        resizeStagger: 500,
        transitionDuration: 200,
        bgCallback: undefined,
        bgColor: "black",
        bgOpacity: 0.9,
        dialogsAllowed: 0,
      })
    );

    const memory = reactive(
      new HighlighterMemory({
        selector: "body",
        padding: 0,
        bgColor: config.bgColor,
        bgOpacity: config.bgOpacity,
      })
    );

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
    } = useDialogHandler(config);

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

    const getNamedTopSize = (
      position: string,
      padding: number,
      rect: { height: number },
      { viewHeight }: { viewHeight: number }
    ) => {
      const scrollY = document.documentElement.scrollTop;
      const scrollBarCorrection = scrollY > 0 ? 16 : 0;
      if (position === "top") {
        return `${scrollY}px`;
      }
      if (position === "bottom") {
        return `${
          viewHeight + scrollY - rect.height - padding - scrollBarCorrection
        }px`;
      }
      if (position === "center") {
        return `${
          scrollY -
          scrollBarCorrection +
          (viewHeight - rect.height - padding) / 2
        }px`;
      }

      return position;
    };

    const getNamedLeftSize = (
      position: string,
      padding: number,
      rect: { width: number },
      page: { viewWidth: number }
    ) => {
      const scrollX = document.documentElement.scrollLeft;
      if (position === "left") {
        return `${scrollX}px`;
      }
      if (position === "right") {
        return `${page.viewWidth + scrollX - rect.width - padding}px`;
      }
      if (position === "center") {
        return `${scrollX + (page.viewWidth - rect.width - padding) / 2}px`;
      }

      return position;
    };

    const updateStyles = ({
      rect = document.body.getBoundingClientRect(),
      padding = 0,
      bgColor = config.bgColor,
      bgOpacity = config.bgOpacity,
    }: {
      rect?: {
        width: number;
        height: number;
        left: number | string;
        top: number | string;
      };
      padding?: number;
      bgColor?: string;
      bgOpacity?: number;
    } = {}) => {
      const page = getPageSize();
      containerStyle.width = `${page.width}px`;
      containerStyle.height = `${page.height}px`;

      windowStyle.width = `${rect.width + 2 * padding}px`;
      windowStyle.height = `${rect.height + 2 * padding}px`;

      if (typeof rect.left === "string") {
        const leftSize = getNamedLeftSize(rect.left, padding, rect, page);
        leftStyle.width = leftSize;
        rightStyle.width = `calc(${
          page.width - rect.width - padding
        }px - ${leftSize})`;
      } else {
        leftStyle.width = `${rect.left - padding}px`;
        rightStyle.width = `${page.width - rect.left - rect.width - padding}px`;
      }

      if (typeof rect.top === "string") {
        const topSize = getNamedTopSize(rect.top, padding, rect, page);

        topStyle.height = topSize;
        bottomStyle.height = `calc(${
          page.height - rect.height - padding
        }px - ${topSize})`;
      } else {
        topStyle.height = `${rect.top - padding}px`;
        bottomStyle.height = `${
          page.height - rect.top - rect.height - padding
        }px`;
      }

      const styles = [leftStyle, rightStyle, topStyle, bottomStyle];

      styles.forEach((style) => {
        style.opacity = bgOpacity;
        style.backgroundColor = bgColor;
      });
    };

    const highlight = async (
      selector: string | { x: number | string; y: number | string },
      {
        transitionDuration = config.transitionDuration,
        shouldDisplay = true,
        padding = 0,
        bgColor = config.bgColor,
        bgOpacity = config.bgOpacity,
      }: IHighlighterEntry = {}
    ) => {
      if (!selector) return;
      let rect: {
        width: number;
        height: number;
        left: number | string;
        top: number | string;
      } = {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
      };
      if (typeof selector === "string") {
        const el = document.querySelector(selector as string);
        if (!el) return;
        const { width, height, top, left } = el.getBoundingClientRect();
        rect = { width, height, top, left };
      } else {
        rect = { width: 0, height: 0, top: selector.y, left: selector.x };
      }

      memory.lastHighlight = new HighlighterEntry({
        selector,
        transitionDuration,
        padding,
        bgColor,
        bgOpacity,
      });
      memory.shouldDisplay = shouldDisplay

      const haveUpdated = updateTransition(transitionDuration);
      const previousDisplayValue = display.value;
      display.value = shouldDisplay;
      if (haveUpdated || previousDisplayValue != display.value)
        await nextTick();
      updateStyles({
        rect,
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
      clearText();
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
      bgColor = config.bgColor,
      bgOpacity = config.bgOpacity,
      bgCallback = config.bgCallback,
      dialogsAllowed = config.dialogsAllowed,
    }: IHighlighterConfig = {}) => {
      config.resizeStagger = resizeStagger;
      config.transitionDuration = transitionDuration;
      config.bgCallback = bgCallback;
      config.bgColor = bgColor;
      config.bgOpacity = bgOpacity;
      config.dialogsAllowed = dialogsAllowed;

      controlDialogs();
    };

    const handleBackgroudClick = (evt: MouseEvent) => {
      if (config.bgCallback) config.bgCallback(evt);
    };

    const refreshPosition = () => {
      clearTimeout(memory.refreshTimeout);
      memory.refreshTimeout = setTimeout(() => {
        highlight(memory.lastHighlight.selector, {
          transitionDuration: 200,
          shouldDisplay: memory.shouldDisplay,
          padding: memory.lastHighlight.padding,
          bgColor: memory.lastHighlight.bgColor,
          bgOpacity: memory.lastHighlight.bgOpacity,
        });
      }, config.resizeStagger);
    };

    onMounted(() => {
      window.addEventListener("resize", refreshPosition);
      window.addEventListener("scroll", refreshPosition);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", refreshPosition);
      window.removeEventListener("scroll", refreshPosition);
    });

    setDialogPosition({ vertical: "top-inset", horizontal: "right" });

    return {
      display,
      leftStyle,
      rightStyle,
      topStyle,
      bottomStyle,
      windowStyle,
      containerStyle,
      dialogContainerClasses,
      dialogContainerStyles,
      config,
      dialogs,
      addText,
      highlight,
      dismiss,
      clearText,
      removeText,
      setConfig,
      handleBackgroudClick,
    };
  },
  components: { DialogBox },
};
</script>

<style lang="scss">
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
    position: relative;
    pointer-events: none;
  }

  &__dialog {
    width: max-content;
    height: max-content;
    &-container {
      position: absolute;
      z-index: $hud-z-index + 2;
      pointer-events: all;
      overflow: visible;

      &--content {
        display: flex;
        flex-direction: column;
        align-items: inherit;
        justify-content: inherit;
        gap: $default-spacing * 0.25;
        padding: $default-spacing * 0.5;
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
