<template>
  <div>

    <nav-header title="兑现" />
    <div class="center-content">
      <div class="flex_center base-line">
        <h1 class="h1">{{ amountCurr }}</h1>
        <span>算力</span>
      </div>
      <div class="flex_center grey fee">兑换≈ {{ currentBbai }}<strong class="sub_color">&nbsp; BBAI</strong> </div>
      <div class="flex_center grey fee">手续费≈ {{ fee }}<strong class="sub_color">&nbsp;BBAI</strong> </div>
      <div class="flex_center grey fee">燃烧费≈ {{ fire }}<strong class="sub_color">&nbsp;BBAI</strong> </div>
      <div class="flex_center  fee green_color">实际到账≈ {{ last }}<strong class="sub_color">&nbsp;BBAI</strong> </div>
    </div>

    <van-number-keyboard :show="show" theme="custom" extra-key="." v-model="amount"
      :close-button-text="active == 0 ? '兑换' : '卖出'" @close="buyOrSell" class="block_bg keyboard" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { bbaiWithdraw } from "@api/node";
export default {
  data() {
    return {
      show: true,
      active: 0,
      amount: "0",
      selectOps: 0,
      quickOps: [{ text: "快捷支付", value: 0 }],
      coinOps: [],
      selectCoin: "",
    };
  },
  computed: {
    amountCurr() {
      return parseFloat(this.amount);
    },
    ...mapState({
      marketSocketData: (state) => state.trade.marketSocketData,
      getConfig: (state) => state.common.getConfig,
    }),
    fee() {
      if (!this.getConfig) {
        return 0;
      }
      return (this.currentBbai * this.getConfig.BBAI_WITHDRAW_FEE / 100).toFixed(2)
    },
    last() {
      return (this.currentBbai - this.fee - this.fire).toFixed(2);
    },
    fire() {
      if (!this.getConfig) {
        return 0;
      }
      return (this.currentBbai * this.getConfig.BBAI_WITHDRAW_FIRE_FEE / 100).toFixed(2)
    },
    currentBbai() {
      if (!this.marketSocketData || !this.marketSocketData.symbols) {
        return 0;
      }
      const bbai = this.marketSocketData.symbols.find(v => v.tradcoin === 'BBAI');
      // 仅返回计算结果，不修改其他属性
      return bbai ? (bbai.price * this.amountCurr).toFixed(2) : 0;
    },
    currentCoin() {
      // 返回当前选择的 coin 名称
      const selectedOption = this.coinOps.find(
        (op) => op.value === this.selectCoin
      );
      return selectedOption ? selectedOption.text : "";
    },
  },

  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

    async buyOrSell() {
      if (!this.amountCurr || this.amountCurr <= 0) {
        return;
      }
      const ret = await bbaiWithdraw({ number: this.amountCurr });
      if (ret.code == 200) {
        this.pushPath("/withdrawRecord")
      }
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss">
.title {
  font-size: 16px;
  font-weight: 400;
  color: white;
  margin: 10px 0;
}

.select {
  margin-right: 10px;

  .right {
    background: $bgColor;

    .van-dropdown-menu__item {
      background: $bgColor;

      .van-dropdown-menu__title {
        color: white;
      }
    }

    .van-image {
      flex: 1;
      max-width: 22px;
      width: 22px;
      height: 22px;
    }

    .coin {
      font-size: 12px;
      margin-left: 5px;
    }
  }
}

.bg {
  background: $bgColor;

  .van-dropdown-menu__item {
    background: $bgColor;

    .van-dropdown-menu__title {
      color: white;
    }
  }
}

.tab {
  padding: 0 20px;
  background-color: $bgColor;

  .van-tab {
    margin-right: 40px;
    background-color: $bgColor;
  }

  .van-tabs__nav {
    background-color: $bgColor;
  }
}

.keyboard {
  .van-key {
    background: #666666;
  }

  .van-key--blue {
    background-color: #efa70a;
  }
}

.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 280px;

  /* 可根据需要调整 */
  .grey {
    color: var(--subFontColor);
  }

  .fee {
    margin-bottom: 15px;
  }

  .base-line {
    align-items: baseline;
    margin-bottom: 20px;

    .h1 {
      font-size: 38px;
    }
  }
}
</style>