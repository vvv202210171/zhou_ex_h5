<template>
  <div id="app" :class="appThem">
    <!-- <keep-alive  include="home,allClassify,mallSearch"> -->
    <router-view class="child-view" :class="transitionName" />
    <!-- </keep-alive> -->
    <nav-footer v-show="showFooter" />

    <div v-show="showLoading" class="loading loading_ajax">
      <van-loading color="#F0B90A" />
    </div>

    <appUpdate />
  </div>
</template>

<script>
import { mapState } from "vuex";
import navFooter from "@/components/navFooter.vue";
import appUpdate from "@/components/appUpdate.vue";
export default {
  name: "App",
  components: {
    navFooter,
    appUpdate,
  },
  data() {
    return {
      transitionName: "slide-left",
      appThem: window._config.them,
    };
  },
  computed: {
    ...mapState({
      showLoading: (state) => state.common.showLoading,
      showFooter: (state) => state.common.showFooter,
      isAppUpdate: (state) => state.common.isAppUpdate,
    }),
  },
  watch: {
    $route(to, from) {
      if (to.meta.level < from.meta.level) {
        this.transitionName = "slide-right";
      } else if (to.meta.level > from.meta.level) {
        this.transitionName = "slide-left";
      }
    },
  },
  created() {
    this.$store.dispatch("user/getUserInfo");
    this.$store.dispatch("wallet/getRate", "USD");
    this.$store.dispatch("common/getConfig");
  },
};
</script>

<style lang="scss">
.child-view {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  overflow-x: hidden;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
    /*隐藏滚轮*/
  }
}
.loading_ajax {
  background-color: rgba(0, 0, 0, 0.01) !important;
}

@keyframes moveRight {
  0% {
    opacity: 0;
    left: 100%;
  }
  100% {
    opacity: 1;
    left: 0;
  }
}
@keyframes moveLeft {
  0% {
    opacity: 0;
    left: -100%;
  }
  100% {
    opacity: 1;
    left: 0;
  }
}

.slide-left {
  animation: 0.3s moveRight;
}
.slide-right {
  animation: 0.3s moveLeft;
}
</style>
