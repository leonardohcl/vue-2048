<template>
  <div class="container robot-lab">
    <h1>Robot Lab</h1>
    <Card title="Create your robot template" v-if="factory === null">
      <RobotFactoryForm @created="handleFactoryCreated" />
    </Card>
    <Card title="Train your robot" v-else>
      <RobotFactoryControls :factory="factory" @training="handleTrainingUpdate" />
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
  import Card from '@/components/atoms/Card.vue'
  import RobotFactoryControls from '@/components/molecules/RobotFactoryControls.vue'
  import Board from '@/components/molecules/Board.vue'
  import RobotFactoryForm from '@/components/molecules/RobotFactoryForm.vue'

  export default {
    components: { Card, Board, RobotFactoryControls, RobotFactoryForm },
    data() {
      return {
        robot: null,
        factory: null,
        training: false,
        percent: 0,
        elementPercent: 0,
        samples: [],
      }
    },
    methods: {
      handleFactoryCreated(factory){
        this.factory = factory;
      },
      handleTrainingUpdate(update) {
        if (update.status === 'stopped' || update.status === 'finished') {
          this.robot = update.robot
          this.getSampleBoards()
        }
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
