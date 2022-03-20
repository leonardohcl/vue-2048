<template>
  <form class="robot-factory__form d-flex flex-wrap" @submit.prevent="createRobot">
    <div class="row mb-3 w-100">
      <Input
        id="name"
        label="Robot Name"
        type="text"
        v-model="robotName"
        required
        class="col-12 col-md-6 col-lg-4"
      />
    </div>
    <div class="row mb-3 w-50">
      <em class="mb-2">Game Settings</em>
      <Input
        id="boradSize"
        label="Board Size"
        type="number"
        :min="4"
        :max="10"
        v-model="boardSize"
        required
        class="col-12 col-sm-6 col-md-3"
      />
    </div>

    <div class="row mb-3 w-50">
      <em class="mb-2">Robot Settings</em>
      <Checkbox label="Use Bias" v-model="useBias" />
    </div>

    <div class="row mb-3 w-100">
      <em class="mb-2">Training Settings</em>
      <Input
        id="population"
        label="Population Size"
        type="number"
        :min="2"
        v-model="populationSize"
        required
        class="col-12 col-md-6 col-lg-3 col-xl-2"
      />
      <Input
        id="generation"
        label="Generations"
        type="number"
        :min="1"
        v-model="generationCount"
        required
        class="col-12 col-md-6 col-lg-3 col-xl-2"
      />
      <Input
        id="mutation"
        label="Mutation Probability"
        type="number"
        :min="0"
        :max="1"
        :step="0.05"
        v-model="mutationProbability"
        required
        class="col-12 col-md-6 col-lg-3 col-xl-2"
      />
      <Checkbox
        label="Use Elitism"
        v-model="useElitism"
        class="col-12"
      />
    </div>
    <div class="text-right w-100">
      <Btn type="submit">Create</Btn>
    </div>
  </form>
</template>

<script>
  import Input from "@/components/atoms/Input.vue";
  import Btn from "@/components/atoms/Btn.vue";
  import RobotFactory from "@/model/NeuralNetwork/RobotFactory";
  import Checkbox from "../atoms/Checkbox.vue";

  export default {
    components: { Input, Btn, Checkbox },
    name: "RobotFactoryForm",
    data() {
      return {
        robotName: "factory",
        boardSize: 4,
        mutationProbability: 0.2,
        generationCount: 1000,
        populationSize: 100,
        useBias: true,
        useElitism: true,
        restBetweenGenerations: 10,
      };
    },
    methods: {
      createRobot() {
        const factory = new RobotFactory(
          this.robotName,
          +this.boardSize,
          [],
          +this.populationSize,
          +this.generationCount,
          +this.mutationProbability,
          this.useElitism,
          this.useBias,
          +this.restBetweenGenerations
        );
        this.$emit("created", factory);
      },
    },
  };
</script>
