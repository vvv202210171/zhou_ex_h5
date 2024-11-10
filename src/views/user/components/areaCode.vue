<template>
  <div class="area_code">
    <div ref="areaCodeTop" class="area_code_top">
      <div class="area_code_nav flex">
        <div class="search_box flex">
          <i class="iconfont icon-search" />
          <form action="">
            <input v-model.trim="searchVal" type="text" :placeholder="$t('accountLang.lang12')">
          </form>
        </div>
        <button @click="goBack()">{{ $t('commonLang.lang1') }}</button>
      </div>
    </div>

    <div v-show="!searchVal" ref="areaListBox" class="area_list_box">
      <van-index-bar :index-list="areaCodeData.indexBar" :sticky="false" highlight-color="#7C51FF">
        <div>
          <van-index-anchor :index="$t('accountLang.lang13')" />
          <van-cell v-for="data in areaCodeData.mainArea" :key="data.id" :title="data.country" @click="chooseArea(data)" />
        </div>

        <div v-for="(item,index) in areaCodeData.areaCode" :key="index">
          <van-index-anchor :index="item.key" />
          <van-cell v-for="data in item.data" :key="data.id" :title="data.country" @click="chooseArea(data)" />
        </div>
      </van-index-bar>
    </div>

    <div v-show="!!searchVal" ref="searchItemBox" class="search_item_box">
      <van-cell v-for="data in areaCode" v-if="data.country.includes(searchVal)" :key="data.id" :title="data.country" @click="chooseArea(data)" />
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      searchVal: '',
      isSearch: true
    }
  },
  computed: {
    ...mapState({
      areaCode: state => state.common.areaCode
    }),
    ...mapGetters({
      areaCodeData: 'areaCodeData'
    })
  },
  watch: {},
  mounted() {
    const areaCodeTopEl = this.$refs.areaCodeTop
    areaCodeTopEl.style.paddingTop = `${this.$barHeight}px`
    this.$refs.areaListBox.style.top = `${areaCodeTopEl.clientHeight}px`
    this.$refs.searchItemBox.style.top = `${areaCodeTopEl.clientHeight}px`
  },
  methods: {
    chooseArea(data) {
      // if(data.mobilePrefix=='86'){
      //   Toast('中国大陆地区禁止注册')
      // }else{
      this.goBack()
      localStorage.setItem('defaultCode', data.mobilePrefix)
      this.$emit('selecteArea', data)
      // }
    }
  }

}
</script>

<style lang="scss" scoped>

.area_code_top{
  background-color: $blockColor;
  position: relative;
  .area_code_nav{
    padding: 4px 0 4px 15px;
    .search_box{
      flex: 1;
      border-radius: 20px;
      background-color: $bgColor;
      padding: 7px 10px;
      i{
        flex: 1;
        max-width: 22px;
        min-width: 22px;
        height: 22px;
        font-size: 16px;
        font-weight: 600;
        color: $subFontColor;
        padding: 3px;
      }
      form{
        flex: 1;
        margin-left: 5px;
        input{
          height: 22px;
        }
      }
    }
    button{
      padding: 0 15px;
      color: $mainColor;
    }
  }
}

.area_list_box{
  position: absolute;
  width: 100%;
  bottom: 0;
  top: 44px;
  overflow-y: auto;
  padding-top: 15px;
}
.search_item_box{
  position: absolute;
  width: 100%;
  bottom: 0;
  top: 44px;
  overflow-y: auto;
  padding-top: 15px;
}
</style>
