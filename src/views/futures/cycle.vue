<template>
  <div class="cycle_futures">
    <div ref="cycleTop" class="cycle_top">
      <div class="coin_header flex_between">
        <label class="flex" @click="showLeftPopup()">
          <img src="@img/trade/icon_menu.png" alt="" />
          <h3>{{ coinInfo.tradcoin }}/{{ coinInfo.maincoin }}</h3>
        </label>
        <p>
          <i
            v-if="!coinInfo.isOptional"
            class="iconfont icon-star-o"
            @click="handleOptional()"
          />
          <i
            v-else
            class="iconfont icon-star main_color"
            @click="handleOptional()"
          />
          <i class="iconfont icon-record" @click="pushPath('/cycleHistory')" />
        </p>
      </div>
      <div class="coin_price flex_between">
        <div class="price_left_box">
          <h2
            :class="[
              coinInfo.rise >= 0 ? 'green_color' : 'red_color',
              'text_hide',
            ]"
          >
            {{ coinInfo.price }}
          </h2>
          <label class="flex">
            <p>
              ≈ {{ rateData.symbol
              }}{{ (coinInfo.price * rateData.price) | mathFloor(2) }}
            </p>
            <i v-if="coinInfo.rise >= 0" class="green_color"
              >+{{ coinInfo.rise }}%</i
            >
            <i v-if="coinInfo.rise < 0" class="red_color"
              >{{ coinInfo.rise }}%</i
            >
          </label>
        </div>
        <div class="price_right_box">
          <p>
            <span>{{ coinInfo.height }}</span>
            <em>{{ $t("tradeLang.lang15") }}</em>
          </p>
          <p>
            <span>{{ coinInfo.low }}</span>
            <em>{{ $t("tradeLang.lang16") }}</em>
          </p>
        </div>
      </div>
    </div>

    <div ref="cycleBox" class="cycle_box">
      <div class="kline_box">
        <kline
          v-if="coinInfo.tradcoin"
          :key="klineKey"
          coin-type="cycle"
          ref="klinechart"
          :default-pair-name="coinInfo.tradcoin + '/' + coinInfo.maincoin"
          :default-name="coinInfo.tradcoin"
          :defaultfloat-precision="coinInfo.price_accuracy"
          default-period="4"
          @periodData="changePerioad"
        />
      </div>
      <div class="btn_box">
        <van-button class="green_bg" @click="showTradePopup(1)">{{
          $t("tradeLang.lang235")
        }}</van-button>
        <van-button class="red_bg" @click="showTradePopup(2)">{{
          $t("tradeLang.lang236")
        }}</van-button>
      </div>

      <van-tabs v-model="active" border :line-height="1" :line-width="20">
        <van-tab :title="$t('tradeLang.lang237')">
          <ol
            v-for="item in positionOrder"
            :key="item.orderid"
            class="position_box"
          >
            <li class="position_top flex_between">
              <h2>{{ item.tradcoin }}/{{ item.maincoin }}</h2>
              <i>{{ Number(item.wdate) | ts_local("MM-dd hh:mm:ss") }}</i>
              <em v-if="item.type == 'buy'" class="green_color">{{
                $t("tradeLang.lang235")
              }}</em>
              <em v-if="item.type == 'sell'" class="red_color">{{
                $t("tradeLang.lang236")
              }}</em>
            </li>
            <li class="position_center flex_between">
              <div>
                <span>{{ $t("tradeLang.lang238") }}({{ item.maincoin }})</span>
                <p>{{ item.price || "--" }}</p>
                <span>{{ $t("tradeLang.lang239") }}</span>
                <p :class="[coinInfo.rise >= 0 ? 'green_color' : 'red_color']">
                  {{ coinInfo.price }}
                </p>
              </div>
              <div>
                <span>{{ $t("tradeLang.lang240") }}({{ item.paycoin }})</span>
                <p>{{ item.number || "--" }}</p>
                <span>{{ $t("tradeLang.lang241") }}</span>
                <!-- <p :class="[item.income>=0?'green_color':'red_color']">{{item.income||'--'}}</p> -->
                <p
                  v-if="
                    item.type == 'buy' &&
                    Number(coinInfo.price) > Number(item.price) &&
                    gasType == 'profit'
                  "
                  class="green_color text_hide"
                >
                  {{ (item.number * item.profitGas) | mathFloor1(4) }}
                </p>
                <p
                  v-if="
                    item.type == 'buy' &&
                    Number(coinInfo.price) <= Number(item.price) &&
                    gasType == 'profit'
                  "
                  class="red_color text_hide"
                >
                  -{{ (item.number * item.lossGas) | mathFloor1(4) }}
                </p>
                <p
                  v-if="
                    item.type == 'sell' &&
                    Number(coinInfo.price) < Number(item.price) &&
                    gasType == 'profit'
                  "
                  class="green_color text_hide"
                >
                  {{ (item.number * item.profitGas) | mathFloor1(4) }}
                </p>
                <p
                  v-if="
                    item.type == 'sell' &&
                    Number(coinInfo.price) >= Number(item.price) &&
                    gasType == 'profit'
                  "
                  class="red_color text_hide"
                >
                  -{{ (item.number * item.lossGas) | mathFloor1(4) }}
                </p>

                <!-- <p v-if="item.type=='buy'&&Number(coinInfo.price)>Number(item.price)&&gasType=='loss'" class="green_color text_hide">{{(item.number*profitGas)|mathFloor(4)}}</p>
                <p v-if="item.type=='buy'&&Number(coinInfo.price)<=Number(item.price)&&gasType=='loss'" class="red_color text_hide">-{{(item.number*lossGas)|mathFloor(4)}}</p>
                <p v-if="item.type=='sell'&&Number(coinInfo.price)<Number(item.price)&&gasType=='loss'" class="green_color text_hide">{{(item.number*profitGas)|mathFloor(4)}}</p>
                <p v-if="item.type=='sell'&&Number(coinInfo.price)>=Number(item.price)&&gasType=='loss'" class="red_color text_hide">-{{(item.number*lossGas)|mathFloor(4)}}</p> -->
              </div>
              <div>
                <span>{{ $t("tradeLang.lang242") }}</span>
                <p>{{ item.lever }}s</p>
                <span>{{ $t("tradeLang.lang243") }}</span>
                <p>{{ item.gas || "--" }}</p>
              </div>
            </li>
          </ol>
          <div v-if="!positionOrder.length" class="no_data">
            <p class="icon_no_data" />
            <span>{{ $t("commonLang.lang5") }}</span>
          </div>
        </van-tab>
        <van-tab :title="$t('tradeLang.lang244')">
          <van-list v-model="loading" :finished="finished" @load="loadMore">
            <ol
              v-for="item in historyOrder"
              :key="item.autoid"
              class="position_box"
              @click="showDetailsPopup(item)"
            >
              <li class="position_top flex_between">
                <h2>{{ item.tradcoin }}/{{ item.maincoin }}</h2>
                <i v-if="item.wdate">{{
                  item.wdate | ts_local("yyyy/MM/dd hh:mm")
                }}</i>
                <em v-if="item.type == 'buy'" class="green_color">{{
                  $t("tradeLang.lang235")
                }}</em>
                <em v-if="item.type == 'sell'" class="red_color">{{
                  $t("tradeLang.lang236")
                }}</em>
              </li>
              <li class="position_center flex_between">
                <div>
                  <span
                    >{{ $t("tradeLang.lang238") }}({{ item.maincoin }})</span
                  >
                  <p>{{ item.price || "--" }}</p>
                  <span>{{ $t("tradeLang.lang245") }}</span>
                  <p>
                    {{ item.last_profit || "--" }}
                  </p>
                </div>
                <div>
                  <span>{{ $t("tradeLang.lang240") }}({{ item.paycoin }})</span>
                  <p>{{ item.number || "--" }}</p>
                  <span>{{ $t("tradeLang.lang241") }}</span>
                  <!-- <p v-if="item.state=='settlement'">{{$t('tradeLang.lang230')}}</p> -->
                  <p :class="[item.income >= 0 ? 'green_color' : 'red_color']">
                    {{ item.income || "--" }}
                  </p>
                </div>
                <div>
                  <span>{{ $t("tradeLang.lang242") }}</span>
                  <p>{{ item.lever }}s</p>
                  <span>{{ $t("tradeLang.lang243") }}</span>
                  <p>{{ item.gas || "--" }}</p>
                </div>
              </li>
              <li class="position_bottom">
                <div class="flex">
                  <span>{{ $t("tradeLang.lang246") }}</span>
                  <p>{{ item.closedate | ts_local("yyyy/MM/dd hh:mm") }}</p>
                </div>
              </li>
            </ol>
          </van-list>
          <div v-if="!historyOrder.length && isload" class="no_data">
            <p class="icon_no_data" />
            <span>{{ $t("commonLang.lang5") }}</span>
          </div>
        </van-tab>
        <van-tab :title="$t('tradeLang.lang247')">
          <ol class="top_order">
            <li>
              <span>{{ $t("tradeLang.lang248") }}</span>
              <span>{{ $t("tradeLang.lang249") }}</span>
              <span
                >{{ $t("tradeLang.lang250") }}({{ coinInfo.maincoin }})</span
              >
              <span>{{ $t("tradeLang.lang251") }}</span>
            </li>
            <li v-for="(item, index) in topOrder" :key="index">
              <p>{{ item.wdate }}</p>
              <p v-if="item.type == 'buy'" class="green_color">
                {{ $t("tradeLang.lang235") }}
              </p>
              <p v-if="item.type == 'sell'" class="red_color">
                {{ $t("tradeLang.lang236") }}
              </p>
              <p>{{ item.income }}</p>
              <p>{{ item.last_profit }}</p>
            </li>
          </ol>
          <div v-if="!topOrder.length" class="no_data">
            <p class="icon_no_data" />
            <span>{{ $t("commonLang.lang5") }}</span>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <van-popup
      ref="leftPopup"
      v-model="leftPopup"
      position="left"
      safe-area-inset-bottom
      get-container="#app"
      :lazy-render="false"
      class="left_popup"
    >
      <div class="left_title">{{ $t("tradeLang.lang252") }}</div>
      <ol>
        <li
          v-for="item in coinList"
          :key="item.tradcoin"
          :class="[
            { coin_selected: coinInfo.tradcoin == item.tradcoin },
            'flex_between van-hairline--bottom',
          ]"
          @click="chooseCoin(item)"
        >
          <div>
            <span
              >{{ item.tradcoin.toUpperCase() }}/{{
                item.maincoin.toUpperCase()
              }}</span
            >
            <label v-if="$i18n.locale == 'CN'">{{ item.chinaname }}</label>
            <label v-else>{{ item.symbol }}</label>
          </div>
          <p :class="[item.rise >= 0 ? 'red_color' : 'green_color']">
            {{ item.price }}
          </p>
        </li>
      </ol>
    </van-popup>

    <van-popup
      v-model="tradePopup"
      position="bottom"
      safe-area-inset-bottom
      get-container="#app"
      class="trade_popup"
    >
      <div class="trade_popup_title flex_between">
        <div class="flex">
          <h3>{{ coinInfo.tradcoin }}/{{ coinInfo.maincoin }}</h3>
          <p v-if="coinInfo.rise >= 0" class="green_color">
            {{ coinInfo.price }}
          </p>
          <p v-if="coinInfo.rise < 0" class="red_color">{{ coinInfo.price }}</p>
        </div>
        <a @click="tradePopup = false">{{ $t("commonLang.lang1") }}</a>
      </div>
      <!--      <p class="time_box">-->
      <!--        <em>{{ nowDate|formatDate('yyyy-MM-dd hh:mm:ss') }}</em>-->
      <!--      </p>-->

      <ol class="trade_popup_ol">
        <li>
          <label>{{ $t("tradeLang.lang253") }}</label>
          <div>
            <p
              v-for="item in payCoinList"
              :key="item.paycoin"
              :class="[{ tab_select: payCoinData.paycoin == item.paycoin }]"
              @click="selectPayCoin(item)"
            >
              {{ item.paycoin }}
            </p>
          </div>
        </li>
        <li>
          <label>{{ $t("tradeLang.lang254") }}</label>
          <div>
            <input v-model="usable" type="text" disabled readonly />
          </div>
        </li>
        <li>
          <label>{{ $t("tradeLang.lang255") }}</label>
          <div>
            <input
              v-model="tradeNum"
              type="number"
              :placeholder="
                $t('tradeLang.lang256', {
                  min: leverData.minnumber,
                  coin: payCoinData.paycoin,
                })
              "
            />
          </div>
        </li>
        <li>
          <label>{{ $t("tradeLang.lang242") }}</label>
          <div>
            <p
              v-for="item in leverList"
              :key="item.autoid"
              :class="[{ tab_select: leverData.lever == item.lever }]"
              @click="chooseCycle(item)"
            >
              {{ item.lever }}s
            </p>
          </div>
        </li>
      </ol>
      <div class="profit_box flex_between">
        <p>
          {{ $t("tradeLang.lang257")
          }}<em>{{ (leverData.profitGas * 100) | mathFloor(2) }}%</em>
        </p>
        <p>
          {{ $t("tradeLang.lang258")
          }}<em>{{ (tradeNum * leverData.profitGas) | mathFloor1(8) }}</em>
        </p>
      </div>
      <div class="trade_popup_btn">
        <van-button
          v-if="tradeType == 1"
          class="green_bg"
          @click="addOrder('buy')"
          >{{ $t("tradeLang.lang235") }}</van-button
        >
        <van-button v-else class="red_bg" @click="addOrder('sell')">{{
          $t("tradeLang.lang236")
        }}</van-button>
      </div>
    </van-popup>

    <drag-box
      v-for="(item, index) in positionOrder"
      :id="'cycle' + item.autoid"
      :key="'cycle' + item.autoid"
      :offset-time="offsetTime"
      :now-price="coinInfo.price"
      :data="item"
      :top="100 + index * 150"
      @dragNotice="updatePosition"
      @refreshData="refreshHistory"
    />
  </div>
