<!-- 充币 -->
<template>
  <div>
    <nav-header :title="$t('tradeLang.lang35')" />
    <div class="main_content">
      <div class="coin_recharge_box">
        <div class="coin_name flex" @click="coinSheet = true">
          <van-image :src="`${baseImgUrl}/${coinData.logo}`" />
          <h3>{{ coinData.coin }}</h3>
          <label class="flex">
            <span>{{ $t("tradeLang.lang58") }}</span>
            <i class="iconfont icon-arrow-down"></i>
          </label>
        </div>
        <div class="chain_box">
          <p>{{ $t("tradeLang.lang59") }}</p>
          <ol>
            <li v-for="(item, index) in chainArr" :key="index" :class="[{ tab_selected: chainName == item.symbol }]"
              @click="changeChain(item)">
              {{ item.symbol }}
            </li>
          </ol>
        </div>
        <p class="qr_box"><img :src="imgQr" alt="" /></p>
        <div class="info_box">
          <!-- <div class="address_box">{{addressData.address}}</div>
          <button class="copy_btn" :aria-label="addressData.address" @click="$utils.promote()">{{$t('commonLang.lang6')}}</button> -->
          <!-- <div class="tag_box" v-if="coinData.istag=='enable'">{{addressData.tag}}</div>
          <em class="main_color" v-if="coinData.istag=='enable'">{{$t('tradeLang.lang61')}}</em>
          <button class="copy_btn" v-if="coinData.istag=='enable'" :aria-label="addressData.tag" @click="$utils.promote()">{{$t('commonLang.lang6')}}</button> -->
        </div>
        <ul class="input_box">
          <li>
            <span>{{ $t("tradeLang.lang60") }}</span>
            <input type="text" :value="addressData.address" readonly />
            <button class="copy_btn" :aria-label="addressData.address" @click="$utils.promote()">
              {{ $t("commonLang.lang6") }}
            </button>
          </li>
          <li>
            <span>{{ $t("tradeLang.lang275") }}</span>
            <input type="text" v-model="model.number" :placeholder="$t('tradeLang.lang276')" />
            <small class="sub_font">{{ coinData.coin }}</small>
          </li>
          <li>
            <span>{{ $t("commonLang.rechargeJietu") }}</span>
            <van-uploader upload-icon="photo" v-model="imgArr" :max-count="1" multiple :max-size="5 * 1024 * 1024"
              accept="image/*" @oversize="onOversize" />
          </li>
        </ul>
        <div class="submit_btn">
          <van-button type="primary" size="large" @click="confirmAction" :disabled="!model.number ||
            imgArr.length != 1 ||
            !addressData.address ||
            Number(model.number) < Number(coinData.oneinlow)
            ">
            {{ $t("commonLang.lang2") }}</van-button>
        </div>
      </div>
      <van-action-sheet v-model="coinSheet" :actions="coinList" @select="onSelect"
        :cancel-text="$t('commonLang.lang1')" />
      <div class="tip_box">
        <!-- <pre v-html="coinData.intitle"></pre> -->
        <p>{{ $t("tradeLang.lang62", { coin: coinData.coin }) }}</p>
        <p>
          {{
            $t("tradeLang.lang63", {
              coin: coinData.coin,
              low: coinData.oneinlow,
            })
          }}
        </p>
      </div>
    </div>

    <!-- <van-overlay :show="orderPopup">
      <div class="pay_popup" @click.stop>
        <rechargeDialog
          @cancelAction="orderPopup = false"
          @confirmAction="confirmAction"
        />
      </div>
    </van-overlay> -->
  </div>
</template>

<script>
import qrcode from "qrcode";
import { mapGetters, mapState } from "vuex";
import { getCoinAddress, rgaddFiatPayOrder } from "@api/wallet";
import rechargeDialog from "./components/rechargeDialog";
import { Toast } from "vant";
import $upload from "@/assets/js/upload";
import { editRealName } from "@api/user";
export default {
  components: { rechargeDialog },
  data() {
    return {
      coinSheet: false,
      coinData: {},
      addressData: {},
      imgQr: "",
      chainArr: [],
      chainName: "ERC",
      tipText: "",
      imgArr: [],
      orderPopup: false,
      model: {
        number: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      coinList: "rechargeCoinList",
    }),
    ...mapState({
      baseImgUrl: (state) => state.common.baseImgUrl,
    }),
  },
  watch: {
    coinList(data) {
      this.initData(data);
    },
  },
  created() {
    this.$store.dispatch("wallet/getRechargeCoins");
    this.initData(this.coinList);
  },
  mounted() { },
  methods: {
    initData(data) {
      if (data && data.length) {
        this.coinData = data[0].coinArr[0];
        this.chainArr = data[0].coinArr;
        this.chainName = this.coinData.symbol;
        this.getAddress(this.coinData.blockname);
      }
    },
    onOversize() {
      Toast(this.$t("accountLang.lang135"));
    },
    changeChain(data) {
      if (data.symbol != this.chainName) {
        this.chainName = data.symbol;
        this.coinData = data;
        this.getAddress(this.coinData.blockname);
      }
    },

    onSelect(data) {
      this.coinSheet = false;
      if (this.coinData.coin == data.name) {
        return;
      }
      this.coinData = data.coinArr[0];
      this.chainArr = data.coinArr;
      this.chainName = this.coinData.symbol;
      this.getAddress(this.coinData.blockname);
    },
    getAddress(blockname) {
      this.addressData = {};
      this.imgQr = null;
      let data = {
        coin: this.coinData.coin,
        symbol: this.coinData.symbol,
        blockName: blockname,
      };
      getCoinAddress(data).then((res) => {
        this.addressData = res.data;
        this.createQr();
      });
    },
    createQr() {
      var opts = {
        errorCorrectionLevel: "H",
        type: "image/png",
        rendererOpts: { quality: 0.3 },
      };
      qrcode.toDataURL(this.addressData.address, opts, (err, url) => {
        if (err) throw err;
        this.imgQr = url;
      });
    },
    confirmAction() {
      const imgurl = this.imgArr[0];
      $upload.uploadImg(imgurl.file).then((url1) => {
        const params = {
          coin: this.coinData.coin,
          blockname: this.coinData.blockname,
          imgurl: url1,
          number: this.model.number,
          address: this.addressData.address,
        };
        rgaddFiatPayOrder(params).then((res) => {
          Toast(res.msg);
          if (res.code === 200) {
            sessionStorage.setItem(
              "balancesData",
              JSON.stringify(this.coinData)
            );
            this.$router.push("/balanceRecord");
          }
        });
      });
    },
  },
};
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
      border: 1px solid $lineColor;
      border-radius: 3px;
      padding: 0 10px;
      margin-right: 10px;
      font-size: 12px;
    }
  }

  .tab_selected {
    border: 1px solid rgba($mainColor, 0.3);
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
        height: 1px;
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