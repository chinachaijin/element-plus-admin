import { asyncRoutes, constantRoutes } from '@/router'
import router from '@/router'

/**
 * 使用meta.role确定当前用户是否具有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    let isrole = false 
    let metaroles = {}
    let rolekeys = Object.keys(route.meta.roles)
    rolekeys.forEach(key => {
      if (roles[key] !== undefined) {
        metaroles[key] = Object.assign([], roles[key])
        isrole = true
      }
    })

    route.meta.roles = metaroles
    return isrole
  } else {
    return true
  }
}

/**
 * 按递归筛选异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children, roles)
      if(tmp.children.length > 0) {
        res.push(tmp)
      }
    } else {
      if (hasPermission(roles, tmp)) {
        res.push(tmp)
      }
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // 动态添加可访问路由
      accessedRoutes.forEach(async (item) => {
        item.symbol =  await router.addRoute(item)
      })
      commit('SET_ROUTES', accessedRoutes)
      console.log(accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  deleteroutes({ state }) {
    return new Promise(resolve => {
      state.addRoutes.forEach((item) => {
        item.symbol()
      })
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
