<template>
  <div>
    <nav-header :title="$t('tradeLang.lang38')">
      <span slot="headerRight" class="iconfont icon-record" @click="showRecord()" />
    </nav-header>
    <div class="main_content">
      <ol class="exchange_top_box block_bg flex">
        <li>
          <p>{{ exchangeData.maincoin||'--' }}</p>
          <h3 class="main_color">{{ coinAccount.mainusable||"0.00" }}</h3>
        </li>
        <li>
          <p>{{ exchangeData.tradcoin||'--' }}</p>
          <h3 class="main_color">{{ coinAccount.tradusable||"0.00" }}</h3>
        </li>
      </ol>
      <div class="exchange_box">
        <ol class="exchange_top flex">
          <li>
            <div class="flex_between" @click="coinSheet=true">
              <span>{{ exchangeData.maincoin }}</span>
              <i class="iconfont icon-down" />
            </div>
            <div>
              <input v-model="exchangeNum" v-input-line type="number" :placeholder="$t('tradeLang.lang6')">
            </div>
          </li>
          <img src="@img/wallet/icon_transfer.png" alt="">
          <li>
            <div>
              <span>{{ exchangeData.tradcoin }}</span>
            </div>
            <div>
              <p>{{ (exchangeNum*exchangeData.mainprice/exchangeData.tradprice)|mathFloor(8) }}</p>
            </div>
          </li>
        </ol>
        <div class="rate_box">{{ $t('tradeLang.lang90') }}1{{ exchangeData.maincoin }} ≈ {{ (exchangeData.mainprice/exchangeData.tradprice)|mathFloor(8) }}{{ exchangeData.tradcoin }}</div>
      </div>

      <div class="submit_btn">
        <van-button type="primary" size="large" @click="showPayPopup()">{{ $t('tradeLang.lang38') }}</van-button>
      </div>
      <div class="tip_box">{{ $t('tradeLang.lang91',{low:exchangeData.low,height:exchangeData.height}) }}</div>
    </div>
    <van-action-sheet v-model="coinSheet" :actions="exchangeCoinList" :cancel-text="$t('commonLang.lang1')" close-on-popstate @select="onSelect" />
    <van-overlay :show="payPopup" @click="payPopup = false">
      <div class="pay_popup" @click.stop>
        <passwordDialog v-model="payPass" @cancelAction="payPopup = false" @confirmAction="confirmPass" />
      </div>
    </van-overlay>

    <van-popup v-model="recordPopup" class="right_popup" position="right" close-on-popstate overlay-class="block_bg">
      <nav-header :title="$t('tradeLang.lang92')" />
      <div class="main_content">
        <van-list v-model="loading" :finished="finished" @load="loadMore">
          <ol v-for="(item,index) in recordList" :key="index" class="record_box block_bg">
            <li class="flex_between">
              <h4>{{ item.maincoin }} {{ $t('tradeLang.lang93') }} {{ item.tradcoin }}</h4>
              <span class="sub_font">{{ item.wdate }}</span>
            </li>
            <li class="flex_between">
              <p><em class="main_color">{{ $t('tradeLang.lang94') }} {{ item.fromnumber }} {{ item.maincoin }}</em></p>
              <p class="main_color">{{ $t('tradeLang.lang95') }} {{ item.tonumber }} {{ item.tradcoin }}</p>
            </li>
          </ol>
        </van-list>
        <div v-show="isload&&recordList.length==0" class="no_data">
          <i class="icon_no_data" />
          <span>{{ $t('commonLang.lang5') }}</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from 'vant'
