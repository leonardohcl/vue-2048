<template>
  <div class="ranking-entry">
    <div class="ranking-entry__name font-weight-bold">
      <span class="ranking-entry__position" v-if="position">
        <FontAwesomeIcon
          :icon="position > 3 ? 'hashtag' : position === 1 ? 'trophy' : 'medal'"
          :class="{
            'ranking-entry__position--first': position === 1,
            'ranking-entry__position--second': position === 2,
            'ranking-entry__position--third': position === 3,
          }"
        />
        {{ position }}
      </span>
      {{ entry.name || 'Empty' }}
    </div>
    <div class="ranking-entry__score font-weight-bold"  v-b-tooltip.hover title="Score" >
      {{ entry.score }}
    </div>
    <div class="ranking-entry__block" v-b-tooltip.hover title="Highest Block">
      <Square :value="entry.block" inline />
    </div>
    <div class="ranking-entry__details">
      <div
        class="ranking-entry__data ranking-entry__moves"
        v-if="withBoard"
        :style="detailsStyle"
        v-b-tooltip.hover title="Board Size"
      >
        <FontAwesomeIcon icon="table-cells" class="text-primary" />
        {{ entry.width }}x{{ entry.height }}
      </div>
      <div class="ranking-entry__data ranking-entry__run" v-if="withRun" v-b-tooltip.hover title="Runs">
        <FontAwesomeIcon icon="person-running" class="text-primary" />
        {{ entry.run }}
      </div>
      <div class="ranking-entry__data ranking-entry__moves" v-b-tooltip.hover title="Moves">
        <FontAwesomeIcon icon="up-down-left-right" />
        {{ entry.moves }}
      </div>
      <div class="ranking-entry__data ranking-entry__undos" v-b-tooltip.hover title="Undos">
        <FontAwesomeIcon icon="rotate-left" />
        {{ entry.undos }}
      </div>
    </div>
  </div>
</template>

<script>
  import Square from '@/components/atoms/Square.vue'

  import RankingEntry from '@/model/2048/RankingEntry'
  export default {
    components: { Square },
    props: {
      entry: {
        type: RankingEntry,
        default: () => new RankingEntry({ id: '', name: '' }),
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
  }
</script>

<style lang="scss">
  .ranking-entry {
    display: grid;
    grid-template-columns: repeat(3, auto);
    gap: $default-spacing * 0.25;
    align-items: center;
    width: 100%;
    border: solid $bg-secondary;
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
      gap: $default-spacing * 0.25;
      justify-content: end;
      align-items: center;
    }

    &__data {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: fade-out($bg-secondary, 0.5);
      border-radius: $border-radius;
      padding: $default-spacing * 0.1 $default-spacing * 0.25;

      svg {
        margin-right: 0.5em;
      }
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
