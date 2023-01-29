import { createApp } from 'vue'
import MainApp from '@/App.vue'


import router from '@/router'
import store from '@/store'

import vuetify from '@/plugins/vuetify'

const app = createApp(MainApp)

app.use(router)
app.use(store)
app.use(vuetify)


import '@/assets/styles/main.scss'
app.mount('#app')
