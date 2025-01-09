<template>
  <div>
    <nav-header :title="$t('tradeLang.zz')">
      <span slot="headerRight" class="right_img" @click="toRecord"><img src="@img/home/icon_record.png" alt="" /></span>
    </nav-header>
    <div class="main_content">
      <div class="transfer_box">
        <div class="coin_name">
          <p>{{ $t('tradeLang.lang85') }}</p>
          <div class="flex_between" @click="showCoinSheet()">
            <h3>{{ coinData.name || '--' }}</h3>
            <label class="flex">
              <span class="sub_font">{{ $t('tradeLang.lang58') }}</span>
              <i class="iconfont icon-arrow-right" />
            </label>
          </div>
        </div>
        <div class="num_box">
          <p>{{ $t("tradeLang.dkzh") }}</p>
          <div class="flex">
            <input v-model="receive" v-input-line type="number" :placeholder="$t('tradeLang.jyid')">
          </div>
        </div>
        <div class="num_box">
          <p>{{ $t("tradeLang.jymm") }}</p>
          <div class="flex">
            <input v-model="tradPass" v-input-line type="password" :placeholder="$t('tradeLang.lang71')">
          </div>
        </div>
        <div class="num_box">
          <p>{{ $t('tradeLang.lang6') }}</p>
          <div class="flex">
            <input v-model.number="number" v-input-line type="number" :placeholder="$t('tradeLang.lang86')">
            <em>{{ coinData.name }}</em>
            <h4 class="main_color" @click="number = usable">{{ $t('tradeLang.lang67') }}</h4>
          </div>
        </div>
        <div class="usable_box"><em>{{ $t('tradeLang.lang42') }}</em> {{ usable }}{{ coinData.name }}</div>


      </div>
      <div class="transfer_tip sub_font">{{ $t('tradeLang.lang87') }}</div>

      <div class="submit_btn">
        <van-button type="primary" size="large" :disabled="submitDisable" @click="confirmTransfer()">{{
          $t('tradeLang.lang37')
        }}</van-button>
      </div>
    </div>
    <van-action-sheet v-model="assetsSheet" :actions="assetsMenu" :cancel-text="$t('commonLang.lang1')"
      @select="onSelectAssets" />
    <van-action-sheet v-model="futuresSheet" :actions="futuresCoinList" :cancel-text="$t('commonLang.lang1')"
      @select="onSelectCoin" />
    <!-- <van-action-sheet v-model="faitSheet" :actions="faitCoinList" @select="onSelectCoin" :cancel-text="$t('commonLang.lang1')" /> -->

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { tradBalance, trans, loadSupportCoins } from '@api/wallet'
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
      receive: "",
      tradPass: "",

      futuresSheet: false,
      faitSheet: false,
      futuresCoinList: [],
      coinData: {},
      usable: '0.00'
    }
  },
  computed: {
    submitDisable() {
      if (!this.number) {
        return true
      }
      if (!this.receive) {
        return true
      }
      if (!this.tradPass) {
        return true
      }
      return false
    }
  },
  created() {
    this.loadSupportCOins();

  },

  methods: {
    async loadSupportCOins() {
      const ret = await loadSupportCoins();
      this.futuresCoinList = ret.data;
      this.coinData = this.futuresCoinList[0];
      this.getBalance()
    },
    toRecord() {
      this.pushPath('transRecord')
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
        tradBalance({ coin: this.coinData.name }).then(res => {
          this.usable = res.data.usable
        })
      }
    },

    async confirmTransfer() {
      if (this.number > this.usable) {
        Toast(this.$t('tradeLang.lang89'))
        return
      }
      const ret = await trans({ number: this.number, receive: this.receive, tradPass: this.tradPass, tradcoin: this.coinData.name });
      if (ret.code == 200) {
        this.toRecord();
      }

    }
  }
}
</script>

<style lang="scss" scoped>
.right_img {
  width: 20px;
}

.transfer_top {
  margin: 8px 15px;
  background-color: var(--main-box-bgColor);
  padding: 15px 15px 15px 0;
  border-radius: 2px;

  .point_box {
    flex: 1;
    max-width: 40px;
    text-align: center;

    i {
      width: 4px;
      height: 4px;
      display: block;
      margin: 4px auto;
      background-color: $mainColor;
      border-radius: 100%;

      &:first-child,
      &:last-child {
        width: 10px;
        height: 10px;
      }
    }
  }

  .assets_name {
    flex: 1;

    li {
      height: 30px;

      span {
        margin-right: 15px;
      }

      em {
        flex: 1;
        height: 0;
        border-bottom: 1px solid $lineColor;
      }

      i {
        font-size: 14px;
        color: $subFontColor;
      }
    }
  }

  p {
    flex: 1;
    max-width: 30px;
    height: 30px;
    margin-left: 15px;
  }
}

.transfer_box {
  margin: 0 15px;
  padding: 20px 15px;
  border-radius: 2px;
  background-color: var(--main-box-bgColor);

  .coin_name {
    p {
      font-size: 12px;
      margin-bottom: 10px;
    }

    div {
      padding: 12px 0;
      border-bottom: 1px solid $lineColor;
    }

    i {
      font-size: 14px;
      color: $subFontColor;
      margin-left: 5px;
    }
  }

  .num_box {
    margin-top: 20px;

    p {
      font-size: 12px;
      margin-bottom: 15px;
    }

    div {
      height: 48px;
      padding: 14px 0 14px 12px;
      border: 1px solid $lineColor;
      border-radius: 2px;

      input {
        flex: 1;
        line-height: 20px;
        height: 20px;
      }

      em {
        padding: 0 15px;
        font-size: 12px;
        line-height: 18px;
        color: $subFontColor;
      }

      h4 {
        border-left: 1px solid $lineColor;
        padding: 0 15px;
        font-size: 14px;
        line-height: 18px;
      }
    }
  }

  .usable_box {
    margin-top: 15px;
    font-size: 12px;

    em {
      color: $subFontColor;
    }
  }
}

.transfer_tip {
  padding: 15px;
}

.submit_btn {
  margin: 15px;
}
</style>
