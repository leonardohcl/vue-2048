export interface IHighlighterConfig {
    resizeStagger?: number
    transitionDuration?: number,
    bgColor?: string,
    bgOpacity?: number,
    bgCallback?: (evt: MouseEvent) => void,
}

export default class HighlighterConfig implements IHighlighterConfig {
    resizeStagger
    transitionDuration
    bgCallback
    bgColor
    bgOpacity

    constructor({
        resizeStagger = 250,
        transitionDuration = 200,
        bgColor = 'black',
        bgOpacity = 0.75,
        bgCallback,
    }: IHighlighterConfig = {}) {
        this.resizeStagger = resizeStagger;
        this.transitionDuration = transitionDuration;
        this.bgCallback = bgCallback;
        this.bgColor = bgColor;
        this.bgOpacity = bgOpacity;
    };
}