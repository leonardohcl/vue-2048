import { ref, watch, SetupContext } from "vue";

export default function useDialogCommands(context?: SetupContext) {
    const isOpen = ref(false);

    watch(isOpen, newValue => {
        emitStateChange(newValue ? 'open' : 'close')
    })

    const emitStateChange = (state: string) => {
        context?.emit(state)
    }

    const open = () => {
        isOpen.value = true
    }

    const close = () => {
        isOpen.value = false
    }

    return {
        isOpen, open, close
    }
}