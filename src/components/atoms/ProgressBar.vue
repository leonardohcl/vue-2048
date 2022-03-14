<template>
  <div class="progress-bar">
    <div
      class="progress-bar__progress"
      :class="{ 'progress-bar__progress--active': active }"
      :style="progressStyle"
    ></div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    percent: Number,
    active: Boolean,
  },
  computed: {
    progressStyle() {
      return {
        width: `${this.percent * 100}%`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/base";

.progress-bar {
  height: 1.5em;
  width: 100%;
  background-color: $bg-surface;
  border-radius: $square-border-radius;
  margin: 0.5rem 0;
  text-align: center;
  overflow: hidden;

  &__progress {
    height: 100%;
    background-color: $primary;
    border-radius: inherit;
    transition: width 200ms ease-out;

    &--active {
      animation: active 500ms alternate infinite;
    }
  }
}

@keyframes active {
  from {
    background-color: $primary;
  }

  to {
    background-color: $secondary;
  }
}
</style>