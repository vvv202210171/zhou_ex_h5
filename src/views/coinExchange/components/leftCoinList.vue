<template>
  <div>
    <div ref="coinListTop" class="coin_list_top">
      <!-- <ol class="main_coin_box">
        <li v-for="(maincoin,index) in coinTab" @click="areaType=maincoin"  :key="index">
          <p :class="{'main_coin_selected':areaType==maincoin}">{{maincoin}}</p>
        </li>
      </ol> -->
      <div class="search_box">
        <p><i class="iconfont icon-search" /></p>
        <input v-model="searchParams" type="text" :placeholder="$t('tradeLang.lang30')">
      </div>
    </div>

    <div ref="searchList" class="search_list">
      <ol v-show="areaType!='Favorites'">
        <li v-for="(item,index) in coinList" v-if="item.maincoin==areaType&&(item.stringName.indexOf(searchParams.toLocaleUpperCase())!=-1)" :key="index" class="flex_between" @click="chooseCoin(item)">
          <div><span>{{ item.tradcoin }}</span> / {{ item.maincoin }}</div>
          <span :class="[item.rise>=0?'green_color':'red_color','text_hide']">{{ item.price }}</span>
        </li>
        <div class="no_data">
          <p class="icon_no_data" /><span>{{ $t('commonLang.lang4') }}</span>
        </div>
      </ol>
      <ol v-show="areaType=='Favorites'">
        <li v-for="(item,index) in coinList" v-if="item.isOptional&&(item.stringName.indexOf(searchParams.toLocaleUpperCase())!=-1)" :key="index" class="flex_between" @click="chooseCoin(item)">
          <div><span>{{ item.tradcoin }}</span> / {{ item.maincoin }}</div>
          <span :class="[item.rise>=0?'green_color':'red_color','text_hide']">{{ item.price }}</span>
        </li>
        <div class="no_data">
          <p class="icon_no_data" /><span>{{ $t('commonLang.lang4') }}</span>
        </div>
      </ol>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  props: {
    coinListArr: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      areaType: '',
      coinTab: [],
      coinList: [],

      searchParams: ''
    }
  },
  computed: {
    // 获取 store中的 行情 socket数据
    ...mapState({
      marketSocketData: state => state.trade.marketSocketData
    })
  },
  watch: {
    // 监听socket 数据  实时更新
    marketSocketData(data) {
      // 更新行情
      if (data.symbols) {
        this.processData(data.symbols)
      }
    }
  },
  created() {
    // 防止socket更新不及时  先用接口数据填充
    this.processData(this.coinListArr)
  },

  mounted() {
    const coinListTop = this.$refs.coinListTop
    coinListTop.style.paddingTop = `${this.$barHeight}px`
    this.$refs.searchList.style.top = `${coinListTop.clientHeight + 8}px`
  },

  methods: {
    // 填充左侧边栏数据
    processData(resData) {
      // 设置自选
      const optionalData = JSON.parse(localStorage.getItem('optionalData')) || []
      this.coinList = []
      resData.forEach(data => {
        data.stringName = `${data.tradcoin}/${data.maincoin}`
        optionalData.forEach(item => {
          if (data.autoid == item.autoid) {
            data.isOptional = true
          }
        })
        if (!this.coinTab.includes(data.maincoin)) {
          this.coinTab.push(data.maincoin)
        }
        if (!this.areaType) {
          this.areaType = this.coinTab[0]
        }

        if (data.state == 'enable') {
          this.coinList.push(data)
        }
      })
    },

    chooseCoin(coinData) {
      this.$emit('chooseCoin', coinData)
    }
  }
}
</script>

<style lang="scss" scoped>
.main_coin_box{
  position: relative;
  padding: 15px 15px 0;
  overflow-y: auto;
  display: block;
  white-space:nowrap;
  border-bottom: 1px solid rgba($lineColor,1);
  background-color: $blockColor;
  li{
    padding-right: 25px;
    text-align: center;
    display: inline-block;
    color: $subFontColor;
    p{
      position: relative;
      display: block;
      padding: 10px 0 8px;
    }
    .main_coin_selected{
      color: $mainColor;
      &::after{
        content: '';
        position: absolute;
        width: 100%;
        left:0;
        bottom: 0;
        height: 1px;
        z-index: 100;
        background: $mainColor;
      }
    }
  }
}
.search_box{
  width: 100%;
  padding: 12px 15px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba($bgColor,.5);
  color: $subFontColor;
  position: relative;
  i{
    font-size: 15px;

  }
  input {
    margin-left: 5px;
    flex: 1;
    font-size: 15px;
  }
}
.search_list{
  position: absolute;
  width: 100%;
  top: 98px;
  bottom: 0;
  overflow-y: auto;
  li{
    padding: 14px 15px;
    border-bottom: 1px solid rgba($bgColor,.5);
    div{
      font-size: 10px;
    }
    span{
      font-size: 13px;
      font-weight: 600;
    }
    &+div{
      display: none;
    }
  }
}
</style>
