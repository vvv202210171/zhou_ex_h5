<template>
  <div>
    <nav-header :title="$t('accountLang.lang156')"/>
    <div class="main_content">
     <div class="download_app">
      <div class="text_box">
        <p>{{ $t('accountLang.lang149') }}<br>{{ $t('accountLang.lang150') }}</p>
        <span>{{ $t('accountLang.lang151') }}</span>
      </div>
      <div class="btn_box block_bg flex">
        <a :href="urlData.androidUrl||'#downloadApp'" class="android_btn flex_center">
          <img src="@img/download/icon_android.png" alt="">
          <span>{{ $t('accountLang.lang30') }}</span>
        </a>
        <a :href="urlData.iosUrl||'#downloadApp'" class="ios_btn flex_center">
          <img src="@img/download/icon_ios.png" alt="">
          <span>{{ $t('accountLang.lang31') }}</span>
        </a>
      </div>

      <div v-show="isWexin" class="weixin_tip">
        <p> <img src="@img/download/live_weixin.png"> </p>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { downloadUrl } from '@api/common'
export default {
  data() {
    return {
      isWexin: false,
      urlData: {
        androidUrl: '#downloadApp',
        iosUrl: '#downloadApp'
      }
    }
  },

  created() {
    const ua = navigator.userAgent.toLowerCase()
    this.isWexin = !!(ua.match(/MicroMessenger/i) == 'micromessenger')
    this.getDownloadUrl()
  },

  methods: {
    getDownloadUrl() {
      downloadUrl().then(res => {
        this.urlData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.download_app{
  overflow: hidden;
  .text_box{
    position: absolute;
    width: 100%;
    top: 240px;
    text-align: center;
    p{
      padding: 0 10%;
      font-size: 30px;
      line-height: 44px;
      font-weight: 500;
    }
    span{
      margin: 20px 0 10px;
      display: inline-block;
      padding: 10px 30px;
      border-radius: 30px;
      background-color: $blockColor;
    }
  }
}
.btn_box{
  position: fixed;
  z-index: 10;
  width: 100%;
  bottom: 0;
  padding: 25px;
  a{
    flex: 1;
    text-decoration: none;
    border: 1px solid $mainColor;
    padding: 10px 0;
    border-radius: 4px;
    &:first-child{
      margin-right: 15px;
      color: $mainColor !important;
    }
    &:last-child{
      background-color: $mainColor;
      color: $blockColor !important;
    }
    img{
      width: 24px;
      margin-right: 10px;
    }
  }
}

.weixin_tip {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  filter: alpha(opacity=80);
  height: 100vh;
  width: 100%;
  z-index: 100;

  p {
    text-align: center;
    margin-top: 10%;
    padding: 0 5%;
  }
}
</style>
