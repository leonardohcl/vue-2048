<template>
  <form class="robot-training-form" @submit="trainRobot">
    <Input
      id="population"
      label="Population Size"
      type="number"
      :default="100"
      :min="2"
      :disabled="training || factory != null"
      @change="value => (form.populationSize = +value)"
    />
    <Input
      id="generation"
      label="Generations"
      type="number"
      :default="1000"
      :min="1"
      :disabled="training || factory != null"
      @change="value => (form.generationCount = +value)"
    />
    <Input
      id="mutation"
      label="Mutation Probability"
      type="number"
      :default="0.2"
      :min="0"
      :max="1"
      :step="0.05"
      :disabled="training || factory != null"
      @change="value => (form.mutationProbability = +value)"
    />
    <div class="text-right">
      <Btn :disabled="training" @click="clearFactory" v-if="factory">New</Btn>
      <Btn :disabled="!training" @click="training = false">Stop</Btn>
      <Btn :disabled="training" type="submit">Train</Btn>
    </div>
    <div class="progress">
      <b>Training</b>
      <ProgressBar :percent="percent" :active="training" disable-animations />
      <div class="text-right">
        <Timer :id="timerId" />
      </div>
    </div>
  </form>
</template>

<script>
  import Btn from "@/components/atoms/Btn.vue";
  import Input from "@/components/atoms/Input.vue";
  import RobotFactory from "@/model/NeuralNetwork/RobotFactory";
  import ProgressBar from "../atoms/ProgressBar.vue";
  import Timer from "../atoms/Timer.vue";

  const trainingProgress = {
    current: 0,
    diff: 0,
    updateThreshold: 0,
    halted: false,
  };

  export default {
    components: { Btn, Input, ProgressBar, Timer },
    name: "RobotFactory",
    props: {
      progressUpdateThreshold: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        training: false,
        percent: 0,
        trainingPromise: null,
        factory: null,
        timerId: "training-timer",
        form: {
          mutationProbability: 0,
          generationCount: 0,
          populationSize: 0,
          useBias: false,
        },
      };
    },
    methods: {
      async trainRobot(evt) {
        evt.preventDefault();
        this.training = true;
        if (!this.factory) {
          this.$root.$emit("timerClear", this.timerId);
          this.percent = 0;
          trainingProgress.updateThreshold =
            this.progressUpdateThreshold / this.form.generationCount;
          this.factory = new RobotFactory(
            4,
            [],
            this.form.populationSize,
            this.form.generationCount,
            this.form.mutationProbability
          );
        }

        this.$root.$emit("timerStart", this.timerId);

        await this.factory.train(this.updateProgress, this.isTraining);
        this.$root.$emit("timerStop", this.timerId);

        if (!trainingProgress.halted) {
          this.$emit("trained", { robot: this.factory.robot.clone() });
          this.training = false;
        } else {
          trainingProgress.halted = false;
        }
      },
      clearFactory() {
        this.factory = null;
        this.$root.$emit("timerClear", this.timerId);
        this.percent = 0;
      },
      isTraining() {
        trainingProgress.halted = true;
        return !this.training;
      },
      updateProgress(data) {
        const progress = data.generation / data.generationCount;
        trainingProgress.diff += progress - trainingProgress.current;
        trainingProgress.current = progress;
        if (trainingProgress.diff >= this.progressUpdateThreshold) {
          this.percent = trainingProgress.current;
          trainingProgress.diff = 0;
        }
      },
    },
  };
</script>
