import { IHighlighterConfig } from "./HighlighterConfig";
import { IHighlightDialog, IHighlightDialogPosition } from "./HighlighterDialog";
import { IHighlighterEntry } from "./HighlighterMemory";

export default interface IHighlighterFunctions {
    highlight: (
        selector: string,
        config?: IHighlighterEntry
    ) => Promise<void>
    dismiss: (data?: {
        transitionDuration?: number;
    }) => Promise<void>
    addText: (dialog: IHighlightDialog, position?: IHighlightDialogPosition, animationDuration?: number) => void
    clearText: () => void
    removeText: (id: string | number) => void
    setBackgroundCallback: (bgCallback: (evt: MouseEvent) => void) => void
    setConfig: (data: IHighlighterConfig) => void
}