<template>
  <div>
    <nav-header :title="coinName" />
    <div class="main_content block_bg">
      <div class="record_top_box">
        <div class="balance_box">
          <span>{{ $t('tradeLang.lang49') }}</span>
          <h2>{{ (Number(coinBalance.usable) + Number(coinBalance.disable))|mathFloor(8) }}</h2>
          <div class="flex_between">
            <p>{{ $t('tradeLang.lang42') }}</p>
            <span>{{ coinBalance.usable|mathFloor(8) }}</span>
          </div>
          <div class="flex_between">
            <p>{{ $t('tradeLang.lang43') }}</p>
            <span>{{ coinBalance.disable|mathFloor(8) }}</span>
          </div>
          <div class="flex_between">
            <p>{{ $t('tradeLang.lang44') }}({{ rateData.coin }})</p>
            <span>{{ ((Number(coinBalance.usable) + Number(coinBalance.disable)) * coinBalance.usdt *rateData.price)|mathFloor(2) }}</span>
          </div>
        </div>
      </div>
      <van-tabs v-model="active" border :sticky="isSticky" :offset-top="headerHeight" swipeable line-width="20" line-height="2">
        <van-tab :title="$t('tradeLang.lang50')">
          <billList :key="coinName+'in'" type="in" :coin-name="coinName" />
        </van-tab>
        <van-tab :title="$t('tradeLang.lang51')">
          <billList :key="coinName+'out'" type="out" :coin-name="coinName" />
        </van-tab>
        <van-tab :title="$t('tradeLang.lang52')">
          <billList :key="coinName+'system'" type="system" :coin-name="coinName" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import billList from './components/billList.vue'
import { tradBalance } from '@api/wallet'
import { mapState } from 'vuex'
export default {
  components: { billList },
  data() {
    return {
      coinName: 'USDT',
      balancesData: JSON.parse(sessionStorage.getItem('balancesData')),
      coinBalance: {},
      active: 0,
      isSticky: false
    }
  },

  computed: {
    ...mapState({
      headerHeight: state => state.common.headerHeight,
      rateData: state => state.wallet.rateData
    })
  },
  watch: {},
  created() {
    this.coinName = this.balancesData.coin
    this.getBalance()
  },
  mounted() {
    setTimeout(() => {
      this.isSticky = true
    }, 100)
  },
  methods: {
    getBalance() {
      tradBalance({ coin: this.coinName }).then(res => {
        this.coinBalance = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.record_top_box{
  background-color: $bgColor;
  padding: 8px 15px;
}
.balance_box{
  background-color: $mainColor;
  padding: 15px;
  color: $bgColor;
  border-radius: 4px;
  h2{
    line-height: 30px;
    font-size: 26px;
    margin: 10px 0;
  }
  span{
    font-size: 12px;
  }
  div{
    margin-top: 5px;
    line-height: 20px;
    font-size: 13px;
    p{
      font-size: 12px;
    }
  }
}

</style>
