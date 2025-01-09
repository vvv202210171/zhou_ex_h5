import { post, fetch } from "@/service";
import store from "@/store";
const baseURL = "";
export const loadUdunSupportCoinList = () => {
  return fetch(`${baseURL}/udun/support_addr_list`);
};
export const getUdunCoinAddress = (data) => {
  return fetch(`${baseURL}/udun/member_coin_addr`, data);
};
const showLoading = () => {
  store.dispatch("common/showLoading", true);
};
export const loadSupportCoins = () => {
  return fetch(`${baseURL}/account/trans_coins`);
};
export const trans = (data) => {
  showLoading();
  return post(`${baseURL}/account/trans`, data);
};
export const transRecord = () => {
  return fetch(`${baseURL}/account/trans_record`);
};

export const selectRate = (data) => {
  return fetch(`${baseURL}/account/getExchangeRateByCoin`, data);
};

export const myAccountCount = () => {
  return fetch(`${baseURL}/account/myAccountCount`);
};
export const selectExchangeAssets = () => {
  return fetch(`${baseURL}/account/myAccount`);
};
export const selectFuturesAssets = () => {
  return fetch(`${baseURL}/account/contractAssets`);
};
export const selectFaitAssets = () => {
  return fetch(`${baseURL}/account/c2cAccount`);
};

export const rechargeCoins = () => {
  return fetch(`${baseURL}/account/coins`);
};
export const getCoinAddress = (data) => {
  return fetch(`${baseURL}/account/getRjCoinAddress`, data);
};
export const withdrawalTips = (data) => {
  return fetch(`${baseURL}/account/withdrawalTips`, data);
};

export const outCoin = (data) => {
  showLoading();
  //return post(`${baseURL}/account/outCoin`, data)
  return post(`${baseURL}/bank/outCoin`, data);
};
export const coinBalance = (data) => {
  return fetch(`${baseURL}/account/balance`, data);
};
export const tradBalance = (data) => {
  return fetch(`${baseURL}/account/tradBalance`, data);
};
export const contractBalance = (data) => {
  return fetch(`${baseURL}/account/contractBalance`, data);
};
export const c2cBalance = (data) => {
  return fetch(`${baseURL}/account/c2cBalance`, data);
};
export const contractTransfer = (data) => {
  showLoading();
  return post(`${baseURL}/account/contractTransfer`, data);
};
export const c2cTransfer = (data) => {
  showLoading();
  return post(`${baseURL}/account/c2cTransfer`, data);
};

export const financeByTypeCoin = (data) => {
  return fetch(`${baseURL}/account/financeByTypeCoin`, data);
};

export const toAddressList = () => {
  return fetch(`${baseURL}/account/toAddressList`);
};
export const addToAddress = (data) => {
  showLoading();
  return post(`${baseURL}/account/addToAddress`, data);
};
export const removeToAddress = (data) => {
  showLoading();
  return post(`${baseURL}/account/removeToAddress`, data);
};

export const flashCoin = () => {
  return fetch(`${baseURL}/flash/flashCoin`);
};
export const flashOrder = (data) => {
  return fetch(`${baseURL}/flash/flashOrder`, data);
};
export const addFlash = (data) => {
  showLoading();
  return post(`${baseURL}/flash/addFlash`, data);
};

export const ieoList = () => {
  return fetch(`${baseURL}/ieo/getIeoList`);
};
export const findPayCoinByCoin = (data) => {
  return fetch(`${baseURL}/ieo/findPayCoinByCoin`, data);
};
export const findGasById = (data) => {
  return fetch(`${baseURL}/ieo/findGasById`, data);
};
export const getIeoOrder = (data) => {
  return fetch(`${baseURL}/ieo/getIeoOrder`, data);
};
export const addIeoOrder = (data) => {
  showLoading();
  return post(`${baseURL}/ieo/addIeoOrder`, data);
};

export const fiatCoin = () => {
  return fetch(`${baseURL}/fiat/fiatCoin`);
};
export const payCoinList = () => {
  return fetch(`${baseURL}/fiat/payCoinList`);
};
export const addFiatPayOrder = (data) => {
  showLoading();
  return post(`${baseURL}/fiat/addFiatPayOrder`, data);
};
export const fiatOrderList = (data) => {
  return fetch(`${baseURL}/fiat/fiatOrderList`, data);
};
export const rgaddFiatPayOrder = (data) => {
  showLoading();
  return post(`${baseURL}/fiat/rgaddFiatPayOrder`, data);
};
export const orderUndo = (data) => {
  showLoading();
  return post(`${baseURL}/account/out_revoke`, data);
};

export const saveBankCard = (data) => {
  showLoading();
  return post(`${baseURL}/bank/save`, data);
};

export const getAccountBankCard = () => {
  showLoading();
  return fetch(`${baseURL}/bank/get`);
};
