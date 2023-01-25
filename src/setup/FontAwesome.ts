import { library } from '@fortawesome/fontawesome-svg-core'

import {
  faGears,
  faRankingStar,
  faTrophy,
  faFloppyDisk,
  faFolderOpen,
  faArrowsLeftRight,
  faArrowsUpDown,
  faBrain,
  faAnglesUp,
  faPlusSquare,
  faMinusSquare,
  faHammer,
  faHand,
  faCircleXmark,
  faCoins,
  faChessBoard,
  faTimes,
  faRotateLeft,
  faAward,
  faUpDownLeftRight,
  faMedal,
  faPersonRunning,
  faTableCells,
  faHashtag,
} from '@fortawesome/free-solid-svg-icons'

import {
  faMinusSquare as farMinusSquare,
  faPlusSquare as farPlusSquare,
  faSquare as farSquare,
} from '@fortawesome/free-regular-svg-icons'

import {
  FontAwesomeIcon,
  FontAwesomeLayers,
} from '@fortawesome/vue-fontawesome'
import { App } from 'vue'

export function setupFontAwesome(app: App) {
  library.add(
    ...[
      faGears,
      faRankingStar,
      faTrophy,
      faFloppyDisk,
      faFolderOpen,
      faArrowsLeftRight,
      faArrowsUpDown,
      faBrain,
      faAnglesUp,
      faPlusSquare,
      farSquare,
      farPlusSquare,
      farMinusSquare,
      faHammer,
      faMinusSquare,
      faHand,
      faCircleXmark,
      faCoins,
      faChessBoard,
      faTimes,
      faRotateLeft,
      faAward,
      faUpDownLeftRight,
      faMedal,
      faPersonRunning,
      faTableCells,
      faHashtag,
    ]
  )

  app.component('FontAwesomeIcon', FontAwesomeIcon)
  app.component('FontAwesomeLayers', FontAwesomeLayers)
}
