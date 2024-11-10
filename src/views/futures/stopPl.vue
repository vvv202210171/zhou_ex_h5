<template>
  <div>
    <nav-header :title="$t('tradeLang.lang157')" />
    <div class="main_content block_bg">
      <div class="top_box">
        <ol>
          <li class="flex">
            <p>{{ $t('tradeLang.lang189') }}</p>
            <span>{{ plData.tradcoin }}/{{ plData.maincoin }}</span>
          </li>
          <li class="flex">
            <p>{{ $t('tradeLang.lang190') }}</p>
            <span v-for="data in marketSocketData.consymbols" v-if="data.tradcoin==plData.tradcoin" :key="data.tradcoin" :class="[data.rise>=0?'green_color':'red_color']">{{ data.price }}</span>
          </li>
          <li class="flex">
            <p>{{ $t('tradeLang.lang191') }}</p>
            <span>{{ plData.price }}</span>
          </li>
          <li class="flex">
            <p>{{ $t('tradeLang.lang151') }}</p>
            <span>{{ plData.number }}</span>
          </li>
          <li class="flex">
            <p>{{ $t('tradeLang.lang192') }}</p>
            <span v-if="plData.type=='buy'" class="green_color">{{ $t('tradeLang.lang145') }}</span>
            <span v-if="plData.type=='sell'" class="red_color">{{ $t('tradeLang.lang146') }}</span>
          </li>
        </ol>
      </div>
      <div class="pl_main">
        <div class="title_box">{{ $t('tradeLang.lang162') }}</div>
        <div class="input_box flex">
          <input v-model="closeNum" v-int-number type="text" :placeholder="$t('tradeLang.lang163')">
        </div>
        <div class="flex">
          <div class="pl_price">
            <div class="title_box">{{ $t('tradeLang.lang194') }}</div>
            <div class="input_box flex">
              <input v-model="profitPrice" type="number" :placeholder="$t('tradeLang.lang197')">
            </div>
            <!-- 买入开多 （最新价-开仓价）*仓位数量*unit*杠杆 -->
            <!-- 卖出开空 （最新价-开仓价）*仓位数量*unit*杠杆 -->
            <div v-show="plData.type=='buy'">
              <p v-if="profitPrice&&closeNum&&Number(profitPrice)>=Number(plData.price)">{{ $t('tradeLang.lang195') }}{{ ((profitPrice - plData.price)*closeNum*coinData.unit)|mathFloor(4) }}</p>
              <p v-else>{{ $t('tradeLang.lang195') }}0.0000</p>
            </div>
            <div v-show="plData.type=='sell'">
              <p v-if="profitPrice&&closeNum&&Number(profitPrice)<=Number(plData.price)">{{ $t('tradeLang.lang195') }}{{ ((plData.price - profitPrice)*closeNum*coinData.unit)|mathFloor(4) }}</p>
              <p v-else>{{ $t('tradeLang.lang195') }}0.0000</p>
            </div>
          </div>
          <div class="pl_price">
            <div class="title_box">{{ $t('tradeLang.lang196') }}</div>
            <div class="input_box flex">
              <input v-model="lossPrice" type="number" :placeholder="$t('tradeLang.lang198')">
            </div>
            <div v-show="plData.type=='buy'">
              <p v-if="lossPrice&&closeNum&&Number(lossPrice)<=Number(plData.price)">{{ $t('tradeLang.lang195') }}{{ ((lossPrice - plData.price)*closeNum*coinData.unit)|mathFloor(4) }}</p>
              <p v-else>{{ $t('tradeLang.lang195') }}0.0000</p>
            </div>
            <div v-show="plData.type=='sell'">
              <p v-if="lossPrice&&closeNum&&Number(lossPrice)>=Number(plData.price)">{{ $t('tradeLang.lang195') }}{{ ((plData.price - lossPrice)*closeNum*coinData.unit)|mathFloor(4) }}</p>
              <p v-else>{{ $t('tradeLang.lang195') }}0.0000</p>
            </div>
          </div>
        </div>

        <div class="submit_btn">
          <van-button type="primary" size="large" @click="submitPl()">{{ $t('tradeLang.lang157') }}</van-button>
        </div>
      </div>

      <div class="record_box">
        <div class="title_box"><h3>{{ $t('tradeLang.lang199') }}</h3></div>
        <ol v-for="item in recordList" :key="item.autoid">
          <li class="flex_between">
            <p>{{ item.wdate||'--' }}</p>
            <label>
              <em class="main_color" @click="showModifyPopup(item)">{{ $t('tradeLang.lang200') }}</em>
              <span @click="cancelOrder(item)">{{ $t('tradeLang.lang111') }}</span>
            </label>
          </li>
          <li class="flex">
            <div>
              <p>{{ $t('tradeLang.lang6') }}</p>
              <span>{{ item.number||0 }}</span>
            </div>
            <div>
              <p>{{ $t('tradeLang.lang194') }}</p>
              <span v-if="item.take_profit=='enable'">{{ item.take_profit_price }}</span>
              <span v-else>--</span>
            </div>
            <div>
              <p>{{ $t('tradeLang.lang196') }}</p>
              <span v-if="item.stop_loss=='enable'">{{ item.stop_loss_price }}</span>
              <span v-else>--</span>
            </div>
          </li>
        </ol>
        <div v-if="(!recordList.length)&&isload" class="no_data">
          <p class="icon_no_data" />
          <span>{{ $t('commonLang.lang5') }}</span>
        </div>
      </div>
    </div>

    <van-popup v-model="modifyPopup" position="bottom" :close-on-click-overlay="false" class="modify_popup" @click-overlay="modifyPopup = false">
      <div class="modify_box">
        <div class="pl_main">
          <div class="title_box">{{ $t('tradeLang.lang193') }}</div>
          <div class="input_box flex">
            <input type="text" :value="modifyData.number" readonly>
          </div>
          <div class="flex">
            <div class="pl_price">
              <div class="title_box">{{ $t('tradeLang.lang194') }}</div>
              <div class="input_box flex">
                <input v-model="modifyProfitPrice" type="number" :placeholder="$t('tradeLang.lang197')">
              </div>
              <!-- 买入开多 （最新价-开仓价）*仓位数量*unit*杠杆 -->
              <!-- 卖出开空 （最新价-开仓价）*仓位数量*unit*杠杆 -->
              <div v-show="plData.type=='buy'">
                <p v-if="modifyProfitPrice&&Number(modifyProfitPrice)>=Number(plData.price)">{{ $t('tradeLang.lang195') }}{{ ((modifyProfitPrice - plData.price)*modifyData.number*coinData.unit)|mathFloor(4) }}</p>
                <p v-else>{{ $t('tradeLang.lang195') }}0.0000</p>
              </div>
              <div v-show="plData.type=='sell'">
                <p v-if="modifyProfitPrice&&Number(modifyProfitPrice)<=Number(plData.price)">{{ $t('tradeLang.lang195') }}{{ ((plData.price - modifyProfitPrice)*modifyData.number*coinData.unit)|mathFloor(4) }}</p>
                <p v-else>{{ $t('tradeLang.lang195') }}0.0000</p>
              </div>
            </div>
            <div class="pl_price">
              <div class="title_box">{{ $t('tradeLang.lang196') }}</div>
              <div class="input_box flex">
                <input v-model="modifyLossPrice" type="number" :placeholder="$t('tradeLang.lang198')">
              </div>
              <div v-show="plData.type=='buy'">
                <p v-if="modifyLossPrice&&Number(modifyLossPrice)<=Number(plData.price)">{{ $t('tradeLang.lang195') }}{{ ((modifyLossPrice - plData.price)*modifyData.number*coinData.unit)|mathFloor(4) }}</p>
                <p v-else>{{ $t('tradeLang.lang195') }}0.0000</p>
              </div>
              <div v-show="plData.type=='sell'">
                <p v-if="modifyLossPrice&&Number(modifyLossPrice)>=Number(plData.price)">{{ $t('tradeLang.lang195') }}{{ ((plData.price - modifyLossPrice)*modifyData.number*coinData.unit)|mathFloor(4) }}</p>
                <p v-else>{{ $t('tradeLang.lang195') }}0.0000</p>
              </div>
            </div>
          </div>

          <div class="submit_btn flex">
            <van-button class="cancle_btn" @click="modifyPopup = false">{{ $t('commonLang.lang1') }}</van-button>
            <van-button type="primary" size="large" @click="modifyPl()">{{ $t('tradeLang.lang157') }}</van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import { mapState } from 'vuex'
