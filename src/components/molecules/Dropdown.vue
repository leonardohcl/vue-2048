<template>
  <div class="dropdown" :class="classes">
    <Btn
      class="dropdown__button"
      type="button"
      :size="size"
      :outlined="outlinedActive"
      :theme="theme"
      @click.prevent="handleClick"
    >
      <span class="dropdown__button-container" v-if="title">
        {{ title }}
      </span>
      <span class="dropdown__buttons--container" v-else>
        <slot />
      </span>
    </Btn>
    <transition name="slide-down">
      <ul class="dropdown__items" :class="`dropdown__items--align-${align}`" v-if="open">
        <li
          class="dropdown__item"
          v-for="(action, idx) in actions"
          :key="idx"
          @click.stop="handleAction(action.action)"
        >
          {{ action.title }}
        </li>
      </ul>
    </transition>
    <div class="dropdown__backdrop" @click.stop="toggle(false)" v-if="open" />
  </div>
</template>

<script>
  import Btn from "../atoms/Btn.vue";
  export default {
    components: { Btn },
    name: "Dropdown",
    props: {
      title: String,
      actions: { type: Array, required: true },
      size: String,
      outlined: Boolean,
      theme: { type: String, default: "primary" },
      align: { type: String, default: "left" },
    },
    data() {
      return {
        open: false,
      };
    },
    computed: {
      classes() {
        return [
          `dropdown--${this.theme}`,
          this.open && "dropdown--open",
          this.size && `dropdown--${this.size}`,
        ];
      },
      outlinedActive() {
        return this.outlined ? !this.open : false;
      },
    },
    methods: {
      handleClick() {
        this.toggle();
      },
      handleAction(action) {
        action();
        this.toggle(false);
      },
      toggle(value) {
        this.open = value === undefined ? !this.open : value;
      },
    },
  };
</script>

<style lang="scss" scoped>
  $list-space: 0.2em;
  .dropdown {
    $container: &;
    position: relative;
    display: inline-block;

    &__items {
      list-style: none;
      padding: 0;
      background: $bg-secondary;
      position: absolute;
      top: calc(100% + #{$list-space});
      min-width: 100%;
      border-radius: $border-radius;
      z-index: 100;

      @include transition-animation(slide-down, 0.1s, ease);

      &--align-left {
        left: 0;
      }

      &--align-right {
        right: 0;
      }
    }

    &__item {
      padding: 1em 1.5em;
      background: transparent;
      transition: background-color 0.1s;

      &:first-child {
        border-top-right-radius: $border-radius;
        border-top-left-radius: $border-radius;
      }

      &:last-child {
        border-bottom-right-radius: $border-radius;
        border-bottom-left-radius: $border-radius;
      }
    }

    &__backdrop {
      background-color: transparent;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 98;
    }

    &--open {
      #{$container}__button {
        position: relative;
        z-index: 99;
      }
    }

    &--sm {
      #{$container}__item {
        padding: 0.5em 1em;
        font-size: 0.8em;
      }
    }

    @each $key, $value in $themes {
      &--#{$key} {
        #{$container}__item {
          &:hover {
            background-color: fade-out($value, 0.75);
          }

          &:active {
            background-color: fade-out($value, 0.5);
          }
        }
      }
    }
  }

  @keyframes slide-down {
    from {
      opacity: 0;
      top: 90%;
    }
    to {
      opacity: 1;
      top: calc(100% + #{$list-space});
    }
  }
</style>
