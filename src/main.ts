import { createApp } from 'vue'
import App from './App.vue'

import '@/assets/styles/main.scss'
import '@/assets/styles/bootstrap.scss'

import router from './router'
import store from './store'
import { setupFontAwesome } from './setup/FontAwesome'
import { setupBootstrap } from './setup/Bootstrap'

const app = createApp(App)

app.use(router)
app.use(store)

setupFontAwesome(app)
setupBootstrap(app)

app.mount('#app')