import { profitLossOrder, editProfitLoss, profitLoss, closeProfitLoss } from '@api/futures'
export default {
  data() {
    return {
      coinData: {},
      plData: JSON.parse(sessionStorage.getItem('plOrder')),
      closeNum: '',
      profitPrice: '',
      lossPrice: '',

      isload: false,
      recordList: [],
      usNumber: 0,

      modifyPopup: false,
      modifyData: {},
      modifyProfitPrice: '',
      modifyLossPrice: ''
    }
  },
  computed: {
    // 获取 store中的 行情 socket数据
    ...mapState({
      marketSocketData: state => state.trade.marketSocketData
    })
  },
  watch: {
    marketSocketData(val) {
      if (this.plData.tradcoin && val.consymbols.length) {
        this.coinData = val.consymbols.filter(data => (data.tradcoin == this.plData.tradcoin))[0]
      }
    }
  },

  created() {
    this.getRecord()
  },

  methods: {
    submitPl() {
      if (!this.$utils.isCorrectFigure(this.closeNum)) {
        Toast(this.$t('tradeLang.lang201'))
        return
      }
      if (this.profitPrice) {
        if (!this.$utils.isCorrectFigure(this.profitPrice)) {
          Toast(this.$t('tradeLang.lang202'))
          return
        }
        if (this.plData.type == 'buy' && Number(this.profitPrice) <= Number(this.plData.price)) {
          Toast(this.$t('tradeLang.lang203'))
          return
        }
        if (this.plData.type == 'sell' && Number(this.profitPrice) >= Number(this.plData.price)) {
          Toast(this.$t('tradeLang.lang204'))
          return
        }
      }
      if (this.lossPrice) {
        if (!this.$utils.isCorrectFigure(this.lossPrice)) {
          Toast(this.$t('tradeLang.lang205'))
          return
        }
        if (this.plData.type == 'sell' && Number(this.lossPrice) <= Number(this.plData.price)) {
          Toast(this.$t('tradeLang.lang206'))
          return
        }
        if (this.plData.type == 'buy' && Number(this.lossPrice) >= Number(this.plData.price)) {
          Toast(this.$t('tradeLang.lang207'))
          return
        }
      }

      if (!(this.profitPrice || this.lossPrice)) {
        Toast(this.$t('tradeLang.lang208'))
        return
      }

      profitLoss({
        autoid: this.plData.autoid,
        number: this.closeNum,
        take_profit: this.profitPrice ? 'enable' : 'disable',
        take_profit_price: this.profitPrice || 0,
        stop_loss: this.lossPrice ? 'enable' : 'disable',
        stop_loss_price: this.lossPrice || 0
      }).then(res => {
        Toast(res.msg)
        this.closeNum = ''
        this.profitPrice = ''
        this.lossPrice = ''
        this.getRecord()
      })
    },

    getRecord() {
      this.isload = false
      profitLossOrder({ autoid: this.plData.autoid }).then(res => {
        this.isload = true
        // this.usNumber = res.data.usNumber
        this.recordList = res.data
      })
    },

    cancelOrder(data) {
      Dialog.confirm({
        message: this.$t('tradeLang.lang133'),
        confirmButtonText: this.$t('commonLang.lang9'),
        cancelButtonText: this.$t('commonLang.lang1')
      }).then(() => {
        closeProfitLoss({ autoid: data.autoid }).then(res => {
          Toast(res.msg)
          this.getRecord()
        })
      }).catch(() => {})
    },

    showModifyPopup(data) {
      this.modifyData = data
      this.modifyProfitPrice = data.take_profit == 'enable' ? data.take_profit_price : ''
      this.modifyLossPrice = data.stop_loss == 'enable' ? data.stop_loss_price : ''
      this.modifyPopup = true
    },

    modifyPl() {
      if (this.modifyProfitPrice) {
        if (!this.$utils.isCorrectFigure(this.modifyProfitPrice)) {
          Toast(this.$t('tradeLang.lang202'))
          return
        }
        if (this.plData.type == 'buy' && Number(this.modifyProfitPrice) <= Number(this.plData.price)) {
          Toast(this.$t('tradeLang.lang203'))
          return
        }
        if (this.plData.type == 'sell' && Number(this.modifyProfitPrice) >= Number(this.plData.price)) {
          Toast(this.$t('tradeLang.lang204'))
          return
        }
      }
      if (this.modifyLossPrice) {
        if (!this.$utils.isCorrectFigure(this.modifyLossPrice)) {
          Toast(this.$t('tradeLang.lang205'))
          return
        }
        if (this.plData.type == 'sell' && Number(this.modifyLossPrice) <= Number(this.plData.price)) {
          Toast(this.$t('tradeLang.lang206'))
          return
        }
        if (this.plData.type == 'buy' && Number(this.modifyLossPrice) >= Number(this.plData.price)) {
          Toast(this.$t('tradeLang.lang207'))
          return
        }
      }

      if (!(this.modifyProfitPrice || this.modifyLossPrice)) {
        Toast(this.$t('tradeLang.lang208'))
        return
      }
      editProfitLoss({
        autoid: this.modifyData.autoid,
        take_profit: this.modifyProfitPrice ? 'enable' : 'disable',
        take_profit_price: this.modifyProfitPrice || 0,
        stop_loss: this.modifyLossPrice ? 'enable' : 'disable',
        stop_loss_price: this.modifyLossPrice || 0
      }).then(res => {
        Toast(res.msg)
        this.modifyPopup = false
        this.getRecord()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.top_box{
  ol{
    padding: 0 12px;
    border-bottom: 8px solid $bgColor;
    li{
      margin: 15px 0 12px;
      line-height: 20px;
      p{
        font-size: 12px;
        color: $subFontColor;
        flex: 1;
        max-width: 100px;
      }
    }
  }
}
.pl_main{
  padding: 0 12px 12px;
  .title_box{
    padding: 15px 0 12px;
  }
  .input_box{
    border: 1px solid $lineColor;
    border-radius: 4px;
    padding: 10px;
    line-height: 20px;
    input{
      flex: 1;
    }
    em{
      font-size: 12px;
      color: $subFontColor;
    }
  }

  .pl_price{
    flex: 1;
    max-width: 50%;
    &:first-child{
      margin-right: 10px;
    }
    p{
      font-size: 12px;
      color: $subFontColor;
      margin-top: 5px;
      line-height: 20px;
    }
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

.record_box{
  border-top: 8px solid $bgColor;
  .title_box{
    padding: 15px 12px 12px;
    border-bottom: 1px solid $lineColor;
  }
  ol{
    padding: 12px;
    border-bottom: 1px solid $lineColor;
    li{
      &:first-child{
        padding-bottom: 12px;
        span{
          color: $subFontColor;
          margin-left: 10px;
        }
      }
      &:last-child{
        line-height: 21px;
        div{
          flex:1;
          &:nth-child(2){
            text-align: center;
          }
          &:nth-child(3){
            text-align: right;
          }
          p{
            font-size: 12px;
            color: $subFontColor;
          }
        }
      }
    }
  }
}
</style>
