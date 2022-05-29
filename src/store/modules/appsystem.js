import Cookies from 'js-cookie'
const state = {
  setting:{
    iscollapse:Cookies.get('collapseStatus') ? !!+Cookies.get('collapseStatus') : false,
    ismobile: Cookies.get('ismobileStatus') ? !!+Cookies.get('ismobileStatus') : false,
  }
}

const mutations = {
  SET_ISCOLLAPSE: (state, iscollapse) => {
    state.setting.iscollapse = iscollapse
    Cookies.set('collapseStatus', iscollapse ? 1 : 0)
  },
  SET_ISMOBILE: (state, ismobile) => {
    state.setting.ismobile = ismobile
    Cookies.set('ismobileStatus', 0)
  },
}

const actions = {
  
  // 折叠设置
  setiscollapse({ commit }, iscollapse) {
    return new Promise(resolve => {
      commit('SET_ISCOLLAPSE', iscollapse)
      resolve()
    })
  },

  // 手机显示
  setismobile({ commit }, ismobile) {
    commit('SET_ISMOBILE', ismobile)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
