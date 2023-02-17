<template>
  <nav class="navbar">
    <div class="navbar__left">
      <TransitionGroup name="scroll-y-reverse">
        <v-btn
          v-if="!isHome"
          key="home"
          prepend-icon="fas fa-home"
          v-bind="navitemConfig"
          @click="$router.push('/')"
        >
          <span class="d-none d-sm-inline"> Home </span>
        </v-btn>
        <v-btn
          v-if="game && display.leaderboard"
          key="leaderboard"
          prepend-icon="fas fa-fw fa-ranking-star"
          v-bind="navitemConfig"
        >
          <span class="d-none d-sm-inline"> Leaderboard </span>
          <v-dialog activator="parent" width="500" max-height="800">
            <Leaderboard
              key="leaderboard"
              :entries="game.leaderboard"
              :button-options="navitemConfig"
              :with-board="isRoguelike"
              :with-run="isRoguelike"
            />
          </v-dialog>
        </v-btn>
        <v-btn
          v-if="game && display.save"
          key="save"
          prepend-icon="fas fa-fw fa-save"
          v-bind="navitemConfig"
          @click="openMemoryCard(MemoryCardMode.Save)"
        >
          <span class="d-none d-sm-inline"> Save Game </span>
        </v-btn>
        <v-btn
          v-if="game && display.load"
          key="load"
          prepend-icon="far fa-fw fa-folder-open"
          v-bind="navitemConfig"
          @click="openMemoryCard(MemoryCardMode.Load)"
        >
          <span class="d-none d-sm-inline"> Load Game </span>
        </v-btn>
      </TransitionGroup>
    </div>
    <div class="navbar__right">
      <TransitionGroup name="scroll-y-reverse">
        <v-btn
          v-if="game && display.settings"
          key="settings"
          prepend-icon="fas fa-fw fa-gears"
          v-bind="navitemConfig"
        >
          <span class="d-none d-sm-inline"> Settings </span>
          <v-dialog activator="parent" width="300">
            <Settings key="settings" :game="game" />
          </v-dialog>
        </v-btn>

        <Help
          v-if="tutorialHandler && tutorialHandler.tutorials.length"
          key="help"
          :tutorial-handler="tutorialHandler"
          :button-options="navitemConfig"
        >
          <span class="d-none d-sm-inline"> Help </span>
        </Help>
      </TransitionGroup>
      <v-btn v-bind="navitemConfig" prepend-icon="fas fa-fw fa-circle-info">
        <span class="d-none d-sm-inline"> About </span>
        <v-dialog activator="parent" width="300">
          <About />
        </v-dialog>
      </v-btn>
    </div>
    <v-dialog v-model="memoryCard.isOpen" width="400">
      <MemoryCardManager
        v-if="game"
        :game="game"
        :mode="memoryCard.mode"
        @load="memoryCard.isOpen = false"
        @save="memoryCard.isOpen = false"
      />
    </v-dialog>
  </nav>
</template>

<script lang="ts" setup>
import RoguelikeGameController from "@/model/2048 Roguelike/GameController";
import GameController from "@/model/2048 Standard/GameController";
import LooseObject from "@/utils/LooseObject";
import Leaderboard from "@/components/molecules/Leaderboard/Leaderboard.vue";
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Help from "@/components/molecules/Help/Help.vue";
import About from "@/components/atoms/About/About.vue";
import { ITutorialHandler } from "@/composables/tutorialRoutine";
import { MemoryCardMode } from "@/model/Game Utils/MemoryCard";
import MemoryCardManager from "../MemoryCardManager.vue";
import Settings from "@/components/molecules/Settings/Settings.vue";

const route = useRoute();

const isHome = computed(() => route.name === "home");

const navitemConfig: LooseObject<string> = {
  variant: "text",
  size: "small",
};

const game = ref<GameController | RoguelikeGameController>();

const isRoguelike = computed(
  () => game.value instanceof RoguelikeGameController
);

const display = reactive<LooseObject>({
  settings: true,
  leaderboard: true,
  load: true,
  save: true,
});

function setGame(
  newGame?: GameController | RoguelikeGameController,
  {
    showSettings = true,
    showLeaderboard = true,
    showSave = true,
    showLoad = true,
  } = {}
) {
  game.value = newGame;
  display.settings = showSettings;
  display.leaderboard = showLeaderboard;
  display.save = showSave;
  display.load = showLoad;
}

const tutorialHandler = ref<ITutorialHandler>();

function setTutorialHandler(handler?: ITutorialHandler) {
  tutorialHandler.value = handler;
}

const memoryCard = reactive({
  isOpen: false,
  mode: MemoryCardMode.Load,
});

const openMemoryCard = (mode: MemoryCardMode) => {
  memoryCard.mode = mode;
  memoryCard.isOpen = true;
};

const emit = defineEmits(["mounted"]);

defineExpose({setTutorialHandler, setGame})

onMounted(() => {
  emit("mounted", { setTutorialHandler, setGame });
});
</script>

<style lang="scss">
.navbar {
  padding: $default-spacing * 0.25;
  display: flex;
  justify-content: space-between;

  &__left,
  &__right {
    display: flex;
    gap: $default-spacing * 0.25;
  }
}
</style>
