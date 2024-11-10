<!-- 币种详情 -->
<template>
  <div>
    <nav-header :title="coinData.tradcoin+'/'+coinData.maincoin">
      <span slot="headerRight" :class="[coinData.isOptional?'icon-star main_color':'icon-star-o','iconfont']" @click="handleOptional()" />
    </nav-header>
    <!-- <nav-header :title="coinData.tradcoin+'/'+coinData.maincoin"></nav-header> -->
    <div class="main_content quotation_details">
      <ol class="coin_info">
        <li>
          <h2 :class="[coinInfo.rise>=0?'green_color':'red_color','text_hide']">{{ coinInfo.price }}</h2>
          <p>
            <em>≈ {{ rateData.symbol }}{{ (coinInfo.price*rateData.price)|mathFloor(2) }}</em>
            <i v-if="coinInfo.rise>=0" class="green_color">+{{ coinInfo.rise }}%</i>
            <i v-if="coinInfo.rise<0" class="red_color">{{ coinInfo.rise }}%</i>
          </p>
        </li>
        <li>
          <label> <span>{{ coinInfo.height }}</span> <em>{{ $t('tradeLang.lang15') }}</em> </label>
          <label> <span>{{ coinInfo.low }}</span> <em>{{ $t('tradeLang.lang16') }}</em> </label>
          <label> <span>{{ coinInfo.volume }}</span> <em>{{ $t('tradeLang.lang17') }}</em> </label>
        </li>
      </ol>
      <div class="kline_box">
        <kline :key="klineKey" :coin-type="coinType" ref="klinechart" :default-pair-name="coinData.tradcoin+'/'+coinData.maincoin" :default-name="coinData.tradcoin" :defaultfloat-precision="coinData.price_accuracy" default-period="4" @periodData="changePerioad" />
      </div>

      <van-tabs v-model="active" border line-height="1" :offset-top="headerHeight" sticky>
        <van-tab :title="$t('tradeLang.lang18')">
          <gear-map :key="mapKey" :coin-type="coinType" :params="coinInfo" :map-data="mapData" :show-all="true" />
        </van-tab>
        <van-tab :title="$t('tradeLang.lang19')">
          <ol class="deal_list block_bg">
            <li>
              <span>{{ $t('tradeLang.lang21') }}</span>
              <span>{{ $t('tradeLang.lang22') }}</span>
              <span>{{ $t('tradeLang.lang7') }}</span>
              <span>{{ $t('tradeLang.lang6') }}</span>
            </li>
            <li v-for="(item,index) in orderList" v-if="index<30" :key="index">
              <span>{{ item.wdate }}</span>
              <span v-if="item.type=='buy'" class="green_color">{{ coinType=='trad'?$t('tradeLang.lang23'):$t('tradeLang.lang28') }}</span>
              <span v-else class="red_color">{{ coinType=='trad'?$t('tradeLang.lang24'):$t('tradeLang.lang29') }}</span>
              <span>{{ item.price }}</span>
              <span>{{ item.number }}</span>
            </li>
          </ol>
        </van-tab>
        <van-tab :title="$t('tradeLang.lang20')">
          <ol class="coin_info_top block_bg van-hairline--bottom">
            <li class="van-hairline--bottom">
              <div>
                <p>{{ coinDetails.info }}({{ coinDetails.symbol }})</p>
              </div>
            </li>
            <li class="flex_between van-hairline--bottom">
              <span>{{ $t('tradeLang.lang25') }}</span>
              <em>{{ coinDetails.number }}</em>
            </li>
            <li class="flex_between van-hairline--bottom">
              <span>{{ $t('tradeLang.lang26') }}</span>
              <em>{{ coinDetails.web }}</em>
            </li>
            <li class="flex_between">
              <span>{{ $t('tradeLang.lang27') }}</span>
              <em>{{ coinDetails.blockweb }}</em>
            </li>
          </ol>
          <div class="coin_info_bottom block_bg">
            <label>{{ $t('tradeLang.lang20') }}</label>
            <p>{{ coinDetails.info }}</p>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div class="btn_box">
      <van-button class="green_bg" @click="goTrade(1)">{{ coinType=='trad'?$t('tradeLang.lang23'):$t('tradeLang.lang28') }}</van-button>
      <van-button class="red_bg" @click="goTrade(2)">{{ coinType=='trad'?$t('tradeLang.lang24'):$t('tradeLang.lang29') }}</van-button>
    </div>
  </div>
</template>

