<!-- 充币 -->
<template>
  <div>
    <nav-header :title="$t('tradeLang.lang35')" />
    <div class="main_content">
      <div class="coin_recharge_box">
        <div class="coin_name flex" @click="coinSheet = true">
          <van-image :src="`${baseImgUrl}/${coinData.symbol}`" />
          <h3>{{ coinData.symbol }}</h3>
          <label class="flex">
            <span>{{ $t('tradeLang.lang58') }}</span>
            <i class="iconfont icon-arrow-down"></i>
          </label>
        </div>
        <p class="qr_box"><img :src="imgQr" alt=""></p>
        <ul class="input_box">
          <li>
            <span>{{ $t('tradeLang.lang60') }}</span>
            <input type="text" :value="addressData.address" readonly>
          </li>

        </ul>
        <div class="submit_btn">
          <van-button type="primary" size="large" @click="$utils.promote()" :aria-label="addressData.address"
            :disabled="!addressData.address" class="copy_btn">
            {{ $t('commonLang.lang6') }}</van-button>
        </div>
      </div>
      <van-action-sheet v-model="coinSheet" :actions="coinList" @select="onSelect"
        :cancel-text="$t('commonLang.lang1')" />
      <div class="tip_box">
        <!-- <pre v-html="coinData.intitle"></pre> -->
        <p>{{ $t('tradeLang.lang62', { coin: coinData.coin }) }}</p>
        <p>{{ $t('tradeLang.lang63', { coin: coinData.coin, low: coinData.oneinlow }) }}</p>
      </div>
    </div>

  </div>
</template>

<script>
import qrcode from "qrcode";
import { getUdunCoinAddress, loadUdunSupportCoinList } from "@api/wallet"
import rechargeDialog from "./components/rechargeDialog"
export default {
  components: { rechargeDialog },
  data() {
    return {
      coinSheet: false,
      coinData: {},
      addressData: {},
      imgQr: '',
      tipText: '',
      orderPopup: false,
      model: {
        number: ''
      },
      coinList: [],
    };
  },
  computed: {
    coinImgUrl() {
      console.log(this.coinData);
      return '';
      //      return require(`@img/coin/${this.coinData.symbol}.png`).default;
    },

  },

  created() {
    this.loadUdunCoinList();
  },

  methods: {
    async loadUdunCoinList() {
      const res = await loadUdunSupportCoinList();
      this.coinList = res.data
      if (!this.coinList || this.coinList.length === 0) {
        return
      }
      this.initData(res.data)
    },
    initData(data) {
      if (data && data.length) {
        this.coinData = data[0];
        this.getAddress();
      }
    },
    onSelect(data) {
      this.coinSheet = false;
      console.log("data:", data)
      this.coinData = data
      this.getAddress();
    },
    getAddress() {
      this.addressData = {};
      this.imgQr = null;
      let data = {
        coin: this.coinData.symbol,
        mainCoinType: this.coinData.mainCoinType,
        symbol: this.coinData.symbol,
        blockname: "TRC",
      };
      getUdunCoinAddress(data).then(res => {
        this.addressData = { address: res.data };
        this.createQr();
      })
    },
    createQr() {
      var opts = { errorCorrectionLevel: "H", type: "image/png", rendererOpts: { quality: 0.3 } };
      qrcode.toDataURL(this.addressData.address, opts, (err, url) => {
        if (err) throw err;
        this.imgQr = url;
      });
    },
  },
}
</script>
<style lang='scss' scoped>
::v-deep .van-nav-bar {
  //background: transparent;
}

.icon-record {
  font-size: 18px;
  padding: 5px;
  font-weight: 600;
}

.coin_name {
  height: 48px;
  background: $blockColor;
  padding: 12px 15px;

  .van-image {
    flex: 1;
    max-width: 24px;
    width: 24px;
    height: 24px;
  }

  h3 {
    flex: 1;
    margin-left: 10px;
  }

  span {
    font-size: 12px;
    color: $subFontColor;
  }

  i {
    font-size: 14px;
    color: $subFontColor;
    margin-left: 5px;
  }
}

.chain_box {
  margin: 15px 15px 0;

  p {
    font-size: 12px;
  }

  ol {
    overflow: hidden;
    margin-top: 15px;

    li {
      float: left;
      text-align: center;
      line-height: 24px;
      height: 24px;
      color: $subFontColor;
      border: 1Px solid $lineColor;
      border-radius: 3px;
      padding: 0 10px;
      margin-right: 10px;
      font-size: 12px;
    }
  }

  .tab_selected {
    border: 1Px solid rgba($mainColor, .3);
    background-color: $mainColor;
    color: $bgColor;
  }
}

.coin_recharge_box {
  margin: 15px;
  border-radius: 4px;
  background-color: $bgColor;
  overflow: hidden;

  .qr_box {
    background-color: $blockColor;
    width: 50vw;
    height: 50vw;
    margin: 30px auto 0;
  }

  .info_box {
    text-align: center;
    padding-bottom: 20px;

    span {
      display: block;
      margin: 25px 0 10px;
      font-size: 12px;
      color: $subFontColor;
    }

    em {
      display: block;
      font-size: 12px;
      margin-top: 10px;
    }

    button {
      margin-top: 10px;
      padding: 10px 30px;
      border-radius: 2px;
      background-color: $mainColor;
      font-size: 14px;
      color: $bgColor;
    }

    .address_box {
      height: 40px;
      padding: 0 15px;
      line-height: 20px;
    }

    .tag_box {
      margin-top: 15px;
    }
  }

  .input_box {
    background-color: var(--inputBox-bgColor);

    li {
      padding: 15px 12px;
      display: flex;
      align-items: center;
      position: relative;
      line-height: 20px;

      &:first-child::after {
        position: absolute;
        content: "";
        left: 92px;
        bottom: 0;
        width: calc(100% - 104px);
        height: 1Px;
        background-color: $lineColor;
      }

      span {
        flex: 1;
        max-width: 80px;
      }

      input {
        flex: 1;
      }
    }
  }

  .submit_btn {
    margin: 30px 15px 10px;
  }
}

.tip_box {
  margin: 15px;
  color: $bgColor;
  font-size: 12px;
  line-height: 20px;
  // p{
  //   color: $subFontColor;
  //   font-size: 12px;
  //   margin-top: 10px;
  // }
}
</style>