<template>
  <div class="container robot-lab">
    <h1>Robot Lab</h1>
    <div class="text-end mb-3">
      <Btn @click="openRobotList" size="sm" title="Load" />
      <Btn
        @click="resetFactory"
        size="sm"
        title="Create New"
        class="ms-2"
        v-if="this.factory"
      />
    </div>
    <Card title="Create your robot template" v-if="!factory">
      <RobotFactoryForm @created="selectFactory" />
    </Card>
    <div v-else>
      <RobotFactoryControls
        :factory="factory"
        @training="handleTrainingUpdate"
      />
    </div>
    <Card v-if="this.robot" class="mt-3">
      <template v-slot:title>
        Games played by the robot
        <Btn
          size="sm"
          title="Play"
          @click="handleRobotPlay"
          class="float-end"
        />
      </template>
      <div class="row">
        <div
          class="col-12 col-sm-6 col-md-4 col-lg-3 col-xxl-2 mt-3"
          v-for="(sample, idx) in samples"
          :key="idx"
        >
          <b>Score: </b> {{ sample.score }}
          <Board :board="sample.board" :size="4" :transitionDuration="0" />
        </div>
      </div>
    </Card>
    <RobotFactoryModal @select="handleRobotSelection" />
  </div>
</template>

<script>
  import Card from "@/components/atoms/Card.vue";
  import RobotFactoryControls from "@/components/molecules/RobotFactoryControls.vue";
  import Board from "@/components/molecules/Board.vue";
  import RobotFactoryForm from "@/components/molecules/RobotFactoryForm.vue";
  import Btn from "@/components/atoms/Btn.vue";
  import RobotFactoryModal from "@/components/organisms/RobotFactoryModal.vue";
  import { mapMutations } from "vuex";

  export default {
    components: {
      Card,
      Board,
      RobotFactoryControls,
      RobotFactoryForm,
      Btn,
      RobotFactoryModal,
    },
    data() {
      return {
        robot: null,
        factory: null,
        training: false,
        percent: 0,
        elementPercent: 0,
        samples: [],
      };
    },
    methods: {
      ...mapMutations("robots", ["removeFactory"]),
      resetFactory() {
        this.factory = null;
        this.robot = null;
      },
      handleRobotSelection(factory) {
        this.$modal.close("factory-modal");
        this.selectFactory(factory);
      },
      selectFactory(factory) {
        this.factory = factory;
        this.robot = this.factory.robot
      },
      handleTrainingUpdate(update) {
        if (update.status === "finished" || update.status == "stopped") {
          this.robot = this.factory.robot
          this.getPlayedBoards();
        }
      },
      handleRobotPlay(){
        this.getPlayedBoards();
      },
      getPlayedBoards(boardCount = 12) {
        const samples = [];
        for (let i = 0; i < boardCount; i++) {
          samples.push({
            score: this.robot.play(),
            board: this.robot.board.clone(),
          });
        }
        this.samples = samples.sort((a, b) => b.score - a.score);
      },
      openRobotList() {
        this.$modal.open("factory-modal");
      },
    },
    mounted() {
      this.openRobotList();
    },
  };
</script>
