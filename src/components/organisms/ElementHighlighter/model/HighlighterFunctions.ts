import { IHighlighterConfig } from "./HighlighterConfig";
import { IHighlightDialog, IHighlightDialogPosition } from "./HighlighterDialog";
import { IHighlighterEntry } from "./HighlighterMemory";

export interface IHighlighterFunctions {
    highlight?: (
        selector: string | { x: number | string, y: number | string },
        config?: IHighlighterEntry
    ) => Promise<void>
    dismiss?: (data?: {
        transitionDuration?: number;
    }) => Promise<void>
    addText?: (dialog: IHighlightDialog, position?: IHighlightDialogPosition, animationDuration?: number) => void
    clearText?: (duration?: number) => Promise<void>
    removeText?: (id: string | number) => void
    setConfig?: (data: IHighlighterConfig) => void
}

function throwMissingReference() {
    throw new Error("Reference to ElementHighligher method not set")
}

export default class HighlighterFunctions implements IHighlighterFunctions {
    highlight
    dismiss
    addText
    clearText
    removeText
    setConfig

    constructor({
        highlight = (selector: string | { x: number | string, y: number | string }) => { throwMissingReference(); return Promise.resolve() },
        dismiss = () => { throwMissingReference(); return Promise.resolve() },
        addText = (dialog: IHighlightDialog) => { throwMissingReference() },
        clearText = () => { throwMissingReference(); return Promise.resolve() },
        removeText = (id: string | number) => { throwMissingReference() },
        setConfig = (data: IHighlighterConfig) => { throwMissingReference() }
    }: IHighlighterFunctions = {}) {
        this.highlight = highlight
        this.dismiss = dismiss
        this.addText = addText
        this.clearText = clearText
        this.removeText = removeText
        this.setConfig = setConfig
    }
}