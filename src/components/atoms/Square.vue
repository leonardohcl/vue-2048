<template>
  <div class="square">
    <div
      class="square__block"
      :class="blockClasses"
      :style="blockStyles"
      v-if="data.value"
    >
      {{ data.value }}
    </div>
  </div>
</template>

<script>
  import Square from '../../model/Square'

  export default {
    name: 'Square',
    props: {
      data: {
        type: Square,
        required: true,
      },
      transitionDuration: {
        type: Number,
        required: true,
      },
      gap: {
        type: Number,
        required: true,
      },
    },
    computed: {
      stepSize() {
        return this.data.nextMove.horizontal || this.data.nextMove.vertical
      },
      blockClasses() {
        return [`square__block--${this.data.value}`]
      },
      blockStyles() {
        if (this.stepSize) {
          const styles = {
              transform: '',
              transition: `transform ${this.transitionDuration}ms ease-out`,
            },
            transform = `calc(${this.stepSize * -100}% + ${
              this.stepSize * -this.gap
            }em)`

          if (this.data.nextMove.horizontal) {
            styles.transform = `translateX(${transform})`
          } else {
            styles.transform = `translateY(${transform})`
          }

          return styles
        }
        return {}
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/base';

  .square {
    width: $square-size;
    height: $square-size;
    border-radius: $square-border-radius;
    background-color: $square-color;

    &__block {
      width: 100%;
      height: 100%;
      border-radius: inherit;
      color: white;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(0, 0);

      @each $key, $value in $block-colors {
        &--#{$key} {
          background-color: $value;
        }
      }
    }
  }
</style>
