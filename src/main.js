import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

/** Fontawesome setup */
import { library } from "@fortawesome/fontawesome-svg-core";
// import { } from '@fortawesome/free-regular-svg-icons'

import {
  faEllipsisVertical,
  faRobot,
  faPlay,
  faPause,
  faXmark,
  faUserSecret,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

library.add([
  faEllipsisVertical,
  faRobot,
  faPlay,
  faPause,
  faXmark,
  faUserSecret,
  faChevronLeft,
]);

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
Vue.component("FontAwesomeIcon", FontAwesomeIcon);
/** End Fontawesome setup */

import modalPlugin from "@/plugins/modal";
Vue.use(modalPlugin);

import "@/assets/styles/bootstrap.scss";
import "@/assets/styles/main.scss";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
