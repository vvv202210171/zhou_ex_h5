// import {} from '@api/wallet'

const state = {
  marketSocketData: {},
  coinSocketData: {},
  coinTopData: [],
  contractSocketData: {},
  contractTopData: [],

  cycleSocketData: {},
  cycleTopData: []
}

const mutations = {
  MARKET_DATA(state, val) {
    state.marketSocketData = val
  },
  EXCHANGE_COIN_DATA(state, val) {
    state.coinSocketData = val
  },
  COIN_TOP_DATA(state, val) {
    state.coinTopData = val
  },
  CONTRACT_COIN_DATA(state, val) {
    state.contractSocketData = val
  },
  CONTRACT_TOP_DATA(state, val) {
    state.contractTopData = val
  },

  CYCLE_COIN_DATA(state, val) {
    state.cycleSocketData = val
  },
  CYCLE_TOP_DATA(state, val) {
    state.cycleTopData = val
  }
}

const actions = {
  setMarketData({ commit }, data) {
    commit('MARKET_DATA', data)
  },
  setExchangeCoinData({ commit }, data) {
    commit('EXCHANGE_COIN_DATA', data)
  },
  setCoinTopData({ commit }, data) {
    commit('COIN_TOP_DATA', data)
  },
  setContractCoinData({ commit }, data) {
    commit('CONTRACT_COIN_DATA', data)
  },
  setConTopData({ commit }, data) {
    commit('CONTRACT_TOP_DATA', data)
  },

  setCycleCoinData({ commit }, data) {
    commit('CYCLE_COIN_DATA', data)
  },
  setCycleTopData({ commit }, data) {
    commit('CYCLE_TOP_DATA', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
