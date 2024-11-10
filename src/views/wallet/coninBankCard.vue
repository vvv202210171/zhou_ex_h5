<template>
  <div>
    <nav-header :title="$t('commonLang.lang25')"> </nav-header>
    <div class="main_content">
      <div v-if="bankCardList != null" class="bankCard_box">
        <div class="bankCard">
          <span class="bankName">{{ bankCardList.bankName }}</span>
          <span class="cardNum title">{{ $t("commonLang.lang18") }}</span>
          <span class="num content">{{ bankCardList.bankAccount }}</span>
          <span class="phone title">{{ $t("commonLang.lang19") }}</span>
          <span class="phoneNum content">{{ bankCardList.phone }}</span>
          <span class="accName title">{{ $t("commonLang.lang20") }}</span>
          <span class="name content">{{ bankCardList.holderName }}</span>
        </div>
        <div class="tip-content">
          <div class="tip-title">{{ $t("commonLang.lang21") }}</div>
          <div class="tip-text">
            <span>{{ $t("commonLang.lang22") }}</span>
            <span>{{ $t("commonLang.lang23") }}</span>
          </div>
        </div>
      </div>
      <div v-else class="no_bankCard">
        <img src="@img/my/address_icon.png" alt="" />
        <p>{{ $t("commonLang.lang24") }}</p>
        <van-button @click="pushPath('/bindBankCard')">{{ $t("tradeLang.lang75") }}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccountBankCard } from "@api/wallet";
export default {
  data() {
    return {
      phone: "",
      isload: false,
      bankCardList: {},
      remark: "",
      bankCard: "",
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getBankCard();
  },

  methods: {
    initData(data) {
      if (data && data.length) {
        this.coinData = data[0];
      }
    },
    onSelectCoin(data) {
      this.coinData = data;
      this.coinSheet = false;
    },
    getBankCard() {
      this.isload = false;
      getAccountBankCard().then((res) => {
        this.isload = true;
        this.bankCardList = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-add {
  color: var(--icon-color);
}
.bankCard_box {
  margin: 12px;
  .bankCard {
    background-image: url("../../assets/img/my/bankCard.png");
    background-size: contain;
    background-repeat: no-repeat;
    width: 100%;
    height: 171px;
    position: relative;
    .title {
      font-size: 12px;
      font-weight: 500;
      color: #ae8501;
    }
    .content {
      font-size: 16px;
      font-weight: 600;
      color: #755a00;
    }
    .bankName {
      position: absolute;
      font-size: 20px;
      font-weight: 600;
      color: #755a00;
      left: 4%;
      top: 4%;
    }
    .cardNum {
      position: absolute;
      left: 4%;
      top: 18%;
    }
    .num {
      position: absolute;
      left: 4%;
      top: 28%;
    }
    .phone {
      position: absolute;
      left: 4%;
      bottom: 24%;
    }
    .phoneNum {
      position: absolute;
      left: 4%;
      bottom: 12%;
    }
    .accName {
      position: absolute;
      right: 33%;
      bottom: 24%;
    }
    .name {
      position: absolute;
      right: 40%;
      bottom: 12%;
    }
  }

  .tip-content {
    margin: 30px 0px;
    .tip-title {
      font-size: 16px;
      font-weight: 400;
      color: #efb90b;
    }
    .tip-text {
      display: grid;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      color: var(--title-color);
    }
  }
}
.no_bankCard {
  margin-top: 20vh;
  text-align: center;
  img {
    width: 150px;
    height: 150px;
  }
  p {
    margin: 15px 0;
    color: $subFontColor;
  }
  button {
    padding: 4px 20px;
    line-height: 32px;
    height: 32px;
    border-radius: 50px;
    border: 1px solid $mainColor;
    color: $mainColor;
    background-color: transparent;
  }
}
.choose_box {
  background-color: $blockColor;
  border-bottom: 8px solid $bgColor;
  padding: 12px 15px;
  i {
    font-size: 14px;
    color: $subFontColor;
    margin-left: 5px;
  }
}
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
