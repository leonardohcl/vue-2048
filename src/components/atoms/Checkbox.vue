<template>
  <label class="checkbox">
    <div class="checkbox__check">
      <input type="checkbox" v-model="inputValue" />
      <span class="checkmark"></span>
    </div>
    {{ label }}
  </label>
</template>

<script>
  export default {
    name: "Checkbox",
    props: {
      value: {},
      label: String,
    },
    computed: {
      inputValue: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit("input", val);
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/styles/base";

  .checkbox {
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    user-select: none;
    margin: 0.5em 0;

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;

      & ~ .checkmark {
        background-color: $bg-surface;
      }

      &:checked {
        & ~ .checkmark {
          background-color: $primary;

          &::after {
            display: block;
          }
        }
      }
    }

    &__check {
      margin-right: 0.5em;
    }
  }

  .checkmark {
    height: 1.25rem;
    width: 1.25rem;
    background-color: #eee;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: $square-border-radius/2;

    &::after {
      content: "";
      display: none;
      width: 0.25rem;
      height: 0.5rem;
      border: solid white;
      border-width: 0 3px 3px 0;
      transform: rotate(45deg);
    }
  }
</style>
