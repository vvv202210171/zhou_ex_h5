<template>
  <div>
    <nav-header title="BBAI" :left-arrow="!inviteCodeReadonly">
      <h3 slot="headerTitle" class="header_title">BBAI</h3>
      <span
        v-if="!inviteCodeReadonly"
        slot="headerRight"
        class="main_color"
        @click="goBack()"
        >{{ $t("accountLang.lang1") }}</span
      >
      <span
        v-else
        slot="headerRight"
        class="main_color"
        @click="langSheet = true"
        >{{ $t("accountLang.lang145") }}</span
      >
    </nav-header>
    <div class="main_content">
      <div class="login_tip">
        <h2>{{ $t("accountLang.lang152") }}</h2>
        <p>
          {{ $t("accountLang.lang2") }}
          <em
            v-if="registerType == 'tel'"
            class="main_color"
            @click="registerType = 'email'"
            >{{ $t("accountLang.lang14") }}</em
          >
          <em
            v-if="registerType == 'email'"
            class="main_color"
            @click="registerType = 'tel'"
            >{{ $t("accountLang.lang15") }}</em
          >
        </p>
      </div>

      <ol class="input_box">
        <li>
          <p>{{ $t("accountLang.lang23") }}</p>
          <div class="input_div flex">
            <input
              v-model="inviteCode"
              v-input-line
              type="text"
              :readonly="inviteCodeReadonly"
              :placeholder="$t('accountLang.lang23a')"
            />
          </div>
        </li>
        <li v-show="registerType == 'tel'">
          <p>{{ $t("accountLang.lang5") }}</p>
          <div class="input_div flex">
            <label class="flex_center" @click="showAreaCodePopup()">
              <span>+{{ areaCode }}</span>
              <em class="iconfont icon-arrow-down" />
            </label>
            <input
              v-model.trim="phone"
              v-input-line
              type="text"
              :placeholder="$t('accountLang.lang6')"
            />
            <i
              v-show="!!phone"
              class="iconfont icon-text-close"
              @click="phone = ''"
            />
          </div>
        </li>
        <li v-show="registerType == 'email'">
          <p>{{ $t("accountLang.lang7") }}</p>
          <div class="input_div flex">
            <input
              v-model.trim="email"
              v-input-line
              type="text"
              :placeholder="$t('accountLang.lang8')"
            />
            <i
              v-show="!!email"
              class="iconfont icon-text-close"
              @click="email = ''"
            />
          </div>
        </li>
        <li>
          <p>{{ $t("accountLang.lang16") }}</p>
          <div class="input_div flex">
            <input
              v-model="password"
              v-input-line
              :type="passwordType"
              :placeholder="$t('accountLang.lang17')"
            />
            <i
              v-if="passwordType == 'password' && password"
              class="iconfont icon-eye-close"
              @click="passwordType = 'text'"
            />
            <i
              v-if="passwordType == 'text' && password"
              class="iconfont icon-eye-open"
              @click="passwordType = 'password'"
            />
          </div>
        </li>
        <li>
          <p>{{ $t("accountLang.lang18") }}</p>
          <div class="input_div flex">
            <input
              v-model="confirmPassword"
              v-input-line
              :type="confirmPasswordType"
              :placeholder="$t('accountLang.lang19')"
            />
            <i
              v-if="confirmPasswordType == 'password' && confirmPassword"
              class="iconfont icon-eye-close"
              @click="confirmPasswordType = 'text'"
            />
            <i
              v-if="confirmPasswordType == 'text' && confirmPassword"
              class="iconfont icon-eye-open"
              @click="confirmPasswordType = 'password'"
            />
          </div>
        </li>
        <li v-show="showVerCode">
          <p>{{ $t("accountLang.lang20") }}</p>
          <div class="ver_box flex">
            <div class="ver_input">
              <input
                v-model.trim="verCode"
                type="number"
                :placeholder="$t('accountLang.lang21')"
              />
            </div>
            <van-button
              v-show="!sendDisabled"
              :disabled="
                (registerType == 'tel' && !phone) ||
                (registerType == 'email' && !email)
              "
              @click="getVerCode()"
              >{{ $t("accountLang.lang22") }}</van-button
            >
            <van-button v-show="sendDisabled" disabled>{{ time }}S</van-button>
          </div>
        </li>
      </ol>
      <div v-if="showVerCode" class="submit_btn">
        <van-checkbox v-model="checked" shape="square" icon-size="16px">
          <label class="agree_text"
            >{{ $t("accountLang.lang24")
            }}<em @click="showAgreePopup()"
              >《{{ $t("accountLang.lang25") }}》</em
            ></label
          >
        </van-checkbox>
        <van-button
          v-show="registerType == 'tel'"
          type="primary"
          size="large"
          :disabled="
            !(phone && password && confirmPassword && verCode && checked)
          "
          @click="registerUser()"
          >{{ $t("accountLang.lang11") }}</van-button
        >
        <van-button
          v-show="registerType == 'email'"
          type="primary"
          size="large"
          :disabled="
            !(email && password && confirmPassword && verCode && checked)
          "
          @click="registerUser()"
          >{{ $t("accountLang.lang11") }}</van-button
        >
      </div>
      <div v-else class="submit_btn">
        <van-checkbox v-model="checked" shape="square" icon-size="16px">
          <label class="agree_text"
            >{{ $t("accountLang.lang24")
            }}<em @click="showAgreePopup()"
              >《{{ $t("accountLang.lang25") }}》</em
            ></label
          >
        </van-checkbox>
        <van-button
          v-show="registerType == 'tel'"
          type="primary"
          size="large"
          :disabled="!(phone && password && confirmPassword && checked)"
          @click="registerUser()"
          >{{ $t("accountLang.lang11") }}</van-button
        >
        <van-button
          v-show="registerType == 'email'"
          type="primary"
          size="large"
          :disabled="!(email && password && confirmPassword && checked)"
          @click="registerUser()"
          >{{ $t("accountLang.lang11") }}</van-button
        >
      </div>
    </div>
    <van-popup
      v-model="areaCodePopup"
      class="right_popup"
      position="right"
      close-on-popstate
      overlay-class="block_bg"
    >
      <areaCodeTmp @selecteArea="selecteArea" />
    </van-popup>
    <van-popup
      v-model="agreePopup"
      class="right_popup"
      position="right"
      close-on-popstate
      overlay-class="block_bg"
    >
      <nav-header :title="$t('accountLang.lang25')" />
      <div class="main_content">
        <userAgreement />
      </div>
    </van-popup>
    <van-action-sheet
      v-model="langSheet"
      :actions="langList"
      :cancel-text="$t('commonLang.lang1')"
      @select="onSelectLang"
    />
  </div>
