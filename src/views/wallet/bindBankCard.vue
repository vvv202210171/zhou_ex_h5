<template>
  <div>
    <nav-header :title="$t('commonLang.lang25')" />
    <div class="main_content">
      <ol class="input_box block_bg">
        <li>
          <p>{{ $t("commonLang.lang20") }}:</p>
          <div class="input_div flex">
            <input v-model.trim="holderName" v-input-line type="text" :placeholder="$t('commonLang.lang27')" />
          </div>
        </li>
        <li>
          <p>{{ $t("commonLang.lang26") }}</p>
          <div class="input_div flex">
            <input v-model.trim="bankName" v-input-line type="text" :placeholder="$t('commonLang.lang28')" />
          </div>
        </li>
        <li>
          <p>{{ $t("commonLang.lang29") }}</p>
          <div class="input_div flex">
            <input v-model.trim="bankAccount" v-input-line type="text" :placeholder="$t('commonLang.lang30')" />
          </div>
        </li>
        <li>
          <p>{{ $t("commonLang.lang31") }}</p>
          <div class="input_div flex">
            <label class="flex_center" @click="showAreaCodePopup()">
              <span>+{{ areaCode }}</span>
              <em class="iconfont icon-arrow-down" />
            </label>
            <input v-model.trim="phone" v-input-line type="text" :placeholder="$t('accountLang.lang6')" />
            <i v-show="!!phone" class="iconfont icon-text-close" @click="phone = ''" />
          </div>
        </li>
      </ol>
      <div class="submit_btn">
        <van-button type="primary" size="large" :disabled="!(holderName && bankName && bankAccount && phone && areaCode)" @click="saveBankCard()">{{ $t("commonLang.lang2") }}</van-button>
      </div>
    </div>
    <van-popup v-model="areaCodePopup" class="right_popup" position="right" close-on-popstate overlay-class="block_bg">
      <areaCodeTmp @selecteArea="selecteArea" />
    </van-popup>
  </div>
</template>
<script>
import { saveBankCard } from "@api/wallet";
import areaCodeTmp from "./../user/components/areaCode.vue";
import { Toast, Dialog } from "vant";
export default {
  components: { areaCodeTmp },
  data() {
    return {
      coinData: {},
      isload: false,
      holderName: "",
      bankName: "",
      bankAccount: "",
      phone: "",
      areaCode: localStorage.getItem("defaultCode") || "1",
      areaCodePopup: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.$store.dispatch("common/getAreaCode");
  },

  methods: {
    showAreaCodePopup() {
      this.pushState("?areaCodePopup");
      this.areaCodePopup = true;
    },
    selecteArea(data) {
      this.areaCode = data.mobilePrefix;
    },

    saveBankCard() {
      const params = {
        holderName: this.holderName,
        bankName: this.bankName,
        bankAccount: this.bankAccount,
        areaCode: this.areaCode,
        phone: this.phone,
      };
      saveBankCard(params).then((res) => {
        Toast(res.msg);
        this.goBack();
      });
    },
  },
};
</script>

<style lang="scss">
.input_box {
  padding: 20px 15px;
  li {
    margin-bottom: 20px;
  }
  p {
    font-size: 12px;
    margin-bottom: 12px;
  }
  .input_div {
    height: 48px;
    padding: 14px 12px 14px 0;
    border: 1px solid $lineColor;
    border-radius: 2px;
    label {
      flex: 1;
      max-width: 70px;
      border-right: 1px solid $lineColor;
      em {
        font-size: 12px;
        margin-left: 3px;
      }
    }
    input {
      flex: 1;
      padding-left: 12px;
      line-height: 20px;
    }
    i {
      font-size: 16px;
      color: $subFontColor;
    }
  }
}
.submit_btn {
  margin: 20px 12px;
}
</style>
