<template>
  <div>
    <van-list v-model="loading" :finished="finished" @load="loadMore">
      <ol v-for="(item,index) in recordList" :key="index" class="record_list">
        <li class="flex_between">
          <h4>{{ item.title }} </h4>
          <span>{{ item.wdate }}</span>
        </li>
        <li class="flex_between">
          <h3 class="main_color"> {{ item.number }} {{ item.coin }} </h3>
          <p>{{ $t('tradeLang.lang53') }}{{ item.state|assetsState() }}</p>
        </li>
        <li>
          <p>{{ $t('tradeLang.lang54') }}{{ item.address }}</p>
        </li>
        <li>
          <p>hash: {{ item.hash }}</p>
        </li>
        <li v-if="item.type === 'out' && item.state === 'sending'">
          <van-button type="primary" size="large" @click="orderUndo(item)">{{ $t('tradeLang.lang111') }}</van-button>
        </li>
      </ol>
    </van-list>
    <div v-if="recordList.length==0&&isload" class="no_data">
      <p class="icon_no_data" />
      <span>{{ $t('commonLang.lang5') }}</span>
    </div>
  </div>
</template>

<script>
import {financeByTypeCoin, orderUndo} from '@api/wallet'
export default {
  props: ['type', 'coinName'],
  data() {
    return {
      searchData: {
        type: 'in',
        coin: '',
        page: 1,
        limit: 30
      },
      isload: false,
      loading: false,
      finished: true,
      recordList: []
    }
  },
  created() {
    this.getProfit()
  },
  methods: {
    getProfit() {
      this.recordList = []
      this.isload = false
      this.searchData.page = 1
      this.searchData.type = this.type
      this.searchData.coin = this.coinName
      financeByTypeCoin(this.searchData).then(res => {
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
      financeByTypeCoin(this.searchData).then(res => {
        this.loading = false
        this.finished = true
        this.recordList = this.recordList.concat(res.data)
        this.finished = res.count == this.recordList.length
      })
    },
    orderUndo(obj){
      orderUndo({ autoid : obj.autoid }).then(res=>{
        this.getProfit()
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.record_list {
  background-color: $blockColor;
  border-bottom: 1px solid $lineColor;
  padding: 15px;
  line-height: 22px;
  font-size: 13px;
  span {
    font-size: 12px;
  }
}
</style>