</template>

<script>
import kline from "@/views/home/components/kline";
import dragBox from "./components/dragBox";
import { Toast } from "vant";
import { mapState } from "vuex";
import { systemTime } from "@api/common";
import { contractBalance } from "@api/wallet";
import {
  cycleSymbols,
  cycleInfo,
  cycleBuyMarket,
  cycleSellMarket,
  positionByCoin,
  historyPositionByCoin,
} from "@api/cycle";
export default {
  components: { kline, dragBox },
  data() {
    return {
      tradeType: sessionStorage.getItem("cycleType") || 1,
      nowDate: null,
      timeInterval: null,

      leftPopup: false,
      coinList: [],
      coinInfo: {},

      klineKey:
        Date.now().toString() + Math.floor(Math.random() * 1000).toString(),

      tradePopup: false,
      payCoinPopup: false,
      payCoinList: [],
      payCoinData: {},

      leverPopup: false,
      leverList: [],
      leverData: {},

      coinSheet: false,
      coinActions: [],

      usable: "",
      gasType: "profit",
      profitGas: "0.00",
      lossGas: "0.00",

      tradeNum: "",

      active: 0,
      topOrder: [],
      positionOrder: [],

      historyOrder: [],
      searchData: {
        page: 1,
        limit: 15,
      },
      isload: false,
      loading: false,
      finished: true,
    };
  },
  computed: {
    ...mapState({
      marketSocketData: (state) => state.trade.marketSocketData,

      cycleSocketData: (state) => state.trade.cycleSocketData,
      cycleTopData: (state) => state.trade.cycleTopData,

      headerHeight: (state) => state.common.headerHeight,
      offsetTime: (state) => state.common.offsetTime,
      rateData: (state) => state.wallet.rateData,
    }),
  },
  watch: {
    // 监听socket 数据  实时更新
    marketSocketData(data) {
      // 更新行情
      data.cyclesymbols && (this.coinList = data.cyclesymbols);
    },
    // 监听socket 数据  实时更新
    cycleSocketData(data) {
      // 更新行情
      if (data.cycleinfo && this.coinInfo) {
        if (data.cycleinfo.autoid == this.coinInfo.autoid) {
          this.setCoinData(data.cycleinfo);
        }
      }
    },

    cycleTopData(data) {
      this.setTopData(data);
    },
  },
  created() {
    this.$store.dispatch("common/showFooter", true);
    this.$store.dispatch("common/updateSelectedFooter", 3);

    if (this.cycleSocketData && this.cycleSocketData.cycleinfo) {
      if (this.marketSocketData && this.marketSocketData.cyclesymbols) {
        this.initCoinList(this.marketSocketData.cyclesymbols, 1);
      } else {
        this.getCoinList();
      }
    } else {
      this.getCoinList();
    }
  },
  mounted() {
    const cycleTop = this.$refs.cycleTop;
    cycleTop.style.paddingTop = `${this.$barHeight}px`;
    this.$refs.cycleBox.style.top = `${cycleTop.clientHeight}px`;
  },

  methods: {
    // 获取交易币种列表
    getCoinList() {
      cycleSymbols().then((res) => {
        this.initCoinList(res.data);
      });
    },
    initCoinList(resData, type) {
      let cycleCoinParams, coinData;
      this.coinList = resData;
      cycleCoinParams =
        JSON.parse(sessionStorage.getItem("cycleCoinParams")) || {};
      // 检查上次是否已经操作过选择币种 浏览器记住了上次选择的币种 本次默认上次选择币种;
      if (Object.keys(cycleCoinParams).length) {
        coinData = cycleCoinParams;
      } else {
        coinData = this.coinList[0];
        sessionStorage.setItem("cycleCoinParams", JSON.stringify(coinData));
      }
      if (type == 1) {
        if (this.cycleSocketData.cycleinfo.tradcoin == coinData.tradcoin) {
          // 如果ws有数据 取ws的数据 不调接口
          this.coinInfo = this.cycleSocketData.cycleinfo;
        } else {
          this.getCoinInfo(coinData);
        }
      } else {
        this.getCoinInfo(coinData);
      }

      // 更新账户信息
      this.getOffsetTime(coinData);
      this.getHistoryPosition(coinData);
      this.sendWsParams(coinData);
    },
    // 获取交易币种信息
    getCoinInfo(data) {
      cycleInfo({
        maincoin: data.maincoin,
        tradcoin: data.tradcoin,
      }).then((res) => {
        this.setCoinData(res.data);
      });
    },
    setCoinData(resData) {
      const optionalData =
        JSON.parse(localStorage.getItem("optionalCycleData")) || [];
      resData.stringName = `${resData.tradcoin}/${resData.maincoin}`;
      optionalData.forEach((id) => {
        resData.isOptional = resData.autoid == id;
      });
      this.coinInfo = resData;
    },
    changePerioad(data) {
      this.sendWsParams(this.coinInfo, data.Min);
    },
    sendWsParams(coinData, klineMinute) {
      // console.log(this.$ws);
      if (this.$ws && this.$ws.readyState == 1) {
        // 通知 ws 更新币种数据
        const key = `${coinData.maincoin}_${coinData.tradcoin}_cycle_${
          klineMinute || 1
        }`;
        this.$ws.send(key);
        sessionStorage.setItem("webSocketKey", key);
      } else {
        // 如果ws没准备好  1.5s后再试
        setTimeout(() => {
          // 通知 ws 更新币种数据
          this.sendWsParams(coinData);
        }, 1500);
      }
    },

    // 操作自选收藏
    handleOptional() {
      this.$set(this.coinInfo, "isOptional", !this.coinInfo.isOptional);

      // 重置缓存中的coinInfo数据，更新自选
      sessionStorage.setItem("cycleCoinParams", JSON.stringify(this.coinInfo));

      // 更新coinList 中的自选状态
      this.coinList.forEach((data) => {
        if (data.autoid == this.coinInfo.autoid) {
          data.isOptional = !data.isOptional;
        }
      });

      // 获取缓存中的自选数据
      let optionalData =
        JSON.parse(localStorage.getItem("optionalCycleData")) || [];

      // 如果币种当前状态为 已自选状态 直接添加进缓存中数据
      if (this.coinInfo.isOptional) {
        optionalData.push(this.coinInfo.autoid);
      } else {
        // 过滤掉取消自选的币种数据
        optionalData = optionalData.filter(
          (id) => !(id == this.coinInfo.autoid)
        );
      }
      localStorage.setItem("optionalCycleData", JSON.stringify(optionalData));
    },

    showLeftPopup() {
      this.leftPopup = true;
      const leftPopup = this.$refs.leftPopup.$el;
      leftPopup.style.paddingTop = `${this.$barHeight}px`;
    },

    chooseCoin(coinData) {
      this.leftPopup = false;
      // 选择的当前币种  不处理
      if (coinData.tradcoin != this.coinInfo.tradcoin) {
        // 更新币种信息；
        this.coinInfo = coinData;
        sessionStorage.setItem("cycleCoinParams", JSON.stringify(coinData));
        this.klineKey =
          Date.now().toString() + Math.floor(Math.random() * 1000).toString();

        this.topOrder = [];

        // 重新获取选中币种信息和账户信息
        this.getCoinInfo(coinData);
        this.sendWsParams(coinData);
        this.getPosition(coinData);
        this.getHistoryPosition(coinData);
      }
    },

    setTopData(data) {
      const orderList = this.topOrder;
      data.forEach((top) => {
        orderList.forEach((order, index) => {
          if (top.autoid == order.autoid) {
            orderList.splice(index, 1);
          }
        });
      });
      this.topOrder = [...data, ...orderList];
      if (this.topOrder.length > 20) {
        this.topOrder.length = 20;
      }
    },

    getOffsetTime(coinData) {
      systemTime().then((res) => {
        const offsetTime = res.data - Date.now();
        this.$store.dispatch("common/setOffsetTime", offsetTime);
        coinData && this.getPosition(coinData);
      });
    },

    showTradePopup(type) {
      this.coinInfo.limit.forEach((data) => {
        data.name = data.paycoin;
      });
      this.payCoinList = this.coinInfo.limit;
      this.payCoinData = this.payCoinList[0];

      this.leverList = this.coinInfo.lever;
      this.leverData = this.leverList[0];

      this.initInterval();
      this.tradeType = type;
      this.tradeNum = "";
      this.tradePopup = true;
      this.getBalance();
    },
    selectPayCoin(data) {
      this.payCoinData = data;
      this.usable = "0.00";
      this.getBalance();
    },
    chooseCycle(data) {
      this.leverData = data;
      if (this.tradeNum && Number(data.minnumber) > Number(this.tradeNum)) {
        this.tradeNum = "";
      }
    },

    // 同步服务器时间
    initInterval() {
      let count = 0; // 计数器
      const startTime = Date.now();
      let intervalTime = 1000;
      if (this.offsetTime) {
        this.timeInterval && clearInterval(this.timeInterval);
        this.nowDate = Date.now() + this.offsetTime;
        this.timeInterval = setInterval(() => {
          this.nowDate += 1000;
          const runTime = Date.now();
          const offsetTime = runTime - (startTime + count * 1000) - 1000;
          intervalTime = 1000 - offsetTime;
          // console.log(intervalTime);
          count++;
        }, intervalTime);
      }
    },
    // 获取余额
    getBalance() {
      contractBalance({ coin: this.payCoinData.paycoin }).then((res) => {
        this.usable = Math.max(res.data.usable, 0);
      });
    },

    addOrder(type) {
      if (!this.tradeNum) {
        Toast(this.$t("tradeLang.lang259"));
        return;
      } else if (isNaN(this.tradeNum)) {
        Toast(this.$t("tradeLang.lang260"));
        return;
      } else if (this.tradeNum > Number(this.usable)) {
        Toast(this.$t("tradeLang.lang261"));
        return;
      } else if (this.tradeNum < Number(this.leverData.minnumber)) {
        Toast(this.$t("tradeLang.lang262", { min: this.leverData.minnumber }));
        return;
      }

      // 下单时判断socket连接是否正常 如果不正常 不允许下单
      // if (this.$ws && this.$ws.readyState == 1) {
      // 判断socket 中的时间和服务器的时间差  如果大于5s 不允许下单
      // if (Math.abs(this.coinInfo.new_date - this.nowDate) > 5000) {
      //   this.tradeNum = ''
      //   Toast(this.$t('tradeLang.lang264'))
      //   setTimeout(() => {
      //     window.location.reload()
      //   }, 3000)
      //   return
      // }
      const params = {
        maincoin: this.coinInfo.maincoin,
        tradcoin: this.coinInfo.tradcoin,
        number: this.tradeNum,
        paycoin: this.payCoinData.paycoin,
        lever: this.leverData.lever,
      };

      if (type == "buy") {
        cycleBuyMarket(params).then((res) => {
          Toast(res.msg);
          this.tradeNum = "";
          this.tradePopup = false;
          // 关闭定时器
          this.timeInterval && clearInterval(this.timeInterval);
          this.getPosition(this.coinInfo);
        });
      } else {
        cycleSellMarket(params).then((res) => {
          Toast(res.msg);
          this.tradeNum = "";
          this.tradePopup = false;
          // 关闭定时器
          this.timeInterval && clearInterval(this.timeInterval);
          this.getPosition(this.coinInfo);
        });
      }
      // } else {
      //   this.tradeNum = ''
      //   Toast(this.$t('tradeLang.lang265'))
      //   setTimeout(() => {
      //     window.location.reload()
      //   }, 3000)
      // }
    },

    getPosition(data) {
      positionByCoin({ maincoin: data.maincoin, tradcoin: data.tradcoin }).then(
        (res) => {
          this.positionOrder = res.data;
        }
      );
    },

    updatePosition(data) {
      // 倒计时结束 更新持仓和历史持仓
      this.active = 1;
      setTimeout(() => {
        this.getPosition(data);
      }, 5000);
    },

    refreshHistory() {
      // 定时器，如果下单后每隔1s查数据 直到5秒后不再重复查
      let intervalObj = null;
      let timeNum = 4;
      this.getHistoryPosition(this.coinInfo);
      intervalObj = setInterval(() => {
        timeNum--;
        if (timeNum >= 0) {
          this.getHistoryPosition(this.coinInfo);
        } else {
          intervalObj && clearInterval(intervalObj);
        }
      }, 1500);
    },

    getHistoryPosition(coinData) {
      this.isload = false;
      this.searchData.page = 0;
      this.searchData.tradcoin = coinData.tradcoin;
      this.searchData.maincoin = coinData.maincoin;
      this.loadMore();
    },
    loadMore() {
      this.searchData.page += 1;
      historyPositionByCoin(this.searchData).then((res) => {
        this.isload = true;
        this.loading = false;
        if (res.data && res.data.length) {
          this.historyOrder =
            this.searchData.page == 1
              ? res.data
              : [...this.historyOrder, ...res.data];
        } else {
          this.historyOrder = [];
        }
        this.finished = res.count == this.historyOrder.length;
      });
    },

    showDetailsPopup() {},
  },
};
</script>

