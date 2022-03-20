<template>
  <transition name="fade">
    <div
      class="modal"
      :class="centered ? 'align-items-center' : 'align-items-start'"
      v-if="open"
    >
      <div class="modal__overlay" @click="toggle(false)" />
      <div
        class="modal__window"
        :class="{ 'modal__window--full-width': fullWidth }"
      >
        <div class="modal__title mb-3">
          <slot name="title">
            {{ title }}
            <button
              class="modal__close float-end"
              type="button"
              @click="toggle(false)"
            >
              x
            </button>
          </slot>
        </div>
        <div class="modal__body">
          <slot />
        </div>
        <div class="modal__footer">
          <slot name="footer" />
        </div>
      </div>
      <Keypress :key="27" key-event="keydown" @success="handleEscKey" />
    </div>
  </transition>
</template>

<script>
  import Keypress from "vue-keypress";

  export default {
    components: { Keypress },
    name: "Modal",
    props: {
      id: { type: String },
      centered: Boolean,
      fullWidth: Boolean,
      title: String,
    },
    data() {
      return {
        open: false,
      };
    },
    methods: {
      toggle(value) {
        this.open = value === undefined ? !this.open : value;
        if (this.open) this.$emit("open");
        else this.$emit("close");
      },
      handleEscKey(keypress) {
        if (keypress.event.keyCode == 27) {
          keypress.event.preventDefault();
          this.toggle(false);
        }
      },
    },
    mounted() {
      this.$modal.events.$on("open", id => {
        if (id === this.id) this.toggle(true);
      });

      this.$modal.events.$on("close", id => {
        if (id === this.id) this.toggle(false);
      });
    },
  };
</script>

<style lang="scss" scoped>
  $animation-duration: 0.2s;
  .modal {
    $container: &;
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    padding: 10vh 0;

    @include transition-animation-enter(fade, $animation-duration, ease) {
      #{$container}__window {
        animation: slide-down $animation-duration ease-out;
      }
    }

    @include transition-animation-leave(fade, $animation-duration, ease) {
      #{$container}__window {
        animation: slide-down $animation-duration ease-out reverse;
      }
    }

    &__overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: fade-out($bg, 0.25);
    }

    &__window {
      position: relative;
      background-color: $bg-secondary;
      border-radius: $border-radius;
      padding: 0.75rem;
      max-height: 80vh;
      max-width: 350px;
      width: 100%;

      @include screen-above(sm) {
        max-width: map-get($breakpoints, sm) * 0.75;
      }
      @include screen-above(md) {
        max-width: map-get($breakpoints, md) * 0.75;
      }
      @include screen-above(lg) {
        max-width: map-get($breakpoints, lg) * 0.75;
      }

      &--full-width {
        max-width: 1440px;
      }
    }

    &__title {
      font-size: 2rem;
      font-weight: bold;
    }

    &__close {
      font-size: 1.25rem;
      font-weight: bold;
      background-color: transparent;
      border: none;
      color: inherit;
      transition: color 0.11s ease;

      &:hover {
        color: darken($text-color, 25%);
      }
    }

    &__footer {
      &:empty {
        display: none;
      }
    }
  }

  @keyframes slide-down {
    from {
      transform: translateY(-25px);
    }
    top {
      transform: translate(0);
    }
  }
</style>
