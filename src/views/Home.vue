<template>
  <div class="home">
    <h1>2048</h1>
    <Game :game="game" />
    <FabContainer>
      <Btn
        fab
        size="sm"
        class="mb-2"
        theme="danger"
        v-if="robot"
        @click="clearRobot"
      >
        <FontAwesomeIcon icon="fa-xmark" />
      </Btn>
      <Btn
        fab
        size="sm"
        class="mb-2"
        v-if="robot && !autoplay"
        @click="startAutoPlay"
      >
        <FontAwesomeIcon icon="fa-play" />
      </Btn>
      <Btn
        fab
        size="sm"
        class="mb-2"
        v-if="robot && autoplay"
        @click="stopAutoPlay"
      >
        <FontAwesomeIcon icon="fa-pause" />
      </Btn>
      <Btn fab @click="openRobotModal">
        <FontAwesomeIcon icon="fa-robot" />
      </Btn>
    </FabContainer>
    <RobotFactoryModal @select="handleRobotSelection" disable-actions />
  </div>
</template>

<script>
  import Game from "@/components/organisms/Game.vue";
  import GameController from "@/model/2048/GameController";
  import Btn from "@/components/atoms/Btn.vue";
  import RobotFactoryModal from "@/components/organisms/RobotFactoryModal.vue";
  import FabContainer from "@/components/atoms/FabContainer.vue";

  export default {
    components: { Game, Btn, RobotFactoryModal, FabContainer },
    name: "Home",
    data() {
      return {
        robot: null,
        game: new GameController(4, 100),
        autoplay: false,
      };
    },
    methods: {
      openRobotModal() {
        this.$modal.open("factory-modal");
      },
      handleRobotSelection(factory) {
        this.stopAutoPlay()
        this.robot = factory.robot;
        this.robot.setGame(this.game);
        this.$modal.close("factory-modal");
      },
      async startAutoPlay() {
        this.autoplay = true;
        await this.robot.asyncPlay(300, this.abortAutoPlay);
        this.autoplay = false;
      },
      stopAutoPlay() {
        this.autoplay = false;
      },
      abortAutoPlay() {
        return !this.autoplay;
      },
      async clearRobot() {
        this.stopAutoPlay();
        this.robot = null;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .home {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 100vw;
    min-height: 100vh;

    h1 {
      font-size: 3rem;
      margin: 0 0 0.25em;
    }
  }
</style>
