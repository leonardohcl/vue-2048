import { Highlighter } from "@/keys"
import { ITutorial, ITutorialStep } from "@/model/Game Utils/Tutorial"
import { inject, reactive } from "vue"

export default function useTutorialRoutine() {
    const highlighter = inject(Highlighter)
    const tracker = reactive<{ routine: ITutorialStep[], index: number, defaultDuration: number }>({
        defaultDuration: 500,
        routine: [],
        index: 0
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
        if (!highlighter) return;
        const step = tracker.routine[tracker.index]
        if (!step) return highlighter.dismiss();

        if (step.highlight) {
            if (step.clearTextBeforeHighlight) await highlighter.clearText(tracker.defaultDuration)
            await highlighter.highlight(
                step.highlight,
                {
                    ...step.highlightConfig,
                    transitionDuration: step.highlightConfig?.transitionDuration ?? tracker.defaultDuration,
                    bgCallbacks: [nextStep]
                })
        }
        if (step.dialog) {
            if (!step.dialog.append) await highlighter.clearText(tracker.defaultDuration)
            await highlighter.addText(step.dialog, step.dialogPosition, step.dialogDuration ?? tracker.defaultDuration)
        }

    }

    return {
        start
    }

}