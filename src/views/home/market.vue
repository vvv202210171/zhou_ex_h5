<template>
  <div class="market block_bg">
    <div ref="marketTop" class="market_top">
      <ol class="market_nav flex">
        <li :class="[{'nav_active':active==1}]" @click="active=1">{{ $t('homeLang.lang37') }}</li>
        <li :class="[{'nav_active':active==2}]" @click="active=2">{{ $t('homeLang.lang38') }}</li>
        <li :class="[{'nav_active':active==3}]" @click="active=3">{{ $t('homeLang.lang39') }}</li>
        <label><p @click="pushPath('/coinSearch')"><img src="@img/home/market_search.png" alt=""></p></label>
      </ol>
      <div class="main_top_box">
        <ol class="main_nav flex">
          <li :class="[{'main_selected':mainNav==1}]" @click="mainNav=1">{{ $t('homeLang.lang40') }}</li>
          <li :class="[{'main_selected':mainNav==2}]" @click="mainNav=2">{{ $t('homeLang.lang41') }}</li>
          <li :class="[{'main_selected':mainNav==3}]" @click="mainNav=3">{{ $t('homeLang.lang42') }}</li>
        </ol>
        <ol class="sort_box flex">
          <li><span :class="[volSort=='up'?'sort_up':volSort=='down'?'sort_down':'sort_no']" @click="changeSort(1)">{{ $t('homeLang.lang44') }}</span></li>
          <li><span :class="[priceSort=='up'?'sort_up':priceSort=='down'?'sort_down':'sort_no']" @click="changeSort(2)">{{ $t('homeLang.lang45') }}</span></li>
          <li><span :class="[riseSort=='up'?'sort_up':riseSort=='down'?'sort_down':'sort_no']" @click="changeSort(3)">{{ $t('homeLang.lang46') }}</span></li>
        </ol>
      </div>
    </div>
    <div ref="marketBox" class="market_content">
      <div v-if="active==1">
        <div v-for="item in exchangeList" :key="item.autoid">
          <ol v-if="(item.isOptional&&mainNav==1)||mainNav==2||(mainNav==3&&item.plate=='main')||(mainNav==4&&item.plate=='pioneer')" class="coin_box flex" @click="goDetails(item)">
            <li>
              <div class="flex"><h3>{{ item.tradcoin }}</h3><span>/{{ item.maincoin }}</span></div>
              <p>VOL {{ item.volume }}</p>
            </li>
            <li>
              <p :class="[item.rise<0?'red_color':'green_color']">{{ item.price }}</p>
              <span>≈ {{ rateData.symbol }}{{ (item.price*rateData.price)|mathFloor(item.price_accuracy) }}</span>
            </li>
            <li>
              <span :class="[item.rise<0?'rise_red':'rise_green']"><em v-if="item.rise>=0">+</em>{{ item.rise }}%</span>
            </li>
          </ol>
        </div>
        <div v-if="(mainNav==1&&!hasExchangeOptional)||(mainNav==4&&!hasExchangePioneer)" class="no_data">
          <p class="icon_no_data" />
          <span>{{ $t('commonLang.lang4') }}</span>
        </div>
      </div>
      <div v-if="active==2">
        <div v-for="item in futuresList" :key="item.autoid">
          <ol v-if="(item.isOptional&&mainNav==1)||mainNav==2||(mainNav==3&&item.plate=='main')||(mainNav==4&&item.plate=='pioneer')" class="coin_box flex" @click="goDetails(item)">
            <li>
              <div class="flex"><h3>{{ item.tradcoin }}</h3><span>/{{ item.maincoin }}</span></div>
              <p>VOL {{ item.volume }}</p>
            </li>
            <li>
              <p :class="[item.rise<0?'red_color':'green_color']">{{ item.price }}</p>
              <span>≈ {{ rateData.symbol }}{{ (item.price*rateData.price)|mathFloor(item.price_accuracy) }}</span>
            </li>
            <li>
              <span :class="[item.rise<0?'rise_red':'rise_green']"><em v-if="item.rise>=0">+</em>{{ item.rise }}%</span>
            </li>
          </ol>
        </div>
        <div v-if="(mainNav==1&&!hasFuturesOptional)||(mainNav==4&&!hasFuturesPioneer)" class="no_data">
          <p class="icon_no_data" />
          <span>{{ $t('commonLang.lang4') }}</span>
        </div>
      </div>
      <div v-if="active==3">
        <div v-for="item in cycleList" :key="item.autoid">
          <ol v-if="(item.isOptional&&mainNav==1)||mainNav==2||(mainNav==3&&item.plate=='main')||(mainNav==4&&item.plate=='pioneer')" class="coin_box flex" @click="goDetails(item)">
            <li>
              <div class="flex"><h3>{{ item.tradcoin }}</h3><span>/{{ item.maincoin }}</span></div>
              <p>VOL {{ item.volume }}</p>
            </li>
            <li>
              <p :class="[item.rise<0?'red_color':'green_color']">{{ item.price }}</p>
              <span>≈ {{ rateData.symbol }}{{ (item.price*rateData.price)|mathFloor(item.price_accuracy) }}</span>
            </li>
            <li>
              <span :class="[item.rise<0?'rise_red':'rise_green']"><em v-if="item.rise>=0">+</em>{{ item.rise }}%</span>
            </li>
          </ol>
        </div>
        <div v-if="(mainNav==1&&!hasCycleOptional)||(mainNav==4&&!hasCyclePioneer)" class="no_data">
          <p class="icon_no_data" />
          <span>{{ $t('commonLang.lang4') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { tradeSymbols } from '@api/exchange'
import { futuresSymbols } from '@api/futures'
import { cycleSymbols } from '@api/cycle'
export default {
  data() {
    return {
      active: sessionStorage.getItem('marketActive') || 1,
      mainNav: sessionStorage.getItem('marketMian') || 2,

      volSort: 'no',
      priceSort: 'no',
      riseSort: 'no',

      optionalData: JSON.parse(localStorage.getItem('optionalData')) || [],
      hasExchangeOptional: false,
      hasExchangePioneer: false,
      exchangeList: [],

      optionalFuturesData: JSON.parse(localStorage.getItem('optionalFuturesData')) || [],
      hasFuturesOptional: false,
      hasFuturesPioneer: false,
      futuresList: [],

      optionalCycleData: JSON.parse(localStorage.getItem('optionalCycleData')) || [],
      hasCycleOptional: false,
      hasCyclePioneer: false,
      cycleList: []
    }
  },
  computed: {
    ...mapState({
      marketSocketData: state => state.trade.marketSocketData,
      rateData: state => state.wallet.rateData
    })
  },
  watch: {
    // 监听socket 数据  实时更新
    marketSocketData() {
      this.initMarket()
    },

    active(val) {
      sessionStorage.setItem('marketActive', val)
      this.mainNav = 2
      this.volSort = 'no'
      this.priceSort = 'no'
      this.riseSort = 'no'
    },
    mainNav(val) {
      sessionStorage.setItem('marketMian', val)
    }
  },
  created() {
    this.$store.dispatch('common/showFooter', true)
    this.$store.dispatch('common/updateSelectedFooter', 1)
    this.initMarket()
  },
  mounted() {
    const marketTop = this.$refs.marketTop
    marketTop.style.paddingTop = `${this.$barHeight}px`
    this.$refs.marketBox.style.top = `${marketTop.clientHeight}px`
  },

  methods: {
    initMarket() {
      if (this.marketSocketData && this.marketSocketData.symbols) {
        // 更新行情
        if (this.marketSocketData.symbols) {
          this.processExchangeData(this.marketSocketData.symbols)
        }
        // 更新行情
        if (this.marketSocketData.consymbols) {
          this.processFuturesData(this.marketSocketData.consymbols)
        }
        // 更新行情
        if (this.marketSocketData.cyclesymbols) {
          this.processCycleData(this.marketSocketData.cyclesymbols)
        }
      } else {
        this.getSymbols()
      }
    },
    getSymbols() {
      tradeSymbols().then(res => {
        this.processExchangeData(res.data)
      })
      futuresSymbols().then(res => {
        this.processFuturesData(res.data)
      })
      cycleSymbols().then(res => {
        this.processCycleData(res.data)
      })
    },

    processExchangeData(resData) {
      // 自选列表
      resData.forEach(data => {
        this.optionalData.forEach(id => {
          if (id == data.autoid) {
            this.hasExchangeOptional = true
            this.$set(data, 'isOptional', true)
          }
        })

        if (data.plate == 'pioneer') {
          this.hasExchangePioneer = true
        }
      })

      this.exchangeList = [...this.sortData(resData)]
    },
    processFuturesData(resData) {
      // 自选列表
      resData.forEach(data => {
        this.optionalFuturesData.forEach(id => {
          if (id == data.autoid) {
            this.hasFuturesOptional = true
            this.$set(data, 'isOptional', true)
          }
        })

        if (data.plate == 'pioneer') {
          this.hasFuturesPioneer = true
        }
      })

      this.futuresList = [...this.sortData(resData)]
    },
    processCycleData(resData) {
      // 自选列表
      resData.forEach(data => {
        this.optionalCycleData.forEach(id => {
          if (id == data.autoid) {
            this.hasCycleOptional = true
            this.$set(data, 'isOptional', true)
          }
        })

        if (data.plate == 'pioneer') {
          this.hasCyclePioneer = true
        }
      })

      this.cycleList = [...this.sortData(resData)]
    },
    sortData(resData) {
      if (this.volSort == 'down') {
        resData.sort(this.$utils.compareRise('volume'))
      } else if (this.volSort == 'up') {
        resData.sort(this.$utils.compareRise('volume', 'up'))
      } else if (this.priceSort == 'down') {
        resData.sort(this.$utils.compareRise('price'))
      } else if (this.priceSort == 'up') {
        resData.sort(this.$utils.compareRise('price', 'up'))
      } else if (this.riseSort == 'down') {
        resData.sort(this.$utils.compareRise('rise'))
      } else if (this.riseSort == 'up') {
        resData.sort(this.$utils.compareRise('rise', 'up'))
      }
      return resData
    },
    changeSort(type) {
      if (type == 1) {
        this.volSort = this.volSort == 'down' ? 'up' : this.volSort == 'up' ? 'no' : 'down'
        this.priceSort = 'no'
        this.riseSort = 'no'
      }
      if (type == 2) {
        this.priceSort = this.priceSort == 'down' ? 'up' : this.priceSort == 'up' ? 'no' : 'down'
        this.volSort = 'no'
        this.riseSort = 'no'
      }
      if (type == 3) {
        this.riseSort = this.riseSort == 'down' ? 'up' : this.riseSort == 'up' ? 'no' : 'down'
        this.volSort = 'no'
        this.priceSort = 'no'
      }
      if (this.active == 1) {
        this.processExchangeData(this.exchangeList)
      } else if (this.active == 2) {
        this.processFuturesData(this.futuresList)
      } else if (this.active == 2) {
        this.processCycleData(this.cycleList)
      }
    },

    goDetails(data) {
      if (this.active == 1) {
        sessionStorage.setItem('marketDetails', JSON.stringify(data))
        this.pushPath('/marketDetails/trad')
      } else if (this.active == 2) {
        sessionStorage.setItem('marketDetails', JSON.stringify(data))
        this.pushPath('/marketDetails/contract')
      } else {
        sessionStorage.setItem('cycleCoinParams', JSON.stringify(data))
        this.$router.replace('/cycle')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.market{
  bottom: 50px;
  height: auto;
}
.market_top{
  background: $bgColor;
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
}
.market_content{
  position: absolute;
  width: 100%;
  top: 1.22667rem;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
}
.market_nav{
  padding: 10px 15px 10px 0;
  li{
    padding: 0 15px;
    height: 26px;
    line-height: 26px;
    color: $subFontColor;
  }
  .nav_active{
    transform: scale(1.2);
    color: $fontColor;
    font-weight: 600;
  }
  label{
    flex: 1;
    p{
      float: right;
      width: 18px;
    }
  }
}
.main_top_box{
  background: $blockColor;
  padding: 20px 15px 5px;
  border-radius: 20px 20px 0 0;
  .main_nav{
    li{
      flex: 1;
      max-width: 33%;
      text-align: center;
      background-color: $subBlockColor;
      color: $fontColor;
      height: 30px;
      line-height: 32px;
      border-radius: 5px;
      margin-right: 10px;
      &:last-child{
        margin-right: 0;
      }
    }
    .main_selected{
      background-color: $mainColor;
      color: $blockColor;
      font-weight: 500;
    }
  }
  .sort_box{
    margin-top: 10px;
    justify-content: space-between;
    li{
      max-width: 100px;
      flex: 1;
      padding: 5px 0;
      font-size: 12px;
      color: $subFontColor;
      text-align: right;
      &:first-child{
        text-align: left;
      }
      span{
        position: relative;
        padding-right: 17px;
      }
      .sort_after{
        content: "";
        position: absolute;
        background-size: 100% 100%!important;
        width: 12px;
        height: 12px;
        margin-left: 5px;
      }
      .sort_no{
        &::after{
          background: url(../../assets/img/home/sort_no.png)  no-repeat ;
          @extend .sort_after;
        }
      }
      .sort_up{
        &::after{
          background: url(../../assets/img/home/sort_up.png)  no-repeat ;
          @extend .sort_after;
        }
      }
      .sort_down{
        &::after{
          background: url(../../assets/img/home/sort_down.png)  no-repeat ;
          @extend .sort_after;
        }
      }
    }
  }
}

.coin_box{
  padding: 10px 15px;
  height: 55px;
  li{
    flex: 1;
    text-align: right;
    &:nth-child(1){
      text-align: left;
      div{
        margin-bottom: 4px;
      }
      span,p{
        color: $subFontColor;
        font-size: 12px;
      }
    }
    &:nth-child(2){
      p{
        margin-bottom: 5px;
      }
      span{
        font-size: 12px;
        color: $subFontColor;
      }
    }
    &:nth-child(3){
      span{
        display: inline-block;
        height: 35px;
        line-height: 36px;
        width: 85px;
        border-radius: 5px;
        text-align: center;
      }
    }
  }

  .rise_red{
    background-color: rgba($redColor,.1);
    color: $redColor;
  }
  .rise_green{
    background-color: rgba($greenColor,.1);
    color: $greenColor;
  }
}
</style>
