<template>
  <div
    class="progress-bar"
    :class="{
      'progress-bar--no-animations': disableAnimations,
      'progress-bar--small': small,
    }"
  >
    <span class="progress-bar__percentage progress-bar__percentage--reverse" v-if="showProgress">
      {{ percentage }}%
    </span>
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
      percent: { type: Number, default: 0 },
      small: Boolean,
      active: Boolean,
      showProgress: Boolean,
      disableAnimations: Boolean,
    },
    computed: {
      progressStyle() {
        return {
          width: `${this.percentage}%`,
        };
      },
      percentage() {
        return (this.percent * 100).toFixed(2);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .progress-bar {
    $container: &;

    position: relative;
    height: 1.5rem;
    width: 100%;
    background-color: $bg-secondary;
    border-radius: $border-radius;
    margin: 0.5rem 0;
    text-align: center;
    overflow: hidden;

    &__percentage {
      position: absolute;
      text-align: center;
      left: 0;
      right: 0;
    }

    &--small {
      height: 0.8rem;
      font-size: 0.75rem;
    }

    &:not(#{$container}--no-animations) {
      &__progress {
        transition: width 200ms ease-out;

        &--active {
          animation: active 1s alternate infinite;
        }
      }
    }

    &__progress {
      height: 100%;
      background-color: $primary;
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
