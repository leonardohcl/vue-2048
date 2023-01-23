<template>
  <component
    :is="tag"
    class="btn"
    :class="classes"
    :type="type"
    @click="handleClick"
  >
    <slot>
      <FontAwesomeIcon :icon="icon" v-if="icon" />
      {{ text }}
    </slot>
  </component>
</template>

<script>
  import { computed } from 'vue'

  export default {
    emits: ['click'],
    props: {
      size: {
        type: String,
      },
      theme: {
        type: String,
        default: 'primary',
      },
      outlined: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        default: 'button',
      },
      text: {
        type: String,
      },
      isIcon: {
        type: Boolean,
        default: false,
      },
      icon: {
        type: String,
        default: '',
      },
      fab: {
        type: Boolean,
        default: false,
      },
      tag: { default: 'button' },
    },
    setup(props, context) {
      const classes = computed(() => [
        `btn--${props.theme}`,
        props.isIcon && `btn--icon`,
        props.size && `btn--${props.size}`,
        props.outlined && `btn--outlined`,
        props.fab && `btn--fab`,
      ])

      const handleClick = (evt) => {
        context.emit('click', evt)
      }

      return {
        classes,
        handleClick,
      }
    },
  }
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

    &--icon {
      height: 1.5em !important;
      width: 1.5em !important;
      padding: 0 !important;
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
      &--sm {
        height: 30px;
        font-size: 0.9rem;
        padding: 0 0.75em;
      }
    }
  }
</style>
