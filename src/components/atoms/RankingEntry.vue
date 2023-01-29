<template>
  <div class="ranking-entry">
    <div class="ranking-entry__name font-weight-bold">
      <span class="ranking-entry__position" v-if="position">
        <v-icon
          :icon="`fas fa-${
            position > 3 ? 'hashtag' : position === 1 ? 'trophy' : 'medal'
          }`"
          :class="{
            'ranking-entry__position--first': position === 1,
            'ranking-entry__position--second': position === 2,
            'ranking-entry__position--third': position === 3,
          }"
        />
        {{ position }}
      </span>
      {{ entry.name || "Empty" }}
    </div>
    <div class="ranking-entry__score font-weight-bold">
      <DataChip theme="score">
        <span class="d-none d-sm-inline mr-1">Score:</span>
        <span class="font-weight-bold">
          {{ entry.score }}
        </span>
      </DataChip>
    </div>
    <div class="ranking-entry__block">
      <v-tooltip activator="parent" location="top">Highest Block</v-tooltip>
      <Square :value="entry.block" inline />
    </div>
    <div class="ranking-entry__details">
      <DataChip
        v-if="withBoard"
        class="ranking-entry__data ranking-entry__moves"
        size="small"
        variant="outlined"
        color="primary"
        prepend-icon="fas fa-fw fa-table-cells"
      >
        <span class="d-none d-sm-inline font-weight-bold mr-1">Board:</span>
        {{ entry.width }}x{{ entry.height }}
      </DataChip>
      <DataChip
        v-if="withRun"
        class="ranking-entry__data ranking-entry__run"
        theme="run"
      >
        <span class="d-none d-sm-inline font-weight-bold mr-1">Runs:</span>
        {{ entry.run }}
      </DataChip>
      <DataChip class="ranking-entry__data ranking-entry__moves" theme="moves">
        <span class="d-none d-sm-inline font-weight-bold mr-1">Moves:</span>
        {{ entry.moves }}
      </DataChip>
      <DataChip
        class="ranking-entry__data ranking-entry__undos"
        theme="undos"
      >
        <span class="d-none d-sm-inline font-weight-bold mr-1">Undos:</span>
        {{ entry.undos }}
      </DataChip>
    </div>
  </div>
</template>

<script>
import Square from "@/components/atoms/Square.vue";
import DataChip from "@/components/atoms/DataChip.vue";

import RankingEntry from "@/model/2048/RankingEntry";
export default {
  components: { Square, DataChip },
  props: {
    entry: {
      type: [RankingEntry, Object],
      default: () => new RankingEntry({ id: "", name: "" }),
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
};
</script>

<style lang="scss">
.ranking-entry {
  display: grid;
  grid-template-columns: repeat(3, auto);
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
    font-size: 1.3rem;
  }

  &__score {
    font-size: 1.1rem;
  }

  &__details {
    display: flex;
    grid-column: 1/4;
    gap: $default-spacing * 0.5;
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
