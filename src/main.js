import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

/** Fontawesome setup */
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
} from '@fortawesome/free-solid-svg-icons'

import { faMinusSquare, faPlusSquare, faSquare } from '@fortawesome/free-regular-svg-icons'

library.add([
  faGears,
  faRankingStar,
  faTrophy,
  faFloppyDisk,
  faFolderOpen,
  faArrowsLeftRight,
  faArrowsUpDown,
  faBrain,
  faSquare,
  faAnglesUp,
  faPlusSquare,
  faMinusSquare
])

import {
  FontAwesomeIcon,
  FontAwesomeLayers,
} from '@fortawesome/vue-fontawesome'
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.component('FontAwesomeLayers', FontAwesomeLayers)

/** End Fontawesome setup */

import '@/assets/styles/main.scss'
import '@/assets/styles/bootstrap.scss'

import router from './router'
import store from './store'

app.use(router)
app.use(store)

/** End main style, router and store setup */

/** Boostrap Setup */
import { ModalPlugin, TooltipPlugin, TabsPlugin } from 'bootstrap-vue'

app.use(TabsPlugin)
app.use(ModalPlugin)
app.use(TooltipPlugin)

/** End Bootstrap setup */

app.mount('#app')
