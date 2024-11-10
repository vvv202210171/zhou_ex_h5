<template>
  <van-popup v-model="isAppUpdate" :close-on-click-overlay="false" class="update_box">
    <div class="update_top_img">
      <img src="@img/common/update_top_img.png" alt="">
      <p>V1.{{ versionData.code }}</p>
    </div>
    <div class="update_bottom_box">
      <h3>{{ $t('plusLang.lang10') }}</h3>
      <p class="update_text">{{ versionData.info||$t('plusLang.lang11') }}</p>
      <div v-show="!showProgress" class="update_btn">
        <van-button type="primary" size="large" @click="createDownloadTask()">{{ $t('plusLang.lang12') }}</van-button>
      </div>
      <div v-show="showProgress" class="download_progress_box">
        <h4>{{ $t('plusLang.lang4') }} ({{ Math.floor(downloadProgress*100) }}%)</h4>
        <progress :value="downloadProgress" />
      </div>
    </div>
  </van-popup>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      showProgress: false,
      dtask: null,
      downloadProgress: 0
    }
  },
  computed: {
    ...mapState({
      versionData: state => state.common.versionData,
      isAppUpdate: state => state.common.isAppUpdate
    })
  },

  methods: {
    createDownloadTask() {
      if (mui.os.android) {
        this.showProgress = true
        this.dtask = plus.downloader.createDownload(this.versionData.url, {}, (d, status) => {
          if (status == 200) {
            this.installPackage(d.filename)
            plus.runtime.quit()
          } else {
            plus.nativeUI.alert(this.$t('plusLang.lang13'), function() {}, '', 'ok')
          }
        })

        this.dtask.addEventListener('statechanged', this.onStateChanged, false)
        this.dtask.start()
      } else {
        plus.runtime.openURL(this.versionData.url)
        plus.runtime.restart()
      }
    },

    // 监听下载任务状态  展示下载进度条进度
    onStateChanged() {
      mui.later(() => {
        const num = this.dtask.downloadedSize / this.dtask.totalSize
        if (num && num < 1) {
          this.downloadProgress = num
        }
      }, 200)
    },

    // 安装更新文件
    installPackage(path) {
      const vm = this
      plus.runtime.install(path, {}, function() {
        plus.nativeUI.closeWaiting()
        console.log('安装wgt文件成功！')
        setTimeout(() => {
          plus.nativeUI.alert(vm.$t('plusLang.lang6'), function() {
            plus.runtime.restart()
          }, '', 'ok')
        }, 3000)
      }, function(e) {
        plus.nativeUI.closeWaiting()
        console.log('安装wgt文件失败[' + e.code + ']：' + e.message)
        plus.nativeUI.alert(`${vm.$t('plusLang.lang7')} ${e.code}：${e.message}`, function() {}, '', 'ok')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.update_box{
  width: calc(100vw - 100px);
  background-color: transparent;
  .update_top_img{
    position: relative;
    p{
      position: absolute;
      right: 10px;
      top: 40px;
      color: #fff;
      font-size: 12px;
    }
  }
  .update_bottom_box{
    background-color: #fff;
    color: $bgColor;
    margin-top: -1px;
    padding: 20px;
    border-radius: 0 0 10px 10px;
    .update_text{
      color: $blockColor;
      font-size: 12px;
      margin: 10px 0 20px;
      line-height: 18px;
    }
    .update_btn{
      text-align: right;
      height: 44px;
    }
  }

  .download_progress_box{
    height: 44px;
    h4{
      font-size: 12px;
      color: $mainColor;
      margin-bottom: 5px;
    }
    progress{
      width: 100%;
      border-radius: 30px;
      height: 5px;
      vertical-align: middle;
      &::-webkit-progress-bar{
        background-color: $bgColor;
        border-radius: 30px;
      }
      &::-webkit-progress-value{
        background: $mainColor;
        border-radius: 30px;
      }
    }
  }
}
</style>
