<template>
  <div>
    <nav-header :title="$t('tradeLang.lang36')" />
    <div class="main_content main_bg">
      <div class="withdraw_box block_bg">
        <div class="coin_name flex" @click="coinSheet = true">
          <van-image :src="`${baseImgUrl}/${coinData.logo}`" />
          <h3>{{ coinData.coin }}</h3>
          <label class="flex">
            <span>{{ $t("tradeLang.lang58") }}</span>
            <i class="iconfont icon-arrow-down" />
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
        <ol class="input_box">
          <li>
            <van-tabs type="card" v-model="active" @change="changeTab" animated>
              <van-tab :title="$t('commonLang.lang32')">
                <div class="flex input_content">
                  <input v-model="address" v-input-line type="text" :placeholder="$t('tradeLang.lang65')"
                    :readonly="true" />
                  <span v-show="isPlus" @click="goScan()"><img src="@img/wallet/icon_scan.png" alt="" /></span>
                  <span @click="showAddressSheet()"><img src="@img/wallet/icon_address.png" alt="" /></span>
                </div>
              </van-tab>
              <!-- <van-tab :title="$t('commonLang.lang33')"
                ><div class="flex input_content">
                  <input
                    v-model="address"
                    v-input-line
                    type="text"
                    :placeholder="$t('commonLang.lang34')"
                    :readonly="true"
                  />
                  <span @click="showBankCardSheet()"
                    ><img src="@img/my/my_menu_10.png" alt=""
                  /></span></div
              ></van-tab> -->
            </van-tabs>
          </li>
          <li>
            <p>{{ $t("tradeLang.lang6") }}</p>
            <div class="flex input_content">
              <input v-model.number="number" v-input-line type="number" :placeholder="$t('tradeLang.lang66')" />
              <em>{{ coinData.coin }}</em>
              <h4 class="main_color" @click="number = coinInfo.usable">
                {{ $t("tradeLang.lang67") }}
              </h4>
            </div>
            <label class="flex_between">
              <span><em>{{ $t("tradeLang.lang42") }}</em> {{ coinInfo.usable }}
                {{ coinData.coin || "--" }}</span>
              <span><em>{{ $t("tradeLang.lang68") }} {{ coinData.outgas * number / 100 }}
                  {{ coinData.coin || "--" }}</em></span>
            </label>
          </li>
          <li>
            <p>{{ $t("tradeLang.lang69") }}</p>
            <h2>
              {{
                number > coinData.outgas ? number - coinData.outgas * number / 100 : "0.00"
              }}
              {{ coinData.coin }}
            </h2>
          </li>
        </ol>
      </div>

      <div class="submit_btn">
        <van-button type="primary" size="large" :disabled="!(address && number)" @click="showPayDialog()">{{
          $t("tradeLang.lang36") }}</van-button>
      </div>
      <div class="withdraw_tip">
        <p class="sub_font">
          {{
            $t("tradeLang.lang70", {
              oneoutheight: coinData.oneoutheight,
              low: coinData.oneoutlow,
              height: coinData.dayoutheight,
            })
          }}
        </p>
      </div>
    </div>
    <van-action-sheet v-model="coinSheet" :actions="coinList" :cancel-text="$t('commonLang.lang1')"
      @select="onSelectCoin" />
    <van-action-sheet v-model="addressSheet" :actions="addressList" :cancel-text="$t('commonLang.lang1')"
      @select="onSelectAddress" />
    <van-action-sheet v-model="bankCardSheet" :actions="bankCardList" :cancel-text="$t('commonLang.lang1')"
      @select="onSelectBankCard" />

    <appDialog v-model="tipPopup" :title="tipData.title" :text="tipData.text" :confirm-text="tipData.btnText"
      @confirmAction="pushPath(tipData.path)" />

    <!-- <div class="pay_popup" v-show="payPopup">

    </div> -->
    <van-overlay :show="payPopup" @click="payPopup = false">
      <div class="pay_popup" @click.stop>
        <passwordDialog v-model="payPass" @cancelAction="payPopup = false" @confirmAction="confirmPass" />
      </div>
    </van-overlay>

    <van-popup v-model="scanPopup" class="right_popup" position="right" close-on-popstate overlay-class="block_bg">
      <scan :key="scanKey" @getScanText="getScanResult" />
    </van-popup>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import scan from "./components/scan.vue";
