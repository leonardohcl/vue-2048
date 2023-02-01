export interface IHighlighterEntry {
    shouldDisplay?:boolean
    selector?: string
    padding?: number,
    bgColor?: string,
    bgOpacity?: number,
    transitionDuration?: number
}

export class HighlighterEntry implements IHighlighterEntry {
    selector
    padding
    bgColor
    bgOpacity
    transitionDuration

    constructor({ selector = 'body', padding = 0, bgColor = 'black', bgOpacity = 0.75, transitionDuration = 0 } = {}) {
        this.selector = selector
        this.padding = padding
        this.bgColor = bgColor
        this.bgOpacity = bgOpacity
        this.transitionDuration = transitionDuration
    }
}

export interface IHighlighterMemory {
    lastHighlight?: IHighlighterEntry
    refreshTimeout?: any,
}

export default class HighlighterMemory implements IHighlighterMemory {
    lastHighlight: HighlighterEntry;
    refreshTimeout?: any

    constructor({ selector = 'body', padding = 0, bgColor = 'black', bgOpacity = 0.75 } = {}) {
        this.lastHighlight = new HighlighterEntry({ selector, padding, bgColor, bgOpacity })
    }
}