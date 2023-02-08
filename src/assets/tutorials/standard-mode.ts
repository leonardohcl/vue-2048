import { ITutorial } from "@/model/Game Utils/Tutorial";

import GameplayTutorial from "./standard-gameplay"
import ControlsTutorial from "./controls";
import SettingsTutorial from "./settings";
import MemoryTutorial from "./memory"

const routine: ITutorial = {
  title: "How to play",
  routine: [
    ...GameplayTutorial.routine,
    ...ControlsTutorial.routine,
    ...SettingsTutorial.routine,
    ...MemoryTutorial.routine
  ],
};

export default routine;
