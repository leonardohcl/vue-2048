<template>
  <div class="card">
    <div class="card__title" v-if="title">{{ title }}</div>
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

<style lang="scss" scoped>
.card {
  padding: 0.75rem;
  border-radius: $border-radius;
  border: solid 1px $bg-secondary;

  &__title{
      font-weight: bold;
      font-size: 1.2rem;
      margin-bottom: 1em;
  }
}
</style>