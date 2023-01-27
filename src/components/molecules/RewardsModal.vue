<template>
  <b-modal
    :id="id"
    v-model="isOpen"
    centered
    title="Rewards"
    size="sm"
    class="rewards-modal"
    hide-footer
  >
    <div class="rewards-modal__block-list">
      <div
        class="rewards-modal__block"
        v-for="square in rewards.squares"
        :key="square.block"
      >
        <Square inline :value="square.block" />
        <span class="small ml-2">
          ({{ square.value }} <FontAwesomeIcon icon="coins" />)
        </span>
        <span class="ml-2"
          >x {{ square.count }} = {{ square.coinsEarned }}
          <FontAwesomeIcon icon="coins"
        /></span>
      </div>
    </div>
    <div class="rewards-modal__total">
      <div class="badge badge-warning badge-pill">
        + {{ rewards.totalEarned }} <FontAwesomeIcon icon="coins" />
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts">
  import Square from '@/components/atoms/Square.vue'
  import GameRewards from '@/model/roguelike/GameRewards'

  export default {
    components: { Square },
    props: {
      id: {
        type: String,
        required: true,
      },
      rewards: {
        type: GameRewards,
        required: true,
      },
    },
  }
</script>

<style lang="scss">
  .rewards-modal {
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
