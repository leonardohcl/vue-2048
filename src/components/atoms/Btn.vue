<template>
  <component
    :is="tag"
    class="btn"
    :class="classes"
    :type="type"
    :to="to"
    @click.stop="handleClick"
  >
    <slot>
      {{ title }}
    </slot>
  </component>
</template>

<script>
  export default {
    props: {
      size: {
        type: String,
      },
      theme: {
        type: String,
        default: "primary",
      },
      outlined: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        default: "button",
      },
      title: {
        type: String,
      },
      fab: Boolean,
      tag: { default: "button" },
      to: { type: [String, Object] },
    },
    methods: {
      handleClick(evt) {
        this.$emit("click", evt);
      },
    },
    computed: {
      classes() {
        return [
          `btn--${this.theme}`,
          this.size && `btn--${this.size}`,
          this.outlined && `btn--outlined`,
          this.fab && `btn--fab`,
        ];
      },
    },
  };
</script>

<style lang="scss" scoped>
  .btn {
    border: none;
    outline: none;
    height: 40px;
    padding: 0 1em;
    border-radius: $border-radius;
    text-align: center;
    font-size: 1.2rem;
    font-family: inherit;
    font-weight: bold;
    transition: background-color 0.1s;
    color: black;
    cursor: pointer;

    &--sm {
      height: 20px;
      font-size: 0.8rem;
      padding: 0 0.5em;
    }

    &--fab {
      border-radius: 50%;
      padding: 0 !important;
      width: 3em;
      height: 3em !important;
    }

    @each $key, $value in $themes {
      &--#{$key} {
        background-color: $value;

        &:focus {
          outline: solid 2px fade-out($value, 0.5);
        }

        &:hover {
          background-color: darken($value, 7.5%);
        }

        &:active {
          background-color: darken($value, 12%);
        }

        &:disabled {
          color: rgba(0, 0, 0, 0.3);
          background-color: desaturate(darken($value, 5%), 50%);
        }

        &.btn--outlined {
          background-color: transparent;
          color: $value;

          &:hover {
            background-color: $value;
            color: black;
          }

          &:active {
            background-color: darken($value, 12%);
          }

          &:disabled {
            color: desaturate(darken($value, 5%), 50%);
            background-color: transparent;
          }
        }
      }
    }
  }

  @include screen-above(md) {
    .btn {
      height: 50px;
      padding: 0 1.3em;
      font-size: 1.3rem;

      &--sm {
        height: 30px;
        font-size: 0.9rem;
        padding: 0 0.75em;
      }
    }
  }
</style>
