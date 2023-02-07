<template>
  <v-dialog
    class="ranking-modal"
    max-height="800"
    max-width="500"
    v-model="isOpen"
    transition="slide-y-transition"
  >
    <v-card title="Ranking" prepend-icon="fas fa-fw fa-ranking-star">
      <v-card-text>
        <LeaderboardEntry
          v-for="(entry, idx) in leaderboard"
          :key="idx"
          :position="idx + 1"
          :entry="entry"
          :with-board="withBoard"
          :with-run="withRun"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import LeaderboardEntry from '@/components/atoms/LeaderboardEntry.vue'
  import useDialogCommands from '@/composables/dialogCommands'
  import LeaderboardEntryClass from '@/model/Game Utils/Leaderboard/LeaderboardEntry'
  import { defineComponent } from 'vue'

  export default defineComponent({
    components: { LeaderboardEntry },
    props: {
      leaderboard: { type: Array<LeaderboardEntryClass>, required: true },
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
      return { ...useDialogCommands() }
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
