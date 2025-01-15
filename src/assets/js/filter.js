import i18n from "@/i18n";
import store from "../../store/modules/common";

export default {
  /**
   * 时间戳转字符串时间格式
   * @param {string} time 时间戳
   * @param {string} fmt 类似 yyyy-MM-dd hh:mm:ss
   */
  formatDate(time, fmt) {
    if (!time) {
      return;
    }
    // let localTime = time + (new Date().getTimezoneOffset()*60000) + 180*60000
    const date = new Date(
      time + (480 + new Date().getTimezoneOffset()) * 60000
    );
    function padLeftZero(str) {
      return ("00" + str).substr(str.length);
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    const o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
    };
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const str = o[k] + "";
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? str : padLeftZero(str)
        );
      }
    }
    return fmt;
  },

  ts_local(str, fmt) {
    if (!str) return str;

    const TIME_ZONE = parseInt(store.state.getConfig.TIME_ZONE) || -5; // 默认使用 UTC-5
    const localTimeZoneOffset = -new Date().getTimezoneOffset() / 60; // 当前本地时区偏移量（单位：小时）
    console.log("localTimeZoneOffset", localTimeZoneOffset, TIME_ZONE);

    // 创建目标时区时间
    const targetDate = new Date(str);
    const targetTimestamp = targetDate.getTime(); // 转为时间戳（毫秒）

    // 计算本地时间戳
    const adjustedTimestamp =
      targetTimestamp + (TIME_ZONE - localTimeZoneOffset) * 60 * 60 * 1000;
    const adjustedDate = new Date(adjustedTimestamp);

    // 格式化时间
    const formatTime = (date, format) => {
      const pad = (n) => (n < 10 ? "0" + n : n);
      return format
        .replace("yyyy", date.getFullYear())
        .replace("MM", pad(date.getMonth() + 1))
        .replace("dd", pad(date.getDate()))
        .replace("HH", pad(date.getHours()))
        .replace("hh", pad(date.getHours()))
        .replace("mm", pad(date.getMinutes()))
        .replace("ss", pad(date.getSeconds()));
    };

    return formatTime(adjustedDate, fmt || "yyyy-MM-dd HH:mm:ss"); // 默认格式化
  },
  /**
   * 数字处理
   * @param {*} number 需要处理的数字
   * @param {number} digit 需要保留的小数位数
   */
  mathFloor(number, digit) {
    if (isNaN(Number(number)) || isNaN(Number(digit))) {
      return 0;
    }
    return (
      Math.floor(number * Math.pow(10, digit) + 1 / Math.pow(10, 9 - digit)) /
      Math.pow(10, Number(digit))
    ).toFixed(Number(digit));
  },

  mathFloor1(number, digit) {
    if (isNaN(Number(number)) || isNaN(Number(digit))) {
      return 0;
    }
    const calcNum = (
      Math.floor(number * Math.pow(10, digit) + 1 / Math.pow(10, 9 - digit)) /
      Math.pow(10, Number(digit))
    ).toFixed(Number(digit));

    return parseFloat(calcNum);
  },

  /**
   * 手机号隐藏中间4位
   * @param {string} phone 手机号
   */
  hidePhone(phone) {
    if (phone) {
      return phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
    }
  },

  // 资产记录状态
  assetsState(val) {
    switch (val) {
      case "sending":
        return i18n.t("tradeLang.lang55");
      case "completed":
        return i18n.t("tradeLang.lang56");
      case "dismissed":
        return i18n.t("tradeLang.lang57");
      case "revoke":
        return i18n.t("tradeLang.lang111");
      default:
        return "";
    }
  },

  entrustState(val) {
    switch (val) {
      case "unfilled":
        return i18n.t("tradeLang.lang118");
      case "section":
        return i18n.t("tradeLang.lang119");
      case "all":
        return i18n.t("tradeLang.lang120");
      case "cancel":
        return i18n.t("tradeLang.lang121");
      case "uncancel":
        return i18n.t("tradeLang.lang122");
      default:
        return "";
    }
  },
};
