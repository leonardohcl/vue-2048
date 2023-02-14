import vuetify from "@/plugins/vuetify";
import { defineSetupVue3 } from "@histoire/plugin-vue";

import "@/assets/styles/histoire.scss";
import 'vuetify/styles'

export const setupVue3 = defineSetupVue3(({ app, story, variant }) => {  
  app.use(vuetify);
});
