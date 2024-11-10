<template>
  <div class="coin_exchange">
    <div ref="exchangeTop" class="exchange_nav main_bg">
      <div class="coin_top flex_between">
        <label class="flex" @click="leftPopup=true;">
          <img src="@img/trade/icon_menu.png" alt="">
          <h3>{{ coinInfo.tradcoin }}/{{ coinInfo.maincoin }}</h3>
        </label>
        <p>
          <i v-if="!coinInfo.isOptional" class="iconfont icon-star-o" @click="handleOptional()" />
          <i v-else class="iconfont icon-star main_color" @click="handleOptional()" />
          <i class="iconfont icon-k-line" @click="goDetails('trad')" />
          <i class="iconfont icon-record" @click="pushPath('/allRecord')" />
        </p>
      </div>
    </div>
    <div ref="exchangeBox" class="main_content">
      <div v-show="pageIsload" class="trade_content flex block_bg">
        <div class="left_box">
          <ol class="release_nav flex_between">
            <li :class="[{'selected_nav green_bg':tradeType==0}]" @click="tradeType=0">{{ $t('tradeLang.lang23') }}</li>
            <li :class="[{'selected_nav red_bg':tradeType==1}]" @click="tradeType=1">{{ $t('tradeLang.lang24') }}</li>
          </ol>
          <van-action-sheet v-model="tradeStyleSheet" :actions="tradeStyleList" :cancel-text="$t('commonLang.lang1')" @select="onSelectStyle" />
          <div v-show="tradeType==0" class="release_box">
            <p class="trade_type_box" @click="tradeStyleSheet=true">{{ tradeStyleData.name }} <i class="iconfont icon-down" /></p>
            <van-stepper v-if="!priceReadonly" v-model="buyPrice" name="buyPrice" button-size="20px" :min="(1/Math.pow(10,price_accuracy))" :step="(1/Math.pow(10,price_accuracy))" />
            <div v-if="priceReadonly" class="price_readonly_box text_hide">{{ $t('tradeLang.lang106') }}</div>
            <p class="cny_box"> <span v-if="!priceReadonly">≈ {{ rateData.symbol }}{{ (buyPrice*rateData.price)|mathFloor(2) }}</span></p>
            <div class="num_box">
              <input v-model="buyNumber" type="number" :placeholder="$t('tradeLang.lang6')">
              <em>{{ coinInfo.tradcoin }}</em>
            </div>
            <p class="usable_box text_hide">{{ $t('tradeLang.lang42') }} <em class="text_hide">{{ account.mainusable||"0.00" }}{{ coinInfo.maincoin }}</em></p>
            <div class="slider_box">
              <vue-slider
                ref="buySlider"
                v-model="sliderBuyVal"
                tooltip-formatter="{value}%"
                :process-style="{ backgroundColor: '#F0B90A' }"
                :label-style="{ color: '#272D42',fontSize:'12px'}"
                :adsorb="true"
                :included="true"
                :dot-size="10"
                :height="8"
                :max="100"
                :marks="marks"
                :hide-label="true"
                @change="buyStep"
              >
                <template v-slot:step="{ label, active }">
                  <div :class="['custom-step', { active }]" />
                </template>
              </vue-slider>
            </div>
            <p class="usable_box text_hide">{{ $t('tradeLang.lang107') }}
              <em v-if="!priceReadonly" class="text_hide">{{ (buyPrice*buyNumber)|mathFloor1(8) }}{{ coinInfo.maincoin }}</em>
              <em v-if="priceReadonly" class="text_hide">{{ (coinInfo.price*buyNumber)|mathFloor1(8) }}{{ coinInfo.maincoin }}</em>
            </p>
            <van-button class="green_bg" @click="releaseBuy()">{{ $t('tradeLang.lang23') }}</van-button>
          </div>
          <div v-show="tradeType==1" class="release_box">
            <p class="trade_type_box" @click="tradeStyleSheet=true">{{ tradeStyleData.name }} <i class="iconfont icon-down" /></p>
            <van-stepper v-if="!priceReadonly" v-model="sellPrice" name="sellPrice" button-size="20px" :min="1/Math.pow(10,price_accuracy)" :step="1/Math.pow(10,price_accuracy)" />
            <div v-if="priceReadonly" class="price_readonly_box text_hide">{{ $t('tradeLang.lang106') }} </div>
            <p class="cny_box"> <span v-if="!priceReadonly">≈ {{ rateData.symbol }}{{ (buyPrice*rateData.price)|mathFloor(2) }}</span> </p>
            <div class="num_box">
              <input v-model="sellNumber" type="number" :placeholder="$t('tradeLang.lang6')">
              <em>{{ coinInfo.tradcoin }}</em>
            </div>
            <p class="usable_box text_hide">{{ $t('tradeLang.lang42') }}  <em class="text_hide">{{ account.tradusable||"0.00" }} {{ coinInfo.tradcoin }}</em></p>
            <div class="slider_box">
              <vue-slider
                ref="sellSlider"
                v-model="sliderSellVal"
                tooltip-formatter="{value}%"
                :process-style="{ backgroundColor: '#F0B90A' }"
                :label-style="{ color: '#272D42',fontSize:'12px'}"
                :adsorb="true"
                :included="true"
                :dot-size="10"
                :height="3"
                :max="100"
                :marks="marks"
                :hide-label="true"
                @change="sellStep"
              >
                <template v-slot:step="{ label, active }">
                  <div :class="['custom-step', { active }]" />
                </template>
              </vue-slider>
            </div>
            <p class="usable_box text_hide">{{ $t('tradeLang.lang107') }}
              <em v-if="!priceReadonly" class="text_hide">{{ (sellPrice*sellNumber)|mathFloor1(8) }}{{ coinInfo.maincoin }}</em>
              <em v-if="priceReadonly" class="text_hide">{{ (coinInfo.price*sellNumber)|mathFloor1(8) }}{{ coinInfo.maincoin }}</em>
            </p>
            <van-button class="red_bg" @click="releaseSell()">{{ $t('tradeLang.lang24') }}</van-button>
          </div>
        </div>

        <div class="right_box">
          <div class="right_header flex_between">
            <span>{{ $t('tradeLang.lang7') }}</span>
            <span>{{ $t('tradeLang.lang6') }}</span>
          </div>
          <ol class="list_box">
            <li v-for="(item,index) in sellList" :key="index+'sell'" @click="setPrice('sell',item)">
              <div>
                <i :style="{'width':item.width+'%'}" class="red_transparent" />
                <p class="flex_between">
                  <span class="red_color">{{ item.price|mathFloor(coinInfo.price_accuracy) }}</span>
                  <span>{{ item.amount }}</span>
                </p>
              </div>
            </li>
            <li v-for="n in (6-sellList.length>0?6-sellList.length:0)" :key="n">
              <div>
                <p class="flex_between">
                  <span class="red_color">--</span>
                  <span>--</span>
                </p>
              </div>
            </li>
          </ol>
          <section>
            <h2 :class="[coinInfo.rise>=0?'green_color':'red_color','text_hide']">{{ coinInfo.price|mathFloor(coinInfo.price_accuracy) }}</h2>
            <p>≈ {{ rateData.symbol }}{{ (coinInfo.price*rateData.price)|mathFloor(2) }}</p>
          </section>
          <ol class="list_box">
            <li v-for="(item,index) in buyList" :key="index+'buy'" @click="setPrice('buy',item)">
              <div>
                <i :style="{'width':item.width+'%'}" class="green_transparent" />
                <p class="flex_between">
                  <span class="green_color">{{ item.price|mathFloor(coinInfo.price_accuracy) }}</span>
                  <span>{{ item.amount }}</span>
                </p>
              </div>
            </li>
            <li v-for="n in (6-buyList.length>0?6-buyList.length:0)" :key="n">
              <div>
                <p class="flex_between">
                  <span class="green_color">--</span>
                  <span>--</span>
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>

      <div v-show="pageIsload" class="trade_list">
        <div class="title flex_between">
          <h3>{{ $t('tradeLang.lang108') }}</h3>
          <span @click="pushPath('/coinRecord/'+JSON.stringify({'plate':coinInfo.plate,'tradcoin':coinInfo.tradcoin,'maincoin':coinInfo.maincoin}))"><i class="iconfont icon-record" /> {{ $t('tradeLang.lang108a') }}</span>
        </div>
        <ol v-for="item in recordList" :key="item.id">
          <li>
            <div class="flex">
              <span :class="[item.type=='buy'?'green_bg':'red_bg']">
                {{ item.type=='buy'?$t('tradeLang.lang23'):$t('tradeLang.lang24') }}·{{ item.style=='limit'?$t('tradeLang.lang109'):$t('tradeLang.lang110') }}
              </span>
              <h3>{{ item.tradcoin }}/{{ item.maincoin }}</h3>
              <label>
                <a class="main_color" @click="closeEntrustOrder(item)">{{ $t('tradeLang.lang111') }}</a>
              </label>
            </div>
            <section>
              <label>
                <span>{{ $t('tradeLang.lang112') }}</span>
                <em>{{ item.price }}</em>
                <span>{{ $t('tradeLang.lang112') }}</span>
                <em>{{ item.wdate }}</em>
              </label>
              <label>
                <span>{{ $t('tradeLang.lang114') }}</span>
                <em>{{ item.number }}</em>
                <span>{{ $t('tradeLang.lang115') }}</span>
                <em>{{ item.unfilled||0 }}</em>
              </label>
              <label>
                <span>{{ $t('tradeLang.lang116') }}</span>
                <em>{{ (item.number*item.price)|mathFloor1(8) }}</em>
                <span>{{ $t('tradeLang.lang117') }}</span>
                <em>{{ item.state|entrustState() }}</em>
              </label>
            </section>
          </li>
        </ol>
        <div v-show="listLoad&&recordList.length==0" class="no_data">
          <p class="icon_no_data" /><span>{{ $t('commonLang.lang5') }}</span>
        </div>
      </div>
    </div>

    <van-popup v-model="leftPopup"  safe-area-inset-bottom get-container="#app"  class="left_popup" position="left">
      <left-list :coin-list-arr="coinList" @chooseCoin="chooseCoinData" />
    </van-popup>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import leftList from './components/leftCoinList.vue'
