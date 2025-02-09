// H5 plus事件处理
import Vue from "vue";
import { getVersion } from "@api/common";
import store from "@/store";
import router from "@/router";
import i18n from "@/i18n";
const nowCode = window.appVersion; // 当前版本号
Vue.prototype.appVersion = nowCode;
if (window.plus) {
  // 获取系统状态栏高度
  const statusbarHeight = plus.navigator.getStatusbarHeight() || 0;
  Vue.prototype.$barHeight = parseInt(statusbarHeight);

  initPlus();
} else {
  Vue.prototype.$barHeight = 0;
}

function initPlus() {
  let newCode = null; // 最新版本号
  const dtask = null; // 下载任务

  // plus环境准备就绪
  mui.plusReady(() => {
    // 处理页面返回
    handleBack();

    // 处理监听
    handleListener();

    // 检查更新
    checkUpdate();
  });

  // 检查更新
  const checkUpdate = () => {
    getVersion({
      type: mui.os.android ? "android" : "ios",
    }).then((res) => {
      res.data.nowCode = nowCode;
      newCode = res.data.code;
      store.dispatch("common/setVersionData", res.data);
    });
  };

  // 处理document 监听事件
  const handleListener = () => {
    let timeObj = null;
    // 监听网络状态
    document.addEventListener(
      "netchange",
      () => {
        var nt = plus.networkinfo.getCurrentType();
        // 获取历史状态
        var lastNt = sessionStorage.getItem("lastNt") || nt;
        timeObj && window.clearTimeout(timeObj);
        // 加延时是为了避免无线wifi切数据时会插入一个无网络状态所造成的判断错误
        timeObj = setTimeout(() => {
          // 更新历史状态
          sessionStorage.setItem("lastNt", nt);
          // 网络状态为 0 或 1 时无网络服务
          if (nt == 1 || nt == 0) {
            mui.toast(i18n.t("plusLang.lang8"), "");
          } else if (lastNt == 1 || lastNt == 0) {
            // 历史状态为 0 或 1 时 表示网络状态由无到有
            console.log("重新连接网络");
            window.location.reload();
          }
        }, 3000);
      },
      false
    );

    // 监听app进入前台
    document.addEventListener(
      "resume",
      () => {
        // 如果没有下载安装包任务 版本号也不一致 就再次请求接口确认
        if (!dtask && nowCode != newCode) {
          checkUpdate();
        }
      },
      false
    );
  };

  // 处理页面返回
  const handleBack = () => {
    let quitTime = null;
    mui.back = function() {
      // 首次按键，提示‘再按一次退出应用’
      const route = router.currentRoute;
      const pageName = [
        "home",
        "market",
        "trade",
        "balances",
        "cycle",
        "login",
      ];
      if (!quitTime) {
        if (!pageName.includes(route.name)) {
          // 不是主界面才开启物理键回退到上一页面
          window.history.go(-1);
        } else if (route.fullPath.includes("Popup")) {
          // 是主界面 但是带有popup还是需要后退
          window.history.go(-1);
        } else {
          // 记录第一次按下回退键的时间
          quitTime = Date.now();
          mui.toast(i18n.t("plusLang.lang9"), "");
          setTimeout(function() {
            // 1s中后清除
            quitTime = null;
          }, 1000);
        }
      } else {
        if (Date.now() - quitTime < 1000) {
          quitTime = null;
          if (pageName.includes(route.name)) {
            // 只有在主界面才开启2次回退关闭app
            plus.runtime.quit();
          }
        }
      }
    };
  };
}
