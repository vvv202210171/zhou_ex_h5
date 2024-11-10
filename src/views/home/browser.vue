<template>
  <div>
    <nav-header title="customer service" />
    <div class="main_content content">
      <div v-show="showLoading" class="loading loading_ajax">
        <van-loading color="#F0B90A" />
      </div>
      <iframe ref="content" :src="serviceUrl" @load="ifarmeLoad"></iframe>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  data() {
    return {
      showLoading:true,
    }
  },
  computed: {
    ...mapState({
      serviceUrl: state => state.common.serviceUrl,
    })
  },
  methods: {
    ifarmeLoad(e){
      this.showLoading=false
    }
  }
}
</script>

<style lang="scss" scoped>
    .content{
      overflow-y: hidden;
    }
    iframe{
      overflow: hidden;
      -webkit-overflow-scrolling: touch;
      min-width: 100%;
      *width:100%;
      width:1px;
      height: 100%;
      padding: 0;
      margin: 0;
      border: 0;
    }

</style>
