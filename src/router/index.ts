import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Roguelike from '@/views/Roguelike.vue'


const routes = [{
  path: '/',
  name: 'Home',
  component: Home
}, {
  path: '/roguelike',
  name: 'Roguelike',
  component: Roguelike
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router