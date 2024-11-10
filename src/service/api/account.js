import { post, fetch } from '@/service'
import store from '@/store'
const baseURL = ''

const showLoading = () => {
  store.dispatch('common/showLoading', true)
}

export const myBalance = () => {
  return fetch(`${baseURL}/account/myBalance`)
}
export const profitList = (data) => {
  return fetch(`${baseURL}/account/profitList`, data)
}
export const booktransfer = (data) => {
  showLoading()
  return post(`${baseURL}/account/booktransfer`, data)
}

export const selectExchangeCoin = () => {
  return fetch(`${baseURL}/account/flash_coins`)
}
export const exchangeCoin = (data) => {
  showLoading()
  return post(`${baseURL}/account/add_flash`, data)
}

