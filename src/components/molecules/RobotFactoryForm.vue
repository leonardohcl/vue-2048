<template>
  <form class="robot-factory__form" @submit.prevent="createRobot">
    <Input
      id="population"
      label="Population Size"
      type="number"
      :min="2"
      v-model="populationSize"
      required
    />
    <Input
      id="generation"
      label="Generations"
      type="number"
      :min="1"
      v-model="generationCount"
      required
    />
    <Input
      id="mutation"
      label="Mutation Probability"
      type="number"
      :min="0"
      :max="1"
      :step="0.05"
      v-model="mutationProbability"
      required
    />
    <div class="text-right">
      <Btn type="submit">Create</Btn>
    </div>
  </form>
</template>

<script>
  import Input from '@/components/atoms/Input.vue'
  import Btn from '@/components/atoms/Btn.vue'
  import RobotFactory from '@/model/NeuralNetwork/RobotFactory'

  export default {
    components: { Input, Btn },
    name: 'RobotFactoryForm',
    data() {
      return {
        mutationProbability: 0,
        generationCount: 0,
        populationSize: 0,
        mutationProbability: 0.2,
        generationCount: 1000,
        populationSize: 100,
        useBias: false,
      }
    },
    methods: {
      createRobot() {
        const factory = new RobotFactory(
          "factory",
          4,
          [],
          this.populationSize,
          this.generationCount,
          this.mutationProbability
        )
        this.$emit('created', factory)
      },
    },
  }
</script>
