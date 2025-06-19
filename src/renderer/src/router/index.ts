import { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'user',
    component: () => import('../views/user-list.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
