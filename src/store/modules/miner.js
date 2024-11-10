import { minerInfo } from '@api/miner'

const state = {
  minerCount: {}
}

const mutations = {
  MINER_COUNT(state, val) {
    state.minerCount = val
  }
}

const actions = {
  getMinerInfo({ commit }) {
    minerInfo().then(res => {
      commit('MINER_COUNT', res.data)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
