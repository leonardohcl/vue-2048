export interface IHighlighterMemoryEntry {
    selector?: string
    padding?: number,
    bgColor?: string,
    bgOpacity?: number,
}

export class HighlighterMemoryEntry {
    selector
    padding
    bgColor
    bgOpacity

    constructor({ selector = 'body', padding = 0, bgColor = 'black', bgOpacity = 0.75 } = {}) {
        this.selector = selector
        this.padding = padding
        this.bgColor = bgColor
        this.bgOpacity = bgOpacity
    }
}

export interface IHighlighterMemory {
    lastHighlight?: IHighlighterMemoryEntry
    refreshTimeout?: any,
}

export default class HighlighterMemory implements IHighlighterMemory {
    lastHighlight: HighlighterMemoryEntry;
    refreshTimeout?: any

    constructor({ selector = 'body', padding = 0, bgColor = 'black', bgOpacity = 0.75 } = {}) {
        this.lastHighlight = new HighlighterMemoryEntry({ selector, padding, bgColor, bgOpacity })
    }
}