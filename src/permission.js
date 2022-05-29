import router from './router'
import store from './store'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie获取令牌
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 进程配置

const whiteList = ['/login', '/auth-redirect'] // 没有重定向白名单

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 确定用户是否通过getinfo获取了权限角色
      const hasRoles = store.getters.roles && Object.keys(store.getters.roles).length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          // 注意：角色必须是对象数组！例如：【管理员】或，【开发人员】、【编辑人员】 代码：['admin'] 或者,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // 根据角色生成可访问的路由映射
          await store.dispatch('permission/generateRoutes', roles)
          
          // hack方法确保addroutes完成
          // 设置replace:true，导航不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          // Message.error((typeof error) == 'string' ? error : 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有令牌(token)*/

    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单中，直接进入
      next()
    } else {
      // 其他没有访问权限的页面将重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to) => {
  // 完成进度条
  if(to.meta.roles != undefined)
  {
    let userrights = {}
    for (let index = 0; index < to.meta.roles[Object.keys(to.meta.roles)[0]].length; index++) {
      userrights[to.meta.roles[Object.keys(to.meta.roles)[0]][index]] = 1
    }
    store.commit('user/SET_USERRIGHTS',Object.assign({}, userrights))
  }
  
  NProgress.done()
})
