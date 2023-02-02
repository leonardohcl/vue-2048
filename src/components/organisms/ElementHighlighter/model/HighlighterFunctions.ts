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
    clearText?: () => void
    removeText?: (id: string | number) => void
    setBackgroundCallback?: (bgCallback: (evt: MouseEvent) => void) => void
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
    setBackgroundCallback
    setConfig

    constructor({
        highlight = (selector: string | { x: number | string, y: number | string }) => { throwMissingReference(); return Promise.resolve() },
        dismiss = () => { throwMissingReference(); return Promise.resolve() },
        addText = (dialog: IHighlightDialog) => { throwMissingReference() },
        clearText = () => { throwMissingReference() },
        removeText = (id: string | number) => { throwMissingReference() },
        setBackgroundCallback = (bgCallback: (evt: MouseEvent) => void) => { throwMissingReference() },
        setConfig = (data: IHighlighterConfig) => { throwMissingReference() }
    }: IHighlighterFunctions = {}) {
        this.highlight = highlight
        this.dismiss = dismiss
        this.addText = addText
        this.clearText = clearText
        this.removeText = removeText
        this.setBackgroundCallback = setBackgroundCallback
        this.setConfig = setConfig
    }
}