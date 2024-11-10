import { selectUserInfo, getInvitationUrl } from '@api/user'

const state = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {},
  invitedData: {} // 邀请好友数据
}

const mutations = {
  USER_INFO(state, val) {
    state.userInfo = val
  },
  INVITED_DATA(state, val) {
    state.invitedData = val
  }
}

const actions = {

  // 获取 用户信息  缓存中有数据就直接取  不再调用
  getUserInfo({ commit }) {
    if (this.state.common.isLogin) {
      selectUserInfo().then(res => {
        localStorage.setItem('userInfo', JSON.stringify(res.data))
        commit('USER_INFO', res.data)
      })
    } else {
      commit('USER_INFO', {})
    }
  },

  getInvitedData({ commit }) {
    getInvitationUrl().then(res => {
      commit('INVITED_DATA', res.data)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
