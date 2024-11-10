<!--  -->
<template>
  <div class="contract block_bg">
    <div ref="contractTop" class="contract_top">
      <div class="coin_header flex_between">
        <label class="flex" @click="showLeftPopup()">
          <img src="@img/trade/icon_menu.png" alt="">
          <h3>{{ coinInfo.tradcoin }}/{{ coinInfo.maincoin }}</h3>
        </label>
        <em :class="[coinInfo.rise>=0?'green_color':'red_color']">{{ coinInfo.rise }}%</em>
        <i v-if="!coinInfo.isOptional" class="iconfont icon-star-o" @click="handleOptional()" />
        <i v-else class="iconfont icon-star main_color" @click="handleOptional()" />
        <i class="iconfont icon-k-line" @click="goDetails('contract')" />
        <i class="iconfont icon-record" @click="pushPath('/futuresRecord')" />
      </div>
      <ol class="trade_tab">
        <li :class="{'selected_tab':selectedTab==0}" @click="changeType(0)">{{ $t('tradeLang.lang135') }}</li>
        <li :class="{'selected_tab':selectedTab==1}" @click="changeType(1)">{{ $t('tradeLang.lang136') }}</li>
        <p v-show="selectedTab==1&&nowPosition.length" @click="closePositionSheet=true">{{ $t('tradeLang.lang137') }}</p>
      </ol>
    </div>

    <div ref="contractSwipe">
      <van-swipe v-if="pageIsload" ref="futuresSwipe" :show-indicators="false" :initial-swipe="initTab" :loop="false" @change="changeFuturesType">
        <van-swipe-item key="open">
          <div class="release_box ">
            <div class="left_box">
              <ol class="release_header">
                <li :class="[{'tab_active_1':tradeType==1},'text_hide']" @click="tradeType=1">{{ $t('tradeLang.lang28') }}</li>
                <li :class="[{'tab_active_2':tradeType==2},'text_hide']" @click="tradeType=2">{{ $t('tradeLang.lang29') }}</li>
              </ol>
              <div class="choose_box flex_between">
                <div @click="showModel=true">{{ modelData.name }} <i class="iconfont icon-down" /></div>
                <div @click="showLeverPopup()">{{ leverData.name }} <i class="iconfont icon-down" /></div>
              </div>
              <div class="input_price_box flex_between">
                <input v-model="price" v-input-line type="text" :readonly="priceReadonly" :placeholder="$t('tradeLang.lang7')+'('+coinInfo.maincoin+')'">
                <div @click="tradeStyleSheet=true">{{ tradeStyleData.name }} <i class="iconfont icon-down" /></div>
              </div>

              <div class="input_box flex_between">
                <input v-model="tradeNum" v-int-number v-input-line type="text" :placeholder="$t('tradeLang.lang6')">
                <em>{{ $t('tradeLang.lang140') }}</em>
              </div>
              <p v-if="!tradeNum" class="release_cost">1 {{ $t('tradeLang.lang140') }} = {{ coinInfo.unit }}{{ coinInfo.tradcoin }}</p>
              <p v-if="tradeNum" class="release_cost text_hide">{{ tradeNum }} {{ $t('tradeLang.lang140') }} = {{ coinInfo.unit*tradeNum|mathFloor1(8) }}{{ coinInfo.tradcoin }}</p>
              <div class="stop_box flex_between">
                <div><input v-model.trim="profitPrice" v-input-line type="number" :placeholder="$t('tradeLang.lang141')"></div>
                <div><input v-model.trim="lossPrice" v-input-line type="number" :placeholder="$t('tradeLang.lang142')"></div>
              </div>
              <ol class="num_stepper">
                <li class="click_active" @click="setStep(0.25)">25%</li>
                <li class="click_active" @click="setStep(0.50)">50%</li>
                <li class="click_active" @click="setStep(0.75)">75%</li>
                <li class="click_active" @click="setStep(1)">100%</li>
              </ol>

              <p class="release_tip flex_between"><em>{{ $t('tradeLang.lang42') }}</em> <span class="text_hide">{{ account.usable }} {{ coinInfo.maincoin }}</span></p>
              <p class="release_tip flex_between"><em>{{ $t('tradeLang.lang143') }}</em> <span class="text_hide">{{ bondNum|mathFloor(8) }} {{ coinInfo.maincoin }}</span></p>
              <p class="release_tip flex_between"><em>{{ $t('tradeLang.lang68') }}</em> <span class="text_hide">{{ gasNum|mathFloor(8) }} {{ coinInfo.maincoin }}</span></p>

              <button v-if="tradeType==1" class="release_btn green_bg" @click="releaseTrade()">{{ $t('tradeLang.lang28') }}</button>
              <button v-if="tradeType==2" class="release_btn red_bg" @click="releaseTrade()">{{ $t('tradeLang.lang29') }}</button>
            </div>
            <div class="right_box">
              <div class="right_header flex_between">
                <span>{{ $t('tradeLang.lang7') }}</span>
                <span>{{ $t('tradeLang.lang6') }}</span>
              </div>
              <ol class="list_box">
                <li v-for="(item,index) in sellList" :key="index+'sell'" @click="setPrice(item)">
                  <div>
                    <i :style="{'width':item.width+'%'}" class="red_transparent" />
                    <p class="flex_between">
                      <span class="red_color">{{ item.price|mathFloor(coinInfo.price_accuracy) }}</span>
                      <span>{{ item.amount }}</span>
                    </p>
                  </div>
                </li>
                <li v-for="n in (7-sellList.length>0?7-sellList.length:0)" :key="n">
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
                <!-- <p>≈{{coinInfo.cny|mathFloor(2)}} CNY</p> -->
              </section>
              <ol class="list_box">
                <li v-for="(item,index) in buyList" :key="index+'buy'" @click="setPrice(item)">
                  <div>
                    <i :style="{'width':item.width+'%'}" class="green_transparent" />
                    <p class="flex_between">
                      <span class="green_color">{{ item.price|mathFloor(coinInfo.price_accuracy) }}</span>
                      <span>{{ item.amount }}</span>
                    </p>
                  </div>
                </li>
                <li v-for="n in (7-buyList.length>0?7-buyList.length:0)" :key="n">
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

          <div class="trade_record">
            <div class="record_title flex_between">
              <p>{{ $t('tradeLang.lang144') }}</p>
              <span @click="pushPath('/futuresRecord')"><i class="iconfont icon-record" /> {{ $t('tradeLang.lang67') }}</span>
            </div>
            <div v-for="item in nowEntrust" :key="item.autoid" class="record_box van-hairline--top">
              <div class="record_top">
                <em v-if="item.type=='buy'" class="green_bg">{{ $t('tradeLang.lang145') }}·{{ item.tdMode=='lsolate'?$t('tradeLang.lang147'):$t('tradeLang.lang148') }}·{{ item.lever }}X</em>
                <em v-if="item.type=='sell'" class="red_bg">{{ $t('tradeLang.lang146') }}·{{ item.tdMode=='lsolate'?$t('tradeLang.lang147'):$t('tradeLang.lang148') }}·{{ item.lever }}X</em>
                <span>{{ item.tradcoin }}/{{ item.maincoin }}</span>
                <p>{{ item.wdate }}</p>
                <a @click="closeEntrustOrder(item)">{{ $t('tradeLang.lang111') }}</a>
              </div>
              <h3 class="record_price_box">{{ item.entrust_price }}</h3>
              <ol class="record_bottom">
                <li class="record_left">
                  <p>{{ $t('tradeLang.lang149') }}</p>
                  <span :class="[coinInfo.rise>=0?'green_color':'red_color']">{{ coinInfo.price }}</span>
                  <p>{{ $t('tradeLang.lang150') }}</p>
                  <span>{{ item.price||'--' }}</span>
                </li>
                <li class="record_center">
                  <p>{{ $t('tradeLang.lang151') }}</p>
                  <span>{{ item.number }}</span>
                  <p>{{ $t('tradeLang.lang152') }}</p>
                  <span>{{ item.unfilled }}</span>
                </li>
                <li class="record_right">
                  <p>{{ $t('tradeLang.lang153') }}</p>
                  <span>{{ item.style=='limit'?$t('tradeLang.lang109'):$t('tradeLang.lang110') }}</span>
                  <p>{{ $t('tradeLang.lang143') }}</p>
                  <span>{{ item.point||'--' }}</span>
                </li>
              </ol>
            </div>
            <div v-if="nowEntrust.length==0&&isload" class="no_data">
              <p class="icon_no_data" />
              <span>{{ $t('commonLang.lang5') }}</span>
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item key="position">
          <ol v-for="item in nowPosition" :key="item.autoid" class="position_box" @click="showPosterPopup(item)">
            <li class="position_top flex_between">
              <h2>{{ item.tradcoin }}/{{ item.maincoin }}</h2>
              <i>{{ item.wdate }}</i>
              <em v-if="item.type=='buy'" class="green_bg">{{ $t('tradeLang.lang145') }}·{{ item.tdMode=='lsolate'?$t('tradeLang.lang147'):$t('tradeLang.lang148') }}·{{ item.lever }}X</em>
              <em v-if="item.type=='sell'" class="red_bg">{{ $t('tradeLang.lang146') }}·{{ item.tdMode=='lsolate'?$t('tradeLang.lang147'):$t('tradeLang.lang148') }}·{{ item.lever }}X</em>
            </li>
            <li v-if="item.type=='buy'" class="profit_box flex_between">
              <!--(当前-建仓)*unit*张数-->
              <div>
                <p>{{ $t('tradeLang.lang233') }}({{ item.maincoin }})</p>
                <h3 :class="[((coinInfo.price-item.price)*coinInfo.unit*item.number)>=0?'green_color':'red_color']">{{ ((coinInfo.price-item.price)*coinInfo.unit*item.number)|mathFloor(4) }}</h3>
              </div>
              <div>
                <p>{{ $t('tradeLang.lang234') }}</p>
                <h3 :class="[((coinInfo.price-item.price)*coinInfo.unit*item.number)>=0?'green_color':'red_color']">{{(((coinInfo.price-item.price)*coinInfo.unit*item.number)*100/item.position)|mathFloor(2)||'--'}}%</h3>
              </div>
            </li>
            <li v-if="item.type=='sell'" class="profit_box flex_between">
              <!--(建仓-当前)*unit*张数-->
              <div>
                <p>{{ $t('tradeLang.lang233') }}({{ item.maincoin }})</p>
                <h3 :class="[((item.price-coinInfo.price)*coinInfo.unit*item.number)>=0?'green_color':'red_color']">{{ ((item.price-coinInfo.price)*coinInfo.unit*item.number)|mathFloor(4) }}</h3>
              </div>
              <div>
                <p>{{ $t('tradeLang.lang234') }}</p>
                <h3 :class="[((item.price-coinInfo.price)*coinInfo.unit*item.number)>=0?'green_color':'red_color']">{{(((item.price-coinInfo.price)*coinInfo.unit*item.number)*100/item.position)|mathFloor(2)||'--'}}%</h3>
              </div>
            </li>
            <li class="position_center flex_between">
              <div>
                <span>{{ $t('tradeLang.lang150') }}({{ item.maincoin }})</span>
                <p>{{ item.price||'--' }}</p>
                <span>{{ $t('tradeLang.lang154') }}</span>
                <p v-if="item.point>0">{{ item.point||'--' }}</p>
                <p v-else>--</p>
              </div>
              <div>
                <span>{{ $t('tradeLang.lang161') }}</span>
                <p>{{ item.profit||'--' }}</p>
                <span>{{ $t('tradeLang.lang68') }}</span>
                <p>{{ item.gas||'--' }}</p>
              </div>
              <div>
                <span>{{ $t('tradeLang.lang151') }}</span>
                <p>{{ item.number||'--' }}</p>
                <span>{{ $t('tradeLang.lang155a') }}</span>
                <p>{{ item.fess||'--' }}</p>
              </div>
            </li>
            <li class="position_btn flex_between">
              <van-button @click.stop="showStopPopup(item)">{{ $t('tradeLang.lang157') }}({{ item.profitOrder }})</van-button>
              <van-button @click.stop="closePositionOrder(item)">{{ $t('tradeLang.lang158') }}</van-button>
              <van-button @click.stop="showClosePopup(item)">{{ $t('tradeLang.lang159') }}</van-button>
            </li>
          </ol>
          <div v-if="nowPosition.length==0&&positionLaod" class="no_data">
            <p class="icon_no_data" />
            <span>{{ $t('commonLang.lang5') }}</span>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- </van-pull-refresh> -->
    <van-action-sheet v-model="showModel" :actions="modelList" :cancel-text="$t('commonLang.lang1')" @select="onSelectModel" />
    <van-action-sheet v-model="leverPopup" :actions="leverList" :cancel-text="$t('commonLang.lang1')" @select="onSelectLever" />
    <van-action-sheet v-model="tradeStyleSheet" :actions="tradeStyleList" :cancel-text="$t('commonLang.lang1')" @select="onSelectStyle" />
    <van-action-sheet v-model="closePositionSheet" :actions="closeActions" :cancel-text="$t('commonLang.lang1')" @select="onSelectClose" />

    <van-popup v-model="closePopup" position="bottom" class="change_profit_popup">
      <div class="change_profit_title"><h3>{{ $t('tradeLang.lang159') }}</h3> <i class="iconfont icon-close" @click="closePopup=false" /></div>
      <ol>
        <li class="flex_between">
          <span>{{ positionData.tradcoin }}/{{ positionData.maincoin }}</span>
          <p>
            <em v-if="positionData.type=='buy'" class="green_color">{{ $t('tradeLang.lang145') }}·{{ positionData.tdMode=='lsolate'?$t('tradeLang.lang147'):$t('tradeLang.lang148') }}·{{ positionData.lever }}X</em>
            <em v-if="positionData.type=='sell'" class="red_color">{{ $t('tradeLang.lang146') }}·{{ positionData.tdMode=='lsolate'?$t('tradeLang.lang147'):$t('tradeLang.lang148') }}·{{ positionData.lever }}X</em>
          </p>
        </li>
        <li class="flex_between">
          <span>{{ $t('tradeLang.lang160') }}</span>
          <p>{{ positionData.unfilled }}</p>
        </li>
        <li class="flex_between">
          <span>{{ $t('tradeLang.lang161') }}</span>
          <p>{{ positionData.profit }} {{ positionData.maincoin }}</p>
        </li>
      </ol>
      <div class="add_profit">
        <span>{{ $t('tradeLang.lang162') }}</span>
        <div class="flex_between">
          <input v-model.trim="closeNum" v-input-line type="number" :placeholder="$t('tradeLang.lang163')">
          <em class="main_color" @click="closeNum = positionData.unfilled">{{ $t('tradeLang.lang67') }}</em>
        </div>
      </div>
      <button @click="confirmClose()">{{ $t('commonLang.lang3') }}</button>
    </van-popup>

    <van-popup ref="leftPopup" v-model="leftPopup" position="left" safe-area-inset-bottom get-container="#app" :lazy-render="false" class="left_popup">
      <div class="left_title">{{ $t('tradeLang.lang164') }}</div>
      <ol>
        <li v-for="item in coinList" :key="item.tradcoin" :class="[{'coin_selected':coinInfo.tradcoin == item.tradcoin},'flex_between van-hairline--bottom']" @click="chooseCoin(item)">
          <div><span>{{ item.tradcoin.toUpperCase() }}/{{ item.maincoin.toUpperCase() }}</span></div>
          <p :class="[item.rise>=0?'red_color':'green_color']">{{ item.price }}</p>
        </li>
      </ol>
    </van-popup>

    <div v-if="historyPopup" class="history_popup">
      <div class="overlay_box" @click="historyPopup=false" />
      <poster v-if="historyKey" :key="historyKey" :order-data="historyData" />
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import poster from './components/poster'
import { mapState } from 'vuex'
import { futuresSymbols, contractCoinInfo, contractLever, contractAccount,
  buyLimit, sellLimit, buyMarket, sellMarket, closeEntrust, positionOrderByCoin, closePosition, closeCoinPosition } from '@api/futures'
