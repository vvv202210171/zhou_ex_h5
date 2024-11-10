<template>
  <div>
    <nav-header :title="$t('tradeLang.lang37')" />
    <div class="main_content">
      <div class="transfer_top flex">
        <div class="point_box">
          <i v-for="n in 8" :key="n" />
        </div>
        <ol class="assets_name">
          <li class="flex_between" @click="showAssetsSheet('from')">
            <h3>{{ fromAssets }}</h3>
            <!-- <i v-show="!transferOut" class="iconfont icon-arrow-right"></i> -->
          </li>
          <li class="flex"><span class="sub_font">{{ $t('tradeLang.lang84') }}</span><em /></li>
          <li class="flex_between" @click="showAssetsSheet('to')">
            <h3>{{ toAssets }}</h3>
            <!-- <i v-show="transferOut" class="iconfont icon-arrow-right"></i> -->
          </li>
        </ol>
        <p @click="changeTransfer()"><img src="@img/wallet/icon_transfer.png" alt=""></p>
      </div>

      <div class="transfer_box">
        <div class="coin_name">
          <p>{{ $t('tradeLang.lang85') }}</p>
          <div class="flex_between" @click="showCoinSheet()">
            <h3>{{ coinData.name||'--' }}</h3>
            <label class="flex">
              <span class="sub_font">{{ $t('tradeLang.lang58') }}</span>
              <i class="iconfont icon-arrow-right" />
            </label>
          </div>
        </div>

        <div class="num_box">
          <p>{{ $t('tradeLang.lang6') }}</p>
          <div class="flex">
            <input v-model.number="number" v-input-line type="number" :placeholder="$t('tradeLang.lang86')">
            <em>{{ coinData.name }}</em>
            <h4 class="main_color" @click="number=usable">{{ $t('tradeLang.lang67') }}</h4>
          </div>
        </div>

        <div class="usable_box"><em>{{ $t('tradeLang.lang42') }}</em> {{ usable }}{{ coinData.name }}</div>
      </div>
      <div class="transfer_tip sub_font">{{ $t('tradeLang.lang87') }}</div>

      <div class="submit_btn">
        <van-button type="primary" size="large" :disabled="!number" @click="confirmTransfer()">{{ $t('tradeLang.lang37') }}</van-button>
      </div>
    </div>
    <van-action-sheet v-model="assetsSheet" :actions="assetsMenu" :cancel-text="$t('commonLang.lang1')" @select="onSelectAssets" />
    <van-action-sheet v-model="futuresSheet" :actions="futuresCoinList" :cancel-text="$t('commonLang.lang1')" @select="onSelectCoin" />
    <!-- <van-action-sheet v-model="faitSheet" :actions="faitCoinList" @select="onSelectCoin" :cancel-text="$t('commonLang.lang1')" /> -->

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { tradBalance, contractBalance, c2cBalance, contractTransfer, c2cTransfer } from '@api/wallet'
import { Toast } from 'vant'
export default {
  data() {
    return {
      transferOut: true,
      fromAssets: this.$t('tradeLang.lang1'),
      toAssets: this.$t('tradeLang.lang2'),
      assetsType: 'futures',

      assetsSheet: false,
      assetsMenu: [
        { name: this.$t('tradeLang.lang2'), type: 'futures' },
        { name: this.$t('tradeLang.lang88'), type: 'fait' }
      ],

      number: '',

      futuresSheet: false,
      faitSheet: false,

      coinData: {},
      usable: '0.00'
    }
  },

  computed: {
    ...mapState({
      futuresCoinList: state => state.wallet.futuresCoinList
      // faitCoinList:state => state.wallet.faitCoinList,
    })
  },

  watch: {
    futuresCoinList(val) {
      if (val.length) {
        this.assetsType == 'futures' && this.initCoinList(this.futuresCoinList)
      }
    }

    // faitCoinList(val){
    //   if(val.length){
    //     this.assetsType=='fait'&&this.initCoinList(this.faitCoinList)
    //   }
    // },
  },
  created() {
    if (this.futuresCoinList.length) {
      this.assetsType == 'futures' && this.initCoinList(this.futuresCoinList)
    } else {
      this.$store.dispatch('wallet/getFuturesAssets')
    }

    // if(this.faitCoinList.length){
    //   this.assetsType=='fait'&&this.initCoinList(this.faitCoinList)
    // }else{
    //   this.$store.dispatch('wallet/getFaitAssets')
    // }
  },

  methods: {
    initCoinList(data) {
      this.coinData = data[0]
      this.getBalance()
    },

    changeTransfer() {
      this.transferOut = !this.transferOut
      if (this.transferOut) {
        this.fromAssets = this.$t('tradeLang.lang1')
        if (this.assetsType == 'futures') {
          this.toAssets = this.$t('tradeLang.lang2')
        } else {
          this.toAssets = this.$t('tradeLang.lang88')
        }
      } else {
        this.toAssets = this.$t('tradeLang.lang1')
        if (this.assetsType == 'futures') {
          this.fromAssets = this.$t('tradeLang.lang2')
        } else {
          this.fromAssets = this.$t('tradeLang.lang88')
        }
      }
      this.number = ''
      this.getBalance()
    },

    showAssetsSheet(type) {
      return
      if (this.transferOut && type == 'to') {
        this.assetsSheet = true
      }
      if (!this.transferOut && type == 'from') {
        this.assetsSheet = true
      }
    },

    onSelectAssets(data) {
      if (data.type != this.assetsType) {
        if (this.transferOut) {
          this.toAssets = data.name
        } else {
          this.fromAssets = data.name
        }
        this.assetsType = data.type
        if (data.type == 'futures') {
          this.coinData = this.futuresCoinList[0]
        } else {
          // this.coinData = this.faitCoinList[0]
        }
        this.number = ''
        this.getBalance()
      }
      this.assetsSheet = false
    },

    showCoinSheet() {
      if (this.assetsType == 'futures') {
        this.futuresSheet = true
      } else {
        this.faitSheet = true
      }
    },
    onSelectCoin(data) {
      this.coinData = data
      this.number = ''
      this.getBalance()
      this.futuresSheet = false
      this.faitSheet = false
    },

    getBalance() {
      if (this.coinData.name) {
        if (!this.transferOut) {
          if (this.assetsType == 'futures') {
            contractBalance({ coin: this.coinData.name }).then(res => {
              this.usable = res.data.usable
            })
          } else {
            c2cBalance({ coin: this.coinData.name }).then(res => {
              this.usable = res.data.usable
            })
          }
        } else {
          tradBalance({ coin: this.coinData.name }).then(res => {
            this.usable = res.data.usable
          })
        }
      }
    },

    confirmTransfer() {
      if (this.number > this.usable) {
        Toast(this.$t('tradeLang.lang89'))
        return
      }

      if (this.assetsType == 'futures') {
        contractTransfer({
          type: this.transferOut ? 'in' : 'out',
          coin: this.coinData.name,
          number: this.number
        }).then(res => {
          Toast(res.msg)
          this.number = ''
          this.getBalance()
        })
      } else {
        c2cTransfer({
          type: this.transferOut ? 'in' : 'out',
          coin: this.coinData.name,
          number: this.number
        }).then(res => {
          Toast(res.msg)
          this.number = ''
          this.getBalance()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.transfer_top{
  margin: 8px 15px;
  background-color: var(--main-box-bgColor);
  padding: 15px 15px 15px 0;
  border-radius: 2px;
  .point_box{
    flex: 1;
    max-width: 40px;
    text-align: center;
    i{
      width: 4px;
      height: 4px;
      display: block;
      margin: 4px auto;
      background-color: $mainColor;
      border-radius: 100%;
      &:first-child,&:last-child{
        width: 10px;
        height: 10px;
      }
    }
  }
  .assets_name{
    flex: 1;
    li{
      height: 30px;
      span{
        margin-right: 15px;
      }
      em{
        flex: 1;
        height: 0;
        border-bottom: 1px solid $lineColor;
      }
      i{
        font-size: 14px;
        color: $subFontColor;
      }
    }
  }
  p{
    flex: 1;
    max-width: 30px;
    height: 30px;
    margin-left: 15px;
  }
}
.transfer_box{
  margin: 0 15px;
  padding: 20px 15px;
  border-radius: 2px;
  background-color: var(--main-box-bgColor);
  .coin_name{
    p{
      font-size: 12px;
      margin-bottom: 10px;
    }
    div{
      padding: 12px 0;
      border-bottom: 1px solid $lineColor;
    }
    i{
      font-size: 14px;
      color: $subFontColor;
      margin-left: 5px;
    }
  }
  .num_box{
    margin-top: 20px;
    p{
      font-size: 12px;
      margin-bottom: 15px;
    }
    div{
      height: 48px;
      padding: 14px 0 14px 12px;
      border: 1px solid $lineColor;
      border-radius: 2px;
      input{
        flex: 1;
        line-height: 20px;
        height: 20px;
      }

      em{
        padding: 0 15px;
        font-size: 12px;
        line-height: 18px;
        color: $subFontColor;
      }
      h4{
        border-left: 1px solid $lineColor;
        padding: 0 15px;
        font-size: 14px;
        line-height: 18px;
      }
    }
  }
  .usable_box{
    margin-top: 15px;
    font-size: 12px;
    em{
      color: $subFontColor;
    }
  }
}

.transfer_tip{
  padding: 15px;
}
.submit_btn{
  margin: 15px;
}
</style>
