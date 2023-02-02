import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Regular from '@/views/Regular.vue'
import Roguelike from '@/views/Roguelike/Roguelike.vue'
import app from '@/main'
import ElementHighlighterVue from '@/components/organisms/ElementHighlighter/ElementHighlighter.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/regular',
    name: 'regular',
    component: Regular,
  },
  {
    path: '/roguelike',
    name: 'roguelike',
    component: Roguelike,
  },
]

const router = createRouter({
  
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(()=>{
  const highlighter = app._instance?.refs.elementHighlighter
  if(highlighter){
    (highlighter as typeof ElementHighlighterVue).dismiss()
  }
})

export default router
