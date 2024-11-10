import { selectRate, myAccountCount, selectExchangeAssets, selectFuturesAssets, selectFaitAssets, rechargeCoins, ieoList } from '@api/wallet'

const state = {
  assetsCount: {},

  exchangeCoinList: [],
  exchangeAmount: {},

  futuresCoinList: [],
  futuresAmount: {},

  faitCoinList: [],
  faitAmount: {},

  rechargeCoinArr: [],

  ieoList: [],

  rateData: {}
}

const mutations = {
  ASSETS_COUNT(state, val) {
    state.assetsCount = val
    state.assetsCount.usdt = Math.max(state.assetsCount.usdt, 0)
  },

  EXCHANGE_ASSETS(state, val) {
    state.exchangeCoinList = val.assets || []
    state.exchangeAmount = val.assets_amount || {}
    state.exchangeAmount.usdt = Math.max(state.exchangeAmount.usdt, 0)
  },

  FUTURES_ASSETS(state, val) {
    val.contract_assets.forEach(data => {
      data.name = data.coin
    })
    state.futuresCoinList = val.contract_assets
    state.futuresAmount = val.contract_assets_amount || {}
    state.futuresAmount.usdt = Math.max(state.futuresAmount.usdt, 0)
  },

  FAIT_ASSETS(state, val) {
    val.c2c_assets.forEach(data => {
      data.name = data.coin
    })
    state.faitCoinList = val.c2c_assets
    state.faitAmount = val.c2c_assets_amount || {}
  },

  RECHARGE_COIN_ARR(state, val) {
    state.rechargeCoinArr = val
  },

  IEO_LIST(state, val) {
    state.ieoList = val
  },

  RATE_DATA(state, val) {
    state.rateData = val
  }
}

const actions = {
  getAssetsCount({ commit }) {
    myAccountCount().then(res => {
      commit('ASSETS_COUNT', res.data)
    })
  },
  getExchangeAssets({ commit }) {
    selectExchangeAssets().then(res => {
      commit('EXCHANGE_ASSETS', res.data)
    })
  },
  getFuturesAssets({ commit }) {
    selectFuturesAssets().then(res => {
      commit('FUTURES_ASSETS', res.data)
    })
  },
  getFaitAssets({ commit }) {
    selectFaitAssets().then(res => {
      commit('FAIT_ASSETS', res.data)
    })
  },

  getRechargeCoins({ commit }) {
    if (!state.rechargeCoinArr.length) { // 判断空数组
      rechargeCoins().then(res => {
        commit('RECHARGE_COIN_ARR', res.data)
      })
    }
  },
  getIeoList({ commit }) {
    ieoList().then(res => {
      commit('IEO_LIST', res.data)
    })
  },

  getRate({ commit }, unit) {
    selectRate({ coin: unit }).then(res => {
      commit('RATE_DATA', res.data)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
