import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App)


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
app.component("FontAwesomeIcon", FontAwesomeIcon)

/** End Fontawesome setup */

import "@/assets/styles/bootstrap.scss";
import "@/assets/styles/main.scss";


import router from "./router";
import store from "./store";


app.use(router)
app.use(store)

app.mount("#app")
