import { createApp } from 'vue'
import MainApp from '@/App.vue'

import '@/assets/styles/main.scss'
import '@/assets/styles/bootstrap.scss'

import { setupFontAwesome } from './setup/FontAwesome'
import { setupBootstrap } from './setup/Bootstrap'
import router from '@/router'
import store from '@/store'

import ElementHighlighterPlugin from '@/plugins/ElementHighlighter'
const app = createApp(MainApp)

app.use(router)
app.use(store)

setupFontAwesome(app)
setupBootstrap(app)

app.use(ElementHighlighterPlugin)

app.mount('#app')
