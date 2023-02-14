import { defineConfig } from "histoire";
import { HstVue } from "@histoire/plugin-vue";

export default defineConfig({
  setupFile: "./src/histoire.setup.ts",
  plugins: [HstVue()],
  responsivePresets: [
    { label: "Xs (Smallest mobile)", width: 375, height: 0 },
    { label: "Sm (Large or landscape mobile )", width: 600, height: 0 },
    { label: "Md (Tablets and monitors)", width: 960, height: 0 },
    { label: "Lg (HD monitor)", width: 1264, height: 0 },
    { label: "Xl (Full HD monitors)", width: 1904, height: 0 },
  ],
  tree: {
    groups: [
      { id: "electrons", title: "Electrons" },
      { id: "atoms", title: "Atoms" },
      { id: "molecules", title: "Molecules" },
      { id: "organisms", title: "Organisms" },
      { id: "pages", title: "Pages" },
    ],    
  },
  defaultStoryProps:{
    autoPropsDisabled: true
  }
});
