import { createApp } from 'vue'
import MainApp from '@/App.vue'


import router from '@/router'
import vuetify from '@/plugins/vuetify'

const app = createApp(MainApp)

app.use(router)
app.use(vuetify)

import '@/assets/styles/main.scss'
import 'vuetify/styles'

app.mount('#app')

export default app