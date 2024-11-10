<template>
  <div class="invite_poster">
    <a class="close_btn" @click="hidePopup()"><img src="@img/my/icon_close.png" alt=""></a>
    <div class="poster_box" ref="posterBox">
      <img v-if="$i18n.locale=='CN'" src="@img/my/invite_poster_bg_cn.png" alt="">
      <img v-if="$i18n.locale=='EN'" src="@img/my/invite_poster_bg_en.png" alt="">
      <img v-if="$i18n.locale=='AR'" src="@img/my/invite_poster_bg_ar.png" alt="">
      <img v-if="$i18n.locale=='TR'" src="@img/my/invite_poster_bg_tr.png" alt="">
      <img v-if="$i18n.locale=='JP'" src="@img/my/invite_poster_bg_jp.png" alt="">
      <img class="qr_img" :src="qrImg" alt="">
    </div>
    <van-button type="primary" size="large" @click="createImage()">{{$t('accountLang.lang116')}}</van-button>
  </div>
</template>

<script>
import qrcode from "qrcode";
import html2canvas from 'html2canvas';
import $upload from '@/assets/js/upload';
export default {
  data(){
    return{
      qrImg:''
    }
  },
  props:['invitedData'],
  created(){
    this.createQr();
  },
  methods:{
    createQr() {
      var opts = { errorCorrectionLevel: "H", type: "image/png", rendererOpts: { quality: 0.3 } };
      qrcode.toDataURL( this.invitedData.appurl, opts, (err, url)=>{
          if (err) throw err;
          this.qrImg = url;
        }
      );
    },

    hidePopup(){
      this.$emit('hidePopup');
    },

    //创建海报
    createImage(){
      this.$store.dispatch('common/showLoading',true)
      let el = this.$refs.posterBox;
      html2canvas(el,{
        width: el.clientWidth - 1, //dom 原始宽度
        height: el.clientHeight - 1,
        scrollY: 0, 
        scrollX: 0,
      }).then((canvas) => {
        if(window.plus){
          let imgFile = $upload.dataURLtoFile(canvas.toDataURL("image/jpg"));
          //上传到oss
          $upload.uploadAlioss(imgFile,`IMG_${this.invitedData.recomcode}_${this.$i18n.locale}`).then(url => {
            this.downloadPoster(url);
          })
        }else{
          let imgUrl = canvas.toDataURL("image/jpeg");
          this.savePicture(imgUrl);
        }
      });
    },

    //下载海报
    downloadPoster(url){
      let vm = this;
      //创建下载任务  
      var dtask = plus.downloader.createDownload(url, {}, function (d, status) {
        if (status == 200) {
          window.plus.gallery.save( d.filename,function() {
            vm.$store.dispatch('common/showLoading',false)
            //保存到相册方法
            window.plus.nativeUI.closeWaiting();
            mui.toast(this.$t('accountLang.lang117'));
          },function() {
            vm.$store.dispatch('common/showLoading',false)
            window.plus.nativeUI.closeWaiting();
            mui.toast($t('accountLang.lang118'));
          });
        } else {
          vm.$store.dispatch('common/showLoading',false)
          Toast($t('accountLang.lang118'));
        }
      });
      //启动下载任务  
      dtask.start();
    },

    savePicture(imgUrl){
      this.$store.dispatch('common/showLoading',false)
      var blob=new Blob([''], {type:'application/octet-stream'});
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = imgUrl;
      a.download = `IMG_${this.invitedData.recomcode}_${this.$i18n.locale}`;
      var e = document.createEvent('MouseEvents');
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
      URL.revokeObjectURL(url);
    }
  }
}
</script>

<style lang="scss" scoped>
.invite_poster{
  width: 70%;
  z-index: 11;
  text-align: right;
  .close_btn{
    width: 25px;
    height: 25px;
    margin-bottom: 10px;
    display: inline-block;
  }
}
.poster_box{
  margin-bottom: 20px;
  border-radius: 0 0 5px 5px;
  overflow: hidden;
  position: relative;
  height: 467px;
  .qr_img{
    width:60px;
    height: 60px;
    position: absolute;
    right: 15px;
    bottom: 15px;
  }
}
</style>