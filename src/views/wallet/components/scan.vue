<template>
  <div class="scan">
    <nav-header :title="$t('tradeLang.lang83')"/>
    <div class="main_content" id="bcid">
      <!-- <span class="scan_go_back" @click="subGoBack()"></span> -->
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
let scan = null
let styles = {frameColor: "#F0B90A",scanbarColor: "#F0B90A",background: ""};
export default {
  name:'scan',
  // props: {
  //   initStart: {
  //     type: Boolean
  //   }
  // },
  data() {
    return {
      codeUrl: ''
    }
  },
  watch: {
    $route(val, oldval) {
      if (oldval.fullPath.indexOf("?") != -1) {
        scan&&scan.cancel()
        scan&&scan.close()
      }
    },
  },
  created() {
  },
  mounted() {
    this.startRecognize();
  },
  // beforeRouteLeave(to, from, next) {
  //   if (!window.plus) return
  //   scan.cancel()
  //   scan.close()
  //   next();
  // },
  methods: {
    // 创建扫描控件
    startRecognize() {
      let that = this
      if (!window.plus) return
      // eslint-disable-next-line
      scan = new plus.barcode.Barcode('bcid','',styles)
      scan.onmarked = onmarked
      this.startScan();
      function onmarked(type, result, file) {
        switch (type) {
          // eslint-disable-next-line
          case plus.barcode.QR:
            type = 'QR'
            break
          // eslint-disable-next-line
          case plus.barcode.EAN13:
            type = 'EAN13'
            break
          // eslint-disable-next-line
          case plus.barcode.EAN8:
            type = 'EAN8'
            break
          default:
            type = '其它' + type
            break
        }
        // 获得code
        result = result.replace(/\n/g, '')
        that.codeUrl = result
        if (!window.plus) return
        scan.cancel()
        scan.close()
        // alert(that.codeUrl)
        that.$emit('getScanText',that.codeUrl);
      }
    },
    // 开始扫描
    startScan() {
      if (!window.plus) return
      scan.start()
    },
  }
}
</script>
<style lang="scss" scoped>
.scan {
  #bcid {
    width: 100%;
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
  }
}
</style>