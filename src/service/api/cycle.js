import { post, fetch } from '@/service'
import store from '@/store'
const baseURL = ''

const showLoading = () => {
  store.dispatch('common/showLoading', true)
}

export const cycleKline = (data) => {
  return fetch(`${baseURL}/cycle/kline`, data)
}

export const cycleSymbols = () => {
  return fetch(`${baseURL}/cycle/symbols`)
}
export const cycleInfo = (data) => {
  return fetch(`${baseURL}/cycle/info`, data)
}
export const cycleBuyMarket = (data) => {
  showLoading()
  return post(`${baseURL}/cycle/buyMarket`, data)
}
export const cycleSellMarket = (data) => {
  showLoading()
  return post(`${baseURL}/cycle/sellMarket`, data)
}

export const positionByCoin = (data) => {
  return fetch(`${baseURL}/cycle/positionByCoin`, data)
}
export const historyPosition = (data) => {
  return fetch(`${baseURL}/cycle/tradHistory`, data)
}
export const historyPositionByCoin = (data) => {
  return fetch(`${baseURL}/cycle/tradHistoryByCoin`, data)
}
