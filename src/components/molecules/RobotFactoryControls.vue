<template>
  <Card class="robot-factory-controls">
    <p class="mt-0">
      <b style="font-size: 1.25em">{{ factory.id }}</b> <br />
      <small>Board: {{ factory.boardSize }}x{{ factory.boardSize }}</small> |
      <small class="ms"
        >Robot uses Bias: {{ factory.useBias ? "Yes" : "No" }}</small
      >
    </p>
    <p><em>Training</em></p>
    <p>
      <b>Generation: </b>
      {{ factory.currentGeneration }} /
      {{ factory.generationCount }}
    </p>
    <p><b>Population Size: </b>{{ factory.populationSize }}</p>
    <p><b>Mutation Probability: </b>{{ factory.mutationProbability * 100 }}%</p>
    <p><b>Using Elitism:</b> {{ factory.useElitism ? "Yes" : "No" }}</p>
    <div class="progress mb-3">
      <b>Training</b>
      <ProgressBar
        :percent="percent"
        :active="training"
        disable-animations
        show-progress
      />
      <div class="text-end">
        <Timer :id="timerId" />
      </div>
    </div>
    <div class="text-end">
      <Btn
        :disabled="training || factory.currentGeneration == 0"
        @click="handleSave"
        title="Save"
        size="sm"
      />
      <Btn
        :disabled="!training"
        @click="training = false"
        class="mx-2"
        title="Stop"
        size="sm"
        v-if="percent < 1"
      />
      <Btn :disabled="training" @click="trainRobot" title="Train" size="sm"   v-if="percent < 1"/>
    </div>
  </Card>
</template>

<script>
  import Btn from "@/components/atoms/Btn.vue";
  import RobotFactory from "@/model/NeuralNetwork/RobotFactory";
  import ProgressBar from "@/components/atoms/ProgressBar.vue";
  import Timer from "@/components/atoms/Timer.vue";
  import Card from "@/components/atoms/Card.vue";
  import { mapMutations } from "vuex";

  const trainingProgress = {
    current: 0,
    diff: 0,
    updateThreshold: 0,
    halted: false,
  };

  export default {
    components: { Btn, ProgressBar, Timer, Card },
    name: "RobotFactoryControls",
    props: {
      factory: { type: RobotFactory, required: true },
      progressUpdateThreshold: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        training: false,
        percent: this.factory.currentGeneration / this.factory.generationCount,
        trainingPromise: null,
        timerId: "training-timer",
      };
    },
    methods: {
      ...mapMutations("robots", ["saveFactory"]),
      handleSave() {
        this.saveFactory(this.factory);
      },
      async trainRobot() {
        trainingProgress.updateThreshold =
          this.progressUpdateThreshold / this.factory.generationCount;

        this.training = true;
        this.$root.$emit("timerClear", this.timerId);
        this.$emit("training", {
          status: "started",
        });

        this.halted = false;

        this.$root.$emit("timerStart", this.timerId);

        await this.factory.train(this.updateProgress, this.isTraining);
        this.$root.$emit("timerStop", this.timerId);

        if (!trainingProgress.halted) {
          this.$emit("training", {
            status: "finished",
            robot: this.factory.robot.clone(),
          });
          this.training = false;
        } else {
          this.$emit("training", {
            status: "stopped",
            robot: this.factory.robot.clone(),
          });
          trainingProgress.halted = false;
        }
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
