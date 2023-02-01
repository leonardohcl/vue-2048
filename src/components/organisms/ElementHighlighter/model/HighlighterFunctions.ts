import { IHighlighterConfig } from "./HighlighterConfig";
import { IHighlighterEntry } from "./HighlighterMemory";

export default interface IHighlighterFunctions {
    highlight: (
        selector: string,
        config?: IHighlighterEntry
    ) => Promise<void>
    dissmiss: (data?: {
        transitionDuration?: number;
    }) => Promise<void>
    setBackgroundCallback: (bgCallback: (evt: MouseEvent) => void) => void
    setConfig: (data: IHighlighterConfig) => void
}