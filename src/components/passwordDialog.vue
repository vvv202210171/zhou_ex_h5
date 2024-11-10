<template>
  <div class="password_dialog_box">
    <h3>{{ $t('tradeLang.lang72') }}</h3>
    <div class="password_box flex">
      <input v-model="password" :type="passwordType" :placeholder="$t('tradeLang.lang71')" @input="changeInput">
      <i v-show="passwordType=='text'" class="iconfont icon-eye-open" @click.stop="passwordType='password';" />
      <i v-show="passwordType=='password'" class="iconfont icon-eye-close" @click.stop="passwordType='text';" />
    </div>
    <div class="popup_btn flex">
      <van-button @click="cancelAction()">{{ $t('commonLang.lang1') }}</van-button>
      <van-button @click="confirmAction()">{{ $t('commonLang.lang9') }}</van-button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  name: 'PasswordDialog',
  props: {
    payPass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      password: '',
      passwordType: 'password'
    }
  },

  mounted() {
    this.password = this.payPass
  },

  methods: {
    changeInput() {
      this.$emit('input', this.password)
    },
    cancelAction() {
      setTimeout(() => {
        this.password = ''
      }, 500)
      this.$emit('cancelAction')
    },
    confirmAction() {
      if (this.password.length) {
        this.cancelAction()
        this.$emit('confirmAction')
      } else {
        Toast(this.$t('tradeLang.lang71'))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.password_dialog_box{
  background-color: $blockColor;
  width: 100%;
  border-radius: 5px;
  padding-top: 20px;
  overflow: hidden;
  h3{
    font-size: 16px;
    text-align: center;
  }
  .password_box{
    height: 40px;
    margin: 15px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid rgba($lineColor,.5);
    input{
      flex: 1;
    }
    i{
      font-size: 14px;
      color: $subFontColor;
    }
  }
  .popup_btn{
    border-top: 1px solid rgba($lineColor,.5);
    button{
      border: none;
      flex: 1;
      color: $mainColor;
      &:first-child{
        color: $subFontColor;
        border-right: 1px solid rgba($lineColor,.5);
      }
    }
  }
}

</style>
