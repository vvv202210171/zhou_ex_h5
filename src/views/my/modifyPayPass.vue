<!-- 修改登录密码 -->
<template>
  <div>
    <nav-header :title="$t('accountLang.lang54')"/>
    <div class="main_content">
      <!-- <ol class="account_box">
        <li v-if="modifyType=='tel'">
          <p>{{$t('accountLang.lang5')}}</p>
          <input :value="userInfo.tel" readonly>
          <span v-show="userInfo.email" @click="modifyType='email';verCode=''" class="main_color">{{$t('accountLang.lang68')}}</span>
        </li>
        <li v-if="modifyType=='email'">
          <p>{{$t('accountLang.lang7')}}</p>
          <input :value="userInfo.email" readonly>
          <span v-show="userInfo.tel" @click="modifyType='tel';verCode=''" class="main_color">{{$t('accountLang.lang69')}}</span>
        </li>
        <li>
          <p>{{$t('accountLang.lang20')}}</p>
          <input type="number" v-model.trim="verCode" :placeholder="$t('accountLang.lang21')">
          <span class="main_color" v-if="!sendDisabled" @click="getSmsCode()">{{$t('accountLang.lang22')}}</span>
          <span class="main_color" v-if="sendDisabled">{{time}}s</span>
        </li>
      </ol> -->
      <ol class="account_box">
        <li v-show="hasPass">
          <p>{{$t('accountLang.lang58')}}</p>
          <input :type="oldPasswordType" :placeholder="$t('accountLang.lang59')" v-model="oldPassword">
          <i v-if="oldPasswordType=='password'" @click="oldPasswordType='text'" class="iconfont icon-eye-close"></i>
          <i v-if="oldPasswordType=='text'" @click="oldPasswordType='password'" class="iconfont icon-eye-open"></i>
        </li>
        <li>
          <p>{{$t('accountLang.lang54')}}</p>
          <input :type="passwordType" :placeholder="$t('accountLang.lang70')" v-model="password">
          <i v-if="passwordType=='password'" @click="passwordType='text'" class="iconfont icon-eye-close"></i>
          <i v-if="passwordType=='text'" @click="passwordType='password'" class="iconfont icon-eye-open"></i>
        </li>
        <li>
          <p>{{$t('accountLang.lang62')}}</p>
          <input :type="confirmPasswordType" :placeholder="$t('accountLang.lang71')" v-model="confirmPassword">
          <i v-if="confirmPasswordType=='password'" @click="confirmPasswordType='text'" class="iconfont icon-eye-close"></i>
          <i v-if="confirmPasswordType=='text'" @click="confirmPasswordType='password'" class="iconfont icon-eye-open"></i>
        </li>
      </ol>
      <div class="submit_btn">
        <van-button v-if="hasPass" type="primary" size="large" :disabled="!(oldPassword&&password&&confirmPassword)" @click="confirmSubmit()">{{$t('commonLang.lang2')}}</van-button>
        <van-button v-else type="primary" size="large" :disabled="!(password&&confirmPassword)" @click="confirmSubmit()">{{$t('commonLang.lang2')}}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import { mapState } from 'vuex'
import {sendCode,editPassword,addTradPassword} from "@api/user"
export default {
  components: {},
  data() {
    return {
      hasPass:false,
      oldPassword:'',
      password:'',
      confirmPassword:'',

      oldPasswordType:'password',
      passwordType:'password',
      confirmPasswordType:'password',

      modifyType:'email',

      time: 60, // 发送验证码倒计时
      sendDisabled: false,
      verCode:'',

    };
  },
  computed: {
    ...mapState({
      userInfo:state => state.user.userInfo
    }),
  },
  watch: {},
  created() {
    this.hasPass = this.userInfo.tradpasswordstate=='true'
  },
  methods: {

    getSmsCode(){
      sendCode({
        type: this.modifyType=='tel'?'toCodeByTel':'toCodeByEmail',
        account:this.modifyType=='tel'?this.userInfo.tel:this.userInfo.email,
        areaCode:this.userInfo.areacode||'0',
      }).then(res=>{
        this.sendDisabled = true;
        let interval = window.setInterval(()=>{
          if ((this.time--) <= 0) {
            this.time = 60;
            this.sendDisabled = false;
            window.clearInterval(interval);
          }
        }, 1000);
      });
    },
    confirmSubmit(){
      // if (!this.verCode){
      //   Toast(this.$t('accountLang.lang21'));
      //   return;
      // }
      if(this.hasPass){
        if (!this.oldPassword){
          Toast(this.$t('accountLang.lang59'));
          return;
        }
      }
      if (!this.$utils.isPassword(this.password)) {
        Toast(this.$t('accountLang.lang72'));
        return;
      }
      if (!this.confirmPassword) {
        Toast(this.$t('accountLang.lang19'));
        return;
      }
      if (this.confirmPassword!=this.password) {
        Toast(this.$t('accountLang.lang29'));
        return;
      }
      if(this.hasPass){
        editPassword({
          oldPassword:this.oldPassword,
          newPassword:this.password,
          type:'TRAD'
        }).then(res=>{
          Toast(res.msg);
          if(this.userInfo.tradpasswordstate!='true'){
            this.$store.dispatch('user/getUserInfo');
          }
          setTimeout(() => {
            this.goBack();
          }, 1000);
        })
      }else{
        addTradPassword({ tradPassword:this.password}).then(res=>{
          Toast(res.msg);
          if(this.userInfo.tradpasswordstate!='true'){
            this.$store.dispatch('user/getUserInfo');
          }
          setTimeout(() => {
            this.goBack();
          }, 1000);
        })
      }
    }
  },
}
</script>
<style lang='scss' scoped>
.account_box{
  background: var(--inputBox-bgColor);
  margin-bottom: 12px;
  padding: 0 15px;
  li{
    display: flex;
    align-items: center;
    padding: 15px 0 12px;
    line-height: 20px;
    border-bottom: 1px solid $lineColor;
    &:last-child{
      border-bottom: none;
    }
    p{
      flex: 1;
      max-width: 80px;
    }
    input{
      flex: 1;
      margin-left: 5px;
    }
    i{
      flex: 1;
      max-width: 20px;
      font-size: 18px;
      color: $subFontColor;
    }
  }
}
.tip_box{
  text-align: right;
  padding-right: 15px;
  color: $mainColor;
  font-size: 12px;
}
.submit_btn{
  margin: 30px 15px;
}
</style>