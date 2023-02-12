import LeaderboardEntry from './LeaderboardEntry.vue';

<template>
  <Story group="atoms" :layout="{type:'grid', width: '400px'}" auto-props-disabled>
    <LeaderboardEntry :entry="entry" :with-board="withBoard" :with-run="withRun" :position="position" />
    <template #controls>
      <HstNumber title="Position" v-model="position" />
      <HstNumber title="Score" v-model="entryData.score" />
      <HstNumber title="Block" v-model="entryData.block" />
      <HstCheckbox title="Show Board" v-model="withBoard" />
      <HstNumber
        v-if="withBoard"
        title="Width"
        max="8"
        min="3"
        v-model="entryData.width"
      />
      <HstNumber
        v-if="withBoard"
        title="Height"
        max="8"
        min="3"
        v-model="entryData.height"
      />
      <HstNumber title="Moves" v-model="entryData.moves" />
      <HstNumber title="Undos" v-model="entryData.undos" />
      <HstCheckbox title="Show Run" v-model="withRun" />
      <HstNumber v-if="withRun" title="Run" v-model="entryData.run" />
    </template>
  </Story>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import LeaderboardEntryType, {
  ILeaderboardEntry,
} from "@/model/Game Utils/Leaderboard/LeaderboardEntry";
import LeaderboardEntry from "./LeaderboardEntry.vue";

const position = ref<number>(1);
const withBoard = ref(true);
const withRun = ref(true);
const entryData: ILeaderboardEntry = reactive({
  score: 0,
  block: 0,
  width: 3,
  height: 3,
  moves: 0,
  undos: 0,
  run: 1,
});

const entry = computed(() => new LeaderboardEntryType({ ...entryData }));
</script>
