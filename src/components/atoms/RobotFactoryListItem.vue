<template>
  <li class="robot-factory-item" @click="handleSelect">
    <div class="d-flex justify-content-between">
      <b> {{ factory.id }} </b>
      <Dropdown :actions="actions" outlined size="sm" class="float-end" theme="plain" align="right">
        <FontAwesomeIcon icon="fa-ellipsis-vertical" />
      </Dropdown>
    </div>
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
  import Dropdown from "@/components/molecules/Dropdown.vue";
  import { mapMutations } from "vuex";

  export default {
    components: { ProgressBar, Dropdown },
    name: "RobotFactoryListItem",
    props: {
      factory: { type: RobotFactory, required: true },
      eventTarget: { type: String, default: "" },
    },
    data() {
      return {
        actions: [{ title: "Remove", action: this.remove }],
      };
    },
    methods: {
      ...mapMutations("robots", ["removeFactory"]),
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
      remove() {
        this.removeFactory(this.factory.id);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .robot-factory-item {
    padding: $default-spacing/2;
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
