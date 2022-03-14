import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import RobotLab from '@/views/RobotLab.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  component: Home
}, {
  path: '/robot-lab',
  name: 'RobotLab',
  component: RobotLab
}]

const router = new VueRouter({
  routes
})

export default router