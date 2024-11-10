<!--  -->
<template>
  <div>
    <nav-header :title="$t('tradeLang.lang181')">
      <span v-if="active==0&&addPositionList.length>0" slot="headerRight" @click="allClose()">{{ $t('tradeLang.lang137') }}</span>
    </nav-header>
    <div class="main_content block_bg">
      <van-tabs v-model="active" border :sticky="isSticky" :offset-top="headerHeight" :line-height="1" :line-width="20">
        <van-tab :title="$t('tradeLang.lang182')">
          <ol v-for="item in addPositionList" :key="item.autoid" class="position_box block_bg" @click="showPosterPopup(item)">
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
                <!-- <h3 :class="[item.income>=0?'green_color':'red_color']">{{item.income}}({{(item.income*100/item.position)|mathFloor(2)||'--'}}%)</h3> -->
                <h3 v-for="data in marketSocketData.consymbols" :key="data.tradcoin">
                  <em v-if="data.tradcoin==item.tradcoin" :class="[((data.price-item.price)*data.unit*item.number)>=0?'green_color':'red_color']">
                    {{ ((data.price-item.price)*data.unit*item.number)|mathFloor(4) }}
                  </em>
                </h3>
                <h3 v-if="!marketSocketData.consymbols" class="green_color">0.00</h3>
              </div>
              <div>
                <p>{{ $t('tradeLang.lang234') }}</p>
                <h3 v-for="data in marketSocketData.consymbols" :key="data.tradcoin">
                  <em v-if="data.tradcoin==item.tradcoin" :class="[((data.price-item.price)*data.unit*item.number)>=0?'green_color':'red_color']">
                    {{ (((data.price-item.price)*data.unit*item.number)*100/item.position)|mathFloor(2) }}%
                  </em>
                </h3>
                <h3 v-if="!marketSocketData.consymbols" class="green_color">0.00%</h3>
              </div>
            </li>
            <li v-if="item.type=='sell'" class="profit_box flex_between">
              <!--(当前-建仓)*unit*张数-->
              <div>
                <p>{{ $t('tradeLang.lang233') }}({{ item.maincoin }})</p>
                <!-- <h3 :class="[item.income>=0?'green_color':'red_color']">{{item.income}}({{(item.income*100/item.position)|mathFloor(2)||'--'}}%)</h3> -->
                <h3 v-for="data in marketSocketData.consymbols" :key="data.tradcoin">
                  <em v-if="data.tradcoin==item.tradcoin" :class="[((item.price-data.price)*data.unit*item.number)>=0?'green_color':'red_color']">
                    {{ ((item.price-data.price)*data.unit*item.number)|mathFloor(4) }}
                  </em>
                </h3>
                <h3 v-if="!marketSocketData.consymbols" class="green_color">0.00</h3>
              </div>
              <div>
                <p>{{ $t('tradeLang.lang234') }}</p>
                <h3 v-for="data in marketSocketData.consymbols" :key="data.tradcoin">
                  <em v-if="data.tradcoin==item.tradcoin" :class="[((item.price-data.price)*data.unit*item.number)>=0?'green_color':'red_color']">
                    {{(((item.price-data.price)*data.unit*item.number)*100/item.position)|mathFloor(2)||'--'}}%
                  </em>
                </h3>
                <h3 v-if="!marketSocketData.consymbols" class="green_color">0.00%</h3>
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
          <div v-if="addPositionList.length==0&&positionLaod" class="no_data">
            <p class="icon_no_data" />
            <span>{{ $t('commonLang.lang5') }}</span>
          </div>
        </van-tab>
        <van-tab :title="$t('tradeLang.lang183')">
          <van-list v-model="loading" :finished="finished" @load="loadMoreHistory">
            <ol v-for="item in historyList" :key="item.autoid" class="position_box block_bg" @click="showPosterPopup(item)">
              <li class="position_top flex_between">
                <h2>{{ item.tradcoin }}/{{ item.maincoin }}</h2>
                <i>{{ item.wdate }}</i>
                <em v-if="item.type=='buy'" class="green_bg">{{ $t('tradeLang.lang145') }}·{{ item.tdMode=='lsolate'?$t('tradeLang.lang147'):$t('tradeLang.lang148') }}·{{ item.lever }}X</em>
                <em v-if="item.type=='sell'" class="red_bg">{{ $t('tradeLang.lang146') }}·{{ item.tdMode=='lsolate'?$t('tradeLang.lang147'):$t('tradeLang.lang148') }}·{{ item.lever }}X</em>
              </li>
              <li class="position_center flex_between">
                <div>
                  <span>{{ $t('tradeLang.lang150') }}({{ item.maincoin }})</span>
                  <p>{{ item.price||'--' }}</p>
                  <span>{{ $t('tradeLang.lang161') }}</span>
                  <p>{{ item.profit||'--' }}</p>
                </div>
                <div>
                  <span>{{ $t('tradeLang.lang151') }}</span>
                  <p>{{ item.number||'--' }}</p>
                  <span>{{ $t('tradeLang.lang68') }}</span>
                  <p>{{ item.gas||'--' }}</p>
                </div>
                <div>
                  <span>{{ $t('tradeLang.lang155') }}</span>
                  <p :class="[item.income>=0?'green_color':'red_color']">{{ item.income }}({{(item.income*100/item.position)|mathFloor(2)||'--'}}%)</p>
                  <span>{{ $t('tradeLang.lang155a') }}</span>
                  <p>{{ item.fess||'--' }}</p>
                </div>
              </li>
              <li class="position_bottom flex_between">
                <div>
                  <span>{{ $t('tradeLang.lang156') }}</span>
                  <p>{{ item.position||'--' }}</p>
                </div>
                <div>
                  <span>{{ $t('tradeLang.lang186') }}</span>
                  <p>{{ item.last_profit||'--' }}</p>
                </div>
                <div>
                  <span>{{ $t('tradeLang.lang187') }}</span>
                  <p>{{ item.closedate||'--' }}</p>
                </div>
              </li>
            </ol>
          </van-list>
          <div v-if="historyList.length==0&&historyLaod" class="no_data">
            <p class="icon_no_data" />
            <span>{{ $t('commonLang.lang5') }}</span>
          </div>
        </van-tab>
        <van-tab :title="$t('tradeLang.lang184')">
          <div v-for="item in nowEntrust" :key="item.autoid" class="record_box block_bg van-hairline--bottom">
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
                <span v-for="data in marketSocketData.consymbols" v-if="data.tradcoin==item.tradcoin" :class="[data.rise>=0?'green_color':'red_color']">{{ data.price }}</span>
                <span v-if="!marketSocketData.consymbols">--</span>
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
          <div v-if="nowEntrust.length==0&&entrustLoad" class="no_data">
            <p class="icon_no_data" />
            <span>{{ $t('commonLang.lang5') }}</span>
          </div>
        </van-tab>
        <van-tab :title="$t('tradeLang.lang185')">
          <van-list v-if="recordList.length>0" v-model="loading" :finished="finished" @load="loadMore">
            <div v-for="item in recordList" :key="item.autoid" class="record_box block_bg van-hairline--bottom">
              <div class="record_top">
                <em v-if="item.type=='buy'" class="green_bg">{{ $t('tradeLang.lang145') }}·{{ item.tdMode=='lsolate'?$t('tradeLang.lang147'):$t('tradeLang.lang148') }}·{{ item.lever }}X</em>
                <em v-if="item.type=='sell'" class="red_bg">{{ $t('tradeLang.lang146') }}·{{ item.tdMode=='lsolate'?$t('tradeLang.lang147'):$t('tradeLang.lang148') }}·{{ item.lever }}X</em>
                <span>{{ item.tradcoin }}/{{ item.maincoin }}</span>
                <p>{{ item.wdate }}</p>
              </div>
              <h3 class="record_price_box">{{ item.entrust_price }}</h3>
              <ol class="record_bottom">
                <li class="record_left">
                  <p>{{ $t('tradeLang.lang143') }}</p>
                  <span>{{ item.point||'--' }}</span>
                  <p>{{ $t('tradeLang.lang68') }}</p>
                  <span>{{ item.gas||'--' }}</span>
                </li>
                <li class="record_center">
                  <p>{{ $t('tradeLang.lang151') }}</p>
                  <span>{{ item.number }}</span>
                  <p>{{ $t('tradeLang.lang150') }}({{ item.maincoin }})</p>
                  <span>{{ item.price }}</span>
                </li>
                <li class="record_right">
                  <p>{{ $t('tradeLang.lang153') }}</p>
                  <span>{{ item.style=='limit'?$t('tradeLang.lang109'):$t('tradeLang.lang110') }}</span>
                  <p>{{ $t('tradeLang.lang117') }}</p>
                  <span>{{ item.state|entrustState() }}</span>
                </li>
              </ol>
            </div>
          </van-list>
          <div v-if="recordList.length==0&&isload" class="no_data">
            <p class="icon_no_data" />
            <span>{{ $t('commonLang.lang5') }}</span>
          </div>
        </van-tab>
      </van-tabs>

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
    </div>

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
import { allPosition, closePosition, closeAllPosition, historyPosition, tradEntrust, closeEntrust, tradHistory } from '@api/futures'
export default {
  components: { poster },
  data() {
    return {
      active: Number(sessionStorage.getItem('contractRecord')) || 0,
      isSticky: false,

      addPositionList: [],
      positionLaod: false,
      timeoutPositionObj: null,
      positionData: {}, // 持仓选中数据

      closePopup: false,
      closeNum: '',

      historyLoading: false,
      historyFinished: true,
      historySearchData: {
        page: 1,
        limit: 20
      },
      historyList: [],
      historyLaod: false,

      timeoutObj: null,
      nowEntrust: [],
      entrustLoad: true,

      recordList: [],
      searchData: {
        page: 1,
        limit: 30
      },
      isload: false,
      loading: false,
      finished: true,

      reversePopup: false,
      reverseData: {},

      historyPopup: false,
      historyData: {},
      historyKey: ''
    }
  },
  computed: {
    ...mapState({
      marketSocketData: state => state.trade.marketSocketData,
      headerHeight: state => state.common.headerHeight
    })
  },
  watch: {
    active(val) {
      sessionStorage.setItem('contractRecord', val)
      this.initData()
    }
  },
  beforeDestroy() {
    this.timeoutObj && clearTimeout(this.timeoutObj)
    this.timeoutPositionObj && clearTimeout(this.timeoutPositionObj)
  },
  created() {
    this.initData()
  },
  mounted() {
    setTimeout(() => {
      this.isSticky = true
    }, 1000)
  },
  methods: {
    initData() {
      if (this.active == 0) {
        this.getAllPosition()
      } else if (this.active == 1) {
        this.timeoutObj && clearTimeout(this.timeoutObj)
        this.timeoutPositionObj && clearTimeout(this.timeoutPositionObj)
        this.contradtTradOrder()
      } else if (this.active == 2) {
        this.getNowEntrust()
      } else if (this.active == 3) {
        this.timeoutObj && clearTimeout(this.timeoutObj)
        this.timeoutPositionObj && clearTimeout(this.timeoutPositionObj)
        this.getHistoryEntrust()
      }
    },

    getAllPosition() {
      this.timeoutPositionObj && clearTimeout(this.timeoutPositionObj)
      allPosition().then(res => {
        this.positionLaod = true
        this.addPositionList = res.data
        if (this.addPositionList.length > 0) {
          this.timeoutPositionObj = setTimeout(() => {
            this.getAllPosition()
          }, 10000)
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
        Toast({ message: res.msg })
        this.closePopup = false
        this.getAllPosition()
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
          this.getAllPosition()
        })
      }).catch(() => {})
    },

    allClose() {
      Dialog.confirm({
        message: this.$t('tradeLang.lang188'),
        confirmButtonText: this.$t('commonLang.lang9'),
        cancelButtonText: this.$t('commonLang.lang1')
      }).then(() => {
        closeAllPosition().then(res => {
          Toast(res.msg)
          this.getAllPosition()
        })
      }).catch(() => {})
    },

    contradtTradOrder() {
      this.historyLoading = false
      this.historySearchData.page = 1
      historyPosition(this.historySearchData).then(res => {
        this.historyLaod = true
        this.historyLoading = false
        if (res.data && res.data.length > 0) {
          this.historyList = res.data
          this.historyFinished = res.count == this.historyList.length
        } else {
          this.historyList = []
        }
      })
    },
    loadMoreHistory() {
      this.historySearchData.page += 1
      historyPosition(this.historySearchData).then(res => {
        this.historyLoading = false
        this.historyFinished = true
        this.historyList = this.historyList.concat(res.data)
        this.historyFinished = res.count == this.historyList.length
      })
    },

    getNowEntrust() {
      tradEntrust({ page: 1, limit: 100 }).then(res => {
        this.isload = true
        this.nowEntrust = res.data
        this.timeoutObj && clearTimeout(this.timeoutObj)
        if (this.nowEntrust.length > 0) {
          this.timeoutObj = setTimeout(() => {
            this.getNowEntrust()
          }, 10000)
        }
      })
    },
    closeEntrustOrder(data) {
      Dialog.confirm({
        message: this.$t('tradeLang.lang133'),
        confirmButtonText: this.$t('commonLang.lang9'),
        cancelButtonText: this.$t('commonLang.lang1')
      }).then(() => {
        closeEntrust({ id: data.autoid }).then(res => {
          Toast(res.msg)
          this.getNowEntrust()
        })
      }).catch(() => {})
    },

    getHistoryEntrust() {
      this.isload = false
      this.searchData.page = 1
      tradHistory(this.searchData).then(res => {
        this.isload = true
        this.loading = false
        if (res.data && res.data.length > 0) {
          this.recordList = res.data
          this.finished = res.count == this.recordList.length
        } else {
          this.recordList = []
        }
      })
    },
    loadMore() {
      this.searchData.page += 1
      tradHistory(this.searchData).then(res => {
        this.loading = false
        this.finished = true
        this.recordList = this.recordList.concat(res.data)
        this.finished = res.count == this.recordList.length
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
<style lang='scss' scoped>
.position_box{
  padding: 15px;
  border-bottom: 1px solid $lineColor;
  .position_top{
    line-height: 20px;
    margin-bottom: 15px;
    h2{
      font-size: 15px;
      span{
        font-weight: normal;
        font-size: 12px;
        line-height: 16px;
        padding: 3px 10px;
        border-radius: 3px;
        margin-left: 5px;
        color: $fontColor;
        vertical-align: text-top;
      }
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
  .position_bottom{
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba($lineColor,.5);
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
    display: flex;
    align-items: center;
    button{
      background-color: rgba($mainColor,1);
      color: var(--fontColor);
      height: 28px;
      line-height: 1;
      font-size: 12px;
      border-radius: 2px;
      border: none;
      flex:1;
      margin-right: 15px;
      &:last-child{
        margin-right: 0;
      }
    }
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
      padding: 5px 5px 5px 10px;
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
      border: 1Px solid var(--input-border-color);
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

.record_box{
  padding: 15px;
  .record_top{
    display: flex;
    align-items: center;
    line-height: 20px;
    em{
      border-radius: 4px;
      font-size: 12px;
      padding: 2px 5px;
      text-align: center;
      color: $fontColor;
    }
    span{
      flex: 1;
      margin-left: 10px;
      font-weight: 600;
    }
    p{
      font-size: 12px;
      color: $subFontColor;
    }
    a{
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
.record_list{
  padding: 10px 15px;
  line-height: 20px;
  border-bottom: 1px solid $lineColor;
  background-color: $bgColor;
  li{
    display: flex;
    &:nth-child(1){
      align-items: center;
      justify-content: space-between;
      div{
        font-weight: 600;
        span{
          font-size: 15px;
        }
        em{
          font-size: 13px;
        }
      }
      p{
        text-align: right;
        font-size: 12px;
        color: $subFontColor;
      }
    }
    &:nth-child(2){
      margin-top: 10px;
      div{
        flex: 1;
      }
      p{
        line-height: 22px;
        font-size: 12px;
        color: $subFontColor;
      }
      button{
        max-width: 50px;
        flex: 1;
        border-radius: 4px;
        color: $fontColor;
      }
    }
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
