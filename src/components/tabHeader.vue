<template>
  <div ref="tabHeader" class="tab_header">
    <div class="nav_header_box flex">
      <i class="icon-arrow-left iconfont" @click="goBack()" />
      <ol ref="tabHeaderOl" class="flex_center">
        <li v-for="(title,index) in titleArr" :key="title+index" :class="[{'tab_header_selected':active==index,'padding_bottom_7':line}]" @click="changeActive(index)">{{ title }}</li>
      </ol>
      <div v-if="line" ref="tabHeaderLine" class="tab_header_line" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabHeader',
  model: {
    prop: 'active',
    event: 'changeTabHeaderActive'
  },
  props: {
    titleArr: {
      type: Array,
      default: () => []
    },
    active: {
      type: null,
      default: 0
    },
    line: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    active() {
      setTimeout(() => {
        this.line && this.setLine()
      }, 0)
    }
  },

  mounted() {
    this.setBarHeight()

    this.line && this.setLine()
  },

  methods: {
    setBarHeight() {
      const el = this.$refs.tabHeader
      // console.dir(el);
      el.style.paddingTop = `${this.$barHeight}px`
      el.nextElementSibling && (el.nextElementSibling.style.top = `${el.clientHeight}px`)
    },

    changeActive(index) {
      this.$emit('changeTabHeaderActive', index)
    },

    setLine() {
      let el; const childNodes = this.$refs.tabHeaderOl.childNodes
      // console.dir(childNodes);
      childNodes.forEach(element => {
        element.className.includes('tab_header_selected') && (el = element)
      })
      // console.dir(el);
      const tabHeaderLine = this.$refs.tabHeaderLine
      const xlength = el.offsetLeft + el.clientWidth / 2
      tabHeaderLine.style.transform = `translateX(${xlength}px) translateX(-50%)`
    }
  }
}
</script>

<style lang="scss" scoped>
.tab_header{
  background-color: $blockColor;
  position: relative;
}
.nav_header_box{
  width: 100%;
  height: 46px;
  i{
    font-size: 18px;
    font-weight: 500;
    padding: 12px 15px;
    height: 46px;
  }
  ol{
    flex: 1;
    text-align: center;
    margin-right: 48px;
    font-size: 15px;
    line-height: 22px;
    color: $subFontColor;
    li{
      text-align: center;
      padding-left: 15px;
      padding-right: 15px;
      font-weight: 400;
    }
    .tab_header_selected{
      font-weight: 600;
      color: $mainColor;
    }
  }
  .tab_header_line{
    position: absolute;
    bottom: 9px;
    width: 15px;
    height: 2px;
    background-color: $mainColor;
    border-radius: 10px;
    transition-duration: 0.3s;
  }

  .padding_bottom_7{
    padding-bottom: 7px;
  }
}
</style>
