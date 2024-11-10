<template>
  <div ref="navHeader" class="nav_header" :style="{'background':background}">
    <van-nav-bar
      :title="title"
      :left-text="leftText"
      :right-text="rightText"
      :left-arrow="leftArrow"
      :border="border"
      @click-left="goBack()"
      @click-right="onClickRight"
    >
      <template #right>
        <slot name="headerRight" />
      </template>
      <template #title>
        <slot name="headerTitle" />
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'NavHeader',
  props: {
    title: {
      type: String,
      default: ''
    },
    leftText: {
      type: String,
      default: ''
    },
    rightText: {
      type: String,
      default: ''
    },
    leftArrow: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: false
    },
    background: {
      type: String,
      default: '#191C24'
    },
    color: {
      type: String,
      default: ''
    }
  },

  mounted() {
    this.setBarHeight()
  },
  methods: {
    setBarHeight() {
      const el = this.$refs.navHeader
      // console.dir(el);
      el.style.paddingTop = `${this.$barHeight}px`
      const elHeight = this.getStyle(el, 'height')
      this.$store.dispatch('common/setNavHeaderHeight', elHeight)
      el.nextElementSibling && (el.nextElementSibling.style.top = elHeight)
    },

    // 获取元素实际ComputedStyle属性
    getStyle(obj, attr) {
      if (obj.currentStyle) { // 兼容IE
        return obj.currentStyle[attr]
      } else {
        return window.getComputedStyle(obj, null)[attr]
      }
    },

    onClickRight() {
      this.$emit('clickRight')
    }
  }
}
</script>
<style>
.header_title{
  text-align: center;
  margin: 0 54px 0 0;
  font-size: 16px;
}
</style>
<style lang="scss" scoped>
.nav_header{
  position: relative;
}
</style>
