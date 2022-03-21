import { Line } from 'vue-chartjs'
import helper from '@/utils/chart.js'

const schedule = { update: null }

export default {
  name: 'LineChart',
  extends: Line,
  props: {
    id: String,
    labels: {
      type: Array,
      required: true,
    },
    sets: {
      type: Array,
      required: true,
    },
    fill: Boolean,
    displayLegend: { type: Boolean, default: true },
    yLabel: String,
    xLabel: String,
    yMin: Number,
    yMax: Number,
    styles: Object,
    animationDuratiom: {type: Number, default: 0}
  },
  data() {
    const yTicks = {}
    if (!isNaN(this.yMin)) yTicks.min = this.yMin
    if (!isNaN(this.yMax)) yTicks.max = this.yMax

    return {
      options: {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: this.yLabel ? true : false,
                text: this.yLabel,
              },
              ticks: yTicks,
              gridLines: {
                display: true,
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: this.xLabel ? true : false,
                text: this.xLabel,
              },
              gridLines: {
                display: this.beginAtZero,
              },
            },
          ],
        },
        legend: {
          display: this.displayLegend,
        },
        elements: {
          line: {
            tension: 0,
          },
        },
        animation: {
          duration: this.animationDuratiom
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    }
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: this.sets.map((set, idx) => {
          const color = set.color || helper.getSetColor(idx, this.sets.length)
          return {
            label: set.label,
            data: set.data,
            fill: this.fill,
            borderColor: color,
            backgroundColor: color,
            borderWidth: isNaN(set.borderWidth) ? 2 : set.borderWidth,
            pointStyle: set.point || helper.getSetPointer(idx),
            pointRadius: isNaN(set.pointRadius) ? 3 : set.pointRadius,
          }
        }),
      }
    },
  },
  watch: {
    displayLegend() {
      this.options.legend.display = this.displayLegend
    },
    labels() {
      this.updateChart()
    },
    sets() {
      this.updateChart()
    },
  },
  methods: {
    updateChart() {
      this.$data._chart.destroy()
      this.render()
    },
    render() {
      this.renderChart(this.chartData, this.options)
    },
    scheduleUpdate(time = 100) {
      if (schedule.update) clearTimeout(schedule.update)
      schedule.update = setTimeout(() => {
        schedule.update = null
        this.updateChart()
      }, time)
    },
  },
  mounted() {
    this.render()
    this.$root.$on('updateChart', (id) => {
      if (id === this.id) {
        this.scheduleUpdate()
      }
    })
  },
}
