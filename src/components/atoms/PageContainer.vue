<template>
  <div class="page">
    <div class="page__title--container">
      <component
        class="page__title"
        :is="navigateTo ? 'router-link' : 'h1'"
        v-bind="{ to: navigateTo }"
        >{{ title }}</component
      >

      <v-fade-transition>
        <v-badge
          v-if="subtitle"
          v-bind="subtitleOptions"
          class="page__subtitle"
          inline
          :content="subtitle"
        />
      </v-fade-transition>
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
export default {
  props: {
    title: { type: String, default: "2048" },
    navigateTo: { type: String, default: null },
    subtitle: { type: String },
    subtitleOptions: {
      type: Object,
      default: () => ({ color: "secondary" }),
    },
  },
};
</script>

<style lang="scss">
.page {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 100vw;
  min-height: 100vh;

  &__title {
    font-size: 3rem;
    margin-bottom: 0;
    color: $text-color !important;
    text-decoration: none !important;

    &--container {
      position: relative;
      margin-bottom: 2rem;
    }
  }
  &__subtitle {
    position: absolute;
    right: -10px;
    bottom: 0;
  }
}
</style>
