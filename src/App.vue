<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import { LOAD_SCORE_MUTATION } from '@/store/ranking'
  import { LOAD_GAMES_MUTATION } from '@/store/memory-card'

  import { useStore } from 'vuex'
  export default {
    setup() {
      const store = useStore()
      store.commit(LOAD_SCORE_MUTATION)
      store.commit(LOAD_GAMES_MUTATION)
    },
  }
</script>
