import LooseObject from '@/utils/LooseObject';
import { remove } from 'lodash';
import { ref, reactive } from 'vue'
import HighlighterConfig from '../model/HighlighterConfig';
import HighlightDialog, { IHighlightDialog, IHighlightDialogPosition } from '../model/HighlighterDialog';

export default function useDialogHandler(config: HighlighterConfig) {
    const dialogContainerClasses = ref<string[]>(["", ""]);
    const dialogContainerStyles = reactive<LooseObject<number | string>>({
        paddingLeft: "",
        paddingRight: "",
        paddingTop: "",
        paddingBottom: "",
    });
    const dialogs = ref<HighlightDialog[]>([]);


    const clearText = () => {
        dialogs.value = []
    }

    const fixDialogPad = (position: IHighlightDialogPosition) => {
        const dialogPaddingFixes: {
            [key: string]: {
                paddingLeft?: number | string;
                paddingRight?: number | string;
                paddingTop?: number | string;
                paddingBottom?: number | string;
            };
        } = {
            "top-left-inset": { paddingLeft: 0 },
            "top-right-inset": { paddingRight: 0 },
            "top-inset-left": { paddingTop: 0 },
            "top-inset-right": { paddingTop: 0 },
            "bottom-inset-left": { paddingBottom: 0 },
            "bottom-inset-right": { paddingBottom: 0 },
            "bottom-left-inset": { paddingLeft: 0 },
            "bottom-right-inset": { paddingRight: 0 },
        };

        const fix =
            dialogPaddingFixes[`${position.vertical}-${position.horizontal}`] || {};

        const {
            paddingTop = "",
            paddingRight = "",
            paddingBottom = "",
            paddingLeft = "",
        } = fix;

        dialogContainerStyles.paddingLeft = paddingLeft;
        dialogContainerStyles.paddingRight = paddingRight;
        dialogContainerStyles.paddingBottom = paddingBottom;
        dialogContainerStyles.paddingTop = paddingTop;
    };

    const setDialogPosition = (position: IHighlightDialogPosition) => {
        const classPrefix = "element-highlighter__dialog-container";

        if (position.vertical)
            dialogContainerClasses.value[0] = `${classPrefix}--v-${position.vertical}`;
        if (position.horizontal)
            dialogContainerClasses.value[1] = `${classPrefix}--h-${position.horizontal}`;

        fixDialogPad(position);
    };

    const controlDialogs = (maxAllowed: number = config.dialogsAllowed) => {
        if (maxAllowed === 0) return;

        if (dialogs.value.length > maxAllowed)
            dialogs.value.splice(0, dialogs.value.length - maxAllowed);
    };

    const addText = (
        data: IHighlightDialog,
        position?: IHighlightDialogPosition,
        animationDuration: number = 500
    ) => {
        const dialog = new HighlightDialog({
            ...data,
            style: {
                transitionDuration: `${animationDuration}ms !important`,
                transitionTimingFunction: "cubic-bezier(.15,.75,0,1)",
            },
        });

        if (position) setDialogPosition(position);

        dialog.append ? dialogs.value.push(dialog) : (dialogs.value = [dialog]);

        controlDialogs();
    };

    const removeText = (id: number | string) => {
        remove(dialogs.value, dialog => dialog.id === id)
    }

    return {
        dialogs,
        dialogContainerStyles,
        dialogContainerClasses,
        addText,
        clearText,
        removeText,
        controlDialogs,
        setDialogPosition,
    }
}