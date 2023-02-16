import { getPageSize } from '@/utils/viewport'
import { reactive } from 'vue'

export default function useStyle() {
  const leftStyle = reactive({
    width: '0',
    transition: '',
    backgroundColor: '',
    opacity: 1,
  })
  const rightStyle = reactive({
    width: '0',
    transition: '',
    backgroundColor: '',
    opacity: 1,
  })
  const topStyle = reactive({
    height: '0',
    transition: '',
    backgroundColor: '',
    opacity: 1,
  })
  const bottomStyle = reactive({
    height: '0',
    transition: '',
    backgroundColor: '',
    opacity: 1,
  })
  const windowStyle = reactive({
    width: '100%',
    height: '100%',
    transition: '',
  })
  const containerStyle = reactive({
    width: '100%',
    height: '100%',
    transition: '',
    animationDuration: '',
    left: '0',
    right: '0',
    top: '0',
    bottom: '0',
  })

  function getNamedTopSize(
    position: string,
    padding: number,
    rect: { height: number },
    { viewHeight }: { viewHeight: number }
  ) {
    const scrollY = document.documentElement.scrollTop
    const scrollBarCorrection = scrollY > 0 ? 16 : 0
    if (position === 'top') {
      return `${scrollY}px`
    }
    if (position === 'bottom') {
      return `${
        viewHeight + scrollY - rect.height - 2 * padding - scrollBarCorrection
      }px`
    }
    if (position === 'center') {
      return `${
        scrollY -
        scrollBarCorrection +
        (viewHeight - rect.height - 2 * padding) / 2
      }px`
    }

    return position
  }

  function getNamedLeftSize(
    position: string,
    padding: number,
    rect: { width: number },
    page: { viewWidth: number }
  ) {
    const scrollX = document.documentElement.scrollLeft
    if (position === 'left') {
      return `${scrollX}px`
    }
    if (position === 'right') {
      return `${page.viewWidth + scrollX - rect.width - 2 * padding}px`
    }
    if (position === 'center') {
      return `${scrollX + (page.viewWidth - rect.width - 2 * padding) / 2}px`
    }

    return position
  }

  function getWrapperRect(selector?: string) {
    if (!selector) return getPageSize()
    const wrapper = document.querySelector(selector)
    if (!wrapper) return getPageSize()
    const rect = wrapper.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      viewWidth: rect.width,
      viewHeight: rect.height,
    }
  }

  function updateStyles({
    rect = document.body.getBoundingClientRect(),
    wrapper = '',
    padding = 0,
    bgColor = 'black',
    bgOpacity = 0.75,
  }: {
    rect?: {
      width: number
      height: number
      left: number | string
      top: number | string
    }
    wrapper?: string
    padding?: number
    bgColor?: string
    bgOpacity?: number
  } = {}) {
    const wrapperRect = getWrapperRect(wrapper)
    containerStyle.width = `${wrapperRect.width}px`
    containerStyle.height = `${wrapperRect.height}px`
    containerStyle.top = `${wrapperRect.top}px`
    containerStyle.left = `${wrapperRect.left}px`
    containerStyle.right = `${wrapperRect.left + wrapperRect.width}px`
    containerStyle.bottom = `${wrapperRect.top + wrapperRect.height}px`

    windowStyle.height = `${rect.height + 2 * padding}px`
    windowStyle.width = `${rect.width + 2 * padding}px`

    if (typeof rect.left === 'string') {
      const leftSize = getNamedLeftSize(rect.left, padding, rect, wrapperRect)
      leftStyle.width = leftSize
      rightStyle.width = `calc(${
        wrapperRect.width - rect.width - 2 * padding
      }px - ${leftSize})`
    } else {
      leftStyle.width = `${rect.left - wrapperRect.left - padding}px`
      rightStyle.width = `${
        wrapperRect.width + wrapperRect.left - rect.left - rect.width - padding
      }px`
    }

    if (typeof rect.top === 'string') {
      const topSize = getNamedTopSize(rect.top, padding, rect, wrapperRect)

      topStyle.height = topSize
      bottomStyle.height = `calc(${
        wrapperRect.height - rect.height - 2 * padding
      }px - ${topSize})`
    } else {
      topStyle.height = `${rect.top - wrapperRect.top - padding}px`
      bottomStyle.height = `${
        wrapperRect.height + wrapperRect.top - rect.top - rect.height - padding
      }px`
    }

    const styles = [leftStyle, rightStyle, topStyle, bottomStyle]

    styles.forEach((style) => {
      style.opacity = bgOpacity
      style.backgroundColor = bgColor
    })
  }

  return {
    containerStyle,
    bottomStyle,
    rightStyle,
    leftStyle,
    topStyle,
    windowStyle,
    updateStyles,
  }
}
