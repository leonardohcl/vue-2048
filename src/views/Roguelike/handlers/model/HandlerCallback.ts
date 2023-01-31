import LooseObject from "@/utils/LooseObject"

type CallbackFunction = (args: LooseObject) => void

export default class HandlerCallback<T = any> {
    callbacks: LooseObject<Array<CallbackFunction>>

    set(action: T, fn: CallbackFunction) {
        const key = action as string
        if (!this.callbacks[key]) {
            this.callbacks[key] = new Array<CallbackFunction>()
        }
        this.callbacks[key].push(fn)
    }

    run(action: T, args: any = null) {
        this.callbacks[action as string]?.forEach(fn => fn(args))
    }

    constructor() {
        this.callbacks = {}
    }

}