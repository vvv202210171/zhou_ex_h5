import { post, fetch } from "@/service";
import store from "@/store";
const baseURL = "";
import CryptoJS from "crypto-js";

const SECRET_KEY = "uqgg6254wls5wvhde48ddl8g3qqaqr35";
const showLoading = () => {
  store.dispatch("common/showLoading", true);
};

export const sendCode = (data) => {
  showLoading();
  const timestamp = Date.now();
  const signature = CryptoJS.HmacSHA256(
    `${timestamp}${data.account}${SECRET_KEY}`,
    SECRET_KEY
  ).toString();
  data = { signature, timestamp, ...data };
  return fetch(`${baseURL}/user/getCode_v2`, data);
};
export const codeVerification = (data) => {
  return post(`${baseURL}/member/codeVerification`, data);
};

export const userRegisterTel = (data) => {
  showLoading();
  return post(`${baseURL}/member/registerByTel`, data);
};
export const userRegisterEmail = (data) => {
  showLoading();
  return post(`${baseURL}/member/registerByEmail`, data);
};
export const forgetByTel = (data) => {
  showLoading();
  return post(`${baseURL}/member/forgetByTel`, data);
};
export const forgetByEmail = (data) => {
  showLoading();
  return post(`${baseURL}/member/forgetByEmail`, data);
};

export const loginByCode = (data) => {
  showLoading();
  return post(`${baseURL}/member/loginByCode`, data);
};
export const login = (data) => {
  showLoading();
  return post(`${baseURL}/member/loginByTelOrEmail`, data);
};
export const logout = () => {
  showLoading();
  return post(`${baseURL}/user/logout`);
};

export const selectUserInfo = (data) => {
  return fetch(`${baseURL}/user/userInfo`, data);
};
export const getInvitationUrl = () => {
  return fetch(`${baseURL}/user/getInvitationUrl`);
};
export const getTeamList = (data) => {
  return fetch(`${baseURL}/user/getMyRecom`, data);
};
export const getMyTeam = (data) => {
  return fetch(`${baseURL}/user/getMyTeam`, data);
};

export const updateHeadImg = (data) => {
  showLoading();
  return post(`${baseURL}/user/updateHeadImg`, data);
};
export const updateNickname = (data) => {
  showLoading();
  return post(`${baseURL}/user/updateNickname`, data);
};
export const updateContactNumber = (data) => {
  showLoading();
  return post(`${baseURL}/user/updateContactNumber`, data);
};

export const setNewTelOrEmail = (data) => {
  showLoading();
  return post(`${baseURL}/user/setNewTelOrEmail`, data);
};

export const updateArea = (data) => {
  // showLoading();
  return post(`${baseURL}/user/updateArea`, data);
};

export const editPassword = (data) => {
  showLoading();
  return post(`${baseURL}/user/editPassword`, data);
};

export const addTradPassword = (data) => {
  showLoading();
  return post(`${baseURL}/user/addTradPassword`, data);
};
export const editPasswordByCode = (data) => {
  showLoading();
  return post(`${baseURL}/user/updatePassword`, data);
};

export const editRealName = (data) => {
  showLoading();
  return post(`${baseURL}/user/editRealName`, data);
};
export const addBankcard = (data) => {
  showLoading();
  return post(`${baseURL}/user/addBankcard`, data);
};
export const updateBankcard = (data) => {
  showLoading();
  return post(`${baseURL}/user/updateBankcard`, data);
};

export const onlineList = () => {
  return fetch(`${baseURL}/user/onlineList`);
};
export const addOnline = (data) => {
  showLoading();
  return post(`${baseURL}/user/addOnline`, data);
};

export const rechargeChannel = () => {
  showLoading();
  return fetch(`${baseURL}/user/rg_channel`);
};

export const getEarning = () => {
  showLoading();
  return fetch(`${baseURL}/user/earnings`);
};