import { mapState, mapGetters } from 'vuex'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

import { tradeSymbols, tradeCoinInfo, tradAccount, buyLimit, sellLimit, buyMarket, sellMarket, closeEntrust } from '@api/exchange'
export default {
  components: { leftList, VueSlider },
  data() {
    return {
      pageIsload: false,
      account: {
        tradusable: 0,
        mainusable: 0
      },
      coinInfo: {},
      price_accuracy: 0,

      leftPopup: false,
      coinList: [],

      tradeType: sessionStorage.getItem('tradeType') || 0,

      priceReadonly: true,
      tradeStyleSheet: false,
      tradeStyleData: {
        name: this.$t('tradeLang.lang110'),
        tradeStyle: 'market'
      },
      tradeStyleList: [
        { name: this.$t('tradeLang.lang109'), tradeStyle: 'limit' },
        { name: this.$t('tradeLang.lang110'), tradeStyle: 'market' }
      ],

      buyPrice: null,
      buyNumber: '',
      sellPrice: null,
      sellNumber: '',

      sliderBuyVal: 0,
      sliderSellVal: 0,
      sliderFormatter: '{value}%',
      marks: val => val % 1 === 0,

      sellList: [],
      buyList: [],

      listLoad: false,
      recordList: [],
      timeoutObj: null
    }
  },

  computed: {
    ...mapState({
      marketSocketData: state => state.trade.marketSocketData,
      coinSocketData: state => state.trade.coinSocketData,
      rateData: state => state.wallet.rateData
    })
  },
  watch: {
    tradeType(val) {
      sessionStorage.setItem('tradeType', val)
    },
    // 监听socket 数据  实时更新
    coinSocketData(data) {
      // 更新币种数据
      if (data.info && this.coinInfo && this.coinInfo.tradcoin) {
        // 判断接收到的数据是否是当前币种数据 不是就不赋值
        if (data.info.autoid == this.coinInfo.autoid) {
          this.setData(data)
        }
      }
    }
  },
  beforeDestroy() {
    this.timeoutObj && clearTimeout(this.timeoutObj)
    this.buyPrice = null
    this.sellPrice = null
  },
  created() {
    if (this.coinSocketData && this.coinSocketData.info) {
      if (this.marketSocketData && this.marketSocketData.symbols) {
        this.initCoinList(this.marketSocketData.symbols, 1)
      } else {
        this.getLeftCoinList()
      }
    } else {
      this.getLeftCoinList()
    }
  },
  mounted() {
    setTimeout(() => {
      const tradeTop = this.$parent.$refs.tradeTop
      const exchangeTop = this.$refs.exchangeTop
      exchangeTop.style.top = `${tradeTop.clientHeight}px`
      this.$refs.exchangeBox.style.top = `${tradeTop.clientHeight + exchangeTop.clientHeight}px`
      this.pageIsload = true
    }, 0)
  },
  methods: {
    // 初始获取币种列表
    getLeftCoinList() {
      tradeSymbols().then(res => {
        this.initCoinList(res.data, 2)
      })
    },

    initCoinList(resData, type) {
      const coinList = []; let selectedCoin; let coinData
      resData.forEach(data => {
        // 筛选允许交易币种
        if (data.state == 'enable') {
          coinList.push(data)
        }
      })
      this.coinList = [...coinList]
      selectedCoin = JSON.parse(sessionStorage.getItem('selectedCoin'))
      // 检查上次是否已经操作过选择币种 浏览器记住了上次选择的币种 本次默认上次选择币种;
      if (selectedCoin) {
        coinData = selectedCoin
      } else {
        coinData = coinList[0]
        sessionStorage.setItem('selectedCoin', JSON.stringify(coinData))
      }
      if (type == 1) {
        if (this.coinSocketData.info.autoid == coinData.autoid) {
          // 如果ws有数据 取ws的数据 不调接口
          this.setCoinInfo(this.coinSocketData)
        } else {
          this.getCoinInfo(coinData)
        }
      } else {
        this.getCoinInfo(coinData)
      }

      // 更新账户信息
      this.updateAccountData(coinData)
    },

    // 初始获取币种信息
    getCoinInfo(coinData) {
      tradeCoinInfo({ maincoin: coinData.maincoin, tradcoin: coinData.tradcoin }).then(res => {
        this.setCoinInfo(res.data)
      })
    },
    setCoinInfo(resData) {
      // 只在第一次加载币种数据时设置价格
      this.buyPrice = resData.info.buyprice
      this.sellPrice = resData.info.sellprice
      this.price_accuracy = resData.info.price_accuracy
      // 设置数据
      this.setData(resData)
    },

    // 填充币种数据
    setData(resData) {
      const optionalData = JSON.parse(localStorage.getItem('optionalData')) || []
      resData.info.stringName = `${resData.info.tradcoin}/${resData.info.maincoin}`
      optionalData.forEach(id => {
        resData.info.isOptional = resData.info.autoid == id
      })
      this.coinInfo = resData.info
      // 传递给档位图做初始化渲染
      this.setGearMap(resData)
    },

    // 获取币种账户信息  通知服务端推送数据
    updateAccountData(coinData) {
      this.getAccount(coinData)
      this.sendWsParams(coinData)
    },
    sendWsParams(coinData) {
      // console.log(this.$ws);
      if (this.$ws && this.$ws.readyState == 1) {
        // 通知 ws 更新币种数据
        const key = `${coinData.maincoin}_${coinData.tradcoin}_trad_1`
        this.$ws.send(key)
        sessionStorage.setItem('webSocketKey', key)
      } else {
        // 如果ws没准备好  1.5s后再试
        setTimeout(() => {
          // 通知 ws 更新币种数据
          this.sendWsParams(coinData)
        }, 1500)
      }
    },

    // 获取币种资产和当前委托
    getAccount(coinData) {
      tradAccount({
        tradcoin: coinData.tradcoin,
        maincoin: coinData.maincoin
      }).then(res => {
        this.account = res.data.balance
        this.account.mainusable =  Math.max(this.account.mainusable, 0)
        this.listLoad = true
        this.recordList = res.data.entrust_order
        this.timeoutObj && clearTimeout(this.timeoutObj)
        if (this.recordList.length > 0) {
          this.timeoutObj = setTimeout(() => {
            this.getAccount(coinData)
          }, 5000)
        }
      })
    },

    // 左侧栏选择币种
    chooseCoinData(coinData) {
      this.leftPopup = false
      // 选择的当前币种  不处理
      if (coinData.autoid == this.coinInfo.autoid) {
        return
      }
      // 更新币种信息；
      this.coinInfo = coinData
      sessionStorage.setItem('selectedCoin', JSON.stringify(coinData))
      this.buyNumber = ''
      this.sellNumber = ''
      // 人为修改价格 的状态改为false, 没有手动修改价格 价格跟着ws实时更新 否则不再更新
      // this.priceChange = false;
      const infoArr = []
      infoArr.push(coinData)
      // 重新获取选中币种信息和账户信息
      this.getCoinInfo(coinData)
      this.timeoutObj && clearTimeout(this.timeoutObj)
      this.updateAccountData(coinData)
    },

    // 操作自选收藏
    handleOptional() {
      this.$set(this.coinInfo, 'isOptional', !this.coinInfo.isOptional)

      // 重置缓存中的coinInfo数据，更新自选
      sessionStorage.setItem('selectedCoin', JSON.stringify(this.coinInfo))

      // 更新coinList 中的自选状态
      this.coinList.forEach(data => {
        if (data.autoid == this.coinInfo.autoid) {
          data.isOptional = !data.isOptional
        }
      })

      // 获取缓存中的自选数据
      let optionalData = JSON.parse(localStorage.getItem('optionalData')) || []

      // 如果币种当前状态为 已自选状态 直接添加进缓存中数据
      if (this.coinInfo.isOptional) {
        optionalData.push(this.coinInfo.autoid)
      } else {
        // 过滤掉取消自选的币种数据
        optionalData = optionalData.filter((id) => !(id == this.coinInfo.autoid))
      }
      localStorage.setItem('optionalData', JSON.stringify(optionalData))
    },

    // 行情 kline 详情
    goDetails(type) {
      sessionStorage.setItem('marketDetails', JSON.stringify(this.coinInfo))
      this.pushPath('/marketDetails/' + type)
    },

    // 从档位图获取价格
    setPrice(type, data) {
      if (this.tradeStyleData.tradeStyle == 'limit') {
        if (this.tradeType == 0) {
          this.buyPrice = data.price
        } else {
          this.sellPrice = data.price
        }
      }
    },
    // 设置档位图数据
    setGearMap(mapData) {
      const tradeList = mapData
      let sellTotal = 0
      tradeList.sell.forEach(data => {
        sellTotal += (data.amount * data.price)
      })
      tradeList.sell.forEach(data => {
        data.width = (data.amount * data.price * 800) / sellTotal
        if (data.width > 100) { data.width = 100 }
      })
      if (tradeList.sell.length > 20) {
        tradeList.sell.length = 20
      }

      this.sellList = tradeList.sell.reverse()

      let buyTotal = 0
      tradeList.buy.forEach(data => {
        buyTotal += (data.amount * data.price)
      })
      tradeList.buy.forEach(data => {
        data.width = (data.amount * data.price * 800) / buyTotal
        if (data.width > 100) { data.width = 100 }
      })
      this.buyList = tradeList.buy
    },

    // 选择限价市价
    onSelectStyle(data) {
      this.tradeStyleData = data
      this.buyNumber = ''
      this.sliderBuyVal = 0
      this.sellNumber = ''
      this.sliderSellVal = 0
      if (data.tradeStyle == 'market') {
        this.price = this.coinInfo.price
        this.priceReadonly = true
      } else {
        this.priceReadonly = false
      }
      this.tradeStyleSheet = false
    },

    // 买入 百分比选择
    buyStep(val) {
      setTimeout(() => {
        this.$refs.buySlider.blur()
      }, 1000)
      let buyNumber
      if (this.tradeStyleData.tradeStyle == 'limit') {
        if (!this.buyPrice) {
          this.buyNumber = ''
        }
        buyNumber = (((this.account.mainusable * val) / this.buyPrice) / 100).toString()
        if (buyNumber == 0) {
          this.buyNumber = ''
          return
        }
      } else {
        buyNumber = (((this.account.mainusable * val) / this.coinInfo.price) / 100).toString()
        if (buyNumber == 0) {
          this.buyNumber = ''
          return
        }
      }

      buyNumber = buyNumber.substring(0, buyNumber.indexOf('.') + Number(this.coinInfo.amount_accuracy) + 1)
      if (buyNumber == 0) {
        this.buyNumber = ''
        return
      } else {
        this.buyNumber = buyNumber
      }
    },

    // 出售 百分比选择
    sellStep(val) {
      setTimeout(() => {
        this.$refs.sellSlider.blur()
      }, 1000)
      if (Number(this.account.tradusable) == 0) {
        return
      }
      let sellNumber = ((this.account.tradusable * val) / 100).toString()
      if (sellNumber == 0) {
        this.sellNumber = ''
        return
      }
      sellNumber = sellNumber.substring(0, sellNumber.indexOf('.') + Number(this.coinInfo.amount_accuracy) + 1)
      if (sellNumber == 0) {
        this.sellNumber = ''
        return
      } else {
        this.sellNumber = sellNumber
      }
    },

    releaseBuy() {
      if (this.tradeStyleData.tradeStyle == 'limit') { // 限价委托
        this.buy()
      } else {
        this.marketBuy()
      }
    },

    releaseSell() {
      if (this.tradeStyleData.tradeStyle == 'limit') { // 限价委托
        this.sell()
      } else {
        this.marketSell()
      }
    },

    buy() {
      if (!this.buyPrice) {
        Toast(this.$t('tradeLang.lang123'))
        return
      } else if (isNaN(this.buyPrice)) {
        Toast(this.$t('tradeLang.lang124'))
        return
      } else if (this.buyPrice <= 0) {
        Toast(this.$t('tradeLang.lang125'))
        return
      }

      if (!this.buyNumber) {
        Toast(this.$t('tradeLang.lang126'))
        return
      } else if (isNaN(this.buyNumber)) {
        Toast(this.$t('tradeLang.lang127'))
        return
      } else if (Number(this.buyNumber) < this.coinInfo.minnumber) {
        Toast(this.$t('tradeLang.lang128', { min: this.coinInfo.minnumber }))
        return
      }
      if (this.buyNumber * this.buyPrice > this.account.mainusable) {
        Toast(this.$t('tradeLang.lang129'))
        return
      }
      Dialog.confirm({
        message: this.$t('tradeLang.lang130', { coin: this.coinInfo.tradcoin }),
        confirmButtonText: this.$t('commonLang.lang9'),
        cancelButtonText: this.$t('commonLang.lang1')
      }).then(() => {
        buyLimit({
          price: this.buyPrice,
          number: this.buyNumber,
          tradcoin: this.coinInfo.tradcoin,
          maincoin: this.coinInfo.maincoin,
          plate: this.coinIn
        }).then(res => {
          Toast(res.msg)
          this.buyNumber = ''
          this.updateAccountData(this.coinInfo)
        })
      }).catch(() => {})
    },

    sell() {
      if (!this.sellPrice) {
        Toast(this.$t('tradeLang.lang123'))
        return
      } else if (isNaN(this.sellPrice)) {
        Toast(this.$t('tradeLang.lang124'))
        return
      } else if (this.sellPrice <= 0) {
        Toast(this.$t('tradeLang.lang125'))
        return
      }

      if (!this.sellNumber) {
        Toast(this.$t('tradeLang.lang126'))
        return
      } else if (isNaN(this.sellNumber)) {
        Toast(this.$t('tradeLang.lang127'))
        return
      } else if (Number(this.sellNumber) < this.coinInfo.minnumber) {
        Toast(this.$t('tradeLang.lang131', { min: this.coinInfo.minnumber }))
        return
      } else if (Number(this.sellNumber) > this.account.tradusable) {
        Toast(this.$t('tradeLang.lang129'))
        return
      }
      Dialog.confirm({
        message: this.$t('tradeLang.lang132', { coin: this.coinInfo.tradcoin }),
        confirmButtonText: this.$t('commonLang.lang9'),
        cancelButtonText: this.$t('commonLang.lang1')
      }).then(() => {
        sellLimit({
          price: this.sellPrice,
          number: this.sellNumber,
          tradcoin: this.coinInfo.tradcoin,
          maincoin: this.coinInfo.maincoin,
          plate: this.coinInfo.plate
        }).then(res => {
          Toast(res.msg)
          this.sellNumber = ''
          this.updateAccountData(this.coinInfo)
        })
      }).catch(() => {})
    },

    marketBuy() {
      if (!this.buyNumber) {
        Toast(this.$t('tradeLang.lang126'))
        return
      } else if (isNaN(this.buyNumber)) {
        Toast(this.$t('tradeLang.lang127'))
        return
      } else if (Number(this.buyNumber) < this.coinInfo.minnumber) {
        Toast(this.$t('tradeLang.lang128', { min: this.coinInfo.minnumber }))
        return
      }
      if (this.buyNumber * this.buyPrice > this.account.mainusable) {
        Toast(this.$t('tradeLang.lang129'))
        return
      }
      Dialog.confirm({
        message: this.$t('tradeLang.lang130', { coin: this.coinInfo.tradcoin }),
        confirmButtonText: this.$t('commonLang.lang9'),
        cancelButtonText: this.$t('commonLang.lang1')
      }).then(() => {
        buyMarket({
          number: this.buyNumber,
          tradcoin: this.coinInfo.tradcoin,
          maincoin: this.coinInfo.maincoin,
          plate: this.coinInfo.plate
        }).then(res => {
          Toast(res.msg)
          this.buyNumber = ''
          this.updateAccountData(this.coinInfo)
        })
      }).catch(() => {})
    },

    marketSell() {
      if (!this.sellNumber) {
        Toast(this.$t('tradeLang.lang126'))
        return
      } else if (isNaN(this.sellNumber)) {
        Toast(this.$t('tradeLang.lang127'))
        return
      } else if (Number(this.sellNumber) < this.coinInfo.minnumber) {
        Toast(this.$t('tradeLang.lang131', { min: this.coinInfo.minnumber }))
        return
      } else if (Number(this.sellNumber) > this.account.tradusable) {
        Toast(this.$t('tradeLang.lang129'))
        return
      }
      Dialog.confirm({
        message: this.$t('tradeLang.lang132', { coin: this.coinInfo.tradcoin }),
        confirmButtonText: this.$t('commonLang.lang9'),
        cancelButtonText: this.$t('commonLang.lang1')
      }).then(() => {
        sellMarket({
          number: this.sellNumber,
          tradcoin: this.coinInfo.tradcoin,
          maincoin: this.coinInfo.maincoin,
          plate: this.coinInfo.plate
        }).then(res => {
          Toast(res.msg)
          this.sellNumber = ''
          this.updateAccountData(this.coinInfo)
        })
      }).catch(() => {})
    },

    // 撤销我的当前委托
    closeEntrustOrder(data) {
      Dialog.confirm({
        message: this.$t('tradeLang.lang133'),
        confirmButtonText: this.$t('commonLang.lang9'),
        cancelButtonText: this.$t('commonLang.lang1')
      }).then(() => {
        closeEntrust({ id: data.autoid }).then(res => {
          Toast(res.msg)
          this.updateAccountData(this.coinInfo)
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.exchange_nav{
  //position: fixed;
  //z-index: 10;
  left: 0;
  width: 100%;
  .coin_top{
    height: 42px;
    padding: 8px 15px 14px;
    img{
      width: 18px;
      height: 18px;
      margin-right: 8px;
    }
    i{
      font-size: 20px;
      margin-left: 10px;
    }
  }
}
.main_content{
  overflow-y: scroll;
}

.trade_content{
  padding: 12px 15px;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
}
.left_box{
  flex: 1;
  max-width: 172px;
  min-width: 172px;
  .release_nav{
    li{
      flex: 1;
      max-width: calc((100% - 10px)/2);
      line-height: 32px;
      border: 1px solid $lineColor;
      color: $subFontColor;
      border-radius: 5px;
      text-align: center;
      &:nth-child(1){
        border-radius: 8px 30px 30px 8px;
      }
      &:nth-child(2){
        border-radius: 30px 8px 8px 30px;
      }
    }
    .selected_nav{
      // background-color: $mainColor;
      color: var(--selected-nav-color);
      border-color: transparent;
      font-weight: 600;
    }
  }
  .release_box{
    margin-top: 15px;
    .van-stepper{
      margin-top: 10px;
      border: 1px solid $lineColor;
      display: flex;
      align-items: center;
      border-radius: 2px;
      padding: 0 5px;
    }
    button{
      margin-top: 10px;
      color: var(--selected-nav-color);
      height: 36px;
      line-height: 36px;
      border-radius: 4px;
      border: none;
      text-align: center;
      width: 100%;
      font-size: 15px;
      font-weight: 600;
    }
  }
  .trade_type_box{
    display: inline-block;
    font-size: 12px;
    // color: $subFontColor;
    i{
      font-size: 14px;
    }
  }
  .cny_box,.usable_box{
    height: 20px;
    line-height: 20px;
    margin-top: 5px;
    font-size: 12px;
    color: $subFontColor;
  }
  .price_readonly_box{
    margin-top: 10px;
    height: 38px;
    line-height: 38px;
    border: 1px solid $lineColor;
    padding: 0 5px;
    border-radius: 2px;
    text-align: center;
    opacity: .8;
  }
  .num_box{
    margin-top: 10px;
    height: 38px;
    border: 1px solid $lineColor;
    display: flex;
    align-items: center;
    padding: 0 5px;
    border-radius: 2px;
    input{
      flex: 1;
    }
    em{
      color: $subFontColor;
      font-size: 13px;
    }
  }
}

.slider_box{
  padding: 5px;
  .custom-step {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0 0 0 3px $placeholderColor;
    background-color: $fontColor;
  }
  .vue-slider-mark-label{
    color: $subFontColor;
  }
  .custom-step.active {
    box-shadow: 0 0 0 3px $mainColor;
    background-color: $blockColor;
  }
}

.right_box{
  flex: 1;
  margin-left: 12px;

  .right_header{
    font-size: 12px;
    color: $subFontColor;
    margin-bottom: 1px;
    height: 20px;
  }
  section{
    margin: 5px 0;
    h2{
      font-size: 18px;
      line-height: 24px;
      height: 24px;
    }
    p{
      line-height: 16px;
      font-size: 10px;
      color: $subFontColor;
      height: 16px;
    }
  }
  .list_box{
    height: 120px;
    overflow-y: auto;
    li{
      display: flex;
      align-items: center;
      line-height: 24px;
      height: 24px;
      font-size: 12px;
      em{
        flex: 1;
        max-width: 20px;
      }
      div{
        flex: 1;
        position: relative;
        height: 22px;
        // color: $subFontColor;
        p{
          position: absolute;
          width: 100%;
          box-sizing: border-box;
          padding-right: 4px;
        }
        i{
          position: absolute;
          top: 0;
          right: 0;
          height: 22px;
        }
      }
    }
  }

  .main_params{
    line-height: 18px;
    margin-top: 10px;
    font-size: 11px;
    div{
      font-size: 11px;
      height: 18px;
    }
    em{
      color: $subFontColor;
    }
  }
}

.left_popup{
  width: 80%;
  height: 100%;
  background-color: $blockColor;
}

.trade_list{
  margin-top: 8px;
  background-color: $blockColor;
  .title{
    padding: 10px 15px;
    border-bottom: 1PX solid rgba($lineColor,.5);
    span{
      font-size: 12px;
      color: $subFontColor;
      i{
        font-size: 14px;
      }
    }
  }
  ol{
    li{
      padding: 15px;
      border-bottom: 1px solid $lineColor;
      div{
        margin-bottom: 5px;
        h3{
          margin: 0 8px;
        }
        span{
          border-radius: 4px;
          font-size: 12px;
          padding: 2px 5px;
          text-align: center;
          color: $fontColor;
          line-height: 18px;
        }
        a{
          padding: 2px 0 2px 5px;
        }
        label{
          flex: 1;
          text-align: right;
        }
      }
      section{
        display: flex;
        line-height: 18px;
        label{
          flex: 1;
          &:nth-child(2){
            text-align: center;
          }
          &:nth-child(3){
            text-align: right;
          }
          span{
            display: block;
            margin-top: 10px;
            font-size: 10px;
            color: $subFontColor;
          }
          em{
            font-size: 12px;
            display: block;
          }
        }
      }
    }
  }
}
</style>
