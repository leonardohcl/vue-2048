import {onMounted, onBeforeUnmount } from 'vue'

export function useSwipe(
  target,
  callbackFn,
  options = { minimumSwipeSize: 30, releaseTouchTime: 1500 }
) {

  const TOUCH_INFO = {
    start: null,
    minimumSwipeSize: options.minimumSwipeSize, //px,
    releaseTouchTime: options.releaseTouchTime, //ms
    releaseTimeOut: null,
  }

  function handleTouchStart(evt) {
    evt.preventDefault()
    if (TOUCH_INFO.start) return
    TOUCH_INFO.start = {
      id: evt.touches[0].identifier,
      x: evt.touches[0].clientX,
      y: evt.touches[0].clientY,
    }
    TOUCH_INFO.releaseTimeOut = setTimeout(() => {
      TOUCH_INFO.start = null
    }, TOUCH_INFO.releaseTouchTime)
  }

  function handleTouchEnd(evt) {
    evt.preventDefault()
    if (!TOUCH_INFO.start) return
    let touch
    for (let i = 0; i < evt.changedTouches.length; i++) {
      if (evt.changedTouches[i].identifier === TOUCH_INFO.start.id) {
        touch = evt.changedTouches[i]
        break
      }
    }
    if (!touch) return

    const end = {
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
      },
      deltaX = Math.abs(TOUCH_INFO.start.x - end.x),
      deltaY = Math.abs(TOUCH_INFO.start.y - end.y)

    let command
    if (deltaX > deltaY && deltaX > TOUCH_INFO.minimumSwipeSize) {
      if (TOUCH_INFO.start.x > end.x) command = 'left'
      else command = 'right'
    } else if (deltaY > TOUCH_INFO.minimumSwipeSize) {
      if (TOUCH_INFO.start.y > end.y) command = 'top'
      else command = 'bottom'
    }

    if (command) {
      callbackFn(command)
    }

    if (TOUCH_INFO.releaseTimeOut) {
      clearTimeout(TOUCH_INFO.releaseTimeOut)
      TOUCH_INFO.releaseTimeOut = null
    }
    TOUCH_INFO.start = null
  }

  onMounted(() => {
    const el = document.querySelector(target)
    el.addEventListener('touchstart', handleTouchStart)
    el.addEventListener('touchend', handleTouchEnd)
  })
  
  onBeforeUnmount(() => {
    const el = document.querySelector(target)
    el.removeEventListener('touchstart', handleTouchStart)
    el.removeEventListener('touchend', handleTouchEnd)
  })

}
