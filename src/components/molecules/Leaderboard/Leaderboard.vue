<template>
  <v-card title="Leaderboard" prepend-icon="fas fa-fw fa-ranking-star">
    <v-card-text>
      <LeaderboardEntry
        v-for="(entry, idx) in entries"
        :key="idx"
        :position="idx + 1"
        :entry="entry"
        :with-board="withBoard"
        :with-run="withRun"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import LeaderboardEntry from '@/components/atoms/LeaderboardEntry/LeaderboardEntry.vue'
  import LeaderboardEntryClass from '@/model/Game Utils/Leaderboard/LeaderboardEntry'
  import { defineComponent } from 'vue'

  export default defineComponent({
    components: { LeaderboardEntry },
    props: {
      entries: { type: Array<LeaderboardEntryClass>, required: true },
      withRun: {
        type: Boolean,
        default: false,
      },
      withBoard: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
    },
  })
</script>

<style lang="scss">
  .ranking-modal {
    &--table {
      max-width: 100%;
      text-align: center;
      thead {
        font-weight: bold;
      }

      .truncated-field {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 90px;
      }
    }

    &--square {
      margin: 0 auto;
    }
  }
</style>
