<template>
  <div>
    <nav-header :title="userInfo.tel?$t('accountLang.lang74'):$t('accountLang.lang75')" :border="false" />
    <div class="main_content">
      <div class="top_tip" v-if="!userInfo.tel">
        <h4>{{$t('accountLang.lang76')}}</h4>
        <p>{{$t('accountLang.lang77')}}</p>
      </div>
      <div class="top_tip" v-if="userInfo.tel">
        <h4>{{$t('accountLang.lang78')}}</h4>
        <p>{{$t('accountLang.lang79',{tel:userInfo.tel})}}</p>
      </div>
      <ol class="input_box">
        <li>
          <label>{{$t('accountLang.lang5')}}</label>
          <div class="flex">
            <p class="flex" @click="showAreaCodePopup()"><span>+{{areaCode}}</span><em class="iconfont icon-arrow-down"></em></p>
            <input type="number" v-model="newPhone" v-input-line :placeholder="$t('accountLang.lang6')">
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
        <van-button type="primary" size="large" :disabled="!(newPhone&&newCode)" @click="setNewPhone()">{{$t('commonLang.lang3')}}</van-button>
      </div>
    </div>
    <van-popup class="right_popup" v-model="verPopup" position="right" close-on-popstate overlay-class="block_bg">
      <nav-header :title="$t('accountLang.lang80')" :border="false"/>
      <div class="main_content">
        <div class="top_tip">
          <h4>{{$t('accountLang.lang78')}}</h4>
          <p>{{$t('accountLang.lang79',{tel:userInfo.tel})}}</p>
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
    <van-popup class="right_popup" v-model="areaCodePopup" position="right" close-on-popstate overlay-class="block_bg">
      <areaCodeTmp @selecteArea="selecteArea" />
    </van-popup>
  </div>
</template>

<script>
import { Toast ,Dialog} from "vant";
import { mapState } from 'vuex'
import {sendCode,codeVerification,setNewTelOrEmail} from "@api/user"
import areaCodeTmp from "@/views/user/components/areaCode.vue";
export default {
  components:{areaCodeTmp},
  data(){
    return{
      areaCode:'852',
      areaCodePopup:false,

      time: 60, // 发送验证码倒计时
      sendDisabled: false,
      code: '',

      newPhone:'',

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
    this.verPopup = !!this.userInfo.tel;
    this.areaCode = this.userInfo.areacode||localStorage.getItem('defaultCode')||'1';
    this.$store.dispatch('common/getAreaCode')
  },

  methods:{
    showAreaCodePopup(){
      this.pushState('?areaCodePopup')
      this.areaCodePopup = true;
    },
    selecteArea(data){
      this.areaCode = data.mobilePrefix;
    },
    getOldVerCode(){
      sendCode({
        type:'toCodeByTel',
        account:this.userInfo.tel,
        areaCode:this.userInfo.areacode
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
        type:'registerByTel',
        account:this.newPhone,
        areaCode:this.areaCode
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
        account:this.userInfo.tel,
        code:this.code,
        type:'TEL',
      }).then(res=>{
        this.verPopup = false;
      })
    },


    setNewPhone(){
      setNewTelOrEmail({
        areaCode:this.areaCode,
        account:this.newPhone,
        type:'TEL',
        code:this.newCode,
        setType:this.userInfo.tel?'1':'0',
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