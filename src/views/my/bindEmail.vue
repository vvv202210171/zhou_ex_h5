<template>
  <div>
    <nav-header :title="userInfo.email?$t('accountLang.lang82'):$t('accountLang.lang83')" :border="false" />
    <div class="main_content">
      <div class="top_tip" v-if="!userInfo.email">
        <h4>{{$t('accountLang.lang84')}}</h4>
        <p>{{$t('accountLang.lang85')}}</p>
      </div>
      <div class="top_tip" v-if="userInfo.email">
        <h4>{{$t('accountLang.lang78')}}</h4>
        <p>{{$t('accountLang.lang79',{tel:userInfo.email})}}</p>
      </div>
      <ol class="input_box">
        <li>
          <label>{{$t('accountLang.lang7')}}</label>
          <div class="flex">
            <input type="text" v-model="newEmail" v-input-line :placeholder="$t('accountLang.lang8')">
          </div>
        </li>
        <li>
          <label>{{$t('accountLang.lang20')}}</label>
          <div class="flex">
            <input type="number" v-model="newCode" v-input-line :placeholder="$t('accountLang.lang21')">
            <button class="main_color" v-show="!sendDisabled1" @click="getVerCode()">{{$t('accountLang.lang22')}}</button>
            <button v-show="sendDisabled1">{{time1}}S</button>
          </div>
        </li>
      </ol>

      <div class="submit_btn">
        <van-button type="primary" size="large" :disabled="!($utils.isEmail(newEmail)&&newCode)" @click="setNewEmail()">{{$t('commonLang.lang3')}}</van-button>
      </div>
    </div>
    <van-popup class="right_popup" v-model="verPopup" position="right" close-on-popstate overlay-class="block_bg">
      <nav-header :title="$t('accountLang.lang80')" :border="false"/>
      <div class="main_content">
        <div class="top_tip">
          <h4>{{$t('accountLang.lang78')}}</h4>
          <p>{{$t('accountLang.lang79',{tel:userInfo.email})}}</p>
        </div>

        <ol class="input_box">
          <li>
            <label>{{$t('accountLang.lang20')}}</label>
            <div class="flex">
              <input type="number" v-model="code" v-input-line :placeholder="$t('accountLang.lang21')">
              <button class="main_color" v-show="!sendDisabled" @click="getOldVerCode()">{{$t('accountLang.lang22')}}</button>
              <button v-show="sendDisabled">{{time}}S</button>
            </div>
          </li>
        </ol>

        <div class="submit_btn">
          <van-button type="primary" size="large" :disabled="!code" @click="goNext()">{{$t('accountLang.lang81')}}</van-button>
        </div>
      </div>
      
    </van-popup>
  </div>
</template>

<script>
import { Toast ,Dialog} from "vant";
import { mapState } from 'vuex'
import {sendCode,codeVerification,setNewTelOrEmail} from "@api/user"
export default {
  data(){
    return{
      time: 60, // 发送验证码倒计时
      sendDisabled: false,
      code: '',

      newEmail:'',

      verPopup:false,

      time1: 60, // 发送验证码倒计时
      sendDisabled1: false,
      newCode: '',
    }
  },
  computed:{
    ...mapState({
      userInfo:state => state.user.userInfo
    }),
  },

  created(){
    this.verPopup = !!this.userInfo.email;
  },

  methods:{
    getOldVerCode(){
      sendCode({
        type:'toCodeByEmail',
        account:this.userInfo.email,
        areaCode:0
      }).then(res=>{
        Toast(res.msg);
        this.sendDisabled = true;
        let interval = window.setInterval(()=>{
          if ((this.time--) <= 0) {
            this.time = 60;
            this.sendDisabled = false;
            window.clearInterval(interval);
          }
        }, 1000);
      })
    },
    getVerCode(){
      sendCode({
        type:'registerByEmail',
        account:this.newEmail,
        areaCode:0
      }).then(res=>{
        Toast(res.msg);
        this.sendDisabled1 = true;
        let interval = window.setInterval(()=>{
          if ((this.time1--) <= 0) {
            this.time1 = 60;
            this.sendDisabled1 = false;
            window.clearInterval(interval);
          }
        }, 1000);
      })
    },
    goNext(){
      if(!this.code){
        Toast(this.$t('accountLang.lang21'))
        return;
      }
      codeVerification({
        account:this.userInfo.email,
        code:this.code,
        type:'EMAIL',
      }).then(res=>{
        this.verPopup = false;
      })
    },


    setNewEmail(){
      setNewTelOrEmail({
        areaCode:0,
        account:this.newEmail,
        type:'EMAIL',
        code:this.newCode,
        setType:this.userInfo.email?'1':'0',
      }).then(res=>{
        Toast(res.msg);
        this.$store.dispatch('user/getUserInfo');
        this.goBack()
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.top_tip{
  padding: 10px 25px;
  h4{
    font-size: 13px;
    font-weight: 600;
  }
  p{
    font-size: 11px;
    color: $subFontColor;
    line-height: 18px;
    margin-top: 5px;
  }
}
.input_box{
  margin: 30px 25px;
  li{
    margin-bottom: 20px;
    label{
      font-size: 11px;
      font-weight: 600;
    }

    div{
      padding: 10px 0 8px;
      border-bottom: 1px solid $subFontColor;
      p{
        font-weight: 600;
        margin-right: 10px;
        span{
          font-size: 15px;
        }
        em{
          font-size: 12px;
          margin-left: 3px;
          width: 12px;
        }
      }
      input{
        flex: 1;
        font-size: 15px;
        font-weight: 600;
        line-height: 1;
        height: 25px;
      }
      button{
        color: $subFontColor;
      }
    }
  }
}
.submit_btn{
  margin: 0 25px 10px;
}
</style>