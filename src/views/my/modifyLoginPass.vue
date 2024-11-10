<template>
  <div>
    <nav-header :title="$t('accountLang.lang53')" />
    <div class="main_content">
      <!-- <div class="forgot_tip">{{$t('accountLang.lang57')}}</div> -->
      <ol class="input_box">
        <li>
          <span>{{$t('accountLang.lang58')}}</span>
          <input type="password" v-model="oldPass" :placeholder="$t('accountLang.lang59')">
        </li>
        <li>
          <span>{{$t('accountLang.lang60')}}</span>
          <input type="password" v-model="password" :placeholder="$t('accountLang.lang61')">
        </li>
        <li>
          <span>{{$t('accountLang.lang62')}}</span>
          <input type="password" v-model="confirmPassword" :placeholder="$t('accountLang.lang63')">
        </li>
      </ol>

      <div class="tip_box">
        <p>{{$t('accountLang.lang64')}}</p>
        <span class="main_color" @click="pushPath('/resetPass')">{{$t('accountLang.lang65')}}</span>
      </div>

      <div class="submit_btn">
        <van-button type="primary" size="large" v-show="modifyType=='oldPass'" :disabled="!(oldPass&&password&&confirmPassword)" @click="confirmSubmit()">{{$t('commonLang.lang2')}}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapState } from 'vuex'
import {sendCode,editPassword,editPasswordByCode} from "@api/user"

export default {
  data(){
    return{
      modifyType:'oldPass',

      oldPass:'',
      password:'',
      confirmPassword:'',

      smsCode:'',
      sendDisabled:false,
      time:60,
    }
  },
  computed: {
    ...mapState({
      userInfo:state => state.user.userInfo
    }),
  },
  methods:{
    getSmsCode(){
      sendCode({type: 'toCodeByTel',account:this.userInfo.tel}).then(res=>{
        Toast(res.msg);
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
      if(this.modifyType=='oldPass'){
        // if (!this.$utils.isPassword(this.oldPass)) {
        //   Toast(this.$t('accountLang.lang66'));
        //   return;
        // }
      }else{
        if (!this.smsCode) {
          Toast(this.$t('accountLang.lang21'));
          return;
        }
      }
      
      if (!this.$utils.isPassword(this.password)) {
        Toast(this.$t('accountLang.lang67'));
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
      if(this.modifyType=='oldPass'){
        editPassword({
          oldPassword:this.oldPass,
          newPassword:this.password,
          type:'LOGIN'
        }).then(res=>{
          Toast(res.msg);
          setTimeout(() => {
            this.goBack();
          }, 1000);
        })
      }else{
        editPasswordByCode({
          code:this.smsCode,
          newPassword:this.password,
          type:'LOGIN'
        }).then(res=>{
          Toast(res.msg);
          setTimeout(() => {
            this.goBack();
          }, 1000);
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.forgot_tip{
  background-color: rgba($subColor,.1);
  color: $subColor;
  padding: 8px 15px;
  font-size: 12px;
  line-height: 14px;
}
.input_box{
  background-color: var(--inputBox-bgColor);
  margin-bottom: 10px;
  overflow: hidden;
  li{
    padding: 15px;
    display: flex;
    align-items: center;
    position: relative;
    line-height: 20px;
    &::after{
      position: absolute;
      content: "";
      left: 92px;
      bottom: -1px;
      width: calc(100% - 104px);
      height: 1Px;
      background-color: $lineColor;
    }
    span{
      flex: 1;
      max-width: 80px;
    }
    input{
      flex: 1;
    }
  }
}
.tip_box{
  padding: 5px 15px;
  p{
    font-size: 12px;
    color: $subFontColor;
    margin-bottom: 10px;
  }
}
.submit_btn{
  margin: 25px 15px;
}
</style>