import appDialog from "@/components/appDialog.vue";
import passwordDialog from "@/components/passwordDialog.vue";
import { mapState, mapGetters } from "vuex";
import { withdrawalTips, outCoin, getAccountBankCard } from "@api/wallet";
import { data } from "jquery";
export default {
  components: { scan, appDialog, passwordDialog },
  data() {
    return {
      active: 0,
      isPlus: !!window.plus,
      coinSheet: false,
      coinData: {},
      chainArr: [],
      chainName: "",

      coinInfo: {},
      addressSheet: false,
      addressList: [],
      bankCardSheet: false,
      bankCardList: [{ name: "", subname: "" }],

      tipPopup: false,
      tipData: {},

      address: "",
      number: "",

      payPopup: false,
      payPass: "",

      scanPopup: false,
      scanKey: "",
    };
  },
  computed: {
    ...mapGetters({
      coinList: "withdrawCoinList",
    }),
    ...mapState({
      userInfo: (state) => state.user.userInfo,
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

  methods: {
    initData(data) {
      if (data && data.length) {
        this.coinData = data[0].coinArr[0];
        this.chainArr = data[0].coinArr;
        this.chainName = this.coinData.symbol;
        this.getOutCoinInfo();
        this.getAccountBankCard();
      }
    },

    getOutCoinInfo() {
      this.addressList = [];
      this.coinInfo = {};
      withdrawalTips({ coin: this.coinData.coin }).then((res) => {
        this.coinInfo = res.data.assets;
        res.data.toaddress.forEach((data) => {
          data.name = data.title;
          if (data.coin == this.coinData.coin) {
            this.addressList.push(data);
          }
        });
      });
    },

    getAccountBankCard() {
      getAccountBankCard().then((res) => {
        if (res.data !== null) {
          this.bankCardList[0].name = res.data.bankName;
          this.bankCardList[0].subname = res.data.bankAccount;
        }
      });
    },

    onSelectCoin(data) {
      if (this.coinData.coin != data.name) {
        this.coinData = data.coinArr[0];
        this.chainArr = data.coinArr;
        this.chainName = this.coinData.symbol;
        this.address = "";
        this.number = "";
        this.getOutCoinInfo();
      }
      this.coinSheet = false;
    },

    changeTab() {
      if (this.address != "") {
        this.address = "";
      }
    },

    changeChain(data) {
      this.chainName = data.symbol;
      this.coinData = data;
    },

    showAddressSheet() {
      if (this.addressList.length) {
        this.addressSheet = true;
      } else {
        this.tipData = {
          title: this.$t("tradeLang.lang73"),
          text: this.$t("tradeLang.lang74"),
          btnText: this.$t("tradeLang.lang75"),
          path: "/coinAddress",
        };
        this.tipPopup = true;
      }
    },
    onSelectAddress(data) {
      this.address = data.address;
      this.addressSheet = false;
    },
    showBankCardSheet() {
      if (this.bankCardList[0].name) {
        this.bankCardSheet = true;
      } else {
        this.tipData = {
          title: this.$t("commonLang.lang25"),
          text: this.$t("commonLang.lang24"),
          btnText: this.$t("tradeLang.lang75"),
          path: "/bindBankCard",
        };
        this.tipPopup = true;
      }
    },
    onSelectBankCard(data) {
      this.address = data.subname;
      this.bankCardSheet = false;
    },

    showPayDialog() {
      if (this.userInfo.idcardstate != "completed") {
        this.tipData = {
          title: this.$t("tradeLang.lang76"),
          text: this.$t("tradeLang.lang77"),
          btnText: this.$t("tradeLang.lang78"),
          path: "/idAuth",
        };
        this.tipPopup = true;
        return;
      }
      if (this.userInfo.tradpasswordstate != "true") {
        this.tipData = {
          title: this.$t("tradeLang.lang72"),
          text: this.$t("tradeLang.lang79"),
          btnText: this.$t("tradeLang.lang80"),
          path: "/modifyPayPass",
        };
        this.tipPopup = true;
        return;
      }
      if (Number(this.number) > Number(this.coinInfo.usable)) {
        Toast(this.$t("tradeLang.lang81"));
        return;
      }
      this.payPass = "";
      this.payPopup = true;
    },

    confirmPass() {
      outCoin({
        type: this.active ? "bank" : "coin",
        address: this.address,
        number: this.number,
        blockName: this.coinData.blockname,
        coin: this.coinData.coin,
        tradPassword: this.payPass,
      }).then((res) => {
        Toast(res.msg);
        this.number = "";
        this.getOutCoinInfo();
        this.getAccountBankCard();
      });
    },

    goScan() {
      if (window.plus) {
        this.pushState("?scanPopup");
        this.scanKey = Date.now();
        this.scanPopup = true;
      } else {
        Toast(this.$t("tradeLang.lang82"));
      }
    },
    getScanResult(data) {
      this.address = data;
      this.goBack();
    },
  },
};
</script>

<style lang="scss" scoped>
.withdraw_box {
  margin: 10px 15px;
  padding: 0 15px 15px;
  border-radius: 4px;
  overflow: hidden;
}

.coin_name {
  height: 48px;
  padding: 12px 0;
  border-bottom: 1px solid rgba($lineColor, 0.5);

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
  margin-top: 25px;

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

.input_box {
  li {
    margin-top: 25px;

    p {
      font-size: 12px;
      margin-bottom: 15px;
    }

    .input_content {
      height: 48px;
      padding: 14px 0 14px 12px;
      border: 1px solid $lineColor;
      border-radius: 2px;

      input {
        flex: 1;
        line-height: 20px;
        height: 20px;
      }

      span {
        &:nth-child(2) {
          border-right: 1px solid $lineColor;
        }

        img {
          margin: 0 15px;
          width: 18px;
          height: 18px;
        }
      }

      em {
        padding: 0 15px;
        font-size: 12px;
        line-height: 18px;
        color: $subFontColor;
      }

      h4 {
        border-left: 1px solid rgba($lineColor, 0.5);
        padding: 0 15px;
        font-size: 14px;
        line-height: 18px;
      }
    }

    label {
      font-size: 12px;
      padding: 15px 0 20px;
      border-bottom: 1px solid rgba($lineColor, 0.5);

      em {
        color: $subFontColor;
      }
    }

    h2 {
      font-size: 16px;
    }
  }

  ::v-deep .van-tabs {
    .van-tabs__wrap {
      height: auto;

      .van-tabs__nav {
        margin: 0;
        height: auto;

        .van-tab {
          padding: 4px;

          .van-tab__text {
            word-break: break-all;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }

    .van-tabs__content {
      margin-top: 20px;
    }
  }
}

.submit_btn {
  margin: 20px 15px;
}

.withdraw_tip {
  padding: 0 15px;
}
</style>
