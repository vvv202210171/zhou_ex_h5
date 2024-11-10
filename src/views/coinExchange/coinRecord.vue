<!-- 委托 -->
<template>
  <div>
    <tabHeader v-model="active" :title-arr="headerArr" line />
    <div class="main_content block_bg">
      <van-list v-model="loading" :finished="finished" @load="loadMore">
        <ol v-for="(item,index) in orderList" :key="index">
          <li class="record_box">
            <div class="flex">
              <span :class="[item.type=='buy'?'green_bg':'red_bg']">
                {{ item.type=='buy'?$t('tradeLang.lang23'):$t('tradeLang.lang24') }}·{{ item.style=='limit'?$t('tradeLang.lang109'):$t('tradeLang.lang110') }}
              </span>
              <h3>{{ item.tradcoin }}/{{ item.maincoin }}</h3>
              <label>
                <a v-if="active==0" class="main_color" @click="closeEntrustOrder(item)">{{ $t('tradeLang.lang111') }}</a>
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
                <p v-if="active==0">
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
      </van-list>
      <div v-show="isload&&orderList.length==0" class="no_data">
        <p class="icon_no_data" />
        <span>{{ $t('commonLang.lang5') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import tabHeader from '@/components/tabHeader.vue'
import { entrustOrder, entrustHistory, closeEntrust } from '@api/exchange'
export default {
  components: { tabHeader },
  data() {
    return {
      active: 0,
      headerArr: [this.$t('tradeLang.lang108'), this.$t('tradeLang.lang134')],
      params: {},

      isload: false,
      loading: false,
      finished: true,
      searchData: {
        page: 1,
        limit: 20
      },
      orderList: []
    }
  },
  computed: {},
  watch: {
    active(val) {
      this.getRecord()
    }
  },
  created() {
    this.params = JSON.parse(this.$route.params.data)
    this.getRecord()
  },
  mounted() {

  },
  methods: {
    // 获取委托记录；
    getRecord() {
      this.isload = false
      this.orderList = []
      this.searchData.page = 1
      this.searchData = Object.assign(this.searchData, this.params)
      if (this.active == 0) {
        entrustOrder(this.searchData).then(res => {
          this.isload = true
          this.loading = false
          if (res.data && res.data.length > 0) {
            this.orderList = res.data
            this.finished = res.count == this.orderList.length
          } else {
            this.orderList = []
          }
        })
      } else {
        entrustHistory(this.searchData).then(res => {
          this.isload = true
          this.loading = false
          if (res.data && res.data.length > 0) {
            this.orderList = res.data
            this.finished = res.count == this.orderList.length
          } else {
            this.orderList = []
          }
        })
      }
    },
    loadMore() {
      this.searchData.page += 1
      if (this.active == 0) {
        entrustOrder(this.searchData).then(res => {
          this.isload = true
          this.loading = false
          if (res.data && res.data.length > 0) {
            this.orderList = res.data
            this.finished = res.count == this.orderList.length
          } else {
            this.orderList = []
          }
        })
      } else {
        entrustHistory(this.searchData).then(res => {
          this.isload = true
          this.loading = false
          this.orderList = this.orderList.concat(res.data)
          this.finished = res.count == this.orderList.length
        })
      }
    },
    closeEntrustOrder(data) {
      Dialog.confirm({
        message: this.$t('tradeLang.lang133'),
        confirmButtonText: this.$t('commonLang.lang9'),
        cancelButtonText: this.$t('commonLang.lang1')
      }).then(() => {
        closeEntrust({ id: data.autoid }).then(res => {
          Toast(res.msg)
          this.getRecord()
        })
      }).catch(() => {})
    }
  }
}
</script>
<style lang='scss' scoped>
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
