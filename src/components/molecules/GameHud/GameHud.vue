<template>
  <div class="game-hud">
    <div class="game-hud__buttons">
      <v-btn
        v-if="allowRestart"
        size="small"
        variant="text"
        @click="$emit('restart')"
        >{{ restartText }}</v-btn
      >
      <v-btn
        v-if="allowUndo"
        size="small"
        variant="text"
        :disabled="historyLength === 0"
        @click="$emit('undo')"
      >
        <span v-if="historyLength" class="mr-1">({{ historyLength }})</span>
        {{ undoText }}
      </v-btn>
    </div>
    <div class="game-hud__score">
      <TransitionGroup name="scroll-y-reverse">
        <v-chip
          v-if="newHighscore"
          class="game-hud__score--new-highscore"
          size="x-small"
          color="error"
          variant="flat"
        >
          New Best!
        </v-chip>
      </TransitionGroup>
      Score:
      <span class="points">
        {{ score }}
        <TransitionGroup name="scroll-y-reverse">
          <span
            v-for="idx in 3"
            :key="animatedPoints[idx]?.id ?? -idx"
            v-show="animatedPoints[idx]"
            class="game-hud__score--animated"
            :id="animatedPoints[idx]?.id ?? -idx"
            :style="animatedPointsStyle"
          >
            {{ animatedPoints[idx]?.points }}
          </span>
        </TransitionGroup>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BoardCommand } from '@/composables/boardCommands'
  import { remove } from 'lodash'
  import { ref, computed, onMounted } from 'vue'

  const props = defineProps({
    score: { type: Number, default: 0 },
    newHighscore: {
      type: Boolean,
      default: false,
    },
    historyLength: { type: Number, default: 0 },
    allowRestart: {
      type: Boolean,
      default: true,
    },
    allowUndo: {
      type: Boolean,
      default: true,
    },
    undoText: { type: String, default: 'Undo' },
    restartText: { type: String, default: 'Restart' },
    pointAnimationDuration: {
      type: Number,
      default: 750,
    },
  })

  const emit = defineEmits(['restart', 'undo', 'mounted'])

  const nextPointId = ref(0)

  const animatedPoints = ref(new Array(3).fill(0))
  const animatedPointsStyle = computed(() => ({
    transition: `${
      props.pointAnimationDuration / 2
    }ms cubic-bezier(.15,.75,0,1)`,
  }))

  const animatePoints = (
    dir: BoardCommand,
    success: boolean,
    points: number
  ) => {
    if (!points) return
    const id = nextPointId.value
    nextPointId.value++
    const point = {
      id,
      points: points < 0 ? points : '+' + points,
    }
    animatedPoints.value.push(point)
    if (animatedPoints.value.length > 3) animatedPoints.value.shift()
    else if (animatedPoints.value.length < 3) animatedPoints.value.unshift(0)
    setTimeout(() => {
      remove(animatedPoints.value, (p) => p.id === point.id)
      if (animatedPoints.value.length < 3) animatedPoints.value.unshift(0)
    }, props.pointAnimationDuration / 2)
  }

  defineExpose({ animatePoints })

  onMounted(() => {
    emit('mounted', { animatePoints })
  })
</script>

<style lang="scss">
  .game-hud {
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;

    &__score {
      position: relative;
      font-size: 1rem;
      font-weight: 300;

      @include screen-above(md) {
        font-size: 1.2rem;
      }

      .points {
        font-size: 1.3em;
        font-weight: bold;
      }

      
    &--animated {
      display: none;
      position: absolute;
      font-size: 0.8em;
      right: 0;
      bottom: 90%;
      opacity: 0.75;
      font-weight: 500;

      @include screen-above(sm) {
        display: initial;
      }
    }
    }
  }
</style>
