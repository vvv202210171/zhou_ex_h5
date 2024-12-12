<template>
  <div class="contract_poster">
    <div ref="positionPosterBox" class="poster_box">
      <div class="popup_top flex_between">
        <img src="@img/trade/poster_logo.png" alt="">
        <div>
          <p>BBAI</p>
          <span v-if="income >= 0">{{ $t("tradeLang.lang209") }}</span>
          <span v-else>{{ $t("tradeLang.lang210") }}</span>
        </div>
      </div>
      <div class="poster_main_box">
        <img v-if="income >= 0" src="@img/trade/poster_up.png" alt="">
        <img v-else src="@img/trade/poster_down.png" alt="">
        <div class="main_top_box">
          <div>
            <p>{{ $t("tradeLang.lang211") }}</p>
            <h1 v-if="income >= 0">
              +{{ income.split(".")[0] }}<em>.{{ income.split(".")[1] }}%</em>
            </h1>
            <h1 v-else>
              {{ income.split(".")[0] }}<em>.{{ income.split(".")[1] }}%</em>
            </h1>
          </div>
        </div>
        <div class="main_bottom_box">
          <ol>
            <li>
              <span>{{ orderData.tradcoin }} {{ $t("tradeLang.lang212") }}</span>
              <span> /{{ orderData.maincoin }}</span>
            </li>
            <li>
              <span>{{ $t("tradeLang.lang150") }}</span>
              <p>${{ orderData.price }}</p>
            </li>
            <li v-if="orderData.closedate">
              <span>{{ $t("tradeLang.lang213") }}</span>
              <p>${{ orderData.last_profit }}</p>
            </li>
            <li v-else>
              <span>{{ $t("tradeLang.lang149") }}</span>
              <p>${{ orderData.last_profit }}</p>
            </li>
          </ol>
          <div class="order_type">
            <em>{{
              orderData.type == "sell"
                ? $t("tradeLang.lang146")
                : $t("tradeLang.lang145")
            }}·{{
              orderData.tdMode == "lsolate"
                ? $t("tradeLang.lang147")
                : $t("tradeLang.lang148")
            }}·{{ `${orderData.lever}X` }}</em>
          </div>
        </div>
      </div>
      <div class="poster_bottom">
        <div>
          <span>{{ $t("tradeLang.lang214") }}</span>
          <em>/</em>
          <span>{{ $t("tradeLang.lang215") }}</span>
          <em>/</em>
          <span>{{ $t("tradeLang.lang216") }}</span>
        </div>
        <p><img :src="qrImg" alt=""></p>
      </div>
    </div>

    <div class="share_btn">
      <van-button type="primary" size="large" @click="createImage()">{{
        $t("tradeLang.lang217")
      }}</van-button>
    </div>
  </div>
</template>

