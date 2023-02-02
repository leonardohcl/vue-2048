export interface IHighlighterConfig {
    resizeStagger?: number
    transitionDuration?: number,
    bgColor?: string,
    bgOpacity?: number,
    dialogsAllowed?: number
    bgCallback?: (evt: MouseEvent) => void,
}

export default class HighlighterConfig implements IHighlighterConfig {
    resizeStagger
    dialogsAllowed
    transitionDuration
    bgCallback
    bgColor
    bgOpacity

    constructor({
        resizeStagger = 250,
        transitionDuration = 200,
        bgColor = 'black',
        bgOpacity = 0.75,
        dialogsAllowed = 0,
        bgCallback,
    }: IHighlighterConfig = {}) {
        this.dialogsAllowed = dialogsAllowed
        this.resizeStagger = resizeStagger;
        this.transitionDuration = transitionDuration;
        this.bgCallback = bgCallback;
        this.bgColor = bgColor;
        this.bgOpacity = bgOpacity;        
    };
}