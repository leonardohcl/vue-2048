<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import { LOAD_SCORE_MUTATION } from '@/store/ranking'
  import { useStore } from 'vuex'
  export default {
    setup() {
      const store = useStore()
      store.commit(LOAD_SCORE_MUTATION)
    },
  }
</script>
