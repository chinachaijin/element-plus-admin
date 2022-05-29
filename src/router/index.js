import { createRouter, createWebHashHistory } from 'vue-router'

/* Layout */
import Layout from '@/layout'
import Menu from '@/layout/menu.vue'
import Head from '@/layout/head.vue'
const components = {
  default: Layout,
  menu:Menu,
  head:Head
}
export const constantRoutes = [
  {
    path: '/',
    name: 'home',
    components,
    redirect: '/dashboard',
    meta: { templatestatus: 'admin' },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', templatestatus: 'admin' }
      },
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true,
  }
]

const modulesFiles = require.context('./modules', true, /\.js$/)
const allRouter = []
modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const value = modulesFiles(modulePath)
  allRouter.push(value.default)
}, {})

allRouter.push({ path: '/:pathMatch(.*)*', redirect: '/404', hidden: true })

export const asyncRoutes = allRouter

const router = createRouter({
  history: createWebHashHistory(),
  routes:constantRoutes
})

export function resetRouter (router) {
  const newRouter = createRouter({
    history: createWebHashHistory(),
    routes:constantRoutes
  })
  // 用初始化的matcher替换当前router的matcher
  router.matcher = newRouter.matcher 
}

export default router
