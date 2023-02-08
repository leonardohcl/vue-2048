import { ITutorial } from '@/model/Game Utils/Tutorial'

import GameplayTutorial from './roguelike-gameplay'
import ControlsTutorial from './controls'
import MemoryTutorial from './memory'
import RewardsTutorial from './rewards'
import PurchaseTutorial from './purchase'
import ItemsTutorial from './items'
import UpgradesTutorial from './upgrades'

const RoguelikeModeTutorial: ITutorial = {
  title: 'How to play',
  routine: [
    ...GameplayTutorial.routine,
    ...ControlsTutorial.routine,
    ...RewardsTutorial.routine,
    ...PurchaseTutorial.routine,
    ...ItemsTutorial.routine,
    ...UpgradesTutorial.routine,
    ...MemoryTutorial.routine,
  ],
}

export default RoguelikeModeTutorial
