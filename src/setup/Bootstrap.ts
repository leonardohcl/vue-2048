import { ModalPlugin, TooltipPlugin } from 'bootstrap-vue'
import { App } from 'vue'

export function setupBootstrap(app: App) {
  app.use(ModalPlugin)
  app.use(TooltipPlugin)
}
