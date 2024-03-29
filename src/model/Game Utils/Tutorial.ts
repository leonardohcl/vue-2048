import { IHighlightDialog, IHighlightDialogPosition } from "@/components/atoms/ElementHighlighter/model/HighlighterDialog"
import { IHighlighterEntry } from "@/components/atoms/ElementHighlighter/model/HighlighterMemory"

export interface ITutorialStep {
    highlight?: string | { x: string | number, y: string | number }
    highlightConfig?: IHighlighterEntry
    clearTextBeforeHighlight?: boolean
    dialog?: IHighlightDialog
    dialogPosition?: IHighlightDialogPosition
    dialogDuration?: number
    triggerNext?: boolean
}

export interface ITutorial {
    title: string
    routine: ITutorialStep[]
    stepDuration?: number
}