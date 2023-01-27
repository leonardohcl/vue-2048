import { App, createApp, inject, provide, createVNode } from 'vue'
import IElementHighlighterOptions from './options'
import HighlighterApp from './app.vue'

const ElementHighlighterPlugin = {
  install(app: App, options: IElementHighlighterOptions = {}) {
    const {
      id = 'highlighter',
      resizeStagger,
      transitionDuration,
      bgColor
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

    component.setConfig({ resizeStagger, transitionDuration, bgColor })

    const setBackgroundCallback = (bgCallback: Function) =>
      component.setConfig({ bgCallback })

    const { highlight, dismiss } = component

    const expodedFunctions = {
      highlight,
      dismiss,
      setBackgroundCallback
    }

    app.config.globalProperties.$highlighter = expodedFunctions
    app.provide('highlight',expodedFunctions)

    const router = app.config.globalProperties.$router
    if (router) {
      router.beforeEach(() => {
        dismiss()
      })
    }
  },
}

export function useHighlighter() {
  return inject<{ highlight: Function; dismiss: Function }>('highlight')
}

export default ElementHighlighterPlugin
