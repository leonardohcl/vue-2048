export interface IHighlighterEntry {
  shouldDisplay?: boolean
  selector?: string | { x: number | string; y: number | string }
  padding?: number
  bgColor?: string
  bgOpacity?: number
  transitionDuration?: number
  bgCallbacks?: (() => void)[]
}

export class HighlighterEntry implements IHighlighterEntry {
  selector
  padding
  bgColor
  bgOpacity
  transitionDuration
  bgCallbacks: (() => void)[]

  constructor({
    selector = 'body',
    padding = 0,
    bgColor = 'black',
    bgOpacity = 0.75,
    transitionDuration = 0,
    bgCallbacks = [],
  }: IHighlighterEntry = {}) {
    this.selector = selector
    this.padding = padding
    this.bgColor = bgColor
    this.bgOpacity = bgOpacity
    this.transitionDuration = transitionDuration
    this.bgCallbacks = bgCallbacks
  }
}

export interface IHighlighterMemory {
  shouldDisplay?: boolean
  lastHighlight?: IHighlighterEntry
  refreshTimeout?: any
}

export default class HighlighterMemory implements IHighlighterMemory {
  shouldDisplay = false
  lastHighlight: HighlighterEntry
  refreshTimeout?: any

  constructor({
    selector = 'body',
    padding = 0,
    bgColor = 'black',
    bgOpacity = 0.75,
    bgCallbacks = [] as (() => void)[]
  } = {}) {
    this.lastHighlight = new HighlighterEntry({
      selector: selector,
      padding,
      bgColor,
      bgOpacity,
      bgCallbacks
    })
  }
}
