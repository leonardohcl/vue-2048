import HandlerCallback from "./HandlerCallback";
import { IHandlerSuite } from "./HandlerSuite";

export default interface IHandler {
    registerHandlers: (handlers: IHandlerSuite) => void
    callback: HandlerCallback
} 