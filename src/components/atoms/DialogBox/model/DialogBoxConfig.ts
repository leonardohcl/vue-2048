export interface IDialogBoxConfig {
    title?: string
    subtitle?: string
    content?: string
    color?: string
    variant?: 'flat' | 'elevated' | 'tonal' | 'outlined' | 'text' | 'plain'
    flat?: boolean

    width?: string | number
    maxWidth?: string | number
    minWidth?: string | number

    height?: string | number
    maxHeight?: string | number
    minHeight?: string | number
}

export default class DialogBoxConfig implements IDialogBoxConfig {
    title
    subtitle
    content
    color
    variant
    flat
    width
    minWidth
    maxWidth
    height
    minHeight
    maxHeight

    constructor({
        content, title, subtitle, width, minWidth, height, minHeight, maxHeight,
        maxWidth = "400px",
        color = "secondary",
        variant = "elevated",
        flat = false
    }: IDialogBoxConfig = {}) {
        this.title = title
        this.subtitle = subtitle
        this.content = content
        this.color = color
        this.variant = variant
        this.flat = flat
        this.width = width
        this.minWidth = minWidth
        this.maxWidth = maxWidth
        this.height = height
        this.minHeight = minHeight
        this.maxHeight = maxHeight
    }
}