<template>
  <div>
    <nav-header :title="$t('homeLang.lang54')" />
    <div class="main_content">
      <ol class="top_info">
        <li>
          <h3>{{ minerData.name || "--" }}</h3>
        </li>
        <li class="flex_between">
          <span>{{ $t("homeLang.lang55") }}</span>
          <label class="flex main_color"
            ><h4>{{ minerData.gas }}</h4>
            <em>%</em></label
          >
        </li>
        <li class="flex_between">
          <span>{{ $t("homeLang.lang56") }}</span>
          <p>{{ minerData.cycle }}</p>
        </li>
        <li class="flex_between">
          <span>{{ $t("homeLang.lang57") }}(USDT)</span>
          <p>{{ minerData.minNumber }} - {{ minerData.maxNumber }}</p>
        </li>
        <li class="flex_between">
          <span>{{ $t("homeLang.lang58") }}</span>
          <p>{{ $t("homeLang.lang59") }}</p>
        </li>
        <li class="flex_between">
          <span>{{ $t("homeLang.lang60") }}</span>
          <p>{{ $t("homeLang.lang61") }}</p>
        </li>
        <li class="flex_between">
          <span>{{ $t("homeLang.lang62") }}</span>
          <p>{{ minerData.returnGas }}%</p>
        </li>
      </ol>

      <ol class="input_box">
        <li>
          <p>{{ $t("homeLang.lang60") }}</p>
          <div class="flex">
            <input
              v-model.number="number"
              v-input-line
              type="number"
              :placeholder="$t('homeLang.lang63')"
            />
            <em>USDT</em>
            <h4 class="main_color" @click="number = usable">
              {{ $t("tradeLang.lang67") }}
            </h4>
          </div>
          <label class="flex_between">
            <span
              ><em>{{ $t("tradeLang.lang42") }}</em> {{ usable }} USDT</span
            >
          </label>
        </li>
        <li>
          <p class="sub_font">{{ $t("homeLang.lang64") }}(USDT)</p>
          <h2 v-if="number">
            {{
              ((number * minerData.cycle * minerData.gas) / 10000)
                | mathFloor(2)
            }}
          </h2>
          <h2 v-if="!number">0.00</h2>
        </li>
        <li>
          <p class="sub_font">{{ $t("homeLang.lang76") }}(USDT)</p>
          <h2 v-if="number">
            {{ ((number * minerData.gas) / 10000) | mathFloor(2) }}
          </h2>
          <h2 v-if="!number">0.00</h2>
        </li>
      </ol>

      <div class="submit_btn">
        <van-button type="primary" size="large" @click="showPayPopup()">{{
          $t("commonLang.lang9")
        }}</van-button>
      </div>
    </div>

    <van-overlay :show="payPopup" @click="payPopup = false">
      <div class="pay_popup" @click.stop>
        <passwordDialog
          v-model="payPass"
          @cancelAction="payPopup = false"
          @confirmAction="confirmPass"
        />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { tradBalance } from "@api/wallet";
import { addMinOrder } from "@api/miner";
import { Toast } from "vant";
import passwordDialog from "@/components/passwordDialog.vue";
export default {
  components: { passwordDialog },
  data() {
    return {
      minerData: JSON.parse(sessionStorage.getItem("minerData")),
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
      if (!this.$utils.isCorrectFigure(this.number)) {
        Toast(this.$t("homeLang.lang65"));
        return;
      }
      if (this.number > Number(this.usable)) {
        Toast(this.$t("homeLang.lang66"));
        return;
      }
      if (
        this.number < Number(this.minerData.minNumber) ||
        this.number > Number(this.minerData.maxNumber)
      ) {
        Toast(this.$t("homeLang.lang67"));
        return;
      }
      this.payPass = "";
      this.payPopup = true;
    },
    confirmPass() {
      addMinOrder({
        number: this.number,
        id: this.minerData.id,
        tradPassword: this.payPass,
      }).then((res) => {
        this.number = "";
        Toast(res.msg);
        this.$router.replace("/lockRecord");
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
  background-color: var(--inputBox-bgColor);
  li {
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
