<template>
  <div class="container robot-lab">
    <h1>Robot Lab</h1>
    <Card title="Train your robot">
      <RobotFactory @trained="handleTrainingUpdate" />
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
  import Card from '../components/atoms/Card.vue'
  import RobotFactory from '../components/molecule/RobotFactory.vue'
  import Board from '../components/molecule/Board.vue'

  export default {
    components: { Card, RobotFactory, Board },
    data() {
      return {
        robot: null,
        training: false,
        percent: 0,
        elementPercent: 0,
        samples: [],
      }
    },
    methods: {
      handleTrainingUpdate(update) {
        this.robot = update.robot
        this.getSampleBoards()
      },
      getSampleBoards(count = 12) {
        this.samples = []
        for (let i = 0; i < count; i++) {
          this.samples.push({
            score: this.robot.play(),
            board: this.robot.board.clone(),
          })
        }
      },
    },
  }
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
