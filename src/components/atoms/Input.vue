<template>
  <div class="input">
    <label :for="id" v-if="label">{{ label }}</label>
    <input
      :type="type"
      :id="id"
      :step="step"
      :min="min"
      :max="max"
      :disabled="disabled"
      v-model="inputVal"
    />
  </div>
</template>

<script>
  export default {
    name: "Input",
    props: {
      value: {},
      id: { type: String, required: true },
      type: { type: String, default: "text" },
      label: String,
      step: { type: [Number, String] },
      min: { type: [Number, String] },
      max: { type: [Number, String] },
      default: { type: [Number, String] },
      debounce: { type: Number, default: 500 },
      disabled: { type: Boolean, default: false },
    },
    computed: {
      inputVal: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit("input", val);
        },
      },
    }
  };
</script>

<style lang="scss" scoped>
  .input {
    display: flex;
    flex-direction: column;

    label {
      margin-bottom: 0.25em;
    }

    input {
      background-color: inherit;
      border: solid 1px $bg-secondary;
      border-radius: $border-radius;
      padding: 0.5em;
      color: $text-color;
      transition: border-color 0.11s, background-color 0.11s;
      margin-bottom: 0.5em;

      &:focus,
      &:focus-visible {
        outline: none;
        border-color: $primary;
        background-color: darken($bg-secondary, 10%);
      }

      &:disabled {
        background-color: darken($bg-secondary, 5%);
        color: fade-out($text-color, 0.5);
      }
    }
  }
</style>
