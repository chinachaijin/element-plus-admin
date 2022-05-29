import { getToken, setToken, removeToken } from '@/utils/auth'
import { getInfo } from '@/api/login'

const state = {
  token: getToken(),
  name: '随机',
  avatar: '/img.gif',
  roles: [],
  userrights:{}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERRIGHTS: (state, userrights) => {
    state.userrights = userrights
  },
}

const actions = {
  
  // 删除令牌
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // 保存令牌
  saveToken({ commit }, token) {
    return new Promise(resolve => {
      commit('SET_TOKEN', token)
      resolve()
    })
  },

  // 动态修改权限
  resetRoles({ commit }, role) {
    return new Promise(resolve => {
      commit('SET_ROLES', role)
      resolve()
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录。')
        }

        let { roles, name, avatar } = data
        
        // 角色必须是非空数组
        if (!roles || JSON.stringify(roles) == '{}') {
          roles = {"fdsfsdfsfds":[]}
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', (avatar !== undefined && avatar !== null && avatar !== '' ? avatar : '/img.gif'))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户登出
  logout({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      // 清空路由
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
