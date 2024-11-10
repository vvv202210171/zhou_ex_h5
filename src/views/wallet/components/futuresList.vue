<template>
  <div>
    <div class="total_balance">
      <p>{{ $t('tradeLang.lang39') }}(USDT)</p>
      <div>
        <h2>{{ futuresAmount.usdt||'0.00' }}</h2>
        <span>≈ {{ rateData.symbol }}{{ (futuresAmount.usdt*rateData.price)|mathFloor(2) }}</span>
      </div>
    </div>
    <div class="assets_sub_box">
      <van-checkbox v-model="hideChecked" shape="square" icon-size="16" checked-color="#F0B90A">{{ $t('tradeLang.lang40') }}</van-checkbox>
      <div class="assets_search">
        <img src="@img/wallet/balance_search.png" alt="">
        <input v-model="searchVal" type="text" :placeholder="$t('tradeLang.lang41')">
      </div>
    </div>
    <ol v-for="(item,index) in futuresCoinList" v-if="(hideChecked&&item.usable!=0)||(!hideChecked)" v-show="item.coin.indexOf(searchVal.toLocaleUpperCase())!=-1" :key="index+item.coin+item.blockname" class="coin_list">
      <li class="flex_between">
        <h4 class="main_color">{{ item.coin }}</h4>
        <!-- <i class="iconfont icon-arrow-right"></i> -->
      </li>
      <li class="assets_info flex_between">
        <dl>
          <dt>{{ $t('tradeLang.lang45') }}</dt>
          <dt class="text_hide">{{ item.usable|mathFloor(4) }}</dt>
        </dl>
        <dl>
          <dt>{{ $t('tradeLang.lang46') }}</dt>
          <dt class="text_hide">{{ item.orders|mathFloor(4) }}</dt>
        </dl>
      </li>
      <li class="assets_info flex_between">
        <dl>
          <dt>{{ $t('tradeLang.lang47') }}</dt>
          <dt class="text_hide">{{ item.profit|mathFloor(4) }}</dt>
        </dl>
        <dl>
          <dt>{{ $t('tradeLang.lang48') }}</dt>
          <dt class="text_hide">{{ item.entrust|mathFloor(4) }}</dt>
        </dl>
        
      </li>
    </ol>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      searchVal: '',
      hideChecked: false,
    }
  },
  computed: {
    ...mapState({
      futuresAmount: state => state.wallet.futuresAmount,
      futuresCoinList: state => state.wallet.futuresCoinList,
      rateData: state => state.wallet.rateData
    })
  },
  created() {
    this.$store.dispatch('wallet/getFuturesAssets')
  },
}
</script>

<style lang="scss" scoped>
.total_balance{
  padding: 20px 15px;
  border-bottom: 8px solid $bgColor;
  p{
    font-size: 12px;
    color: $subFontColor;
  }
  div{
    margin-top: 10px;
    display: flex;
    align-items: center;
    h2{
      margin-right: 10px;
      font-size: 24px;
      line-height: 24px;
    }
    span{
      font-size: 12px;
      color: $subFontColor;
    }
  }
}

.earn_balance{
  padding: 20px;
  border-bottom: 8px solid $bgColor;
  display: flex;
  justify-content: space-between;
  span{
    font-size: 12px;
    color: $subFontColor;
  }
}

.assets_sub_box{
  padding: 15px 15px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ::v-deep .van-checkbox__label{
    font-size: 12px;
    color: $subFontColor;
  }

  ::v-deep .van-icon{
    border-radius: 5px;
  }

  .assets_search{
    display: flex;
    align-items: center;
    flex: 1;
    max-width: 100px;
    border: 1px solid $lineColor;
    padding: 4px 10px;
    font-size: 12px;
    line-height: 20px;
    border-radius: 5px;
    img{
      width: 14px;
      margin-right: 5px;
    }
  }
}

.coin_list {
  background: $blockColor;
  padding: 15px 15px 12px;
  border-bottom: 1px solid $lineColor;
  i {
    font-size: 16px;
    color: rgba($subFontColor,.5);
  }
  li{
    &:nth-child(1){
      margin-bottom: 10px;
    }
  }
  .assets_info{
    display: flex;
    align-items: center;
    dl{
      flex: 1;
      &:nth-child(2){
        text-align: center;
      }
      &:last-child{
        text-align: right;
      }
      dt{
        line-height: 24px;
        font-weight: 550;
        &:nth-child(1){
          font-size: 12px;
          color: $subFontColor;
          font-weight: normal;
        }
      }
    }
  }
}
</style>
