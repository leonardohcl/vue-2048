import { createApp } from 'vue'
import MainApp from '@/App.vue'


import router from '@/router'
import vuetify from '@/plugins/vuetify'

const app = createApp(MainApp)

app.use(router)
app.use(vuetify)

import 'vuetify/styles'
import '@/assets/styles/main.scss'

app.mount('#app')

export default app