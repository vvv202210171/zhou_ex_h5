import { post, fetch } from '@/service'
import store from '@/store'
const baseURL = ''

const showLoading = () => {
  store.dispatch('common/showLoading', true)
}

export const tradeOverview = () => {
  return fetch(`${baseURL}/trad/overview`)
}
export const tradeSymbols = () => {
  return fetch(`${baseURL}/trad/symbols`)
}
export const tradeCoinInfo = (data) => {
  return fetch(`${baseURL}/trad/trad`, data)
}
export const currencyIntroduction = (data) => {
  return fetch(`${baseURL}/trad/currencyIntroduction`, data)
}
export const tradAccount = (data) => {
  return fetch(`${baseURL}/trad/tradAccount`, data)
}

export const buyLimit = (data) => {
  showLoading()
  return post(`${baseURL}/trad/buyLimit`, data)
}
export const sellLimit = (data) => {
  showLoading()
  return post(`${baseURL}/trad/sellLimit`, data)
}
export const buyMarket = (data) => {
  showLoading()
  return post(`${baseURL}/trad/buyMarket`, data)
}
export const sellMarket = (data) => {
  showLoading()
  return post(`${baseURL}/trad/sellMarket`, data)
}
export const closeEntrust = (data) => {
  showLoading()
  return post(`${baseURL}/trad/closeEntrust`, data)
}

export const entrustOrder = (data) => {
  return fetch(`${baseURL}/trad/entrustOrder`, data)
}
export const entrustHistory = (data) => {
  return fetch(`${baseURL}/trad/entrustHistory`, data)
}
export const tradEntrust = (data) => {
  return fetch(`${baseURL}/trad/tradEntrust`, data)
}
export const tradHistory = (data) => {
  return fetch(`${baseURL}/trad/tradHistory`, data)
}
export const tradOrder = (data) => {
  return fetch(`${baseURL}/trad/tradOrder`, data)
}

export const tradeKline = (data) => {
  return fetch(`${baseURL}/trad/kline`, data)
}

