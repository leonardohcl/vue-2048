<template>
  <div
    class="page"
    :class="{
      'page--home-screen': meta.homeScreen,
    }"
  >
    <div class="page__title">
      <h1
        class="page__title--text"
        :class="{
          'page__title--redirect': meta.navigateTo,
        }"
        @click="handleRedirect"
      >
        {{ title }}
        <v-fade-transition>
          <v-chip
            v-if="gameMode"
            size="small"
            variant="elevated"
            v-bind="gameModeTheme"
            class="page__game-mode"
          >
            {{ gameMode }}
          </v-chip>
        </v-fade-transition>
      </h1>
    </div>
    <div class="page__content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();

    const meta = computed(() => router.currentRoute.value.meta);

    const title = computed(() => meta.value.title || "2048");
    const gameModeTheme = computed(
      () => meta.value.gameModeTheme || { variant: "tonal" }
    );
    const gameMode = computed(() => meta.value.gameMode as string);

    const handleRedirect = () => {
      if (router.currentRoute.value.meta.navigateTo)
        router.push(router.currentRoute.value.meta.navigateTo as string);
    };

    return {
      meta,
      title,
      gameMode,
      gameModeTheme,
      handleRedirect,
    };
  },
});
</script>

<style lang="scss">
.page {
  width: 100vw;
  height: 100vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  margin-top: 0;
  transition: all 200ms;

  @include screen-above(sm){
    padding: 2rem;
  }

  $page-class-prefix: &;

  &--home-screen {
    #{$page-class-prefix} {
      &__title {
        padding: 4rem;

        @include screen-above(sm){
          padding: 2rem
        }
        
        &--text {
          font-size: 4rem;
          // @include screen-above(sm){
          //   padding: 5rem
          // }
        }
      }
    }
  }

  &__title {
    text-align: center;
    display: flex;
    align-items: center;
    padding: 0 0 1rem;
    transition: padding $page-animation-duration $page-animation-ease;

    &--text {
      position: relative;
      display: inline-block;
      align-items: center;
      font-size: 2rem;
      font-weight: bold;
      margin: 0 auto;
      text-align: center;
      color: $text-color !important;
      text-decoration: none !important;
      transition: font-size $page-animation-duration $page-animation-ease;

      @include screen-above(sm){
        font-size: 3rem;
      }
    }

    &--redirect{
      cursor: pointer;
    }
  }

  &__game-mode {
    position: absolute !important;
    text-transform: capitalize;
    font-weight: bold !important;
    bottom: -1em;
    right: -2em;
    transform: scale(0.8);
  }

  &__content {
    position: relative;
    flex: 0 1 100%;

    & > * {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
