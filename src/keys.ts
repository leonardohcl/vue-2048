import IHighlighterFunctions from "./components/organisms/ElementHighlighter/model/HighlighterFunctions";
import { InjectionKey } from 'vue'
import MemoryCard from "./model/Game Utils/MemoryCard";

export const Highlighter = Symbol("Element highlighter") as InjectionKey<IHighlighterFunctions>