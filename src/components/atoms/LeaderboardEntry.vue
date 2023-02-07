<template>
  <div class="leaderboard-entry">
    <div class="leaderboard-entry__name font-weight-bold">
      <span class="leaderboard-entry__position" v-if="position">
        <v-icon
          :icon="`fas fa-${
            position > 3 ? 'hashtag' : position === 1 ? 'trophy' : 'medal'
          }`"
          :class="{
            'leaderboard-entry__position--first': position === 1,
            'leaderboard-entry__position--second': position === 2,
            'leaderboard-entry__position--third': position === 3,
          }"
        />
        {{ position }}
      </span>
    </div>
    <div class="leaderboard-entry__details">
      <DataChip theme="score">
        <span class="d-none d-sm-inline mr-1">Score:</span>
        <span class="font-weight-bold">
          {{ entry.score }}
        </span>
      </DataChip>
      <DataChip
        v-if="withBoard"
        class="leaderboard-entry__data leaderboard-entry__moves"
        size="small"
        variant="outlined"
        color="primary"
        prepend-icon="fas fa-fw fa-table-cells"
      >
        <span class="d-none d-sm-inline font-weight-bold mr-1">Board:</span>
        {{ entry.width }}x{{ entry.height }}
      </DataChip>
      <DataChip
        v-if="withRun && isRoguelike"
        class="leaderboard-entry__data leaderboard-entry__run"
        theme="run"
      >
        <span class="d-none d-sm-inline font-weight-bold mr-1">Runs:</span>
        {{ entry.run }}
      </DataChip>
      <DataChip
        class="leaderboard-entry__data leaderboard-entry__moves"
        theme="moves"
      >
        <span class="d-none d-sm-inline font-weight-bold mr-1">Moves:</span>
        {{ entry.moves }}
      </DataChip>
      <DataChip
        class="leaderboard-entry__data leaderboard-entry__undos"
        theme="undos"
      >
        <span class="d-none d-sm-inline font-weight-bold mr-1">Undos:</span>
        {{ entry.undos }}
      </DataChip>
    </div>
    <div class="leaderboard-entry__block">
      <v-tooltip activator="parent" location="top">Highest Block</v-tooltip>
      <Square :value="entry.block" inline />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import Square from '@/components/atoms/Square.vue'
  import DataChip from '@/components/atoms/DataChip/DataChip.vue'

  import LeaderboardEntry from '@/model/Game Utils/Leaderboard/LeaderboardEntry'

  export default defineComponent({
    components: { Square, DataChip },
    props: {
      entry: {
        type: LeaderboardEntry,
        required: true,
      },
      position: {
        type: Number,
        default: 0,
      },
      withRun: {
        type: Boolean,
        default: false,
      },
      withBoard: {
        type: Boolean,
        default: false,
      },
    },
    setup(props) {
      const isRoguelike = computed(
        () => props.entry.run != undefined && props.entry.run > 0
      )
      return { isRoguelike }
    },
  })
</script>

<style lang="scss">
  .leaderboard-entry {
    display: flex;
    gap: $default-spacing * 0.25;
    align-items: center;
    width: 100%;
    border: solid fade-out($text-color, 0.5);
    border-width: 0 3px 3px;
    padding: $default-spacing * 0.5;

    &:first-child {
      border-radius: $border-radius $border-radius 0 0;
      border-top-width: 3px;
    }
    &:last-child {
      border-radius: 0 0 $border-radius $border-radius;
    }

    &__position {
      font-size: 1rem;

      &--first {
        color: #ffd700;
        font-size: 1.5em;
      }

      &--second {
        font-size: 1.4em;
        color: #c0c0c0;
      }

      &--third {
        font-size: 1.2em;
        color: #cd7f32;
      }
    }

    &__name {
      align-self: start;
      font-size: 1.3rem;
      flex-shrink: 0;
    }

    &__score {
      font-weight: bold;
      font-size: 1.1rem;
    }

    &__details {
      display: flex;
      flex-wrap: wrap;
      gap: $default-spacing * 0.25;
      justify-content: flex-end;
      align-items: center;
    }

    &__data {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__score {
      justify-self: center;
    }

    &__block {
      background-color: none;
      padding: 0;
      justify-self: end;

      align-self: start;

      .square {
        width: 2.2rem;
        height: 2.2rem;
        font-size: 1rem;
      }
    }
  }
</style>
