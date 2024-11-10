import { post, fetch } from "@/service";
import store from "@/store";
const baseURL = "";

const showLoading = () => {
  store.dispatch("common/showLoading", true);
};

export const getVersion = (data) => {
  return fetch(`${baseURL}/home/version`, data);
};
export const downloadUrl = () => {
  return fetch(`${baseURL}/home/versions`);
};

export const uploadImage = (data, config) => {
  showLoading();
  return post(`${baseURL}/res/upload`, data, config);
};

export const getOssKey = () => {
  return fetch(`${baseURL}/home/getOssKey`);
};
export const systemTime = () => {
  return fetch(`${baseURL}/home/systemTime`);
};

export const selectBanner = (data) => {
  return fetch(`${baseURL}/home/banner`, data);
};

export const selectNotices = (data) => {
  return fetch(`${baseURL}/home/articles`, data);
};

export const selectAreaCode = () => {
  return fetch(`${baseURL}/home/areaCode`);
};

export const selectAboutUs = () => {
  return fetch(`${baseURL}/home/aboutUs`);
};

export const selectConfig = () => {
  return fetch(`${baseURL}/common/get_config`);
};

export const getOpenApi = () => {
  return fetch(`${baseURL}/openapi/v1/get-api`);
};
export const crtOpenApi = () => {
  return fetch(`${baseURL}/openapi/v1/crt-api`);
};
