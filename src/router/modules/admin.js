/** 当您的路由表太长时，您可以将其拆分为小模块 **/

import Layout from '@/layout'
import Menu from '@/layout/menu.vue'
import Head from '@/layout/head.vue'
const components = {
  default: Layout,
  menu:Menu,
  head:Head
}

const AdminRouter = {
  path: '/admin',
  components,
  redirect: '/admin/admin',
  name: 'adminandrole',
  meta: {
    title: '角色与权限',
    icon: 'user',
    templatestatus: 'admin',
  },
  children: [
    {
      path: 'admin',
      component: () => import('@/views/admin/admin'),
      name: 'admin',
      meta: {
        title: '用户管理',
        templatestatus: 'admin',
        roles: {
          'admins': ['new', 'edit', 'index']
        }
      }
    },
    {
      path: 'role',
      component: () => import('@/views/admin/role'),
      name: 'role',
      meta: {
        title: '角色管理',
        roles: {
          'roles': ['new', 'edit', 'index']
        }
      }
    },
    {
      path: 'apps',
      component: () => import('@/views/admin/apps'),
      name: 'apps',
      meta: {
        title: '功能设置',
        roles: {
          'apps': ['new', 'edit', 'index']
        }
      }
    },
    {
      path: 'config',
      component: () => import('@/views/admin/config'),
      name: 'config',
      meta: {
        title: '全局配置',
        roles: {
          'configs': ['new', 'edit', 'index']
        }
      }
    }
  ]
}

export default AdminRouter
