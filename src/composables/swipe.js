import { onMounted, onBeforeUnmount } from 'vue'

export function useSwipe(
  target,
  callbackFn,
  options = {
    minimumSwipeSize: 30, //px
    releaseTouchTime: 1500, //ms
    allowMouse: true,
  }
) {
  const SWIPE_TRACKER = {
    start: null,
    releaseTimeOut: null,
  }

  const CONFIG = {
    minimumSwipeSize: 30, //px
    releaseTouchTime: 1500, //ms
    allowMouse: true,
    ...options,
  }

  const { minimumSwipeSize, releaseTouchTime, allowMouse } = CONFIG

  function handleSwipeStart(coords) {
    if (SWIPE_TRACKER.start) return
    SWIPE_TRACKER.start = coords
    SWIPE_TRACKER.releaseTimeOut = setTimeout(() => {
      SWIPE_TRACKER.start = null
    }, releaseTouchTime)
  }

  function handleTouchStart(evt) {
    evt.preventDefault()
    handleSwipeStart({
      id: evt.touches[0].identifier,
      x: evt.touches[0].clientX,
      y: evt.touches[0].clientY,
    })
  }

  function handleClickStart(evt) {
    evt.preventDefault()
    handleSwipeStart({
      id: 'mouse',
      x: evt.clientX,
      y: evt.clientY,
    })
  }

  function handleSwipeEnd(endCoords) {
    if (!SWIPE_TRACKER.start) return

    const deltaX = Math.abs(SWIPE_TRACKER.start.x - endCoords.x)
    const deltaY = Math.abs(SWIPE_TRACKER.start.y - endCoords.y)

    let command
    if (deltaX > deltaY && deltaX > minimumSwipeSize) {
      if (SWIPE_TRACKER.start.x > endCoords.x) command = 'left'
      else command = 'right'
    } else if (deltaY > minimumSwipeSize) {
      if (SWIPE_TRACKER.start.y > endCoords.y) command = 'top'
      else command = 'bottom'
    }

    if (command) {
      callbackFn(command)
    }

    if (SWIPE_TRACKER.releaseTimeOut) {
      clearTimeout(SWIPE_TRACKER.releaseTimeOut)
      SWIPE_TRACKER.releaseTimeOut = null
    }
    SWIPE_TRACKER.start = null
  }

  function handleTouchEnd(evt) {
    evt.preventDefault()
    let touch
    for (let i = 0; i < evt.changedTouches.length; i++) {
      if (evt.changedTouches[i].identifier === SWIPE_TRACKER.start.id) {
        touch = evt.changedTouches[i]
        break
      }
    }
    if (!touch) return

    handleSwipeEnd({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
    })
  }

  function handleClickEnd(evt) {
    evt.preventDefault()
    handleSwipeEnd({
      id: 'mouse',
      x: evt.clientX,
      y: evt.clientY,
    })
  }

  onMounted(() => {
    const el = document.querySelector(target)
    if (!el) return
    if (allowMouse) {
      el.addEventListener('mousedown', handleClickStart)
      el.addEventListener('mouseup', handleClickEnd)
    }
    el.addEventListener('touchstart', handleTouchStart)
    el.addEventListener('touchend', handleTouchEnd)
  })

  onBeforeUnmount(() => {
    const el = document.querySelector(target)
    if (!el) return
    if (allowMouse) {
      el.removeEventListener('mousedown', handleClickStart)
      el.removeEventListener('mouseup', handleClickEnd)
    }
    el.removeEventListener('touchstart', handleTouchStart)
    el.removeEventListener('touchend', handleTouchEnd)
  })
}
