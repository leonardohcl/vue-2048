<template>
  <li class="robot-factory-item" @click="handleSelect">
    <b> {{ factory.id }} </b>
    <div class="d-flex justify-content-between">
      <small>Board {{ factory.boardSize }}x{{ factory.boardSize }}</small>
      <small
        >{{ factory.populationSize }} robots evolving for
        {{ factory.generationCount }} generations</small
      >
    </div>
    <ProgressBar
      :percent="factory.currentGeneration / factory.generationCount"
      small
    />
  </li>
</template>

<script>
  import RobotFactory from "@/model/NeuralNetwork/RobotFactory";
  import ProgressBar from "./ProgressBar.vue";

  export default {
    components: { ProgressBar },
    name: "RobotFactoryListItem",
    props: {
      factory: { type: RobotFactory, required: true },
      eventTarget: { type: String, default: "" },
    },
    methods: {
      handleSelect() {
        let el = this;
        while (this.eventTarget && el.$parent) {
          if (el.$parent.$options.name === this.eventTarget) {
            el.$parent.$emit("select", this.factory);
            return;
          }
          el = el.$parent;
        }
        this.$emit("select", this.factory);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .robot-factory-item {
    padding: $default-spacing/2;
    list-style: none;
    border: solid 1px $bg-secondary;
    border-bottom-color: transparent;
    background-color: $bg;
    transition: background-color 0.1s;
    cursor: pointer;

    &:first-child {
      border-top-right-radius: $border-radius;
      border-top-left-radius: $border-radius;
    }

    &:last-child {
      border-bottom-right-radius: $border-radius;
      border-bottom-left-radius: $border-radius;
      border-bottom-color: $bg-secondary;
    }

    &:hover {
      background-color: fade-out($primary, 0.9);
    }

    &:active {
      background-color: fade-out($primary, 0.75);
    }
  }
</style>
