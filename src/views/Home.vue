<template>
  <Game :game="game" />
</template>

<script>
import Game from "../components/organisms/Game.vue";
import GameController from "../model/GameController";

export default {
  name: "Home",
  data() {
    return {
      game: new GameController(),
    };
  },
  components: { Game },
};
</script>
