import HighlighterFunctions from '@/components/atoms/ElementHighlighter/model/HighlighterFunctions'
import { ITutorial, ITutorialStep } from '@/model/Game Utils/Tutorial'
import { reactive, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import useHighlighter from './highlighter'

export interface ITutorialHandler {
  tutorials: ITutorial[]
  start: (tutorial: ITutorial) => void
  nextStep: () => void
  stop: () => Promise<void>
}

export default function useTutorialHandler(
  tutorialList: ITutorial[],
  highlighterFunctions?: HighlighterFunctions
): ITutorialHandler {
  const highlighter = highlighterFunctions ?? useHighlighter()
  const tutorials = tutorialList

  const tracker = reactive<{
    routine: ITutorialStep[]
    index: number
    defaultDuration: number
  }>({
    defaultDuration: 500,
    routine: [],
    index: 0,
  })

  const start = (tutorial: ITutorial) => {
    tracker.index = 0
    tracker.routine = tutorial.routine
    tracker.defaultDuration = tutorial.stepDuration ?? 500
    executeCurrentStep()
  }

  const nextStep = () => {
    tracker.index++
    executeCurrentStep()
  }

  const executeCurrentStep = async () => {
    if (!highlighter) return
    const step = tracker.routine[tracker.index]
    if (!step) return highlighter.dismiss()

    if (step.highlight) {
      if (step.clearTextBeforeHighlight)
        await highlighter.clearText(tracker.defaultDuration)
      await highlighter.highlight(step.highlight, {
        ...step.highlightConfig,
        transitionDuration:
          step.highlightConfig?.transitionDuration ?? tracker.defaultDuration,
        bgCallbacks: [nextStep],
      })
    }
    if (step.dialog) {
      if (!step.dialog.append)
        await highlighter.clearText(tracker.defaultDuration)
      await highlighter.addText(
        step.dialog,
        step.dialogPosition,
        step.dialogDuration ?? tracker.defaultDuration
      )
    }
  }

  const stop = async () => {
    await highlighter?.dismiss()
    tracker.routine = []
    tracker.index = 0
  }

  onBeforeRouteLeave(() => {
    stop()
  })

  return {
    tutorials,
    start,
    nextStep,
    stop,
  }
}
