import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App)


/** Fontawesome setup */
import { library } from "@fortawesome/fontawesome-svg-core";
// import { } from '@fortawesome/free-regular-svg-icons'

import {
  faGears
} from "@fortawesome/free-solid-svg-icons";

library.add([
  faGears,
]);

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
app.component("FontAwesomeIcon", FontAwesomeIcon)

/** End Fontawesome setup */

import "@/assets/styles/main.scss";
import "@/assets/styles/bootstrap.scss";


import router from "./router";
import store from "./store";


app.use(router)
app.use(store)

/** End main style, router and store setup */

/** Boostrap Setup */
import { ModalPlugin, TooltipPlugin, BootstrapVueIcons } from 'bootstrap-vue'

app.use(ModalPlugin)
app.use(TooltipPlugin)
app.use(BootstrapVueIcons)

/** End Bootstrap setup */

app.mount("#app")
