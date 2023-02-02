import DialogBoxConfig, { IDialogBoxConfig } from "@/components/atoms/DialogBox/model/DialogBoxConfig";
import DialogBoxAction, { IDialogBoxAction } from "@/components/atoms/DialogBox/model/DialogBoxAction"
import LooseObject from "@/utils/LooseObject";

export interface IHighlightDialogPosition {
    vertical?: "top" | "top-inset" | "center" | "bottom-inset" | "bottom";
    horizontal?: "left" | "left-inset" | "center" | "right-inset" | "right";
}

export interface IHighlightDialog {
    id?: string | number,
    content: string,
    title?: string,
    subtitle?: string,
    config?: IDialogBoxConfig
    actions?: IDialogBoxAction[]
    append?: boolean
    style?: LooseObject<string | number>
}

export default class HighlightDialog implements IHighlightDialog {
    id
    title
    subtitle
    content
    config
    append
    actions
    style

    constructor({ id = new Date().getMilliseconds(), title, content, subtitle, config, append = false, actions = [], style }: IHighlightDialog) {
        this.id = id
        this.title = title
        this.subtitle = subtitle
        this.content = content
        this.config = new DialogBoxConfig({ ...config, title, content, subtitle, })
        this.actions = actions.map(action => new DialogBoxAction(action))
        this.append = append
        this.style = style
    }
}