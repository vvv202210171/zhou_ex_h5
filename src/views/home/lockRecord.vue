<template>
  <div>
    <nav-header :title="$t('homeLang.lang68')" />
    <div class="main_content">
      <van-list v-model="loading" :finished="finished" @load="loadMore">
        <ol v-for="item in recordList" :key="item" class="record_box">
          <li class="flex_between">
            <h3>{{ item.name }}</h3>
            <span v-if="item.state=='enable'" class="main_color">{{ $t('homeLang.lang69') }}</span>
            <span v-if="item.state=='success'">{{ $t('homeLang.lang70') }}</span>
            <span v-if="item.state=='close'" class="sub_font">{{ $t('homeLang.lang71') }}</span>
          </li>
          <li class="flex_between">
            <em>{{ $t('homeLang.lang60') }}</em>
            <p>{{ item.payNumber||'0.00' }} {{ item.payCoin }}</p>
          </li>
          <li class="flex_between">
            <em>{{ $t('homeLang.lang72') }}</em>
            <p>{{ item.income||'0.00' }} {{ item.outCoin }}</p>
          </li>
          <li class="flex_between">
            <em>{{ $t('homeLang.lang73') }}</em>
            <p>{{ item.writedate |ts_local('yyyy-MM-dd')}}</p>
          </li>
          <li class="flex_between">
            <em>{{ $t('homeLang.lang74') }}</em>
            <p>{{ item.enddate|ts_local('yyyy-MM-dd') }}</p>
          </li>
          <li v-if="item.state=='enable'&&userInfo.minerState=='enable'">
            <van-button type="primary" size="large" @click="showPayPopup(item)">{{ $t('commonLang.lang1') }}</van-button>
          </li>
        </ol>
      </van-list>
      <div v-show="isload&&!recordList.length" class="no_data">
        <i class="icon_no_data" />
        <span>{{ $t('commonLang.lang5') }}</span>
      </div>
    </div>
    <van-overlay :show="payPopup" @click="payPopup = false">
      <div class="pay_popup" @click.stop>
        <passwordDialog v-model="payPass" @cancelAction="payPopup = false" @confirmAction="confirmPass" />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Toast, Dialog } from 'vant'
import { minOrder, redeemOrder } from '@api/miner'
import passwordDialog from '@/components/passwordDialog.vue'
export default {
  components: { passwordDialog },
  data() {
    return {
      recordList: [],
      searchData: {
        page: 0,
        limit: 30
      },
      isload: false,
      loading: false,
      finished: true,

      payPass: '',
      payPopup: false,
      id: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  created() {
    this.getRecord()
  },
  methods: {
    getRecord() {
      this.isload = false
      this.searchData.page = 0
      this.loadMore()
    },
    loadMore() {
      this.searchData.page += 1
      minOrder(this.searchData).then(res => {
        this.isload = true
        this.loading = false
        if (res.data && res.data.length) {
          this.recordList = this.searchData.page == 1 ? res.data : [...this.recordList, ...res.data]
        } else {
          this.recordList = []
        }
        this.finished = res.count == this.recordList.length
      })
    },

    showPayPopup(data) {
      Dialog.confirm({
        message: this.$t('homeLang.lang75'),
        confirmButtonText: this.$t('commonLang.lang9'),
        cancelButtonText: this.$t('commonLang.lang1')
      }).then(() => {
        this.id = data.id
        this.payPass = ''
        this.payPopup = true
      }).catch(() => {})
    },

    confirmPass() {
      redeemOrder({
        id: this.id,
        tradPassword: this.payPass
      }).then(res => {
        Toast(res.msg)
        this.getRecord()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.record_box{
  margin-bottom: 8px;
  padding: 0 15px 15px;
  background-color: $blockColor;
  li{
    line-height: 20px;
    margin-top: 12px;
    &:first-child{
      padding: 15px 0 12px;
      margin: 0;
      border-bottom: 1px solid $lineColor;
    }
    em{
      color: $subFontColor;
    }
    button{
      margin-top: 10px;
    }
  }
}
</style>
