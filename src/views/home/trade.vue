<template>
  <div class="trade">
    <div ref="tradeTop" class="trade_top">
      <ol class="trade_nav flex">
        <li :class="[{'nav_active':active==1}]" @click="active=1">{{ $t('homeLang.lang37') }}</li>
        <li :class="[{'nav_active':active==2}]" @click="active=2">{{ $t('homeLang.lang38') }}</li>
        <li :class="[{'nav_active':active==3}]" @click="active=3">{{ $t('homeLang.lang39') }}</li>
      </ol>
    </div>
    <div ref="tradeBox">
      <coinExchange v-if="active==1" />
      <futures v-if="active==2" />
    </div>
  </div>
</template>

<script>
import coinExchange from '@/views/coinExchange/mainIndex.vue'
import futures from '@/views/futures/mainIndex.vue'
export default {
  components: { coinExchange, futures },
  data() {
    return {
      active: Number(sessionStorage.getItem('tradeActive')) || 1
    }
  },
  watch: {
    active(val) {
      if (val != 3) {
        sessionStorage.setItem('tradeActive', val)
      } else {
        this.$router.replace('/cycle')
      }
    }
  },
  created() {
    this.$store.dispatch('common/showFooter', true)
    this.$store.dispatch('common/updateSelectedFooter', 2)
  },
  mounted() {
    const tradeTop = this.$refs.tradeTop
    tradeTop.style.paddingTop = `${this.$barHeight}px`
    this.$refs.tradeBox.style.marginTop = `${tradeTop.clientHeight}px`
  }
}
</script>

<style lang="scss" scoped>
.trade{
  bottom: 50px;
  height: auto;
}
.trade_top{
  background: $bgColor;
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
}
.trade_nav{
  padding: 10px 15px 10px 0;
  li{
    padding: 0 15px 0 18px;
    height: 26px;
    line-height: 26px;
    color: $subFontColor;
  }
  .nav_active{
    transform: scale(1.2);
    color: $fontColor;
    font-weight: 600;
  }
}
</style>
