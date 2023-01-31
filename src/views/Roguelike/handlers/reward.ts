import { reactive, ref, Ref } from "vue";
import RewardsManager from "@/components/organisms/RewardsManager.vue";
import HandlerCallback from "./model/HandlerCallback";
import IHandler from "./model/Handler";
import HandlerSuite, { IHandlerSuite } from "./model/HandlerSuite";

type CallbackAction = "reward"

export interface IRewardHandler extends IHandler {
    callback: HandlerCallback<CallbackAction>
    rewardsManager: Ref<any> | undefined
    getLoot: () => void
    handleReward: (reward: number) => void
}

export default function useRewardHandler(): IRewardHandler {

    const ignoreRewards = ref(false);
    const rewardsManager = ref<typeof RewardsManager>();

    const callback = new HandlerCallback<CallbackAction>()
    const externalHandlers = reactive(new HandlerSuite())

    const getLoot = () => {
        // if (progress.run === 0) return;
        if (!ignoreRewards.value)
            rewardsManager.value?.lootRewards();
    };

    const handleReward = (reward: number) => {
        callback.run("reward", { reward })
    };

    const registerHandlers = ({ state, memory }: IHandlerSuite) => {
        if (state && !externalHandlers.state) {
            state.callback.set("gameOver", () => { if (!ignoreRewards.value) getLoot() })
            state.callback.set("start", () => { ignoreRewards.value = false })
            state.callback.set("end", () => { ignoreRewards.value = false })
            externalHandlers.state = state
        }
        if (memory && !externalHandlers.memory) {
            memory.callback.set("load", () => { ignoreRewards.value = true })
            externalHandlers.memory = memory
        }
    }

    return {
        callback,
        rewardsManager,
        getLoot,
        handleReward,
        registerHandlers
    }
}