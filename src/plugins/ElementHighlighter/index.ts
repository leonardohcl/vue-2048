import { App, createApp, inject, provide, createVNode } from 'vue'
import HighlighterApp from './app.vue'

export interface IElementHighlighterOptions {
  id?: string
  resizeStagger?: number
  transitionDuration?: number
  bgColor?: string
  bgOpacity?: number
}

const ElementHighlighterPlugin = {
  install(app: App, options: IElementHighlighterOptions = {}) {
    const {
      id = 'highlighter',
      resizeStagger,
      transitionDuration,
      bgColor,
      bgOpacity,
    } = options

    const appContainer = document.createElement('div')
    appContainer.id = id
    document.body.appendChild(appContainer)

    const highlighter = createApp(HighlighterApp)

    highlighter.mount(`#${id}`)

    if (!highlighter._instance)
      throw new Error("couldn't find ElementHighlighterComponent's instance")

    const component = highlighter._instance.refs.el as {
      highlight: Function
      dismiss: Function
      setConfig: Function
    }

    const setBackgroundCallback = (bgCallback: Function) =>
      component.setConfig({ bgCallback })

    component.setConfig({
      resizeStagger,
      transitionDuration,
      bgColor,
      bgOpacity,
    })

    const { highlight, dismiss } = component

    const expodedFunctions = {
      highlight,
      dismiss,
      setBackgroundCallback,
    }

    app.config.globalProperties.$highlighter = expodedFunctions
    app.provide('highlight', expodedFunctions)

    const router = app.config.globalProperties.$router
    if (router) {
      router.beforeEach(() => {
        dismiss()
      })
    }
  },
}

export function useHighlighter() {
  return inject<{
    highlight: Function
    dismiss: Function
    setBackgroundCallback: Function
  }>('highlight')
}

export default ElementHighlighterPlugin
