<template>
  <div class="card">
    <div class="card__title" v-if="title">
      <span class="mb-2">
        {{ title }}
      </span>
    </div>
    <div class="card__title" v-else>
      <slot name="title" />
    </div>
    <div class="card__body">
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    name: "Card",
    props: {
      title: String,
    },
  };
</script>

<style lang="scss">
  .card {
    padding: $default-spacing / 2;
    border-radius: $border-radius;
    border: solid 1px $bg-secondary;

    &__title {
      font-weight: bold;
      font-size: 1.2rem;
    }
  }
</style>
