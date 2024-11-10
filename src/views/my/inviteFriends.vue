<template>
  <div>
    <nav-header :title="$t('accountLang.lang95')" />
    <div class="main_content">
      <div class="qr_box">
        <p class="qr_img">
          <img ref="qrBox" v-if="qrImg" :src="qrImg" alt="" />
        </p>
        <van-button type="primary" @click="createImage()">{{
          $t("accountLang.lang116")
        }}</van-button>
      </div>
      <div class="my_invite_info">
        <ol>
          <li>
            <p>{{ $t("accountLang.lang105") }}</p>
            <div>
              <span class="text_hide">{{
                invitedData.recomcode || "000000"
              }}</span>
              <button
                class="copy_btn"
                :aria-label="invitedData.recomcode"
                @click="$utils.promote()"
              >
                {{ $t("commonLang.lang6") }}
              </button>
            </div>
          </li>
          <li>
            <p>{{ $t("accountLang.lang106") }}</p>
            <div>
              <span class="text_hide">{{ invitedData.appurl }}</span>
              <button
                class="copy_btn"
                :aria-label="invitedData.appurl"
                @click="$utils.promote()"
              >
                {{ $t("commonLang.lang6") }}
              </button>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import qrcode from "qrcode";
import html2canvas from "html2canvas";
import $upload from "@/assets/js/upload";
import { mapState } from "vuex";
export default {
  data() {
    return {
      qrImg: "",
    };
  },
  computed: {
    ...mapState({
      invitedData: (state) => state.user.invitedData,
    }),
  },
  watch: {
    invitedData() {
      this.initData();
    },
  },
  created() {
    this.$store.dispatch("user/getInvitedData");
    this.initData();
  },

  methods: {
    initData() {
      let data = this.invitedData;
      let code = data.recomcode;
      data.appurl = `${location.href.split("#")[0]}#/register/${code}`;
      //var info = `${location.href}/${this.invitedData.recomcode}`;
      if (this.invitedData.appurl && !this.qrImg) {
        this.createQr();
      }
    },
    createQr() {
      var opts = {
        errorCorrectionLevel: "H",
        type: "image/png",
        rendererOpts: { quality: 0.3 },
      };
      qrcode.toDataURL(this.invitedData.appurl, opts, (err, url) => {
        if (err) throw err;
        this.qrImg = url;
      });
    },

    hidePopup() {
      this.$emit("hidePopup");
    },

    //创建海报
    createImage() {
      this.$store.dispatch("common/showLoading", true);
      let el = this.$refs.qrBox;
      html2canvas(el, {
        width: el.clientWidth - 1, //dom 原始宽度
        height: el.clientHeight - 1,
        scrollY: 0,
        scrollX: 0,
      }).then((canvas) => {
        if (window.plus) {
          // let imgFile = $upload.dataURLtoFile(canvas.toDataURL("image/jpg"));
          //上传到oss
          // $upload.uploadAlioss(imgFile,`IMG_${this.invitedData.recomcode}_${this.$i18n.locale}`).then(url => {
          //   this.downloadPoster(url);
          // })
          let imgFile = canvas.toDataURL("image/png");
          $upload.uploadImg(imgFile, true).then((url) => {
            this.downloadPoster(url);
          });
        } else {
          let imgUrl = canvas.toDataURL("image/jpeg");
          this.savePicture(imgUrl);
        }
      });
    },

    //下载海报
    downloadPoster(url) {
      let vm = this;
      //创建下载任务
      var dtask = plus.downloader.createDownload(url, {}, function (d, status) {
        if (status == 200) {
          window.plus.gallery.save(
            d.filename,
            function () {
              vm.$store.dispatch("common/showLoading", false);
              //保存到相册方法
              window.plus.nativeUI.closeWaiting();
              mui.toast(this.$t("accountLang.lang117"));
            },
            function () {
              vm.$store.dispatch("common/showLoading", false);
              window.plus.nativeUI.closeWaiting();
              mui.toast($t("accountLang.lang118"));
            }
          );
        } else {
          vm.$store.dispatch("common/showLoading", false);
          Toast($t("accountLang.lang118"));
        }
      });
      //启动下载任务
      dtask.start();
    },

    savePicture(imgUrl) {
      this.$store.dispatch("common/showLoading", false);
      var blob = new Blob([""], { type: "application/octet-stream" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = imgUrl;
      a.download = `IMG_${this.invitedData.recomcode}_${this.$i18n.locale}`;
      var e = document.createEvent("MouseEvents");
      e.initMouseEvent(
        "click",
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
      );
      a.dispatchEvent(e);
      URL.revokeObjectURL(url);
    },
  },
};
</script>

<style lang="scss" scoped>
.qr_box {
  text-align: center;
  padding: 20px 0;
  .qr_img {
    margin: 0 auto;
    width: 200px;
    height: 200px;
    border-radius: 10px;
    overflow: hidden;
    img {
      width: 200px;
      height: 200px;
      vertical-align: inherit;
      margin: 0;
    }
  }
  button {
    margin-top: 30px;
    line-height: 32px;
    height: 32px;
  }
}
.my_invite_info {
  padding: 15px;
  li {
    margin-bottom: 25px;
    p {
      font-weight: 600;
      margin-bottom: 15px;
    }
    div {
      flex: 1;
      // border: 1px solid $lineColor;
      box-shadow: inset 0 0 0 1px $subBlockColor;
      display: flex;
      align-items: center;
      padding-left: 15px;
      border-radius: 4px;
      overflow: hidden;
      span {
        flex: 1;
        line-height: 20px;
        padding-right: 10px;
      }
      button {
        flex: 1;
        max-width: 100px;
        line-height: 44px;
        background-color: $mainColor;
        color: $bgColor;
      }
    }
  }
}
</style>