import passwordDialog from '@/components/passwordDialog.vue'
import { flashCoin, coinBalance, addFlash, flashOrder } from '@api/wallet'
export default {
  components: { passwordDialog },
  data() {
    return {
      exchangeCoinList: [],
      exchangeData: {},
      coinAccount: {},

      exchangeNum: '',
      payPass: '',
      payPopup: false,

      coinSheet: false,

      recordPopup: false,
      recordList: [],
      searchData: {
        page: 0,
        limit: 30
      },
      isload: false,
      loading: false,
      finished: true
    }
  },
  created() {
    this.init()
  },

  methods: {
    init() {
      flashCoin().then(res => {
        res.data.forEach(data => {
          data.name = `${data.maincoin} ${this.$t('tradeLang.lang93')} ${data.tradcoin}`
        })
        this.exchangeCoinList = res.data
        this.exchangeData = res.data[0]
        this.getBalance()
      })
    },

    onSelect(data) {
      this.exchangeData = data
      this.getBalance()
      this.coinSheet = false
    },

    getBalance() {
      coinBalance({
        maincoin: this.exchangeData.maincoin,
        tradcoin: this.exchangeData.tradcoin
      }).then(res => {
        this.coinAccount = res.data
      })
    },

    showPayPopup() {
      if (!this.$utils.isCorrectFigure(this.exchangeNum)) {
        Toast(this.$t('tradeLang.lang96'))
        return
      }
      this.payPass = ''
      this.payPopup = true
    },
    confirmPass() {
      addFlash({
        number: this.exchangeNum,
        autoid: this.exchangeData.autoid,
        tradPassword: this.payPass
      }).then(res => {
        this.exchangeNum = ''
        Toast(res.msg)
        this.getBalance()
      })
    },

    showRecord() {
      this.isload = false
      this.getRecord()
      this.pushState('?recordPopup')
      this.recordPopup = true
    },
    getRecord() {
      this.isload = false
      this.searchData.page = 0
      this.loadMore()
    },
    loadMore() {
      this.searchData.page += 1
      flashOrder(this.searchData).then(res => {
        this.isload = true
        this.loading = false
        if (res.data && res.data.length) {
          this.recordList = this.searchData.page == 1 ? res.data : [...this.recordList, ...res.data]
        } else {
          this.recordList = []
        }
        this.finished = res.count == this.recordList.length
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-record{
  font-size: 18px;
  color: $subFontColor;
}
.exchange_top_box{
  margin: 15px;
  border-radius: 5px;
  // background: linear-gradient(-22deg, #E84444, #EF4646);
  // background: url(../../assets/img/home/bg.png) no-repeat;
  // background-size: 100% 100%;
  padding: 20px;
  height: 90px;
  // border: 1px solid $lineColor;
  li{
    flex: 1;
    max-width: 50%;
    text-align: center;
    p{
      line-height: 21px;
      color: $subFontColor;
    }
    h3{
      font-size: 20px;
      margin-top: 10px;
    }
  }
}
.exchange_box{
  margin: 15px;
  // padding: 12px;
  // box-shadow: 0px 4px 24px 0px rgba(153, 153, 153, 0.1);
  // border: 1px solid $lineColor;
  border-radius: 5px;
  .exchange_top{
    li{
      flex: 1;
      line-height: 21px;
      div{
        height: 43px;
        border-radius: 5px;
        padding: 10px;
        border: 1px solid $lineColor;
        margin: 12px 0;
        i{
          font-size: 14px;
          color: $subFontColor;
        }
      }
    }
    img{
      flex: 1;
      max-width: 30px;
      margin: 0 10px;
    }
  }
}
.tip_box{
  padding: 10px 20px;
  line-height: 21px;
  font-size: 12px;
  color: $subFontColor;
}
.gift_box{
  text-align: right;
  font-size: 12px;
  color: $subFontColor;
  line-height: 20px;
}
.rate_box{
  margin-top: 10px;
  padding: 10px ;
  border-radius: 5px;
  line-height: 20px;
  text-align: center;
  color: $mainColor;
  border: 1px solid $lineColor;
}
.submit_btn{
  margin: 30px 15px 10px;
}
.assets_box{
  margin: 15px;
  padding: 0 12px;
  border: 1px solid $lineColor;
  border-radius: 5px;
  line-height: 21px;
  li{
    padding: 12px 0;
    &:first-child{
      padding-bottom: 5px;
    }
    span{
      color: $subFontColor;
      font-size: 12px;
    }
    p{
      color: $subFontColor;
    }
  }
}

.record_box{
  border-bottom: 1px solid $bgColor;
  padding: 10px 15px;
  line-height: 25px;
  font-size: 13px;
  span{
    font-size: 12px;
  }
}
</style>
