<template>
  <div class="container robot-lab">
    <h1>Robot Lab</h1>
    <div class="text-right mb-3">
        <Btn @click="resetFactory" size="sm" title="Create New" v-if="this.factory"/>
    </div>
    <Card title="Create your robot template" v-if="!factory">
      <RobotFactoryForm @created="handleFactoryCreated" />
    </Card>
    <div v-else>
      <RobotFactoryControls
        :factory="factory"
        @training="handleTrainingUpdate"
      />
    </div>
    <Card v-if="this.robot" title="Games played by the robot" class="mt-3">
      <div class="row">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xxl-2" v-for="(sample, idx) in samples" :key="idx">
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
        const samples = []
        for (let i = 0; i < count; i++) {
          samples.push({
            score: this.robot.play(),
            board: this.robot.board.clone(),
          })
        }
        this.samples = samples;
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
