import { IDialogBoxConfig } from "./DialogBoxConfig"

export interface IDialogBoxAction {
    title?: string
    action?: (dialog?:IDialogBoxConfig) => void
    prependIcon?: string
    appendIcon?: string
    color?: string
    size?: string | number
    variant?: 'flat' | 'elevated' | 'tonal' | 'outlined' | 'text' | 'plain'
}

export default class DialogBoxAction {
    title
    action
    prependIcon
    appendIcon
    color
    size
    variant

    constructor(
        { title,
            action,
            prependIcon,
            appendIcon,
            color,
            size,
            variant = "text"
        }: IDialogBoxAction = {}) {
        this.title = title
        this.action = action
        this.prependIcon = prependIcon
        this.appendIcon = appendIcon
        this.color = color
        this.size = size
        this.variant = variant

    }
}