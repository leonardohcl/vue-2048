import vuetify from "@/plugins/vuetify";
import { defineSetupVue3 } from "@histoire/plugin-vue";

import "@/assets/styles/main.scss";
import 'vuetify/styles'

export const setupVue3 = defineSetupVue3(({ app, story, variant }) => {  
  app.use(vuetify);
});
