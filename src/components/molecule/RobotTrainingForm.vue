<template>
  <form class="robot-training-form" @submit="trainRobot">
    <Input
      id="population"
      label="Population Size"
      type="number"
      :default="100"
      :min="2"
      :disabled="training"
      @change="(value) => (form.populationSize = +value)"
    />
    <Input
      id="generation"
      label="Generations"
      type="number"
      :default="1000"
      :min="1"
      :disabled="training"
      @change="(value) => (form.generationCount = +value)"
    />
    <Input
      id="mutation"
      label="Mutation Probability"
      type="number"
      :default="0.2"
      :min="0"
      :max="1"
      :step="0.05"
      :disabled="training"
      @change="(value) => (form.mutation = +value)"
    />
    <div class="text-right">
      <Btn :disabled="training">Train</Btn>
    </div>
  </form>
</template>

<script>
import Btn from "@/components/atoms/Btn.vue";
import Input from "@/components/atoms/Input.vue";
import Robot from "@/model/NeuralNetwork/Robot";
export default {
  components: { Btn, Input },
  name: "RobotTrainingForm",
  data() {
    return {
      training: false,
      form: {
        mutation: 0,
        generationCount: 0,
        populationSize: 0,
        useBias: false,
      },
    };
  },
  methods: {
    async trainRobot(evt) {
      evt.preventDefault();
      this.$emit("training", { status: "running" });
      this.training = true;
      const robot = await Robot.getTrained(
        [],
        this.form.populationSize,
        this.form.generationCount,
        this.form.mutation,
        false,
        (data) => {
          this.$emit("training", { status: "generation", data });
        },
        (data) => {
          this.$emit("training", { status: "element", data });
        }
      );
      this.$emit("training", { status: "finished", robot });
      this.training = false;
    },
  },
};
</script>