<script>
import qrcode from 'qrcode'
import { mapState } from 'vuex'
import { Toast, Dialog } from 'vant'
import $upload from '@/assets/js/upload'
import html2canvas from 'html2canvas'
import utils from '@/assets/js/filter'
export default {
  props: {
    orderData: {
      type: Object
    }
  },
  data() {
    return {
      qrImg: '',
      isApp: !!window.plus,

      income: '0.00'
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      invitedData:state => state.user.invitedData,
    })
  },
  created() {
    this.$store.dispatch('user/getInvitedData');
    this.income = utils.mathFloor(
      (this.orderData.income / this.orderData.position) * 100,
      2
    )
  },
  watch:{
    invitedData(){
      this.createQr()
    }
  },
  methods: {
    createQr() {
      if (this.qrImg) {
        return
      }
      var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        rendererOpts: { quality: 0.3 }
      }
      let url = `${location.href.split('#')[0]}#/register/${this.invitedData.recomcode}`
      qrcode.toDataURL(url, opts, (err, url) => {
        if (err) throw err
        this.qrImg = url
      })
    },

    // 创建海报
    createImage() {
      this.$store.dispatch('common/showLoading', true)
      const el = this.$refs.positionPosterBox
      html2canvas(el, {
        width: el.clientWidth - 1, // dom 原始宽度
        height: el.clientHeight - 1,
        scrollY: 0,
        scrollX: 0
      }).then(canvas => {
        if (window.plus) {
          const imgFile = canvas.toDataURL('image/jpg')
          // 上传到oss
          $upload.uploadImg(imgFile, true).then(url => {
            console.log(url)
            this.downloadPoster(url)
          })
          // let imgFile = $upload.dataURLtoFile(canvas.toDataURL("image/jpg"));
          // //上传到oss
          // $upload.uploadAlioss(imgFile,`CoinCasso_contract_${this.orderData.autoid}`).then(url => {
          //   this.downloadPoster(url);
          // })
        } else {
          const imgUrl = canvas.toDataURL('image/jpeg')
          this.savePicture(imgUrl)
        }
      })
    },

    // 下载海报
    downloadPoster(url) {
      const vm = this
      // 创建下载任务
      var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
        if (status == 200) {
          window.plus.gallery.save(
            d.filename,
            function() {
              vm.$store.dispatch('common/showLoading', false)
              // 保存到相册方法
              window.plus.nativeUI.closeWaiting()
              mui.toast(vm.$t('tradeLang.lang218'))
            },
            function() {
              vm.$store.dispatch('common/showLoading', false)
              window.plus.nativeUI.closeWaiting()
              mui.toast(vm.$t('tradeLang.lang219'))
            }
          )
        } else {
          vm.$store.dispatch('common/showLoading', false)
          Toast(vm.$t('tradeLang.lang219'))
        }
      })
      // 启动下载任务
      dtask.start()
    },

    savePicture(imgUrl) {
      this.$store.dispatch('common/showLoading', false)
      var blob = new Blob([''], { type: 'application/octet-stream' })
      var url = URL.createObjectURL(blob)
      var a = document.createElement('a')
      a.href = imgUrl
      a.download = `CoinCasso_contract_${this.orderData.autoid}`
      var e = document.createEvent('MouseEvents')
      e.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
      a.dispatchEvent(e)
      URL.revokeObjectURL(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.contract_poster {
  width: 90%;
}
.poster_box {
  // background: linear-gradient(0deg, , #16D9AE);
  // background: linear-gradient(to bottom, $mainColor,$mainColor, rgba($mainColor,.8));
  background-color: $mainColor;
  position: relative;
  .popup_top {
    padding: 15px;
    display: flex;
    align-items: center;
    img {
      width: 36px;
      margin-right: 10px;
    }
    div {
      flex: 1;
      color: $blockColor;
      p {
        font-size: 15px;
        font-weight: 600;
        line-height: 22px;
      }
      span {
        color: rgba($blockColor, 0.8);
        font-size: 12px;
      }
    }
  }

  .poster_main_box {
    margin: 0 15px;
    img {
      height: 147px;
    }
    .main_top_box {
      text-align: center;
      background-color: $fontColor;
      padding: 0 30px;
      position: relative;
      div {
        padding: 20px 0 30px;
        border-bottom: 1px dashed rgba($lineColor, 0.1);
      }
      p {
        color: $subFontColor;
        margin-bottom: 10px;
      }
      h1 {
        color: $mainColor;
        letter-spacing: 1px;
        em {
          font-size: 16px;
        }
      }

      &::before {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 100%;
        background-color: $mainColor;
        left: -10px;
        bottom: -10px;
      }
      &::after {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 100%;
        background-color: $mainColor;
        right: -10px;
        bottom: -10px;
      }
    }
    .main_bottom_box {
      background-color: $fontColor;
      padding: 20px;
      ol {
        display: flex;
        align-items: center;
      }
      li {
        flex: 1;
        font-size: 12px;
        line-height: 20px;
        color: $subFontColor;
        span {
          display: block;
        }
        &:nth-child(2) {
          text-align: center;
        }
        &:last-child {
          text-align: right;
        }
      }
      .order_type {
        margin-top: 10px;
        em {
          background-color: $mainColor;
          border-radius: 4px;
          font-size: 12px;
          padding: 4px 10px;
          text-align: center;
          color: $blockColor;
        }
      }
    }
  }
  .poster_bottom {
    display: flex;
    align-items: center;
    padding: 15px;
    div {
      flex: 1;
      display: flex;
      align-items: center;
      // justify-content: center;
      padding-left: 30px;
      color: $blockColor;
      // letter-spacing: 2px;
      em {
        margin: 0 10px;
      }
    }
    p {
      flex: 1;
      max-width: 45px;
      min-width: 45px;
      height: 45px;
    }
  }
  .qr_box {
    padding: 30px;
    p {
      width: 100px;
      height: 100px;
      display: block;
      margin: auto;
      border-radius: 4px;
      overflow: hidden;
    }
  }
}
.share_btn {
  // width: 90%;
  margin-top: 20px;
  button {
    border-radius: 0;
  }
}
</style>
