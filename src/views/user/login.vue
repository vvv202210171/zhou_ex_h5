<template>
  <div>
    <div ref="loginTop" class="login_top">
      <div class="login_header flex">
        <p @click="goBack()">
          <img :src="require(`@img/common/${them}_close.png`)" alt="">
        </p>
        <h3>OCX</h3>
        <span class="main_color" @click="langSheet = true">{{
          $t("accountLang.lang145")
        }}</span>
      </div>
    </div>
    <div ref="loginBox" class="login_main">
      <div class="login_tip">
        <h2>{{ $t("accountLang.lang1") }}</h2>
        <p>
          {{ $t("accountLang.lang2") }}
          <em
            v-if="loginType == 'tel'"
            class="main_color"
            @click="loginType = 'email'"
          >{{ $t("accountLang.lang3") }}</em>
          <em
            v-if="loginType == 'email'"
            class="main_color"
            @click="loginType = 'tel'"
          >{{ $t("accountLang.lang4") }}</em>
        </p>
      </div>

      <ol class="input_box">
        <li v-show="loginType == 'tel'">
          <p>{{ $t("accountLang.lang5") }}</p>
          <div class="flex">
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
        <li v-show="loginType == 'email'">
          <p>{{ $t("accountLang.lang7") }}</p>
          <div class="flex">
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
          <p>{{ $t("accountLang.lang9") }}</p>
          <div class="flex">
            <input
              v-model="password"
              v-input-line
              :type="passwordType"
              :placeholder="$t('accountLang.lang9a')"
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
      </ol>

      <div class="submit_btn">
        <van-button
          v-show="loginType == 'tel'"
          type="primary"
          size="large"
          :disabled="!(phone && password)"
          @click="goLogin()"
        >{{ $t("accountLang.lang1") }}</van-button>
        <van-button
          v-show="loginType == 'email'"
          type="primary"
          size="large"
          :disabled="!($utils.isEmail(email) && password)"
          @click="goLogin()"
        >{{ $t("accountLang.lang1") }}</van-button>
      </div>
      <div class="forgot_pass flex_between">
        <span class="main_color" @click="pushPath('/resetPass')">{{
          $t("accountLang.lang10")
        }}</span>
        <span class="main_color" @click="$router.replace('/register/1')">{{
          $t("accountLang.lang11")
        }}</span>
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
    <van-action-sheet
      v-model="langSheet"
      :actions="langList"
      :cancel-text="$t('commonLang.lang1')"
      @select="onSelectLang"
    />
  </div>
</template>

<script>
import areaCodeTmp from './components/areaCode.vue'
import { login } from '@api/user'
export default {
  components: { areaCodeTmp },
  data() {
    return {
      loginType: 'tel',
      phone: '',
      email: '',

      passwordType: 'password',
      password: '',

      areaCode: localStorage.getItem('defaultCode') || '1',
      areaCodePopup: false,

      langSheet: false,
      langList: [
        { name: 'English', type: 'EN' },
        { name: '繁體中文', type: 'CN' },
        { name: '日本語', type: 'JP' },
        { name: '한국어', type: 'KO' },
        { name: 'Deutsch', type: 'DE' },
        { name: 'España', type: 'ES' },
        { name: 'Français', type: 'FR' },
        { name: 'Italia', type: 'IT' },
        { name: 'Portugal', type: 'PT' },
        { name: 'Indonesia',type:'ID'},
        { name: 'TiếngViệt',type:'VI'}
      ],

      them: "",
    }
  },
  created() {
    this.initLogin()
    this.them =  window._config.them == "dark" ? "login" : "my_dark"
  },
  mounted() {
    const loginTop = this.$refs.loginTop
    loginTop.style.paddingTop = `${this.$barHeight}px`
    this.$refs.loginBox.style.marginTop = `${loginTop.clientHeight}px`

    let params = this.$route.params
    if(Object.keys(params).length > 0) {
      this.password = params.password;
      this.loginType = params.type;
      if(params.type == 'tel'){
        this.phone = params.account;
        this.areaCode = params.areaCode
      }else{
        this.email = params.account;
      }
      this.$nextTick(()=>{
        this.goLogin()
      })
    }
  },

  methods: {
    onSelectLang(data) {
      if (this.$i18n.locale == data.type) {
        this.langSheet = false
        return
      }
      localStorage.setItem('locale', data.type)
      window.location.reload()
      this.langSheet = false
    },
    initLogin() {
      localStorage.removeItem('token')
      this.$store.dispatch('common/updateLoginStatus', false)
      this.$store.dispatch('common/getAreaCode')

      // 回填最后一次登录的账号
      const lastAccountStr = localStorage.getItem('lastAccount')
      if (lastAccountStr) {
        const lastAccount = JSON.parse(lastAccountStr)
        this.loginType = lastAccount.type
        if (lastAccount.type == 'tel') {
          this.phone = lastAccount.account
          this.areaCode = lastAccount.areaCode
        } else {
          this.email = lastAccount.account
        }
      }
    },

    showAreaCodePopup() {
      this.pushState('?areaCodePopup')
      this.areaCodePopup = true
    },
    selecteArea(data) {
      this.areaCode = data.mobilePrefix
    },

    goLogin() {
      login({
        account: this.loginType == 'tel' ? this.phone : this.email,
        areaCode: this.loginType == 'tel' ? this.areaCode : '0',
        loginPassword: this.password,
        type: this.loginType.toUpperCase(),
        device: 'app'
      }).then(res => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        localStorage.setItem('token', res.data.token)

        this.$store.dispatch('common/updateLoginStatus', true)
        this.$store.dispatch('user/getUserInfo')

        // 记录登录信息
        const lastAccount = {
          account: this.loginType == 'tel' ? this.phone : this.email,
          areaCode: this.loginType == 'tel' ? this.areaCode : '0',
          type: this.loginType
        }
        localStorage.setItem('lastAccount', JSON.stringify(lastAccount))

        // 当缓存中有用户信息 而且和当前登录信息一致时 返回页面 否则到主页
        if (userInfo && userInfo.userId && userInfo.userId == res.data.userId) {
          this.goBack()
        } else {
          this.$router.replace('/home')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login_top {
  position: fixed;
  width: 100%;
  z-index: 10;
  background-color: $bgColor;
}
.login_header {
  padding: 13px 15px;
  height: 46px;
  p {
    flex: 1;
    max-width: 18px;
    height: 18px;
    margin-right: 82px;
  }
  h3 {
    flex: 1;
    text-align: center;
    font-size: 16px;
  }
  span {
    flex: 1;
    max-width: 100px;
    text-align: right;
    color: $mainColor;
  }
}
.login_tip {
  padding: 30px 25px;
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
    margin-bottom: 24px;
  }
  p {
    font-size: 12px;
    margin-bottom: 12px;
  }
  div {
    height: 48px;
    padding: 14px 15px 14px 0;
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
  margin: 0 25px;
}
.forgot_pass {
  margin: 15px 25px;
}
</style>
