<template>
  <div class="page">
    <div class="page__title--container">
      <component
        class="page__title"
        :is="navigateTo ? 'router-link' : 'h1'"
        v-bind="{ to: navigateTo }"
        >{{ title }}</component
      >
      <small
        v-if="subtitle"
        class="page__subtitle badge"
        v-bind="subtitleOptions"
        >{{ subtitle }}</small
      >
    </div>
    <slot />
  </div>
</template>

<script>
  export default {
    props: {
      title: { type: String, default: '2048' },
      navigateTo: { type: String, default: null },
      subtitle: { type: String },
      subtitleOptions: {
        type: Object,
        default: () => ({ class: 'badge-secondary' }),
      },
    },
  }
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
      right: -15%;
      bottom: -10%;
    }
  }
</style>
