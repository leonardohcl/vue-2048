import IHighlighterFunctions from "./components/organisms/ElementHighlighter/model/HighlighterFunctions";
import { InjectionKey } from 'vue'
import MemoryCard from "./model/Game Utils/MemoryCard";

export const Highlighter = Symbol("Element highlighter") as InjectionKey<IHighlighterFunctions>
export const StandardMemoryCard = Symbol("Standard Mode Memory Card") as InjectionKey<MemoryCard>
export const RoguelikeMemoryCard = Symbol("Rogulike Mode Memory Card") as InjectionKey<MemoryCard>