export default {
  components: { poster },
  data() {
    return {
      pageIsload: false,

      isOpenContract: 1, // 1：未开通合约，0：已开通合约
      leftPopup: false,
      coinList: [],
      coinInfo: {},

      selectedTab: sessionStorage.getItem('contractActive') || 0,
      initTab: sessionStorage.getItem('contractActive') || 0,

      tradeType: sessionStorage.getItem('contractType') || 1,
      account: {},

      price: '',
      priceReadonly: false,
      tradeNum: '',
      bondNum: '',
      gasNum: '',

      profitPrice: '',
      lossPrice: '',

      tradeStyleSheet: false,
      tradeStyleData: {
        name: this.$t('tradeLang.lang110'),
        tradeStyle: 'market'
      },
      tradeStyleList: [
        { name: this.$t('tradeLang.lang109'), tradeStyle: 'limit' },
        { name: this.$t('tradeLang.lang110'), tradeStyle: 'market' }
      ],

      showModel: false,
      modelList: [{ name: this.$t('tradeLang.lang148'), type: 'cross' }, { name: this.$t('tradeLang.lang147'), type: 'lsolate' }],
      modelData: { name: this.$t('tradeLang.lang148'), type: 'cross' },

      leverPopup: false,
      leverList: [],
      leverData: {},

      sellList: [],
      buyList: [],

      countDownTime: 0,

      nowEntrust: [],
      isload: true,

      nowPosition: [],
      positionLaod: false,

      positionData: {},

      closePopup: false,
      closeNum: '',

      timeoutObj: null,
      timeoutPositionObj: null,

      closePositionSheet: false,
      closeActions: [
        { name: this.$t('tradeLang.lang165'), type: 'all' },
        { name: this.$t('tradeLang.lang166'), type: 'buy' },
        { name: this.$t('tradeLang.lang167'), type: 'sell' }
      ],

      historyPopup: false,
      historyData: {},
      historyKey: ''
    }
  },

  computed: {
    ...mapState({
      marketSocketData: state => state.trade.marketSocketData,
      contractSocketData: state => state.trade.contractSocketData
    })
  },

  watch: {
    // 监听socket 数据  实时更新
    contractSocketData(data) {
      // 更新币种数据
      if (data.coninfo && this.coinInfo && this.coinInfo.tradcoin) {
        // 判断接收到的数据是否是当前币种数据 不是就不赋值
        if (data.coninfo.autoid == this.coinInfo.autoid) {
          this.setData(data)
        }
      }
    },
    // 监听socket 数据  实时更新
    marketSocketData(data) {
      // 更新行情
      data.consymbols && (this.coinList = data.consymbols)
    },

    tradeNum() {
      this.calcBondNum()
    },
    price() {
      this.calcBondNum()
    },

    selectedTab(val) {
      sessionStorage.setItem('contractActive', val)
    },

    tradeType(val) {
      sessionStorage.setItem('contractType', val)
    }
  },
  beforeDestroy() {
    this.timeoutObj && clearTimeout(this.timeoutObj)
    this.timeoutPositionObj && clearTimeout(this.timeoutPositionObj)
  },

  created() {
    if (this.contractSocketData && this.contractSocketData.coninfo) {
      if (this.marketSocketData && this.marketSocketData.consymbols) {
        this.initCoinList(this.marketSocketData.consymbols, 1)
      } else {
        this.getCoinList()
      }
    } else {
      this.getCoinList()
    }
  },

  mounted() {
    setTimeout(() => {
      const tradeTop = this.$parent.$refs.tradeTop
      const contractTop = this.$refs.contractTop
      contractTop.style.top = `${tradeTop.clientHeight}px`
      this.$refs.contractSwipe.style.marginTop = `${tradeTop.clientHeight + contractTop.clientHeight}px`
      const tabbarHeight = document.getElementsByClassName('van-tabbar')[0].clientHeight
      document.getElementsByTagName('body')[0].style.setProperty('--contract-fixed-height', `${tradeTop.clientHeight + contractTop.clientHeight + tabbarHeight}px`)
      this.pageIsload = true
    }, 10)
  },

  methods: {
    showLeftPopup() {
      this.leftPopup = true
      const leftPopup = this.$refs.leftPopup.$el
      leftPopup.style.paddingTop = `${this.$barHeight}px`
    },
    onRefresh() {
      window.location.reload()
    },
    changeFuturesType(index) {
      this.selectedTab = index
    },
    changeType(item) {
      this.selectedTab = item
      this.$refs.futuresSwipe.swipeTo(item)
      this.$refs.futuresSwipe.resize()
    },
    initCoinList(resData, type) {
      let futuresCoinParams, coinData
      this.coinList = resData
      futuresCoinParams = JSON.parse(sessionStorage.getItem('futuresCoinParams')) || {}
      // 检查上次是否已经操作过选择币种 浏览器记住了上次选择的币种 本次默认上次选择币种;
      if (Object.keys(futuresCoinParams).length) {
        coinData = futuresCoinParams
      } else {
        coinData = this.coinList[0]
        sessionStorage.setItem('futuresCoinParams', JSON.stringify(coinData))
      }
      if (type == 1) {
        if (this.contractSocketData.coninfo.autoid == coinData.autoid) {
          // 如果ws有数据 取ws的数据 不调接口
          this.setCoinInfo(this.contractSocketData)
        } else {
          this.getCoinInfo(coinData)
        }
      } else {
        this.getCoinInfo(coinData)
      }

      // 更新账户信息
      this.updateAccountData(coinData)
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
        const key = `${coinData.maincoin}_${coinData.tradcoin}_contract_1`
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

    // 获取交易币种列表
    getCoinList() {
      futuresSymbols().then(res => {
        this.initCoinList(res.data)
      })
    },

    // 获取交易币种信息
    getCoinInfo(data) {
      contractCoinInfo({
        maincoin: data.maincoin,
        tradcoin: data.tradcoin
      }).then(res => {
        const resData = {
          coninfo: res.data.info,
          conbuy: res.data.buy,
          consell: res.data.sell
        }
        this.setCoinInfo(resData)
      })
    },
    setCoinInfo(resData) {
      this.coinInfo = resData.coninfo
      // this.countDownTime = new Date(this.coinInfo.enddate).getTime() - new Date().getTime()

      // 设置默认杠杆倍数
      this.leverData = {
        name: `${this.coinInfo.max_lever}X`,
        lever: this.coinInfo.max_lever
      }
      // 设置数据
      this.setData(resData)
    },

    setData(resData) {
      const optionalData = JSON.parse(localStorage.getItem('optionalFuturesData')) || []
      resData.coninfo.stringName = `${resData.coninfo.tradcoin}/${resData.coninfo.maincoin}`
      optionalData.forEach(id => {
        resData.coninfo.isOptional = resData.coninfo.autoid == id
      })
      this.coinInfo = resData.coninfo
      if (this.tradeStyleData.tradeStyle == 'market') {
        this.price = resData.coninfo.price
        this.priceReadonly = true
      } else {
        this.priceReadonly = false
      }

      // 传递给档位图做初始化渲染
      this.setGearMap(resData)
    },

    // 操作自选收藏
    handleOptional() {
      this.$set(this.coinInfo, 'isOptional', !this.coinInfo.isOptional)

      // 重置缓存中的coinInfo数据，更新自选
      sessionStorage.setItem('futuresCoinParams', JSON.stringify(this.coinInfo))

      // 更新coinList 中的自选状态
      this.coinList.forEach(data => {
        if (data.autoid == this.coinInfo.autoid) {
          data.isOptional = !data.isOptional
        }
      })

      // 获取缓存中的自选数据
      let optionalData = JSON.parse(localStorage.getItem('optionalFuturesData')) || []

      // 如果币种当前状态为 已自选状态 直接添加进缓存中数据
      if (this.coinInfo.isOptional) {
        optionalData.push(this.coinInfo.autoid)
      } else {
        // 过滤掉取消自选的币种数据
        optionalData = optionalData.filter((id) => !(id == this.coinInfo.autoid))
      }
      localStorage.setItem('optionalFuturesData', JSON.stringify(optionalData))
    },

    // 行情 kline 详情
    goDetails(type) {
      sessionStorage.setItem('marketDetails', JSON.stringify(this.coinInfo))
      this.pushPath('/marketDetails/' + type)
    },

    setPrice(data) {
      if (this.tradeStyleData.tradeStyle != 'market') {
        this.price = data.price
        this.priceReadonly = false
      }
    },

    // 设置档位图数据
    setGearMap(mapData) {
      const tradeList = mapData
      let sellTotal = 0
      tradeList.consell.map(data => {
        sellTotal += (data.amount * data.price)
      })
      tradeList.consell.map(data => {
        data.width = (data.amount * data.price * 800) / sellTotal
        if (data.width > 100) { data.width = 100 }
      })
      if (tradeList.consell.length > 20) {
        tradeList.consell.length = 20
      }

      this.sellList = tradeList.consell.reverse()

      let buyTotal = 0
      tradeList.conbuy.map(data => {
        buyTotal += (data.amount * data.price)
      })
      tradeList.conbuy.map(data => {
        data.width = (data.amount * data.price * 800) / buyTotal
        if (data.width > 100) { data.width = 100 }
      })
      this.buyList = tradeList.conbuy
    },

    // 展示杠杆倍数选择
    showLeverPopup() {
      if (!this.leverList.length) {
        this.getLever()
      } else {
        this.leverPopup = true
      }
    },

    // 获取杠杆倍数
    getLever() {
      contractLever({
        maincoin: this.coinInfo.maincoin,
        tradcoin: this.coinInfo.tradcoin
      }).then(res => {
        res.data.forEach(data => {
          data.name = `${data.lever}X`
        })
        this.leverList = res.data
        this.leverPopup = true
      })
    },

    // 获取币种资产和挂单记录
    getAccount(coinData) {
      contractAccount({
        maincoin: coinData.maincoin,
        tradcoin: coinData.tradcoin
      }).then(res => {
        this.isload = true
        this.account = res.data.balance
        this.account.usable = Math.max(this.account.usable, 0)
        this.nowEntrust = res.data.entrust_order
        this.positionByCoin(coinData)// 获取持仓记录
        this.timeoutObj && clearTimeout(this.timeoutObj)
        if (this.nowEntrust.length > 0) {
          this.timeoutObj = setTimeout(() => {
            if (this.$route.name == 'trade') {
              this.getAccount(coinData)
            }
          }, 3000)
        }
      })
    },

    chooseCoin(coinData) {
      this.leftPopup = false
      // 选择的当前币种  不处理
      if (coinData.autoid == this.coinInfo.autoid) {
        return
      }
      // 更新币种信息；
      this.coinInfo = coinData
      sessionStorage.setItem('futuresCoinParams', JSON.stringify(coinData))

      // 重新获取选中币种信息和账户信息
      this.getCoinInfo(coinData)
      this.timeoutObj && clearTimeout(this.timeoutObj)
      this.updateAccountData(coinData)
      this.leverList = []
    },

    // 选择逐仓全仓
    onSelectModel(data) {
      this.modelData = data
      this.showModel = false
    },

    // 选择倍数
    onSelectLever(data) {
      this.leverData = data
      this.leverPopup = false
    },
    // 选择限价市价
    onSelectStyle(data) {
      this.tradeStyleData = data
      if (data.tradeStyle == 'market') {
        this.price = this.coinInfo.price
        this.priceReadonly = true
      } else {
        this.priceReadonly = false
      }
      this.tradeStyleSheet = false
    },

    setStep(lever) {
      if (this.account.usable <= 0) { return }
      if (!this.price) {
        return
      } else if (isNaN(this.price)) {
        return
      } else if (this.price <= 0) {
        return
      }

      let tradeNum = (this.account.usable * lever) / (this.price * this.coinInfo.unit * (1 / this.leverData.lever + Number(this.coinInfo.gas)))
      tradeNum = Math.floor(tradeNum)
      if (tradeNum) {
        this.tradeNum = tradeNum
      }
    },

    calcBondNum() {
      if (!this.price) {
        return
      } else if (isNaN(this.price)) {
        return
      } else if (this.price <= 0) {
        return
      }
      if (!this.tradeNum) {
        return
      } else if (!this.$utils.isInt(this.tradeNum)) {
        return
      } else if (this.tradeNum < Number(this.coinInfo.minnumber)) {
        return
      }
      const bondNum = this.price * this.tradeNum * this.coinInfo.unit
      if (this.account.usable >= (bondNum / this.leverData.lever + bondNum * this.coinInfo.gas)) {
        this.bondNum = (bondNum / this.leverData.lever)
        this.gasNum = bondNum * this.coinInfo.gas
      } else {
        this.bondNum = ''
        this.gasNum = ''
      }
    },

    releaseTrade() {
      if (this.tradeStyleData.tradeStyle == 'limit') {
        if (!this.price) {
          Toast(this.$t('tradeLang.lang168'))
          return
        } else if (!this.$utils.isCorrectFigure(this.price)) {
          Toast(this.$t('tradeLang.lang169'))
          return
        }
      }

      if (!this.tradeNum) {
        Toast(this.$t('tradeLang.lang170'))
        return
      } else if (!this.$utils.isInt(this.tradeNum)) {
        Toast(this.$t('tradeLang.lang171'))
        return
      }
      if (this.tradeNum < Number(this.coinInfo.minnumber)) {
        if (this.tradeType == 1) {
          Toast(this.$t('tradeLang.lang128', { min: this.coinInfo.minnumber }))
        } else {
          Toast(this.$t('tradeLang.lang131', { min: this.coinInfo.minnumber }))
        }
        return
      }
      if (this.tradeNum > Number(this.coinInfo.maxnumber)) {
        if (this.tradeType == 1) {
          Toast(this.$t('tradeLang.lang172', { max: this.coinInfo.maxnumber }))
        } else {
          Toast(this.$t('tradeLang.lang173', { max: this.coinInfo.maxnumber }))
        }
        return
      }

      const price = this.tradeStyleData.tradeStyle == 'limit' ? this.price : this.coinInfo.price

      if (this.tradeType == 1) {
        if (this.profitPrice && Number(this.profitPrice) <= Number(price)) {
          Toast(this.$t('tradeLang.lang174'))
          return
        }
        if (this.lossPrice && Number(this.lossPrice) >= Number(price)) {
          Toast(this.$t('tradeLang.lang175'))
          return
        }
      } else {
        if (this.profitPrice && Number(this.profitPrice) >= Number(price)) {
          Toast(this.$t('tradeLang.lang176'))
          return
        }
        if (this.lossPrice && Number(this.lossPrice) <= Number(price)) {
          Toast(this.$t('tradeLang.lang177'))
          return
        }
      }

      if (!this.bondNum) {
        Toast(this.$t('tradeLang.lang89'))
        return
      }

      Dialog.confirm({
        message: this.tradeType == 1
        // ?`是否开多${this.tradeNum} ${this.coinInfo.tradcoin}，保证金约为${(this.bondNum + this.gasNum).toFixed(4)}${this.coinInfo.maincoin}`
        // :`是否开空${this.tradeNum} ${this.coinInfo.tradcoin}，保证金约为${(this.bondNum + this.gasNum).toFixed(4)}${this.coinInfo.maincoin}`,
          ? this.$t('tradeLang.lang178', { tradeNum: this.tradeNum, bondNum: (this.bondNum + this.gasNum).toFixed(4), tradeCoin: this.coinInfo.tradcoin, mainCoin: this.coinInfo.maincoin })
          : this.$t('tradeLang.lang179', { tradeNum: this.tradeNum, bondNum: (this.bondNum + this.gasNum).toFixed(4), tradeCoin: this.coinInfo.tradcoin, mainCoin: this.coinInfo.maincoin }),
        confirmButtonText: this.$t('commonLang.lang9'),
        cancelButtonText: this.$t('commonLang.lang1')
      }).then(() => {
        const params = {
          maincoin: this.coinInfo.maincoin,
          tradcoin: this.coinInfo.tradcoin,
          price: price,
          profitPrice: this.profitPrice,
          lossPrice: this.lossPrice,
          number: this.tradeNum,
          lever: this.leverData.lever,
          style: this.tradeStyleData.tradeStyle,
          tdMode: this.modelData.type
        }
        if (this.tradeStyleData.tradeStyle == 'limit') {
          if (this.tradeType == 1) {
            buyLimit(params).then(res => {
              Toast(res.msg)
              this.tradeNum = ''
              this.bondNum = ''
              this.gasNum = ''
              this.updateAccountData(this.coinInfo)
            })
          } else {
            sellLimit(params).then(res => {
              Toast(res.msg)
              this.tradeNum = ''
              this.bondNum = ''
              this.gasNum = ''
              this.updateAccountData(this.coinInfo)
            })
          }
        } else {
          if (this.tradeType == 1) {
            buyMarket(params).then(res => {
              Toast(res.msg)
              this.tradeNum = ''
              this.bondNum = ''
              this.gasNum = ''
              this.updateAccountData(this.coinInfo)
            })
          } else {
            sellMarket(params).then(res => {
              Toast(res.msg)
              this.tradeNum = ''
              this.bondNum = ''
              this.gasNum = ''
              this.updateAccountData(this.coinInfo)
            })
          }
        }
      }).catch(() => {})
    },

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
    },

    positionByCoin(coinData) {
      this.timeoutPositionObj && clearTimeout(this.timeoutPositionObj)
      positionOrderByCoin({
        maincoin: coinData.maincoin,
        tradcoin: coinData.tradcoin
      }).then(res => {
        this.positionLaod = true
        this.nowPosition = res.data
        if (this.nowEntrust.length > 0 || this.nowPosition.length > 0) {
          this.timeoutPositionObj = setTimeout(() => {
            if (this.$route.name == 'trade') {
              this.positionByCoin(coinData)
            }
          }, 3000)
        }
      })
    },

    showStopPopup(data) {
      sessionStorage.setItem('plOrder', JSON.stringify(data))
      this.pushPath('/stopPl')
    },

    showClosePopup(data) {
      this.closeNum = ''
      this.positionData = data
      this.closePopup = true
    },
    confirmClose() {
      if (!this.closeNum) {
        Toast(this.$t('tradeLang.lang163'))
        return
      } else if (!this.$utils.isInt(this.closeNum)) {
        Toast(this.$t('tradeLang.lang171'))
        return
      } else if (this.closeNum < 0) {
        Toast(this.$t('tradeLang.lang127'))
        return
      }
      closePosition({
        autoid: this.positionData.autoid,
        number: this.closeNum
      }).then(res => {
        Toast(res.msg)
        this.closePopup = false
        this.positionByCoin(this.coinInfo)
      })
    },
    closePositionOrder(data) {
      Dialog.confirm({
        message: this.$t('tradeLang.lang180'),
        confirmButtonText: this.$t('commonLang.lang9'),
        cancelButtonText: this.$t('commonLang.lang1')
      }).then(() => {
        closePosition({
          autoid: data.autoid,
          number: data.unfilled
        }).then(res => {
          Toast(res.msg)
          this.positionByCoin(this.coinInfo)
        })
      }).catch(() => {})
    },

    onSelectClose(data) {
      this.closePositionSheet = false
      closeCoinPosition({
        coin: this.coinInfo.tradcoin,
        type: data.type
      }).then(res => {
        Toast(res.msg)
        this.positionByCoin(this.coinInfo)
      })
    },

    showPosterPopup(data) {
      this.historyData = data
      this.historyKey = Date.now()
      this.historyPopup = true
    }
  }
}
</script>
<style>
:root {
  --contract-fixed-height: 218px;
}
</style>
<style lang='scss' scoped>
// $fixedHeight: var(--contract-fixed-height);
.contract{
  // position: absolute;
  // left: 0;
  // bottom: 0;
  // width: 100%;
  .contract_top{
    position: fixed;
    left: 0;
    width: 100%;
    z-index: 100;
    background-color: $bgColor;
  }
  .coin_header{
    padding: 8px 15px 14px;
    height: 42px;
    width: 100%;
    span{
      display: inline-block;
      line-height: 20px;
      font-weight: bold;
      vertical-align: bottom;
    }
    img{
      width: 18px;
      height: 18px;
      margin-right: 8px;
    }
    i{
      font-size: 20px;
      margin-left: 10px;
    }
    em{
      flex: 1;
      text-align: right;
    }
  }
  .trade_tab{
    width: 100%;
    padding: 10px 15px;
    border-bottom: 1Px solid rgba($lineColor,.5);
    background-color: $blockColor;
    border-radius: 20px 20px 0 0;
    overflow: hidden;
    li{
      display: inline-block;
      color: $subFontColor;
      line-height: 24px;
      margin-right: 25px;
      font-weight: 600;
    }
    .selected_tab{
      font-size: 20px;
      color: $mainColor;
    }
    p{
      float: right;
      margin-top: 5px;
      line-height: 20px;
    }
  }
  .van-swipe{
    overflow: hidden;
    .van-swipe-item{
      // height: var(--contract-fixed-height);
      max-height: calc(100vh - var(--contract-fixed-height));
      overflow-y: auto;
    }
  }
  .release_box{
    padding: 15px;
    display: flex;
    justify-content: space-between;
    .left_box{
      flex: 1;
      max-width: 175px;
      min-width: 175px;
      .release_header{
        display: flex;
        line-height: 32px;
        overflow: hidden;
        border: 1Px solid $lineColor;
        margin: auto;
        li{
          flex: 1;
          text-align: center;
          border: 0.5Px solid $bgColor;
          font-weight: 600;
          color: $subFontColor;
        }
        .tab_active_1{
          border: 0.5Px solid $greenColor;
          color: $greenColor;
          font-weight: 600;
        }
        .tab_active_2{
          border: 0.5Px solid $redColor;
          color: $redColor;
          font-weight: 600;
        }
      }
      .choose_box{
        margin: 15px 0px 0;
        line-height: 20px;
        font-size: 13px;
        color: $subFontColor;
        div{
          flex:1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px 0;
          border-radius: 4px;
          border: 1px solid rgba($lineColor,.5);
          &:first-child{
            margin-right: 10px;
          }
        }
        i{
          margin-left: 5px;
          font-size: 14px;
        }
      }
      .stop_box{
        margin: 10px 0px;
        line-height: 20px;
        font-size: 12px;
        div{
          padding: 5px 8px;
          border-radius: 4px;
          border: 1px solid rgba($lineColor,.5);
          &:first-child{
            margin-right: 10px;
          }
        }
      }
      .input_price_box{
        margin-top: 10px;
        border-radius: 4px;
        padding: 8px;
        border: 1Px solid $lineColor;
        line-height: 20px;
        font-size: 13px;
        input{
          flex: 1;
        }
        i{
          font-size: 14px;
        }
      }
      .input_box{
        margin-top: 10px;
        border-radius: 4px;
        padding: 8px;
        border: 1Px solid $lineColor;
        line-height: 20px;
        font-size: 13px;
        input{
          flex: 1;
          margin-right: 5px;
        }
      }
      .release_cost{
        margin-top: 5px;
        font-size: 10px;
        color: $subFontColor;
        height: 16px;
        line-height: 16px;
      }
      .num_stepper{
        margin: 10px 0;
        display: flex;
        align-items: center;
        border: 1Px solid $lineColor;
        border-radius: 2px;
        li{
          flex: 1;
          font-size: 12px;
          padding: 7px 0;
          text-align: center;
          color: $subFontColor;
          border-right: 1Px solid $lineColor;
          line-height: 16px;
          &:last-child{
            border-right: none;
          }
        }
        .click_active{
          &:active{
            background-color: rgba($bgColor, 0.8)!important;
          }
        }
      }
      .release_tip{
        line-height: 20px;
        font-size: 12px;
        em{
          // flex: 1;
          // max-width: 44px;
          color: $subFontColor;
        }
        span{
          flex: 1;
          text-align: right;
        }
      }
      .release_btn{
        line-height: 44px;
        width: 100%;
        color: var(--selected-nav-color);
        margin-top: 10px;
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 1px;
        border-radius: 3px;
      }
    }

    .right_box{
      flex: 1;
      margin-left: 15px;

      .right_header{
        font-size: 12px;
        color: $subFontColor;
        margin-bottom: 5px;
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
        height: 168px;
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
            color: $subFontColor;
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
  }

  .trade_record{
    border-top: 8px solid $bgColor;
  }
  .record_title{
    padding: 15px;
    border-bottom: 1px solid rgba($lineColor,.2);
    span{
      color: $subFontColor;
      font-size: 12px;
      i{
        font-size: 14px;
      }
    }
  }
  .record_box{
    padding: 15px;
    .record_top{
      display: flex;
      align-items: center;
      em{
        // flex: 1;
        // max-width: 36px;
        border-radius: 4px;
        font-size: 12px;
        line-height: 18px;
        padding: 2px 5px;
        text-align: center;
        color: $fontColor;
      }
      span{
        flex: 1;
        margin-left: 10px;
        font-size: 15px;
        font-weight: 600;
      }
      p{
        font-size: 12px;
        color: $subFontColor;
      }
      a{
        // flex: 1;
        // max-width: 45px;
        font-size: 13px;
        text-align: right;
        margin-left: 5px;
        color: $mainColor;
      }
    }
    .record_price_box{
      margin: 10px 0 5px;
    }
    .record_center{
      text-align: center;
    }
    .record_bottom{
      display: flex;
      align-items: center;
      li{
        flex: 1;
        font-size: 13px;
        line-height: 24px;
        p{
          font-size: 12px;
          color: $subFontColor;
        }
        &:last-child{
          text-align: right;
        }
      }

    }
  }

  .position_box{
    padding: 15px;
    border-bottom: 1px solid $lineColor;
    .position_top{
      line-height: 20px;
      margin-bottom: 15px;
      h2{
        font-size: 15px;
      }
      i{
        flex:1;
        text-align: right;
        font-size: 12px;
        margin-right: 10px;
        color: $subFontColor;
      }
      em{
        border-radius: 4px;
        font-size: 12px;
        padding: 2px 5px;
        text-align: center;
        color: $fontColor;
      }
    }
    .profit_box{
      padding-bottom: 8px;
      border-bottom: 1px solid rgba($lineColor,.5);
      div:last-child{
        text-align: right;
      }
      p{
        font-size: 12px;
        line-height: 20px;
        color: $subFontColor;
        margin-bottom: 5px;
      }
      h3{
        font-size: 24px;
        line-height: 28px;
      }
    }
    .position_center{
      padding-top: 8px;
      div{
        flex: 1;
        line-height: 22px;
        font-size: 12px;
        &:nth-child(2){
          text-align: center;
        }
        &:last-child{
          text-align: right;
        }
        span{
          color: $subFontColor;
        }
      }
    }
    .position_btn{
      margin-top: 15px;
      button{
        background-color: rgba($mainColor,1);
        color: var(--fontColor);
        height: 28px;
        line-height: 1;
        font-size: 12px;
        border-radius: 2px;
        border: none;
        flex:1;
        margin-right: 12px;
        &:last-child{
          margin-right: 0;
        }
      }
    }
  }
}
.left_popup{
  width: 80%;
  height: 100%;
  .left_title{
    padding: 15px 15px 0;
    font-weight: 600;
    font-size: 15px;
    line-height: 30px;
  }
  ol{
    li{
      padding: 20px 15px;
      // border-bottom: 1px solid $lineColor;
    }
  }
  .coin_selected{
    background-color: $bgColor;
  }
}

.change_profit_popup{
  width: 100%;
  padding: 0 15px 15px;
  .change_profit_title{
    padding: 10px 0;
    line-height: 24px;
    display: flex;
    align-items: center;
    h3{
      flex: 1;
      text-align: center;
      margin-left: 24px;
    }
    i{
      flex: 1;
      max-width: 24px;
      font-size: 20px;
    }
  }
  ol{
    margin-top: 15px;
    line-height: 30px;
    font-size: 13px;
    span{
      color: $subFontColor;
    }
  }
  .add_profit{
    line-height: 30px;
    font-size: 13px;
    span{
      color: $subFontColor;
    }
    div{
      margin: 5px 0;
      border: 1px solid $lineColor;
      border-radius: 2px;
      padding: 5px 10px;
      input{
        flex: 1;
      }
    }
  }
  .predict_price{
    line-height: 30px;
    font-size: 13px;
    margin-top: 10px;
    span{
      color: $subFontColor;
    }
  }
  button{
    margin-top: 20px;
    line-height: 44px;
    height: 44px;
    width: 100%;
    background-color: $btnColor;
    border-radius: 3px;
    color: $fontColor;
  }
}
.reverse_popup{
  width: 100%;
  padding: 0 15px 15px;
  .reverse_title{
    padding: 10px 0;
    line-height: 24px;
    display: flex;
    align-items: center;
    h3{
      flex: 1;
      text-align: center;
      margin-left: 24px;
    }
    i{
      flex: 1;
      max-width: 24px;
      font-size: 20px;
    }
  }
  ol{
    margin-top: 15px;
    margin-bottom: 10px;
    line-height: 30px;
    font-size: 13px;
    span{
      color: $subFontColor;
    }
  }
  .tip_box{
    font-size: 12px;
    color: $redColor;
    line-height: 20px;
  }
  .submit_btn{
    margin-top: 20px;
    button{
      flex:1
    }
    .cancle_btn{
      margin-right: 12px;
      max-width: 30%;
      border: none;
      background-color: $bgColor;
      color: $subFontColor;
      border-radius: 5px;
    }
  }
}

.stop_popup{
  width: 100%;
  .stop_popup_title{
    padding: 10px 15px;
    line-height: 24px;
    display: flex;
    align-items: center;
    h3{
      flex: 1;
      text-align: center;
      margin-left: 24px;
    }
    i{
      flex: 1;
      max-width: 24px;
      font-size: 20px;
    }
  }
  .stop_popup_box{
    padding: 15px;
    .input_box{
      border: 1Px solid $lineColor;
      margin: 15px 0 25px;
      padding: 10px ;
    }
  }
  button{
    line-height: 44px;
    height: 44px;
    width: 100%;
    background-color: $btnColor;
    border-radius: 3px;
    color: $fontColor;
  }
}

.agreement_box{
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 94px;
  box-sizing: border-box;
  padding: 15px;
  overflow: auto;
  span{
    line-height: 20px;
    display: block;
    margin-top: 5px;
  }
  h3{
    margin-top: 10px;
    font-size: 15px;
    text-indent:2em;
  }
  h2{
    text-align: center;
    font-size: 15px;
    margin-bottom: 10px;
  }
  p{
    // color: $subFontColor;
    line-height: 20px;
    margin-top: 5px;
    text-indent:2em;
  }
}
.agree_btn{
  position: fixed;
  bottom: 50px;
  width: 100%;
  border-radius: 0;
}

.history_popup{
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  // background-color: rgba(0,0,0,.7);
  .overlay_box{
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.7);
  }
}
</style>
