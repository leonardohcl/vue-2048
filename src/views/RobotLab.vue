<template>
  <div class="container robot-lab">
    <h1>Robot Lab</h1>
    <Card title="Train your robot">
      <RobotTrainingForm @training="handleTrainingUpdate" />
      <div class="progress" v-if="training || robot">
        <b>Current Generation</b>
        <ProgressBar :percent="elementPercent" :active="training" />
        <b>Training</b>
        <ProgressBar :percent="percent" :active="training" />
      </div>
    </Card>
    <Card v-if="samples.length > 0" title="Games played by the robot">
      <div class="samples">
        <div class="sample" v-for="(sample, idx) in samples" :key="idx">
          <b>Score: </b> {{ sample.score }}
          <Board :board="sample.board" :size="4" :transitionDuration="0" />
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from "../components/atoms/Card.vue";
import RobotTrainingForm from "../components/molecule/RobotTrainingForm.vue";
import ProgressBar from "../components/atoms/ProgressBar.vue";
import Board from "../components/molecule/Board.vue";
export default {
  components: { Card, RobotTrainingForm, ProgressBar, Board },
  data() {
    return {
      robot: null,
      training: false,
      percent: 0,
      elementPercent: 0,
      samples: [],
    };
  },
  methods: {
    async handleTrainingUpdate(update) {
      if (update.status === "running") {
        this.percent = 0;
        this.training = true;
      } else if (update.status === "generation") {
        this.elementPercent = 0;
        this.percent = update.data.generation / update.data.generationCount;
      } else if (update.status === "element") {
        this.elementPercent =
          (update.data.element + 1) / update.data.elementCount;
      } else if (update.status === "finished") {
        this.robot = update.robot;
        this.percent = 1;
        this.elementPercent = 1;
        await this.getSampleBoards();
        this.training = false;
      }
    },
    async getSampleBoards(count = 5) {
      const samples = [];
      for (let i = 0; i < count; i++) {
        samples.push({
          score: await this.robot.play(),
          board: this.robot.board.clone(),
        });
      }
      this.samples = samples;
    },
  },
};
</script>

<style lang="scss">
.samples {
  display: flex;
  flex-wrap: wrap;

  .sample {
    width: 250px;
    padding: 1em;
  }
}
</style>