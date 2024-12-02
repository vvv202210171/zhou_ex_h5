import { post, fetch } from "@/service";
import store from "@/store";
const baseURL = "";

const showLoading = () => {
  store.dispatch("common/showLoading", true);
};

export const nodeInfo = () => {
  return fetch(`${baseURL}/node/nodeInfo`);
};
export const nodes = () => {
  return fetch(`${baseURL}/node/nodes`);
};
export const addNodeOrder = (data) => {
  showLoading();
  return post(`${baseURL}/node/add_node_order`, data);
};

export const nodeOrder = (data) => {
  return fetch(`${baseURL}/node/orders`, data);
};
export const bbaiWithdraw = (data) => {
  showLoading();
  return post(`${baseURL}/node/withdraw`, data);
};
export const withdrawLog = () => {
  return fetch(`${baseURL}/node/withdraw_record`);
};
