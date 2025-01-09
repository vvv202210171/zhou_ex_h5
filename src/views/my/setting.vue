<script src="../../i18n/config/pt/account.js"></script>
<template>
  <div>
    <nav-header :title="$t('accountLang.lang144')" />
    <div class="main_content main_bg">
      <ol class="menu_box">
        <li class="flex" @click="langSheet = true">
          <p>{{ $t('accountLang.lang145') }}</p>
          <em v-if="$i18n.locale == 'CN'">繁體中文</em>
          <em v-if="$i18n.locale == 'EN'">English</em>
          <em v-if="$i18n.locale == 'KO'">한국어</em>
          <em v-if="$i18n.locale == 'JP'">日本語</em>
          <em v-if="$i18n.locale == 'DE'">Deutsch</em>
          <em v-if="$i18n.locale == 'ES'">España</em>
          <em v-if="$i18n.locale == 'FR'">Français</em>
          <em v-if="$i18n.locale == 'IT'">Italia</em>
          <em v-if="$i18n.locale == 'PT'">Portugal</em>
          <em v-if="$i18n.locale == 'ID'">Indonesia</em>
          <em v-if="$i18n.locale == 'VI'">TiếngViệt</em>

          <i class="iconfont icon-arrow-right"></i>
        </li>
        <!-- <li class="flex" @click="unitSheet=true">
          <p>货币单位</p>
          <em>CNY</em>
          <i class="iconfont icon-arrow-right"></i>
        </li> -->
        <li class="flex" @click="showUserAgreePopup()">
          <p>{{ $t('accountLang.lang25') }}</p>
          <i class="iconfont icon-arrow-right"></i>
        </li>
        <li class="flex" @click="showPrivacyPolicyPopup()">
          <p>{{ $t('accountLang.lang26') }}</p>
          <i class="iconfont icon-arrow-right"></i>
        </li>
        <li class="flex" v-show="!isApp" @click="pushPath('/downloadApp')">
          <p>{{ $t('accountLang.lang156') }}</p>
          <i class="iconfont icon-arrow-right"></i>
        </li>
        <li class="flex">
          <p>{{ $t('accountLang.lang146') }}</p>
          <span>V1.{{ appVersion }}</span>
        </li>
      </ol>

      <div class="exit_box" v-if="isLogin">
        <van-button type="primary" size="large" @click="exitPopup = true">{{ $t('accountLang.lang147') }}</van-button>
      </div>
    </div>
    <van-action-sheet v-model="langSheet" :actions="langList" @select="onSelectLang"
      :cancel-text="$t('commonLang.lang1')" />
    <van-popup v-model="exitPopup" position="bottom" close-on-popstate class="model_popup">
      <div class="model_popup_top"><i @click="exitPopup = false"></i></div>
      <div class="exit_popup_box">
        <h3>{{ $t('accountLang.lang147') }}</h3>
        <p>{{ $t('accountLang.lang148') }}</p>
        <div class="model_popup_btn flex">
          <van-button @click="exitPopup = false">{{ $t('commonLang.lang1') }}</van-button>
          <van-button @click="exit()">{{ $t('commonLang.lang3') }}</van-button>
        </div>
      </div>
    </van-popup>

    <van-popup class="right_popup" v-model="userAgreementPopup" position="right" close-on-popstate
      overlay-class="block_bg">
      <nav-header :title="$t('accountLang.lang25')" />
      <div class="main_content">
        <userAgreement />
      </div>
    </van-popup>
    <van-popup class="right_popup" v-model="privacyPolicyPopup" position="right" close-on-popstate
      overlay-class="block_bg">
      <nav-header :title="$t('accountLang.lang26')" />
      <div class="main_content">
        <privacyPolicy />
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { logout } from "@api/user";
import userAgreement from "@/views/user/components/userAgreement.vue"
import privacyPolicy from "@/views/user/components/privacyPolicy.vue"
export default {
  components:{userAgreement,privacyPolicy},
  data(){
    return{
      exitPopup:false,
      langSheet:false,
      langList:[
        { name: 'English',type:'EN'}, 
        { name: '繁體中文',type:'CN'},
        { name: '日本語',type:'JP'},
        { name: '한국어',type:'KO'},
        { name: 'Deutsch',type:'DE'},
        { name: 'España',type:'ES'},
        { name: 'Français',type:'FR'},
        { name: 'Italia',type:'IT'},
        { name: 'Portugal',type:'PT'},
        { name: 'Indonesia',type:'ID'},
        { name: 'TiếngViệt',type:'VI'},
      ],

      unitSheet:false,

      userAgreementPopup:false,
      privacyPolicyPopup:false,
      isApp:false
    }
  },
  computed:{
    ...mapState({
      isLogin:state => state.common.isLogin,
    }),
  },
  mounted() {
    //app环境就别显示下载app了
    if(window.cordova){
      this.isApp = true
    }
  },
  methods:{
    onSelectLang(data){
      if(this.$i18n.locale==data.type){
        this.langSheet = false;
        return
      }
      this.$i18n.locale = data.type;
      localStorage.setItem('locale',data.type);

   // 延迟刷新页面，确保切换生效
      setTimeout(() => {
        window.location.reload();
      }, 100); // 延迟刷新
          this.langSheet = false;
    },
    exit(){
      logout().then(res=>{
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        this.$store.dispatch('common/updateLoginStatus', false)
        //this.pushPath('/login');
        this.$router.replace('/login');
      })
    },

    showUserAgreePopup(){
      this.userAgreementPopup = true;
      this.pushState('?userAgreementPopup')
    },
    showPrivacyPolicyPopup(){
      this.privacyPolicyPopup = true;
      this.pushState('?privacyPolicyPopup')
    },
  }
}
</script>

<style lang="scss" scoped>
.menu_box {
  margin-top: 8px;
  padding-left: 15px;
  background-color: var(--inputBox-bgColor);

  li {
    padding: 12px 15px 12px 0;
    border-bottom: 1px solid $lineColor;

    &:last-child {
      border: none;
    }

    p {
      flex: 1;
      line-height: 20px;
    }

    i {
      flex: 1;
      max-width: 18px;
      min-width: 18px;
      line-height: 21px;
      height: 20px;
      font-size: 14px;
      text-align: right;
      color: rgba($subFontColor, .5);
    }

    span {
      font-size: 13px;
      color: $subFontColor;
      line-height: 20px;
    }
  }
}

.exit_box {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 20px 15px;
}

.exit_popup_box {
  padding: 15px 20px;
  text-align: center;

  p {
    font-size: 12px;
    color: $subFontColor;
    margin: 10px 0 30px;
  }
}
</style>