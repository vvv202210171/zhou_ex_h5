<template>
  <div class="recharge_dialog_box">
    <h3>{{ $t('tradeLang.lang277') }}</h3>
    <div class="form_box flex">
      <input v-model="orderid" :placeholder="$t('tradeLang.lang278')">
    </div>
    <div class="img_box flex">
      <van-uploader upload-icon="photo" v-model="imgArr" :max-count="1" multiple :max-size="5*1024*1024" accept="image/*" @oversize="onOversize" />
    </div>
    <div class="popup_btn flex">
      <van-button @click="cancelAction()">{{ $t('commonLang.lang1') }}</van-button>
      <van-button :disabled="!orderid || !imgArr.length" @click="confirmAction()">{{ $t('commonLang.lang9') }}</van-button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  name: 'RechargeDialog',
  data() {
    return {
      orderid: '',
      imgArr:[],
    }
  },

  mounted() {
  },

  methods: {
    cancelAction() {
      setTimeout(() => {
        this.orderid = ''
      }, 500)
      this.$emit('cancelAction')
    },
    confirmAction() {
      if (this.orderid && this.imgArr.length) {
        this.cancelAction()
        this.$emit('confirmAction', {orderid:this.orderid,imgurl:this.imgArr[0]})
      } else {
        Toast(this.$t('tradeLang.lang278'))
      }
    },
    onOversize() {
      Toast(this.$t('accountLang.lang135'))
    },
  }
}
</script>

<style lang="scss" scoped>
.recharge_dialog_box {
  background-color: $blockColor;
  width: 100%;
  border-radius: 5px;
  padding-top: 20px;
  overflow: hidden;

  h3 {
    font-size: 16px;
    text-align: center;
  }

  .form_box {
    height: 40px;
    margin: 15px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid rgba($lineColor, .5);

    input {
      border: 1px solid #868686;
      padding: 10px;
      border-radius: 5px;
      flex: 1;
    }

    i {
      font-size: 14px;
      color: $subFontColor;
    }
  }
  .img_box{
    padding: 10px;
  }

  .popup_btn {
    border-top: 1px solid rgba($lineColor, .5);

    button {
      border: none;
      flex: 1;
      color: $mainColor;

      &:first-child {
        color: $subFontColor;
        border-right: 1px solid rgba($lineColor, .5);
      }
    }
  }
}
</style>
