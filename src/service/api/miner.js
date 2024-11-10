import { post, fetch } from '@/service'
import store from '@/store'
const baseURL = ''

const showLoading = () => {
  store.dispatch('common/showLoading', true)
}

export const minerInfo = () => {
  return fetch(`${baseURL}/miner/minerInfo`)
}
export const minManage = () => {
  return fetch(`${baseURL}/miner/minManage`)
}
export const addMinOrder = (data) => {
  showLoading()
  return post(`${baseURL}/miner/addMinOrder`, data)
}

export const minOrder = (data) => {
  return fetch(`${baseURL}/miner/minOrder`, data)
}
export const redeemOrder = (data) => {
  showLoading()
  return post(`${baseURL}/miner/redeemOrder`, data)
}
