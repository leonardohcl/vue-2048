import IHighlighterFunctions from "./components/organisms/ElementHighlighter/model/HighlighterFunctions";
import { InjectionKey } from 'vue'

export const Highlighter = Symbol("Element highlighter") as InjectionKey<IHighlighterFunctions>