</template>

<script>
import areaCodeTmp from "./components/areaCode.vue";
import { mapState } from "vuex";
import userAgreement from "./components/userAgreement.vue";
import { sendCode, userRegisterTel, userRegisterEmail } from "@api/user";
import { Toast } from "vant";
export default {
  components: { areaCodeTmp, userAgreement },
  data() {
    return {
      registerType: "email",
      phone: "",
      email: "",

      passwordType: "password",
      password: "",
      confirmPasswordType: "password",
      confirmPassword: "",

      verCode: "",
      sendDisabled: false,
      time: 60,

      inviteCode: "",
      inviteCodeReadonly: false,

      areaCode: localStorage.getItem("defaultCode") || "1",
      areaCodePopup: false,

      checked: false,
      agreePopup: false,

      langSheet: false,
      langList: [
        { name: "English", type: "EN" },
        { name: "繁體中文", type: "CN" },
        { name: "日本語", type: "JP" },
        { name: "한국어", type: "KO" },
        { name: "Deutsch", type: "DE" },
        { name: "España", type: "ES" },
        { name: "Français", type: "FR" },
        { name: "Italia", type: "IT" },
      ],
    };
  },
  computed: {
    ...mapState({
      getConfig: (state) => state.common.getConfig,
    }),
    showVerCode() {
      return (
        (this.registerType === "tel"
          ? this.getConfig.TEL
          : this.getConfig.EMAIL) === "enable"
      );
    },
  },

  created() {
    this.$store.dispatch("common/getAreaCode");
    if (this.$route.params.code != 1) {
      this.inviteCode = this.$route.params.code;
      this.inviteCodeReadonly = true;
    }
    console.log(this.getConfig);
  },

  methods: {
    showAreaCodePopup() {
      this.pushState("?areaCodePopup");
      this.areaCodePopup = true;
    },
    selecteArea(data) {
      this.areaCode = data.mobilePrefix;
    },

    onSelectLang(data) {
      if (this.$i18n.locale == data.type) {
        this.langSheet = false;
        return;
      }
      localStorage.setItem("locale", data.type);
      window.location.reload();
      this.langSheet = false;
    },

    getVerCode() {
      sendCode({
        type: this.registerType == "tel" ? "registerByTel" : "registerByEmail",
        account: this.registerType == "tel" ? this.phone : this.email,
        areaCode: this.registerType == "tel" ? this.areaCode : "0",
      }).then((res) => {
        Toast(res.msg);
        this.sendDisabled = true;
        const interval = window.setInterval(() => {
          if (this.time-- <= 0) {
            this.time = 60;
            this.sendDisabled = false;
            window.clearInterval(interval);
          }
        }, 1000);
      });
    },

    registerUser() {
      if (this.registerType == "email" && !this.$utils.isEmail(this.email)) {
        Toast(this.$t("accountLang.lang27"));
        return;
      }
      if (!this.$utils.isPassword(this.password)) {
        Toast(this.$t("accountLang.lang28"));
        return;
      }
      if (this.password != this.confirmPassword) {
        Toast(this.$t("accountLang.lang29"));
        return;
      }
      const params = {
        tel: this.phone,
        email: this.email,
        loginPassword: this.password,
        areaCode: this.areaCode,
        code: this.verCode,
        parent: this.inviteCode,
      };
      if (this.registerType == "tel") {
        userRegisterTel(params).then((res) => {
          Toast(res.msg);
          if (this.inviteCodeReadonly) {
            this.downloadApp();
          } else {
            this.loginOfRegister();
          }
        });
      } else {
        userRegisterEmail(params).then((res) => {
          Toast(res.msg);
          if (this.inviteCodeReadonly) {
            this.downloadApp();
          } else {
            this.loginOfRegister();
          }
        });
      }
    },

    loginOfRegister() {
      let params = {
        account: this.registerType == "tel" ? this.phone : this.email,
        areaCode: this.registerType == "tel" ? this.areaCode : "0",
        password: this.password,
        type: this.registerType,
      };
      this.$router.replace({ name: "login", params });
    },

    downloadApp() {
      setTimeout(() => {
        this.pushPath("/downloadApp");
      }, 1000);
    },

    showAgreePopup() {
      this.agreePopup = true;
      this.pushState("?agreePopup");
    },
  },
};
</script>

<style lang="scss" scoped>
.login_tip {
  padding: 20px 25px;
  h2 {
    font-size: 24px;
    line-height: 26px;
  }
  p {
    margin-top: 12px;
    color: $subFontColor;
  }
}
.input_box {
  padding: 10px 25px 0;
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
  margin: 0 25px 20px;
  .van-checkbox {
    margin-bottom: 10px;
  }
  .agree_text {
    font-size: 12px;
    color: $subFontColor;
    em {
      color: $mainColor;
      font-style: normal;
    }
  }
}

.ver_box {
  .ver_input {
    flex: 1;
    height: 48px;
    padding: 14px 12px;
    border: 1px solid $lineColor;
    border-radius: 2px;
    input {
      line-height: 20px;
    }
  }
  button {
    flex: 1;
    max-width: 105px;
    background-color: $mainColor;
    color: $fontColor;
    margin-left: 10px;
    border: none;
    height: 48px;
    line-height: 48px;
  }
}
</style>
