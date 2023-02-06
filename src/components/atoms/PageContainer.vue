<template>
  <div
    class="page"
    :class="{
      'page--home-screen': meta.homeScreen,
    }"
  >
    <div class="page__title--container">
      <h1
        class="page__title"
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
  import { computed, defineComponent } from 'vue'
  import { useRouter } from 'vue-router'

  export default defineComponent({
    setup() {
      const router = useRouter()

      const meta = computed(() => router.currentRoute.value.meta)

      const title = computed(() => meta.value.title || '2048')
      const gameModeTheme = computed(
        () => meta.value.gameModeTheme || { variant: 'tonal' }
      )
      const gameMode = computed(() => meta.value.gameMode as string)

      const handleRedirect = () => {
        if (router.currentRoute.value.meta.navigateTo)
          router.push(router.currentRoute.value.meta.navigateTo as string)
      }

      return {
        meta,
        title,
        gameMode,
        gameModeTheme,
        handleRedirect,
      }
    },
  })
</script>

<style lang="scss">
  .page {
    width: 100%;
    max-width: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    margin-top: 0;
    transition: all 200ms;

    $page-class-prefix: &;

    &--home-screen {
      #{$page-class-prefix} {
        &__title {
          font-size: 6rem;

          &--container {
            padding: 8rem 0 4rem;
          }
        }
      }
    }

    &__title {
      position: relative;
      display: inline-block;
      align-items: center;
      font-size: 3rem;
      font-weight: bold;
      margin: 0 auto;
      text-align: center;
      color: $text-color !important;
      text-decoration: none !important;
      transition: font-size $page-animation-duration $page-animation-ease;

      &--container {
        text-align: center;
        display: flex;
        align-items: center;
        padding: 1rem 0;
        transition: padding $page-animation-duration $page-animation-ease;
      }

      &--redirect {
        cursor: pointer;
      }
    }

    &__game-mode {
      position: absolute !important;
      text-transform: capitalize;
      font-weight: bold !important;
      bottom: -5px;
      right: -10px;
    }

    &__content {
      position: relative;
      flex: 1 1 auto;
      & > * {
        width: 100%;
        flex-shrink: 0;
      }
    }
  }
</style>
