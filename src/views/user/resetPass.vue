<template>
  <div>
    <nav-header title="BBAI">
      <h3 slot="headerTitle" class="header_title">BBAI</h3>
      <!-- <slot name="headerTitle"></slot> -->
    </nav-header>
    <div class="main_content">
      <!-- <div class="forgot_tip">{{$t('accountLang.lang32')}}</div> -->
      <div class="login_tip">
        <h2>{{ $t("accountLang.lang33") }}</h2>
        <p>
          {{ $t("accountLang.lang2") }}
          <em
            v-if="resetType == 'tel'"
            class="main_color"
            @click="resetType = 'email'"
          >{{ $t("accountLang.lang34") }}</em>
          <em
            v-if="resetType == 'email'"
            class="main_color"
            @click="resetType = 'tel'"
          >{{ $t("accountLang.lang35") }}</em>
        </p>
      </div>

      <ol class="input_box">
        <li v-show="resetType == 'tel'">
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
            >
            <i
              v-show="!!phone"
              class="iconfont icon-text-close"
              @click="phone = ''"
            />
          </div>
        </li>
        <li v-show="resetType == 'email'">
          <p>{{ $t("accountLang.lang7") }}</p>
          <div class="input_div flex">
            <input
              v-model.trim="email"
              v-input-line
              type="text"
              :placeholder="$t('accountLang.lang8')"
            >
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
            >
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
            >
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
        <li>
          <p>{{ $t("accountLang.lang20") }}</p>
          <div class="ver_box flex">
            <div class="ver_input">
              <input
                v-model.trim="verCode"
                type="number"
                :placeholder="$t('accountLang.lang21')"
              >
            </div>
            <van-button
              v-show="!sendDisabled"
              :disabled="
                (resetType == 'tel' && !phone) ||
                  (resetType == 'email' && !email)
              "
              @click="getVerCode()"
            >{{ $t("accountLang.lang22") }}</van-button>
            <van-button v-show="sendDisabled" disabled>{{ time }}S</van-button>
          </div>
        </li>
      </ol>
      <div class="submit_btn">
        <van-button
          v-show="resetType == 'tel'"
          type="primary"
          size="large"
          :disabled="!(phone && password && confirmPassword && verCode)"
          @click="resetPass()"
        >{{ $t("commonLang.lang9") }}</van-button>
        <van-button
          v-show="resetType == 'email'"
          type="primary"
          size="large"
          :disabled="!(email && password && confirmPassword && verCode)"
          @click="resetPass()"
        >{{ $t("commonLang.lang9") }}</van-button>
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
  </div>
</template>

<script>
import areaCodeTmp from './components/areaCode.vue'
import { sendCode, forgetByTel, forgetByEmail } from '@api/user'
import { Toast } from 'vant'
export default {
  components: { areaCodeTmp },
  data() {
    return {
      resetType: 'tel',
      phone: '',
      email: '',

      passwordType: 'password',
      password: '',
      confirmPasswordType: 'password',
      confirmPassword: '',

      verCode: '',
      sendDisabled: false,
      time: 60,

      areaCode: localStorage.getItem('defaultCode') || '1',
      areaCodePopup: false
    }
  },

  created() {
    this.$store.dispatch('common/getAreaCode')
  },

  methods: {
    showAreaCodePopup() {
      this.pushState('?areaCodePopup')
      this.areaCodePopup = true
    },
    selecteArea(data) {
      this.areaCode = data.mobilePrefix
    },

    getVerCode() {
      sendCode({
        type: this.resetType == 'tel' ? 'toCodeByTel' : 'toCodeByEmail',
        account: this.resetType == 'tel' ? this.phone : this.email,
        areaCode: this.resetType == 'tel' ? this.areaCode : '0'
      }).then(res => {
        Toast(res.msg)
        this.sendDisabled = true
        const interval = window.setInterval(() => {
          if (this.time-- <= 0) {
            this.time = 60
            this.sendDisabled = false
            window.clearInterval(interval)
          }
        }, 1000)
      })
    },

    resetPass() {
      if (this.resetType == 'email' && !this.$utils.isEmail(this.email)) {
        Toast(this.$t('accountLang.lang27'))
        return
      }else if(this.registerType == 'tel' && !this.$utils.isPhone(this.phone)) {
        Toast(this.$t('accountLang.lang159'))
        return
      }
      if (!this.$utils.isPassword(this.password)) {
        Toast(this.$t('accountLang.lang28'))
        return
      }
      if (this.password != this.confirmPassword) {
        Toast(this.$t('accountLang.lang29'))
        return
      }
      const params = {
        tel: this.phone,
        email: this.email,
        loginPassword: this.password,
        areaCode: this.areaCode,
        code: this.verCode
      }
      const lastPage = localStorage.getItem('lastPage')
      if (this.resetType == 'tel') {
        forgetByTel(params).then(res => {
          Toast(res.msg)
          if (lastPage != 'modifyLoginPass') {
            this.goBack()
          } else {
            this.goBack(-2)
          }
        })
      } else {
        forgetByEmail(params).then(res => {
          Toast(res.msg)
          if (lastPage != 'modifyLoginPass') {
            this.goBack()
          } else {
            this.goBack(-2)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.forgot_tip {
  background-color: rgba($subColor, 0.1);
  color: $subColor;
  padding: 8px 25px;
  font-size: 12px;
  line-height: 14px;
}
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
  padding: 10px 25px;
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
