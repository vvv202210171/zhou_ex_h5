import { nodeInfo } from "@api/node";

const state = {
  nodeInfo: {},
};

const mutations = {
  nodeInfo(state, val) {
    state.nodeInfo = val ? val : {};
  },
};

const actions = {
  getNodeInfo({ commit }) {
    nodeInfo().then((res) => {
      commit("nodeInfo", res.data);
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
