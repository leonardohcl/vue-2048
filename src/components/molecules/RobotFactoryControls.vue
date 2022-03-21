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
    <p>
      <b>Best Score:</b> {{ factory.score }} (gen {{ factory.bestGeneration }})
    </p>
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
      <LineChart
        :labels="progressChartLabels"
        :sets="progressChartSets"
        :y-min="0"
        v-if="!hideProgressChart"
      />
    </div>
    <div class="text-end">
      <Btn :disabled="training" @click="handleSave" title="Save" size="sm" />
      <Btn
        :disabled="!training"
        @click="training = false"
        class="mx-2"
        title="Stop"
        size="sm"
        v-if="percent < 1"
      />
      <Btn
        :disabled="training"
        @click="trainRobot"
        title="Train"
        size="sm"
        v-if="percent < 1"
      />
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
  import LineChart from "@/components/atoms/LineChart";
  import { range } from "@/utils/array";

  const trainingProgress = {
    current: 0,
    diff: 0,
    updateThreshold: 0,
    halted: false,
  };

  export default {
    components: { Btn, ProgressBar, Timer, Card, LineChart },
    name: "RobotFactoryControls",
    props: {
      factory: { type: RobotFactory, required: true },
      progressUpdateThreshold: {
        type: Number,
        default: 0,
      },
      hideProgressChart: Boolean,
    },
    data() {
      return {
        training: false,
        percent: this.factory.currentGeneration / this.factory.generationCount,
        trainingPromise: null,
        timerId: "training-timer",
        goatProgress: this.factory.generationsGoats,
        bestProgress: this.factory.generationsBests,
        averageProgress: this.factory.generationsAverages,
        currentGeneration: this.factory.currentGeneration,
      };
    },
    computed: {
      progressChartLabels() {
        if (this.hideProgressChart) return [];
        if (this.currentGeneration < 100) return range(100);

        const diff = this.currentGeneration - this.bestProgress.length;
        return range(diff, diff + 100);
      },
      progressChartSets() {
        if (this.hideProgressChart) return [];
        return [
          {
            label: "Best All Time Score",
            data: this.goatProgress,
            pointRadius: 0,
            color: "#f72585",
          },
          {
            label: "Best Gen Score",
            data: this.bestProgress,
            pointRadius: 0,
            color: "#00a7da",
          },
          {
            label: "Average Gen Score",
            data: this.averageProgress,
            pointRadius: 0,
            color: "#294ce7",
          },
        ];
      },
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
          this.training = false;
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
          this.currentGeneration = data.generation;
          if (!this.hideProgressChart) {
            this.averageProgress = this.factory.generationsAverages;
            this.bestProgress = this.factory.generationsBests;
            this.goatProgress = this.factory.generationsGoats;
          }
        }
      },
    },
  };
</script>
