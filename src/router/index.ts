import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Roguelike from '@/views/Roguelike.vue'
import app from '@/main'
import ElementHighlighterVue from '@/components/organisms/ElementHighlighter/ElementHighlighter.vue'
import Standard from '@/views/Standard.vue'
import GameMode from '@/model/Game Utils/GameMode'
import NavbarVue from '@/components/organisms/Navbar/Navbar.vue'
import Tutorial from '@/assets/tutorials'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      homeScreen: true,
      conditionalEnterFrom: (previousTransitionDirection: string) => {
        switch (previousTransitionDirection) {
          case 'left':
            return 'right'
          case 'right':
            return 'left'
          default:
            return 'fade'
        }
      },
      tutorials: [
        { ...Tutorial.StandardGameplay, title: 'Standard Mode' },
        { ...Tutorial.RoguelikeGameplay, title: 'Roguelike Mode' },
      ],
    },
  },
  {
    path: `/${GameMode.Standard}`,
    name: GameMode.Standard,
    component: Standard,
    meta: {
      navigateTo: '/',
      enterFrom: 'left',
      gameMode: GameMode.Standard,
      gameModeTheme: { color: 'plain', variant: 'tonal' },
      tutorials: [
        Tutorial.StandardMode,
        Tutorial.StandardGameplay,
        Tutorial.Controls,
      ],
    },
  },
  {
    path: `/${GameMode.Roguelike}`,
    name: GameMode.Roguelike,
    component: Roguelike,
    meta: {
      navigateTo: '/',
      enterFrom: 'right',
      gameMode: GameMode.Roguelike,
      gameModeTheme: { color: 'secondary' },
      tutorials: [
        Tutorial.RoguelikeMode,
        Tutorial.RoguelikeGameplay,
        Tutorial.Controls,
        Tutorial.Rewards,
        Tutorial.Purchase,
        Tutorial.Items,
        Tutorial.Upgrades,
      ],
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from) => {
  if (!from.name) return
  if (!app._instance) return

  const highlighter = app._instance.refs.elementHighlighter
  if (highlighter) {
    ;(highlighter as typeof ElementHighlighterVue).dismiss()
  }

  const navbar = app._instance.refs.navbar
  if (navbar) (navbar as typeof NavbarVue).setGame()
})

router.afterEach((to, from) => {
  to.meta.previousPage = from.name
  to.meta.previousGameMode = from.meta.gameMode
  to.meta.previousGameModeTheme = from.meta.gameModeTheme
  to.meta.previousTransitionDirection = from.meta.enterFrom
})

export default router
