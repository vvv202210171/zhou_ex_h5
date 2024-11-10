import Vue from "vue";
import store from "../store/index";
import router from "../router/index";

const wsCoinfig = {
  ws: null, // 建立的连接
  lockReconnect: false, // 是否真正建立连接
  timeout: 30 * 1000, // 30秒一次心跳
  timeoutObj: null, // 心跳心跳倒计时
  serverTimeoutObj: null, // 心跳倒计时
  timeoutnum: null, // 断开 重连倒计时
  isReconnect: false, // 是否重连进入的 init true 需要带参数请求Kline

  userNo: `${Date.now()}${Math.floor(Math.random() * 100)}`,
};

// 初始化方法
initWebsocket();

function initWebsocket() {
  // let socketURL = `${location.protocol === "https:" ? "wss" : "ws"}://${
  //   location.host
  // }/ws/`;
  let socketURL = `${process.env.VUE_APP_BASE_WS}/ws/`;
  wsCoinfig.ws = new WebSocket(`${socketURL}${wsCoinfig.userNo}`);
  wsCoinfig.ws.onopen = onopen;
  wsCoinfig.ws.onmessage = onmessage;
  wsCoinfig.ws.onclose = onclose;
  wsCoinfig.ws.onerror = onerror;
  Vue.prototype.$ws = wsCoinfig.ws;
}
Vue.prototype.initWebsocket = initWebsocket;

function reconnect() {
  // 重新连接
  if (wsCoinfig.lockReconnect) {
    return;
  }
  wsCoinfig.lockReconnect = true;
  // 没连接上会一直重连，设置延迟避免请求过多
  wsCoinfig.timeoutnum && clearTimeout(wsCoinfig.timeoutnum);
  wsCoinfig.timeoutnum = setTimeout(function() {
    // 新连接
    wsCoinfig.lockReconnect = false;
    wsCoinfig.isReconnect = true;
    initWebsocket();
  }, 15000);
}

function reset() {
  // 重置心跳
  clearTimeout(wsCoinfig.timeoutObj);
  clearTimeout(wsCoinfig.serverTimeoutObj);
  // 重启心跳
  start();
}

function start() {
  // 开启心跳
  // console.log('开启心跳');
  wsCoinfig.timeoutObj && clearTimeout(wsCoinfig.timeoutObj);
  wsCoinfig.serverTimeoutObj && clearTimeout(wsCoinfig.serverTimeoutObj);
  wsCoinfig.timeoutObj = setTimeout(() => {
    // 这里发送一个心跳，后端收到后，返回一个心跳消息，
    if (wsCoinfig.ws.readyState == 1) {
      // 如果连接正常
      wsCoinfig.ws.send("ping");
    } else {
      // 否则重连
      reconnect();
    }

    // 心跳时间内没有重新开启心跳就关闭 socket
    wsCoinfig.serverTimeoutObj = setTimeout(() => {
      // 超时关闭
      console.log("超时关闭");
      wsCoinfig.ws.close();
    }, wsCoinfig.timeout);
  }, wsCoinfig.timeout);
}

function onopen() {
  console.log("open");

  if (
    wsCoinfig.isReconnect &&
    ["coinExchange", "futures", "marketDetails", "cycle"].includes(
      router.currentRoute.name
    )
  ) {
    // 重连带参数
    const webSocketKey = sessionStorage.getItem("webSocketKey");
    webSocketKey && wsCoinfig.ws.send(webSocketKey);

    wsCoinfig.isReconnect = false;
  }

  // 开启心跳
  start();
}

function onmessage(e) {
  if (e.data) {
    // 收到服务端的心跳回应 重置心跳
    if (e.data == "pong") {
      reset();
      return;
    }
    const resData = JSON.parse(e.data);
    resData.time = Date.now();
    resData.symbols && store.dispatch("trade/setMarketData", resData);

    resData.info && store.dispatch("trade/setExchangeCoinData", resData);
    resData.top && store.dispatch("trade/setCoinTopData", resData.top);

    resData.coninfo && store.dispatch("trade/setContractCoinData", resData);
    resData.contop && store.dispatch("trade/setConTopData", resData.contop);

    resData.cycleinfo && store.dispatch("trade/setCycleCoinData", resData);
    resData.cycletop &&
      store.dispatch("trade/setCycleTopData", resData.cycletop);
  }
}

function onclose(e) {
  console.log(e);
  console.log("连接关闭");
  // 重连
  reconnect();
}

function onerror(e) {
  console.log("出现错误");
  // 重连
  reconnect();
}
