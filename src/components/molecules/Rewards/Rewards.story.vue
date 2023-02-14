<template>
  <Story group="molecules" :layout="{ type: 'grid', width: 300 }" auto-props-disabled>
    <Rewards :rewards="rewards" />
  </Story>
</template>

<script lang="ts" setup>
  import GameRewards from '@/model/2048 Roguelike/GameRewards'
  import Rewards from './Rewards.vue'

  const rewards = new GameRewards(
    [{ block: 2, count: 1, value: 1, coinsEarned: 1 }],
    1
  )
</script>
