<template>
  <div class="home">
    <h1>2048</h1>
    <Game :game="game" />
  </div>
</template>

<script>
  import Game from "@/components/organisms/Game.vue";
  import GameController from "@/model/2048/GameController";

  export default {
    components: { Game },
    name: "Home",
    data() {
      return {
        robot: null,
        game: new GameController(4, 100),
      };
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
