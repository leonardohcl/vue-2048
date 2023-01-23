<template>
  <span class="badge badge-pill" :class="classes"
    >{{ price }}<FontAwesomeIcon class="ml-1" icon="coins"
  /></span>
</template>

<script>
  export default {
    props: {
      price: { type: Number, default: 0 },
      canAfford: { type: Boolean, default: false },
    },
    computed: {
      classes() {
        return {
          'badge-dark': !this.canAfford,
          'badge-warning': this.canAfford,
        }
      },
    },
  }
</script>
