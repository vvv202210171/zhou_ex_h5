<template>
  <div>
    <nav-header :title="$t('tradeLang.lang272')" />
    <div class="main_content block_bg">
      <van-tabs v-model="active" border line-height="1" :offset-top="headerHeight" sticky>
        <van-tab :title="$t('tradeLang.lang108')">
          <ol v-for="(item,index) in entrustRecord" :key="index">
            <li class="record_box">
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
                  <span>{{ $t('tradeLang.lang113') }}</span>
                  <em>{{ item.wdate }}</em>
                </label>
                <label>
                  <span>{{ $t('tradeLang.lang114') }}</span>
                  <em>{{ item.number }}</em>
                  <p>
                    <span>{{ $t('tradeLang.lang115') }}</span>
                    <em>{{ item.unfilled||0 }}</em>
                  </p>
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
          <div v-show="entrustLoad&&entrustRecord.length==0" class="no_data">
            <p class="icon_no_data" />
            <span>{{ $t('commonLang.lang5') }}</span>
          </div>
        </van-tab>
        <van-tab :title="$t('tradeLang.lang134')">
          <van-list v-model="loading" :finished="finished" @load="loadMore">
            <ol v-for="(item,index) in historyList" :key="index">
              <li class="record_box">
                <div class="flex">
                  <span :class="[item.type=='buy'?'green_bg':'red_bg']">
                    {{ item.type=='buy'?$t('tradeLang.lang23'):$t('tradeLang.lang24') }}·{{ item.style=='limit'?$t('tradeLang.lang109'):$t('tradeLang.lang110') }}
                  </span>
                  <h3>{{ item.tradcoin }}/{{ item.maincoin }}</h3>
                  <label />
                </div>
                <section>
                  <label>
                    <span>{{ $t('tradeLang.lang112') }}</span>
                    <em>{{ item.price }}</em>
                    <span>{{ $t('tradeLang.lang113') }}</span>
                    <em>{{ item.wdate }}</em>
                  </label>
                  <label>
                    <span>{{ $t('tradeLang.lang114') }}</span>
                    <em>{{ item.number }}</em>
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
          </van-list>
          <div v-show="isload&&historyList.length==0" class="no_data">
            <p class="icon_no_data" />
            <span>{{ $t('commonLang.lang5') }}</span>
          </div>
        </van-tab>
        <van-tab :title="$t('tradeLang.lang273')">
          <van-list v-model="loading1" :finished="finished1" @load="loadMore1">
            <ol v-for="(item,index) in orderList" :key="index">
              <li class="record_box">
                <div class="flex">
                  <span :class="[item.type=='buy'?'green_bg':'red_bg']">
                    {{ item.type=='buy'?$t('tradeLang.lang23'):$t('tradeLang.lang24') }}
                  </span>
                  <h3>{{ item.tradcoin }}/{{ item.maincoin }}</h3>
                  <label>{{ item.wdate }}</label>
                </div>
                <section>
                  <label>
                    <span>{{ $t('tradeLang.lang112') }}</span>
                    <em>{{ item.price }}</em>
                  </label>
                  <label>
                    <span>{{ $t('tradeLang.lang114') }}</span>
                    <em>{{ item.number }}</em>
                  </label>
                  <label>
                    <span>{{ $t('tradeLang.lang116') }}</span>
                    <em>{{ (item.number*item.price)|mathFloor1(8) }}</em>
                  </label>
                </section>
              </li>
            </ol>
          </van-list>
          <div v-show="isload1&&orderList.length==0" class="no_data">
            <p class="icon_no_data" />
            <span>{{ $t('commonLang.lang5') }}</span>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Toast, Dialog } from 'vant'
import { tradEntrust, tradHistory, tradOrder, closeEntrust } from '@api/exchange'
export default {
  data() {
    return {
      active: 0,

      entrustLoad: false,
      entrustRecord: [],
      timeoutObj: null,

      isload: false,
      loading: false,
      finished: true,
      searchData: {
        page: 1,
        limit: 20
      },
      historyList: [],

      isload1: false,
      loading1: false,
      finished1: true,
      searchData1: {
        page: 1,
        limit: 30
      },
      orderList: []
    }
  },
  computed: {
    ...mapState({
      headerHeight: state => state.common.headerHeight
    })
  },
  watch: {
    active() {
      this.initData()
    }
  },
  beforeDestroy() {
    this.timeoutObj && clearTimeout(this.timeoutObj)
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      if (this.active == 0) {
        this.getTradEntrust()
      } else if (this.active == 1) {
        this.getTradHistory()
      } else if (this.active == 2) {
        this.getTradOrder()
      }
    },
    getTradEntrust() {
      tradEntrust({ page: 1, limit: 100 }).then(res => {
        this.entrustLoad = true
        this.entrustRecord = res.data
        this.timeoutObj && clearTimeout(this.timeoutObj)
        if (this.entrustRecord.length > 0) {
          this.timeoutObj = setTimeout(() => {
            this.getTradEntrust()
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
          this.getTradEntrust()
        })
      }).catch(() => {})
    },

    getTradHistory() {
      this.isload = false
      this.searchData.page = 0
      this.loadMore()
    },
    loadMore() {
      this.searchData.page += 1
      tradHistory(this.searchData).then(res => {
        this.isload = true
        this.loading = false
        if (res.data && res.data.length) {
          this.historyList = this.searchData.page == 1 ? res.data : [...this.historyList, ...res.data]
        } else {
          this.historyList = []
        }
        this.finished = res.count == this.historyList.length
      })
    },

    getTradOrder() {
      this.isload1 = false
      this.searchData1.page = 0
      this.loadMore1()
    },
    loadMore1() {
      this.searchData1.page += 1
      tradOrder(this.searchData1).then(res => {
        this.isload1 = true
        this.loading1 = false
        if (res.data && res.data.length) {
          this.orderList = this.searchData1.page == 1 ? res.data : [...this.orderList, ...res.data]
        } else {
          this.orderList = []
        }
        this.finished1 = res.count == this.orderList.length
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.record_box{
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
      color: #fff;
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
</style>
