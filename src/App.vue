<template>
  <router-view />
</template>

<script>
  import { LOAD_SCORE_MUTATION } from '@/store/ranking'
  import { LOAD_GAMES_MUTATION } from '@/store/memory-card'

  import { useStore } from 'vuex'
  export default {
    name: 'MainGame',
    setup() {
      const store = useStore()
      store.commit(LOAD_SCORE_MUTATION)
      store.commit(LOAD_GAMES_MUTATION)
    },
  }
</script>
