<template>
  <van-tabbar v-model="selected">
    <van-tabbar-item class="text_hide" @click="pushPage('/home')">
      <p>
        <img v-if="selected==0" :src="require(`@img/common/icon_selected${them}_0.png`)" alt="">
        <img v-if="selected!=0" src="@img/common/icon_default_0.png" alt="">
      </p>
      <span class="footer_name text_hide">{{ $t('homeLang.lang1') }}</span>
    </van-tabbar-item>
    <van-tabbar-item class="text_hide" @click="pushPage('/market')">
      <p>
        <img v-if="selected==1" :src="require(`@img/common/icon_selected${them}_1.png`)" alt="">
        <img v-if="selected!=1" src="@img/common/icon_default_1.png" alt="">
      </p>
      <span class="footer_name text_hide">{{ $t('commonLang.lang15') }}</span>
    </van-tabbar-item>
    <van-tabbar-item class="text_hide" @click="pushPage('/trade')">
      <p>
        <img v-if="selected==2" :src="require(`@img/common/icon_selected${them}_2.png`)" alt="">
        <img v-if="selected!=2" src="@img/common/icon_default_2.png" alt="">
      </p>
      <span class="footer_name text_hide">{{ $t('commonLang.lang14') }}</span>
    </van-tabbar-item>
    <van-tabbar-item class="text_hide" @click="pushPage('/cycle')">
      <p>
        <img v-if="selected==3" :src="require(`@img/common/icon_selected${them}_3.png`)" alt="">
        <img v-if="selected!=3" src="@img/common/icon_default_3.png" alt="">
      </p>
      <span class="footer_name text_hide">{{ $t('commonLang.lang13') }}</span>
    </van-tabbar-item>
    <van-tabbar-item class="text_hide" @click="pushPage('/balances')">
      <p>
        <img v-if="selected==4" :src="require(`@img/common/icon_selected${them}_4.png`)" alt="">
        <img v-if="selected!=4" src="@img/common/icon_default_4.png" alt="">
      </p>
      <span class="footer_name text_hide">{{ $t('commonLang.lang11') }}</span>
    </van-tabbar-item>
  </van-tabbar>
</template>
<script>
export default {
  name: 'NavFooter',
  data() {
    return{
      them: ''
    }    
  },
  created() {
    this.them = "_" + window._config.them
  },
  computed: {
    selected: {
      get() {
        return this.$store.state.common.selectedFooter
      },
      set(newValue) {
        this.$store.state.common.selectedFooter = newValue
      }
    }
  },
  watch: {
    $route(to, from) {
      if (['home', 'market', 'trade', 'balances', 'cycle'].includes(to.name)) {
        this.$store.dispatch('common/showFooter', true)
      } else {
        setTimeout(() => {
          this.$store.dispatch('common/showFooter', false)
        }, 10)
      }
    }
  },
  methods: {
    pushPage(path) {
      this.$router.replace(path)
    }
  }
}
</script>
<style lang="scss" scoped>
@keyframes img_animation {
  0% {
    width: 100%;
    height: 100%;
  }
  50% {
    width: 60%;
    height: 60%;
  }
  100% {
    width: 100%;
    height: 100%;
  }
}
.van-tabbar{
  i{
    display: block;
    text-align: center;
  }
}
.van-tabbar-item{
  min-width: 20%;
  max-width: 20%;
  flex-direction:initial;
  text-align: center;
  font-size: 11px;
  // color: $subFontColor;
  position: relative;
  &::after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    //设置径向渐变
    background-image: radial-gradient(circle, $mainColor 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(8, 8);
    opacity: 0;
    transition: transform .3s, opacity .3s;
  }
  &:active:after {
    transform: scale(0, 0);
    opacity: .3;
    //设置初始状态
    transition: 0s;
  }
  &:active{
    img{
      animation: img_animation 1s infinite linear
    }
  }
  p{
    width: 22px;
    height: 22px;
    margin:0 auto 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      height: 100%;
      width: auto;
    }
  }
}
.footer_name{
  font-size:10px;
}

</style>
