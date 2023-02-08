import IHighlighterFunctions from "./components/organisms/ElementHighlighter/model/HighlighterFunctions";
import { InjectionKey } from 'vue'
import NavbarVue from "./components/organisms/Navbar/Navbar.vue";

export const Highlighter = Symbol("Element highlighter") as InjectionKey<IHighlighterFunctions>
export const Navbar = Symbol("Navbar") as InjectionKey<InstanceType<typeof NavbarVue>>