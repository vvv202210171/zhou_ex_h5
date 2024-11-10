<template>
  <div class="balance block_bg" @scroll="scrollEvent">
    <div ref="balancePlaceholder" class="placeholder_box" />
    <div ref="balanceTop" class="balance_top">
      <div class="blance_top_box">
        <div class="top_title flex_between">
          <p>{{ $t('tradeLang.lang34') }}(USDT)</p>
          <!-- <span @click="hideAssets=!hideAssets">
            <img v-show="!hideAssets" src="@img/wallet/eye_open.png" alt="">
            <img v-show="hideAssets" src="@img/wallet/eye_close.png" alt="">
          </span> -->
        </div>
        <h2 v-show="hideAssets">****.****</h2>
        <label v-show="hideAssets">≈ $****.**</label>
        <span v-show="!hideAssets">{{ assetsCount.usdt||'0.0000' }}</span>
        <label v-show="!hideAssets">≈ {{ rateData.symbol }}{{ (assetsCount.usdt*rateData.price)|mathFloor(2) }}</label>
      </div>
      <div class="earn_balance">
          <div>
            <span>{{ $t('tradeLang.lang279') }}(USDT)</span>
            <h3>{{todayEarning}}</h3>
          </div>
          <div class="linecenter">
          </div>
          <div>
            <span>{{ $t('tradeLang.lang280') }}(USDT)</span>
            <h3>{{ accountEarning }}</h3>
          </div>
        </div>
      <ol class="balance_menu flex">
        <li @click="rechargeChannelInfo">
          <img :src="require(`@img/wallet/menu${this.them}_1.png`)" alt="">
          <p>{{ $t('tradeLang.lang35') }}</p>
        </li>
        <li @click="pushPath('/coinWithdraw')">
          <img :src="require(`@img/wallet/menu${this.them}_2.png`)" alt="">
          <p>{{ $t('tradeLang.lang36') }}</p>
        </li>
        <li @click="pushPath('/coinTransfer')">
          <img :src="require(`@img/wallet/menu${this.them}_3.png`)" alt="">
          <p>{{ $t('tradeLang.lang37') }}</p>
        </li>
        <li @click="pushPath('/coinConvert')">
          <img :src="require(`@img/wallet/menu${this.them}_4.png`)" alt="">
          <p>{{ $t('tradeLang.lang38') }}</p>
        </li>
      </ol>
    </div>
    <div class="balance_bottom">
      <van-tabs v-model="active" :lazy-render="false" border :sticky="isSticky" :offset-top="0" :line-height="2" :line-width="20">
        <van-tab :title="$t('tradeLang.lang1')">
          <exchangeList />
        </van-tab>
        <van-tab :title="$t('tradeLang.lang2')">
          
          <futuresList />
        </van-tab>
        <!-- <van-tab title="法币">

          <faitList />
        </van-tab> -->
      </van-tabs>
    </div>
  </div>
</template>

<script>
import exchangeList from './components/exchangeList.vue'
import futuresList from './components/futuresList.vue'
// import faitList from "./components/faitList.vue"
import { mapState } from 'vuex'
import { Dialog } from 'vant'
import { rechargeChannel, getEarning} from '@api/user'

export default {
  components: { exchangeList, futuresList },
  data() {
    return {
      active: 0,
      isSticky: false,

      hideAssets: false,
 
      isHidePanel: false,
      accountEarning: 0,
      todayEarning: 0,
      them: "",
    }
  },
  computed: {
    ...mapState({
      assetsCount: state => state.wallet.assetsCount,
      rateData: state => state.wallet.rateData
    })
  },
  watch: {
  },
  beforeDestroy() {
    this.isHidePanel = false
  },
  created() {
    this.$store.dispatch('common/showFooter', true)
    this.$store.dispatch('common/updateSelectedFooter', 4)
    this.$store.dispatch('wallet/getAssetsCount')
    this.them = "_" + window._config.them
  },

  mounted() {
    this.$refs.balanceTop.style.paddingTop = `${this.$barHeight}px`
    this.$refs.balancePlaceholder.style.paddingTop = `${this.$barHeight}px`
    this.getearningInfos();
  },

  methods: {
    scrollEvent(e) {
      const scrollTop = e.target.scrollTop
      if (scrollTop > 20) {
        const opacity = (scrollTop / 10) * 0.2
        this.$refs.balancePlaceholder.style.backgroundColor = `rgb(240,185,10,${opacity})`
      } else {
        this.$refs.balancePlaceholder.style.backgroundColor = 'transparent'
      }
    },
    rechargeChannelInfo()
    {
      rechargeChannel().then(res => {
        if(res.data == 'SM')
        {
          this.pushPath('/coinRecharge');
        }
        else
        {
          Dialog.alert({
            //title: '标题',
            message: this.$t('commonLang.lang16'),
            confirmButtonText: this.$t('commonLang.lang9')
          }).then(() => {
            window.Tawk_API?.maximize();
          });
        }
      })
    },
    getearningInfos() {
      getEarning().then(res=>{
        this.accountEarning = res.data.accountEarnings;
        this.todayEarning = res.data.todayEarnings;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.balance {
  bottom: 50px;
  height: auto;

  .placeholder_box {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
  }
}

.balance_top {
  background-color: $mainColor;
  padding-bottom: 20px;

  .blance_top_box {
    padding: 15px 15px 15px;
    color: $bgColor;

    .top_title {
      p {
        font-size: 12px;
        padding-bottom: 5px;
      }

      img {
        width: 18px;
        height: 18px;
      }
    }

    h2 {
      font-size: 25px;
      line-height: 30px;
      margin: 10px 0 8px;
    }

    span{
      padding: 5px 0px 0px 0px;
      font-size: 25px;
      font-weight: bold;
    }

  }
}

.balance_menu {
  background-color: var(--mainIndex-balanceMenu-bgColor);
  color: var(--mainIndex-balanceMenu-color);
  border-radius: 10px;
  margin: 10px 10px;

  li {
    flex: 1;
    max-width: 25%;
    text-align: center;
    padding: 15px 0;
    font-size: 12px;

    img {
      width: 32px;
      height: 32px;
      display: block;
      margin: 0 auto 8px;
    }
  }
}

.balance_bottom {
  background-color: $blockColor;
  position: relative;
  margin-top: -20px;
  padding-top: 10px;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
}

.earn_balance{
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  background-color: rgba(255,255,255,0.15);
  margin-bottom: 5px;
  span{
    font-size: 12px;
    color: $bgColor;
  }

  h3{
    margin-top: 5px;
    color: $bgColor;
    text-align: center;
  }
}

.linecenter{
  border: 1px solid $mainColor;
  background-color: $mainColor;
}

</style>
