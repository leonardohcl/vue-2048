<template>
  <div class="robot-factory-controls">
    <p>
      <b>Generation: </b>
      {{ factory.currentGeneration }} /
      {{ factory.generationCount }}
    </p>
    <p><b>Population Size: </b>{{ factory.generationCount }}</p>
    <p><b>Mutation Probability: </b>{{ factory.mutationProbability * 100 }}%</p>
    <div class="text-right" v-if="percent < 1">
      <Btn :disabled="!training" @click="training = false">Stop</Btn>
      <Btn :disabled="training" @click="trainRobot">Train</Btn>
    </div>
    <div class="progress">
      <b>Training</b>
      <ProgressBar :percent="percent" :active="training" disable-animations />
      <div class="text-right">
        <Timer :id="timerId" />
      </div>
    </div>
  </div>
</template>

<script>
  import Btn from '@/components/atoms/Btn.vue'
  import RobotFactory from '@/model/NeuralNetwork/RobotFactory'
  import ProgressBar from '@/components/atoms/ProgressBar.vue'
  import Timer from '@/components/atoms/Timer.vue'

  const trainingProgress = {
    current: 0,
    diff: 0,
    updateThreshold: 0,
    halted: false,
  }

  export default {
    components: { Btn, ProgressBar, Timer },
    name: 'RobotFactoryControls',
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
        timerId: 'training-timer',      
      }
    },
    methods: {
      async trainRobot() {
        trainingProgress.updateThreshold =
          this.progressUpdateThreshold / this.factory.generationCount

        this.training = true
        this.$root.$emit('timerClear', this.timerId)
        this.$emit('training', {
          status: 'started',
        })

        this.halted = false

        this.$root.$emit('timerStart', this.timerId)

        await this.factory.train(this.updateProgress, this.isTraining)
        this.$root.$emit('timerStop', this.timerId)

        if (!trainingProgress.halted) {
          this.$emit('training', {
            status: 'finished',
            robot: this.factory.robot.clone(),
          })
          this.training = false
        } else {
          this.$emit('training', {
            status: 'stopped',
            robot: this.factory.robot.clone(),
          })
          trainingProgress.halted = false
        }
      },
      isTraining() {
        trainingProgress.halted = true
        return !this.training
      },
      updateProgress(data) {
        const progress = data.generation / data.generationCount
        trainingProgress.diff += progress - trainingProgress.current
        trainingProgress.current = progress
        if (trainingProgress.diff >= this.progressUpdateThreshold) {
          this.percent = trainingProgress.current
          trainingProgress.diff = 0
        }
      },
    },
  }
</script>
