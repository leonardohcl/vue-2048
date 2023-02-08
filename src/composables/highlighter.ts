import { Highlighter } from '@/keys'
import { inject } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

export default function useHighlighter() {
  const highlighter = inject(Highlighter)

  onBeforeRouteLeave(() => {
    highlighter?.dismiss()
  })

  return highlighter
}
