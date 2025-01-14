import {
  selectBanner,
  selectNotices,
  selectAreaCode,
  selectAboutUs,
  selectConfig,
} from "@api/common";

const state = {
  isLogin: !!localStorage.getItem("isLogin"), // 登录状态
  showFooter: false, // 是否显示底部导航
  selectedFooter: 1, // 底部导航位置
  showLoading: false, // 遮罩loading
  versionData: {},
  isAppUpdate: false,

  city: null, // 城市
  headerHeight: 0, // 顶部栏高度

  areaCode: [],
  bannerList: [],
  noticeList: [],
  helpList: [],
  usInfo: {},

  onlineUrl: "",

  countryList: [],

  offsetTime: 0,
  serviceLoaded: false,
  serviceUrl: "",
  baseImgUrl: process.env.VUE_APP_BASE_IMG,
  getConfig: {},
};

const mutations = {
  LOGIN_STATUS(state, val) {
    state.isLogin = val;
  },

  SHOW_FOOTER(state, val) {
    state.showFooter = val;
  },
  SELECTED_FOOTER(state, val) {
    state.selectedFooter = val;
  },

  SHOW_LOADING(state, val) {
    state.showLoading = val;
  },
  VERSION_DATA(state, val) {
    if (val.nowCode != val.code) {
      state.isAppUpdate = true;
    }
    state.versionData = val;
  },

  CITY(state, val) {
    state.city = val;
  },
  HEADER_HEIGHT(state, val) {
    state.headerHeight = val;
  },

  AREA_CODE(state, val) {
    state.areaCode = val;
  },
  COUNTRY_LIST(state, val) {
    state.countryList = val;
  },
  BANNER_LIST(state, val) {
    state.bannerList = val;
  },
  NOTICE_LIST(state, val) {
    state.noticeList = val;
  },
  HELP_LIST(state, val) {
    state.helpList = val;
  },
  US_INFO(state, val) {
    state.usInfo = val;
  },

  ONLINE_URL(state, val) {
    state.onlineUrl = val;
  },

  OFFSET_TIME(state, val) {
    state.offsetTime = val;
  },

  GET_CONFIG(state, val) {
    state.getConfig = val;
    state.serviceUrl = val.KF_ADDRESS_H5;
  },
};

const actions = {
  updateLoginStatus({ commit }, data) {
    data
      ? localStorage.setItem("isLogin", data)
      : localStorage.removeItem("isLogin");
    commit("LOGIN_STATUS", data);
  },
  showFooter({ commit }, data) {
    commit("SHOW_FOOTER", data);
  },
  updateSelectedFooter({ commit }, data) {
    commit("SELECTED_FOOTER", data);
  },
  showLoading({ commit }, data) {
    commit("SHOW_LOADING", data);
  },

  setVersionData({ commit }, data) {
    commit("VERSION_DATA", data);
  },

  setOffsetTime({ commit }, data) {
    commit("OFFSET_TIME", data);
  },

  setCity({ commit }, data) {
    // if(state.city!=data){
    // updateArea({area:data})
    commit("CITY", data);
    // }
  },
  setNavHeaderHeight({ commit }, data) {
    commit("HEADER_HEIGHT", data);
  },

  // 获取地区编码
  getAreaCode({ commit }) {
    if (!state.areaCode.length) {
      selectAreaCode().then((res) => {
        commit("AREA_CODE", res.data);
      });
    }
  },
  // 获取地区编码
  getBanner({ commit }, flag) {
    if (!state.bannerList.length || flag) {
      selectBanner({ type: "app" }).then((res) => {
        commit("BANNER_LIST", res.data);
      });
    }
  },

  getNotice({ commit }, flag) {
    if (!state.noticeList.length || flag) {
      selectNotices({ type: "notice" }).then((res) => {
        commit("NOTICE_LIST", res.data);
      });
    }
  },
  getHelpList({ commit }) {
    if (!state.helpList.length) {
      selectNotices({ type: "help" }).then((res) => {
        commit("HELP_LIST", res.data);
      });
    }
  },
  getUsInfo({ commit }) {
    if (!state.usInfo.length) {
      selectAboutUs().then((res) => {
        commit("US_INFO", res.data);
      });
    }
  },

  // 获取地区编码
  getOnlineUrl({ commit }) {
    if (!state.onlineUrl) {
      getChatLink().then((res) => {
        commit("ONLINE_URL", res.data);
      });
    }
  },

  // 获取国家地区
  getCountry({ commit }) {
    if (!state.countryList.length) {
      selectCountry().then((res) => {
        commit("COUNTRY_LIST", res.data);
      });
    }
  },

  async getConfig({ commit }) {
    if (!state.getConfig.length) {
      const res = await selectConfig();
      commit("GET_CONFIG", res.data);
      return res;
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