<style lang="scss" scoped>
.cycle_futures {
  bottom: 50px;
  height: auto;
  background: $blockColor;
  .cycle_top {
    position: fixed;
    width: 100%;
    z-index: 100;
    background-color: $bgColor;
  }
  .cycle_box {
    position: absolute;
    width: 100%;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .coin_header {
    padding: 15px 15px 12px;
    background-color: $bgColor;
    height: 48px;
    width: 100%;
    img {
      width: 18px;
      height: 18px;
      margin-right: 8px;
    }
    i {
      font-size: 20px;
      margin-left: 10px;
    }
  }
  .coin_price {
    height: 57px;
    align-items: flex-end;
    padding: 0 15px 12px;
    .price_left_box {
      h2 {
        font-size: 20px;
        margin-bottom: 6px;
      }
      label {
        font-size: 13px;
        line-height: 20px;
        p {
          color: $subFontColor;
          margin-right: 10px;
        }
      }
    }
    .price_right_box {
      text-align: right;
      line-height: 20px;
      font-size: 13px;
      span {
        color: $subFontColor;
        margin-right: 10px;
      }
    }
  }
}

.kline_box {
  background-color: $bgColor;
  padding: 5px 0;
  height: 360px;
}

.btn_box {
  border-bottom: 5px solid $bgColor;
  background-color: $blockColor;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  button {
    flex: 1;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    color: var(--selected-nav-color);
    font-weight: 600;
    font-size: 15px;
    border: none;
    &:nth-child(2) {
      margin-left: 15px;
    }
  }
}

.left_popup {
  width: 80%;
  height: 100%;
  .left_title {
    padding: 15px 15px 10px;
    font-weight: 600;
    font-size: 15px;
    line-height: 30px;
  }
  ol {
    line-height: 20px;
    li {
      padding: 12px 15px 10px;
      border-bottom: 1px solid $bgColor;
      align-items: flex-start;
      label {
        display: block;
        font-size: 12px;
        color: $subFontColor;
        margin-top: 5px;
      }
      p {
        font-size: 15px;
        font-weight: 600;
      }
      span {
        display: block;
        font-weight: 600;
      }
    }
  }
  .coin_selected {
    background-color: $bgColor;
  }
}

.trade_popup {
  background-color: $blockColor;
  border-radius: 10px 10px 0 0;
  .trade_popup_title {
    padding: 15px 15px 12px;
    border-bottom: 1px solid $bgColor;
    a {
      font-size: 13px;
      color: $subFontColor;
    }
    h3,
    P {
      font-size: 15px;
      font-weight: 600;
      margin-right: 15px;
    }
  }
  .time_box {
    text-align: right;
    padding: 10px 15px;
  }
  .trade_popup_ol {
    li {
      padding: 5px 15px;
      display: flex;
      align-items: center;
      label {
        flex: 1;
        max-width: 70px;
        min-width: 70px;
        color: $subFontColor;
      }
      .tab_select {
        background-color: $mainColor;
        color: $fontColor;
      }
      &:nth-child(1) {
        div {
          flex: 1;
          display: flex;
          align-items: center;
          p {
            line-height: 30px;
            border: 1px solid $lineColor;
            padding: 0 10px;
            margin-right: 10px;
            border-radius: 3px;
          }
        }
      }
      &:nth-child(2),
      &:nth-child(3) {
        div {
          flex: 1;
          border: 1px solid $lineColor;
          padding: 5px 10px;
          border-radius: 3px;
          input {
            line-height: 22px;
          }
        }
      }
      &:last-child {
        div {
          flex: 1;
          display: flex;
          align-items: center;
          p {
            line-height: 30px;
            border: 1px solid $lineColor;
            padding: 0 10px;
            margin-right: 10px;
            border-radius: 3px;
          }
        }
      }
    }
  }

  .profit_box {
    padding: 10px 15px;
    color: $subFontColor;
    font-size: 12px;
  }

  .trade_popup_btn {
    padding: 10px 15px;
    button {
      width: 100%;
      line-height: 40px;
      border-radius: 3px;
      color: $fontColor;
      border: none;
    }
  }
}

.top_order {
  background: $blockColor;
  li {
    display: flex;
    align-items: center;
    padding: 0 15px;
    line-height: 28px;
    span {
      flex: 1;
      font-size: 12px;
      color: $subFontColor;
      padding: 10px 0 2px;
      &:nth-child(1) {
        max-width: 18%;
      }
      &:nth-child(4) {
        text-align: right;
      }
    }
    p {
      flex: 1;
      font-size: 13px;
      &:nth-child(1) {
        max-width: 18%;
      }
      &:nth-child(4) {
        text-align: right;
      }
    }
  }
}

.position_box {
  padding: 12px 15px;
  border-bottom: 1px solid $bgColor;
  background-color: var(--main-box-bgColor);
  .position_top {
    line-height: 20px;
    margin-bottom: 10px;
    h2 {
      font-size: 15px;
    }
    i {
      flex: 1;
      text-align: right;
      font-size: 12px;
      margin-right: 10px;
      color: $subFontColor;
    }
  }
  .position_center {
    div {
      flex: 1;
      line-height: 22px;
      font-size: 12px;
      &:nth-child(2) {
        text-align: center;
      }
      &:last-child {
        text-align: right;
      }
      span {
        color: $subFontColor;
      }
    }
  }
  .position_bottom {
    border-top: 1px solid rgba($lineColor, 0.5);
    margin-top: 8px;
    padding-top: 8px;
    line-height: 22px;
    font-size: 12px;
    span {
      color: $subFontColor;
    }
    p {
      margin-left: 10px;
    }
  }
  .position_btn {
    margin-top: 15px;
    button {
      flex: 1;
      background-color: rgba($mainColor, 0.2);
      color: $mainColor;
      padding: 5px 0;
      font-size: 13px;
      border-radius: 2px;
      &:first-child {
        margin-right: 15px;
      }
    }
  }
}
</style>
