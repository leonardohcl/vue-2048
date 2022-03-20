import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import modalPlugin from "@/plugins/modal"
Vue.use(modalPlugin)

import "bootstrap/scss/bootstrap-grid.scss"
import "bootstrap/scss/bootstrap-utilities.scss"
import "@/assets/styles/main.scss";

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
