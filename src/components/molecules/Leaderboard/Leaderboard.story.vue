<template>
  <Story
    :layout="{ type: 'grid', width: 500 }"
    group="molecules"
    auto-props-disabled
  >
    <Leaderboard
      :entries="entries"
      :with-board="withBoard"
      :with-run="withRun"
    />
    <template #controls>
      <HstCheckbox title="Show Board" v-model="withBoard" />
      <HstCheckbox title="Show Run" v-model="withRun" />
      <div class="htw-p-2 htw-gap-2 d-flex">
        <HstButton class="htw-p-2" @click="addEntry">Add Entry</HstButton>
        <HstButton class="htw-p-2" @click="removeEntry">Remove Entry</HstButton>
      </div>
    </template>
  </Story>
</template>

<script setup lang="ts">
  import LeaderboardEntry from '@/model/Game Utils/Leaderboard/LeaderboardEntry'
  import Leaderboard from './Leaderboard.vue'
  import { ref } from 'vue'
  const withBoard = ref(false)
  const withRun = ref(false)
  const entries = ref<LeaderboardEntry[]>([])

  function addEntry() {
    entries.value.push(LeaderboardEntry.mock())
  }
  function removeEntry(){
    entries.value.pop()
  }

  addEntry()
  addEntry()
  addEntry()
</script>
