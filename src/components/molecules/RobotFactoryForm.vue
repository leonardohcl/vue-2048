<template>
  <form class="robot-factory__form" @submit.prevent="createRobot">
    <Input
      id="population"
      label="Population Size"
      type="number"
      :default="100"
      :min="2"
      @change="(value) => (populationSize = +value)"
    />
    <Input
      id="generation"
      label="Generations"
      type="number"
      :default="1000"
      :min="1"
      @change="(value) => (generationCount = +value)"
    />
    <Input
      id="mutation"
      label="Mutation Probability"
      type="number"
      :default="0.2"
      :min="0"
      :max="1"
      :step="0.05"
      @change="(value) => (mutationProbability = +value)"
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
