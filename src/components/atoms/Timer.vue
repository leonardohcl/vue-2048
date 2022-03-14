<template>
  <span>{{ formattedTime }}</span>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
      updateFrequency: {
        type: Number,
        default: 1000,
      },
    },
    data() {
      return {
        timeElapsed: 0,
        interval: null,
      }
    },
    methods: {
      startTimer() {
        this.interval = setInterval(() => {
          this.timeElapsed += this.updateFrequency
        }, this.updateFrequency)
      },
      stopTimer() {
        clearInterval(this.interval)
      },
      clearTimer() {
        this.stopTimer()
        this.timeElapsed = 0
      },
    },
    computed: {
      secondsElapsed() {
        return this.timeElapsed / 1000
      },
      minutesElapsed() {
        return this.secondsElapsed / 60
      },
      hoursElapsed() {
        return this.minutesElapsed / 60
      },
      seconds() {
        return Math.floor(this.secondsElapsed % 60)
      },
      minutes() {
        return Math.floor(this.minutesElapsed % 60)
      },
      hours() {
        return Math.floor(this.hoursElapsed % 60)
      },
      formattedTime() {
        const time = [
          this.hours > 0 ? this.hours : null,
          this.minutes,
          this.seconds,
        ]
          .filter((x) => x !== null)
          .map((x) => x.toString().padStart(2, '0'))
        return time.join(':')
      },
    },
    mounted() {
      this.$root.$on('timerStart', (id) => {
        if (id === this.id) this.startTimer()
      })
      this.$root.$on('timerStop', (id) => {
        if (id === this.id) this.stopTimer()
      })
      this.$root.$on('timerClear', (id) => {
        if (id === this.id) this.clearTimer()
      })
    },
  }
</script>
