<template>
  <div>
    <nav-header :title="$t('homeLang.lang54')" />
    <div class="main_content">
      <ol class="top_info">
        <li>
          <h3>{{ minerData.name || "--" }}</h3>
        </li>
        <li class="flex_between">
          <span>每次释放比例</span>
          <label class="flex main_color">
            <h4>{{ minerData.gas }}</h4>
            <em>%</em>
          </label>
        </li>
        <li class="flex_between">
          <span>周期</span>
          <p>{{ minerData.cycle }}</p>
        </li>
        <li class="flex_between">
          <span>价格({{ USDT }})</span>
          <p>{{ minerData.price }}</p>
        </li>
        <li class="flex_between">
          <span>剩余数量</span>
          <p>{{ minerData.remainingTime }}</p>
        </li>
        <li class="flex_between">
          <span>总数</span>
          <p>{{ minerData.totalTime }}</p>
        </li>
      </ol>

      <div class="submit_btn">
        <van-button type="primary" size="large" @click="showPayPopup()">购买</van-button>
      </div>
    </div>

    <van-overlay :show="payPopup" @click="payPopup = false">
      <div class="pay_popup" @click.stop>
        <passwordDialog v-model="payPass" @cancelAction="payPopup = false" @confirmAction="confirmPass" />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { tradBalance } from "@api/wallet";
import { addNodeOrder } from "@api/node";
import { Toast } from "vant";
import passwordDialog from "@/components/passwordDialog.vue";
export default {
  components: { passwordDialog },
  data() {
    return {
      minerData: JSON.parse(sessionStorage.getItem("nodeData")),
      number: "",
      usable: "",

      payPass: "",
      payPopup: false,
    };
  },

  created() {
    this.getBalance();
  },
  methods: {
    getBalance() {
      tradBalance({ coin: "USDT" }).then((res) => {
        this.usable = res.data.usable;
      });
    },

    showPayPopup() {
      if (this.minerData.price > Number(this.usable)) {
        Toast(this.$t("homeLang.lang66"));
        return;
      }

      this.payPass = "";
      this.payPopup = true;
    },
    confirmPass() {
      addNodeOrder({
        id: this.minerData.id,
        tradPassword: this.payPass,
      }).then((res) => {
        this.number = "";
        Toast(res.msg);
        this.$router.replace("/nodeRecord");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.top_info {
  margin: 15px;
  padding: 0 15px 15px;
  border-radius: 4px;
  background-color: $blockColor;

  li {
    line-height: 20px;
    margin-top: 12px;

    &:first-child {
      padding: 12px 0 10px;
      margin: 0;
      border-bottom: 1px solid $lineColor;
    }

    span {
      color: $subFontColor;
    }

    em {
      font-size: 12px;
      line-height: 12px;
    }
  }
}

.input_box {
  margin: 15px;
  padding: 15px;
  border-radius: 4px;
  background-color: var(--inputBox-bgColor);  li {
    &:last-child {
      margin-top: 15px;
    }

    p {
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

      span {
        &:nth-child(2) {
          border-right: 1px solid rgba($lineColor, 0.5);
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
      padding: 15px 0;
      border-bottom: 1px solid rgba($lineColor, 0.2);

      em {
        color: $subFontColor;
      }
    }

    h2 {
      font-size: 16px;
    }
  }
}

.submit_btn {
  margin: 25px 15px 15px;
}
</style>
