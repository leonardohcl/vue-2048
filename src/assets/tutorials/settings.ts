import { ITutorial } from "@/model/Game Utils/Tutorial";

const tutorial: ITutorial = {
    title: "Settings",
    routine: [
        {
            triggerNext: true,
            highlight: ".settings",
            clearTextBeforeHighlight: true,
            dialog: {
                content: "Here you can change the board size if you want a more challenging puzzle...",
                config: {
                    maxWidth: 200
                }
            },
            dialogPosition: { vertical: "bottom", horizontal: "right-inset" }
        },
        {
            dialog: {
                content: "...or more space, just to train...",
                append: true
            },
        },
        {
            dialog: {
                content: "...or need more undos...",
                append: true
            },
        },
        {
            dialog: {
                content: "...or remove them if you <b>don't</b> need undos",
                append: true
            },
        },
    ]
}

export default tutorial