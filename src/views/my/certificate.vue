<template>
  <div>
    <nav-header :title="$t('accountLang.lang157')"/>
    <div class="main_content">
      <div class="pdfdemo"></div>
    </div>
  </div>
</template>

<script>
import pdfh5 from "pdfh5"
import "pdfh5/css/pdfh5.css";
import url from '@/assets/file/whitePaper.pdf'
export default {
  name: 'whitePaper',
  data() {
    return {
      pdfh5: null,
    }
  },
  mounted() {
      this.pdfh5 = new pdfh5(".pdfdemo", {
          pdfurl: url
      })
  }
}
</script>

<style  lang="scss" scoped>

</style>

