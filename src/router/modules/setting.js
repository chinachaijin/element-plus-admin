/** 当您的路由表太长时，您可以将其拆分为小模块 **/

import Layout from '@/layout'
import Menu from '@/layout/menu.vue'
import Head from '@/layout/head.vue'
const components = {
  default: Layout,
  menu:Menu,
  head:Head
}

const Router = {
  path: '/setting',
  components,
  redirect: '/setting/configset',
  name: 'inter',
  meta: {
    title: '系统设置',
    icon: 'tab',
    templatestatus: 'admin',
  },
  children: [
    {
      path: 'configset',
      component: () => import('@/views/admin/configset'),
      name: 'configset',
      meta: {
        title: '基础配置',
        templatestatus: 'admin',
        roles: {
          'configsets': ['indexall', 'setvalue']
        }
      }
    }
  ]
}

export default Router
