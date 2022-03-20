<template>
  <div class="fab">
    <slot />
  </div>
</template>

<script>
  export default {
    name: "FabContainer",
  };
</script>

<style lang="scss" scoped>
  .fab {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    right: 5vw;
    bottom: 5vw;
    z-index: 50;
  }
</style>
