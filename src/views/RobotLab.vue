<template>
  <div class="container robot-lab">
    <h1>Robot Lab</h1>
    <Card title="Create your robot template" v-if="!factory">
      <RobotFactoryForm @created="handleFactoryCreated" />
    </Card>
    <Card title="Train your robot" v-else>
      <div class="text-right">
        <Btn @click="resetFactory">Create New</Btn>
      </div>
      <RobotFactoryControls
        :factory="factory"
        @training="handleTrainingUpdate"
      />
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
  import { mapGetters, mapMutations } from 'vuex'
  import Btn from '../components/atoms/Btn.vue'

  export default {
    components: { Card, Board, RobotFactoryControls, RobotFactoryForm, Btn },
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
    computed: {
      ...mapGetters('robots', ['getFactory']),
    },
    methods: {
      ...mapMutations('robots', ['removeFactory']),
      resetFactory() {
        this.removeFactory(this.factory.id)
        this.factory = null
      },
      handleFactoryCreated(factory) {
        this.factory = factory
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
      loadFactory() {
        this.factory = this.getFactory('factory')
      },
    },
    mounted() {
      this.loadFactory()
    },
  }
</script>

<style lang="scss" scoped>
  .samples {
    display: flex;
    flex-wrap: wrap;

    .sample {
      width: 250px;
      padding: 1em;
    }
  }
</style>
