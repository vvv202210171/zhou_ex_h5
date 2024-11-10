<template>
  <div class="title_tabs flex_between">
    <ol ref="titleTabs">
      <li v-for="(data,index) in titleArr" :key="data.name+index" :class="[{'title_tab_selected':active==index}]" @click="changeActive(index)">
        <span>{{ data.name }}</span>
        <em v-if="data.number"> ({{ data.number }})</em>
      </li>
    </ol>
    <slot name="allBox" />
    <div ref="titleTabsLine" class="title_tabs_line" />
  </div>
</template>

<script>
export default {
  name: 'TabHeader',
  model: {
    prop: 'active',
    event: 'changeTabTitleActive'
  },
  props: {
    titleArr: {
      type: Array,
      default: () => []
    },
    active: {
      type: null,
      default: 0
    }
  },

  watch: {
    active() {
      setTimeout(() => {
        this.setLine()
      }, 0)
    }
  },

  mounted() {
    this.setLine()
  },

  methods: {
    changeActive(index) {
      this.$emit('changeTabTitleActive', index)
    },

    setLine() {
      let el; const childNodes = this.$refs.titleTabs.childNodes
      childNodes.forEach(element => {
        element.className.includes('title_tab_selected') && (el = element)
      })
      const titleTabsLine = this.$refs.titleTabsLine
      const xlength = el.offsetLeft + el.firstChild.clientWidth / 2
      titleTabsLine.style.transform = `translateX(${xlength}px) translateX(-50%)`
    }
  }
}
</script>

<style lang="scss" scoped>
.title_tabs{
  position: relative;
  padding: 15px 0;
  font-size: 15px;
  font-weight: 600;
  color: $subFontColor;
  ol{
    display: flex;
    li{
      margin-left: 15px;
    }
    span{
      display: inline-block;
    }
  }
  .title_tab_selected{
    color: $fontColor;
  }
  .title_tabs_line{
    position: absolute;
    bottom: 6px;
    width: 15px;
    height: 2px;
    background-color: $mainColor;
    border-radius: 10px;
    transition-duration: 0.3s;
  }
}
</style>