<script>
import kline from './components/kline'
import gearMap from './components/gearMap'
import { mapState, mapGetters } from 'vuex'
import { tradeCoinInfo, currencyIntroduction } from '@api/exchange'
import { contractCoinInfo } from '@api/futures'
export default {
  components: { kline, gearMap },
  data() {
    return {
      coinData: JSON.parse(sessionStorage.getItem('marketDetails')),
      coinInfo: {},
      mapData: {},
      mapKey: (new Date().getTime().toString() + Math.floor(Math.random() * 100).toString()),

      active: 0,

      coinDetails: {},

      orderList: [],

      coinType: 'trad',

      klineKey: (Date.now().toString() + Math.floor(Math.random() * 1000).toString())
    }
  },
  computed: {
    ...mapState({
      contractSocketData: state => state.trade.contractSocketData,
      contractTopData: state => state.trade.contractTopData,

      coinSocketData: state => state.trade.coinSocketData,
      coinTopData: state => state.trade.coinTopData,

      headerHeight: state => state.common.headerHeight,
      rateData: state => state.wallet.rateData
    })
  },
  watch: {
    // 监听socket 数据  实时更新
    coinSocketData(data) {
      // 更新行情
      if (data.info && this.coinData && this.coinType == 'trad') {
        if (data.info.autoid == this.coinData.autoid) {
          this.setData(data)
        }
      }
    },
    coinTopData(data) {
      this.setTopData(data)
    },
    // 监听socket 数据  实时更新
    contractSocketData(data) {
      // 更新行情
      if (data.coninfo && this.coinData && this.coinType == 'contract') {
        if (data.coninfo.autoid == this.coinData.autoid) {
          this.setContractData(data)
        }
      }
    },
    contractTopData(data) {
      this.setTopData(data)
    }
  },
  created() {
    this.coinType = this.$route.params.type
    if (!this.coinData) { return }
    this.sendWsParams(1)
    this.getCoinDetails()
    if (this.coinType == 'trad') {
      if (!(this.coinSocketData && this.coinSocketData.info)) {
        this.getCoinInfo()
      } else {
        this.setData(this.coinSocketData)
      }

      this.$set(this.coinData, 'isOptional', false)
      const optionalData = JSON.parse(localStorage.getItem('optionalData')) || []

      optionalData.forEach(id => {
        if (this.coinData.autoid == id) {
          this.coinData.isOptional = true
        }
      })
    } else if (this.coinType == 'contract') {
      if (!(this.contractSocketData && this.contractSocketData.coninfo)) {
        this.getContractInfo()
      } else {
        this.setContractData(this.contractSocketData)
      }
      this.$set(this.coinData, 'isOptional', false)
      const optionalData = JSON.parse(localStorage.getItem('optionalFuturesData')) || []

      optionalData.forEach(id => {
        if (this.coinData.autoid == id) {
          this.coinData.isOptional = true
        }
      })
    }
  },
  mounted() {

  },
  methods: {
    changePerioad(data) {
      this.sendWsParams(data.Min)
    },
    sendWsParams(klineMinute) {
      if (this.$ws && this.$ws.readyState == 1) {
        // 通知 ws 更新币种数据
        const key = `${this.coinData.maincoin}_${this.coinData.tradcoin}_${this.coinType}_${klineMinute || 1}`
        this.$ws.send(key)
        sessionStorage.setItem('webSocketKey', key)
      } else {
        setTimeout(() => {
          // 通知 ws 更新币种数据
          this.sendWsParams(klineMinute)
        }, 1500)
      }
    },

    // 币币数据
    setData(data) { // 初始化
      this.coinInfo = data.info
      // 给档位图 塞数据
      this.mapData = data
      this.mapKey = (new Date().getTime().toString() + Math.floor(Math.random() * 100).toString())
    },
    // 合约数据
    setContractData(data) { // 初始化
      this.coinInfo = data.coninfo
      // 给档位图 塞数据
      this.mapData = data
      this.mapKey = (new Date().getTime().toString() + Math.floor(Math.random() * 100).toString())
    },

    setTopData(data) {
      const orderList = this.orderList
      data.forEach(top => {
        orderList.forEach((order, index) => {
          if (top.autoid == order.autoid) {
            orderList.splice(index, 1)
          }
        })
      })
      this.orderList = data.concat(orderList)
      if (this.orderList.length > 20) {
        this.orderList.length = 20
      }
    },

    getCoinInfo() {
      tradeCoinInfo({
        tradcoin: this.coinData.tradcoin,
        maincoin: this.coinData.maincoin
      }).then(res => {
        // 给档位图 塞初始化数据
        this.mapData = res.data
        this.mapKey = (new Date().getTime().toString() + Math.floor(Math.random() * 100).toString())

        this.coinInfo = res.data.info
        this.orderList = res.data.top
      })
    },

    getCoinDetails() {
      currencyIntroduction({ coin: this.coinData.tradcoin }).then(res => {
        this.coinDetails = res.data
      })
    },

    getContractInfo() {
      contractCoinInfo({
        tradcoin: this.coinData.tradcoin,
        maincoin: this.coinData.maincoin
      }).then(res => {
        // 给档位图 塞初始化数据
        this.mapData = res.data
        this.mapKey = (new Date().getTime().toString() + Math.floor(Math.random() * 100).toString())

        this.coinInfo = res.data.info
        this.orderList = res.data.top
      })
    },

    handleOptional() {
      this.coinData.isOptional = !this.coinData.isOptional
      let optionalData = []
      if (this.coinType == 'trad') {
        optionalData = JSON.parse(localStorage.getItem('optionalData')) || []
      } else {
        optionalData = JSON.parse(localStorage.getItem('optionalFuturesData')) || []
      }
      if (this.coinData.isOptional) {
        optionalData.push(this.coinData.autoid)
      } else {
        optionalData = optionalData.filter((id, index) => !(id == this.coinData.autoid))
      }
      if (this.coinType == 'trad') {
        localStorage.setItem('optionalData', JSON.stringify(optionalData))
      } else {
        localStorage.setItem('optionalFuturesData', JSON.stringify(optionalData))
      }
    },

    goTrade(val) {
      if (this.coinType == 'trad') {
        sessionStorage.setItem('selectedCoin', JSON.stringify(this.coinInfo))
        sessionStorage.setItem('tradeActive', 1)
        sessionStorage.setItem('tradeType', val - 1)
      } else if (this.coinType == 'contract') {
        sessionStorage.setItem('futuresCoinParams', JSON.stringify(this.coinInfo))
        sessionStorage.setItem('tradeActive', 2)
        sessionStorage.setItem('contractActive', 0)
        sessionStorage.setItem('contractType', val)
      }
      if (sessionStorage.getItem('lastPage') == 'trade') {
        this.goBack()
      } else {
        this.$router.replace('/trade')
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.quotation_details{
  bottom: 60px;
}
.icon-star-o{
  font-size: 20px;
  color: var(--fontColor);
}
.icon-star{
  font-size: 20px
}
.coin_info{
  height: 74px;
  display: flex;
  justify-content: space-between;
  padding: 10px 15px 5px;
  li{
    line-height: 20px;
    font-size: 12px;
    h2{
      line-height: 40px;
      font-size: 20px;
    }
    em{
      color: $subFontColor;
    }
    label{
      display: block;
      text-align: right;
    }
    i{
      margin-left: 10px;
    }
    span{
      color: $subFontColor;
      margin-right: 10px;
    }
  }
}

.coin_info_top{
  padding-top: 10px;
  padding-left: 15px;
  li{
    line-height: 40px;
    padding-right: 15px;
    span{
      color: $subFontColor;
    }
    div{
      line-height: 22px;
      padding-bottom: 10px;
    }
    em{color: $subFontColor;}
  }
  .flex_between{
    font-size: 12px;
  }
}
.coin_info_bottom{
  padding: 10px 15px;
  color: $subFontColor;
  label{
    display: block;
    line-height: 20px;
  }
  p{
    color: $subFontColor;
    font-size: 12px;
    line-height: 20px;
  }
  em{color: $subFontColor;}
}
.kline_box{
  background-color: $bgColor;
  padding: 5px 0;
}
.deal_list{
  padding: 10px 15px;
  li{
    display: flex;
    line-height: 36px;
    font-size: 13px;
    &:first-child{
      font-size: 12px;
      color: $subFontColor;
    }
    span{
      flex: 1;
      color: $subFontColor;
      &:nth-child(2){
        text-align: center;
      }
      &:nth-child(3){
        text-align: center;
      }
      &:nth-child(4){
        text-align: right;
      }
    }
  }
}
.btn_box{
  background-color: $blockColor;
  padding: 10px 15px;
  position: fixed;
  width: 100%;
  bottom: 0;
  display: flex;
  align-items: center;
  button{
    flex: 1;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    color: var(--selected-nav-color);
    font-weight: bold;
    font-size: 15px;
    border: none;
    &:nth-child(2){
      margin-left: 15px;
    }
  }
}

.top_order{
  background: $blockColor;
  li{
    display: flex;
    align-items: center;
    padding: 0 15px;
    line-height: 28px;
    span{
      flex: 1;
      max-width: 25%;
      font-size: 12px;
      color: $subFontColor;
      padding: 10px 0 2px;
      &:nth-child(4){
        text-align: right;
      }
    }
    p{
      flex: 1;
      max-width: 25%;
      font-size: 13px;
      &:nth-child(4){
        text-align: right;
      }
    }
  }
}
</style>
