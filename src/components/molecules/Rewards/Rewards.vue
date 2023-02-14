<template>
  <v-card title="Rewards" prepend-icon="fas fa-fw fa-gem">
    <v-card-text>
      <div class="rewards-modal__block-list">
        <div
          class="rewards-modal__block"
          v-for="square in rewards.squares"
          :key="square.block"
        >
          <Square inline :value="square.block" />
          <span class="small ml-2">
            ({{ square.value }} <v-icon icon="fas fa-fw fa-coins" />)
          </span>
          <span class="ml-2"
            >x {{ square.count }} = {{ square.coinsEarned }}
            <v-icon icon="fas fa-fw fa-coins"
          /></span>
        </div>
      </div>
      <div class="rewards-modal__total">
        <div class="badge badge-warning badge-pill">
          + {{ rewards.totalEarned }}
          <v-icon icon="fas fa-fw fa-coins" size="x-small" />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import Square from '@/components/atoms/Square/Square.vue'
  import GameRewards from '@/model/2048 Roguelike/GameRewards'
  import useDialogCommands from '@/composables/dialogCommands'

  export default {
    components: { Square },
    props: {
      rewards: {
        type: GameRewards,
        required: true,
      },
    },
    setup() {
      return { ...useDialogCommands() }
    },
  }
</script>

<style lang="scss">
  .rewards-modal {
    .fa-coins {
      font-size: 0.8em;
    }

    &__block {
      display: flex;
      align-items: center;
    }

    &__block-list {
      display: flex;
      flex-direction: column;
      gap: $default-spacing * 0.5;
    }

    &__total {
      text-align: right;
      font-size: 1.5rem;
    }
  }
</style>
