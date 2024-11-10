import { post, fetch } from '@/service'
import store from '@/store'
const baseURL = ''

const showLoading = () => {
  store.dispatch('common/showLoading', true)
}

export const futuresOverview = () => {
  return fetch(`${baseURL}/contract/overview`)
}
export const futuresSymbols = () => {
  return fetch(`${baseURL}/contract/symbols`)
}

export const contractCoinInfo = (data) => {
  return fetch(`${baseURL}/contract/contract`, data)
}
export const contractLever = (data) => {
  return fetch(`${baseURL}/contract/lever`, data)
}
export const contractAccount = (data) => {
  return fetch(`${baseURL}/contract/contractAccount`, data)
}

export const buyLimit = (data) => {
  showLoading()
  return post(`${baseURL}/contract/buyLimit`, data)
}
export const sellLimit = (data) => {
  showLoading()
  return post(`${baseURL}/contract/sellLimit`, data)
}
export const buyMarket = (data) => {
  showLoading()
  return post(`${baseURL}/contract/buyMarket`, data)
}
export const sellMarket = (data) => {
  showLoading()
  return post(`${baseURL}/contract/sellMarket`, data)
}

export const closeEntrust = (data) => {
  showLoading()
  return post(`${baseURL}/contract/closeEntrust`, data)
}

export const positionOrderByCoin = (data) => {
  return fetch(`${baseURL}/contract/positionByCoin`, data)
}

export const closePosition = (data) => {
  showLoading()
  return post(`${baseURL}/contract/closePosition`, data)
}
export const closeCoinPosition = (data) => {
  showLoading()
  return post(`${baseURL}/contract/closeCoinPosition`, data)
}
export const closeAllPosition = (data) => {
  showLoading()
  return post(`${baseURL}/contract/closeAllPosition`, data)
}

export const allPosition = (data) => {
  return fetch(`${baseURL}/contract/position`, data)
}
export const historyPosition = (data) => {
  return fetch(`${baseURL}/contract/tradOrder`, data)
}
export const tradEntrust = (data) => {
  return fetch(`${baseURL}/contract/tradEntrust`, data)
}
export const tradHistory = (data) => {
  return fetch(`${baseURL}/contract/tradHistory`, data)
}
export const profitLossOrder = (data) => {
  return fetch(`${baseURL}/contract/profitLossOrder`, data)
}
export const closeProfitLoss = (data) => {
  showLoading()
  return post(`${baseURL}/contract/closeProfitLoss`, data)
}
export const editProfitLoss = (data) => {
  showLoading()
  return post(`${baseURL}/contract/editProfitLoss`, data)
}
export const profitLoss = (data) => {
  showLoading()
  return post(`${baseURL}/contract/profitLoss`, data)
}

export const contractKline = (data) => {
  return fetch(`${baseURL}/contract/kline`, data)
}

export const groupIncome = () => {
  return fetch(`${baseURL}/contract/groupIncome`)
}
export const contractIncome = (data) => {
  return fetch(`${baseURL}/contract/contractIncome`, data)
}
