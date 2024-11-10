<!-- 搜索币种 -->
<template>
  <div class="block_bg">
    <div ref="coinSearchTop" class="coin_search_top block_bg">
      <div class="search_box">
        <i class="iconfont icon-search" />
        <form action="">
          <input v-model.trim="searchVal" type="text" :placeholder="$t('tradeLang.lang30')" @keypress="searchKey">
        </form>
        <span @click="goBack()">{{ $t('commonLang.lang1') }}</span>
      </div>
    </div>
    <div ref="coinSearchBox" class="search_content">
      <div v-if="!searchVal" class="history_box">
        <span>{{ $t('tradeLang.lang31') }}</span>
        <ol>
          <li v-for="item in historyList" :key="item.autoid" @click="chooseHistory(item)">{{ item.tradcoin }}/{{ item.maincoin }}</li>
        </ol>
      </div>
      <div v-if="searchVal" class="coin_list">
        <ol>
          <li v-for="item in coinList" v-if="(item.stringName.indexOf(searchVal.toLocaleUpperCase())!=-1)" :key="item.autoid" class="flex_between" @click="searchGoDetails(item)">
            <p>{{ item.tradcoin }}/{{ item.maincoin }}</p>
            <i :class="[{'main_color':item.isOptional},'iconfont icon-star']" @click.stop="handleOptional(item)" />
          </li>
          <div class="no_data">
            <p class="icon_no_data" />
            <span>{{ $t('tradeLang.lang32') }}</span>
          </div>
        </ol>
      </div>
    </div>

  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import { mapState } from 'vuex'
import { tradeSymbols } from '@api/exchange'
export default {
  components: {},
  data() {
    return {
      coinList: [],

      searchVal: '',
      historyList: JSON.parse(localStorage.getItem('searchHistory')) || []
    }
  },
  computed: {
    ...mapState({
      marketSocketData: state => state.trade.userInfo
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
    if (this.marketSocketData && this.marketSocketData.symbols) {
      this.processData(this.marketSocketData.symbols)
    } else {
      this.getSymbols()
    }
  },
  mounted() {
    const coinSearchTop = this.$refs.coinSearchTop
    coinSearchTop.style.paddingTop = `${this.$barHeight}px`
    this.$refs.coinSearchBox.style.marginTop = `${coinSearchTop.clientHeight}px`
  },
  methods: {
    getSymbols() {
      tradeSymbols().then(res => {
        this.processData(res.data)
      })
    },
    // 加工行情数据
    processData(coinData) {
      const optionalData = JSON.parse(localStorage.getItem('optionalData')) || []
      coinData.forEach(data => {
        data.stringName = `${data.tradcoin}/${data.maincoin}`
        optionalData.forEach(id => {
          data.isOptional = data.autoid == id
        })
      })
      this.coinList = coinData
    },
    searchKey() {
      if (event.keyCode == '13') {
        event.preventDefault()
      }
    },
    searchGoDetails(data) {
      if (data.state == 'enable') {
        // 去掉历史查看中
        this.historyList = this.historyList.filter((item, index) => !(item.autoid == data.autoid))
        this.historyList.unshift({ tradcoin: data.tradcoin, maincoin: data.maincoin, autoid: data.autoid })
        localStorage.setItem('searchHistory', JSON.stringify(this.historyList))
        sessionStorage.setItem('marketDetails', JSON.stringify(data))
        this.pushPath('/marketDetails/trad')
      } else {
        Toast(this.$t('tradeLang.lang33'))
      }
    },

    chooseHistory(item) {
      this.searchVal = `${item.tradcoin}/${item.maincoin}`
    },

    handleOptional(data) {
      this.$set(data, 'isOptional', !data.isOptional)
      let optionalData = JSON.parse(localStorage.getItem('optionalData')) || []

      if (data.isOptional) {
        optionalData.push(data.autoid)
      } else {
        optionalData = optionalData.filter((id, index) => !(id == data.autoid))
      }
      localStorage.setItem('optionalData', JSON.stringify(optionalData))
    }
  }
}
</script>
<style lang='scss' scoped>
.coin_search_top{
  position: fixed;
  width: 100%;
  z-index: 10;
}
.search_content{
  margin-top: 52px;
}
.search_box{
  display: flex;
  align-items: center;
  padding: 20px 15px 15px;
  border-bottom: 1PX solid $lineColor;
  i{
    flex: 1;
    max-width: 20px;
    font-size: 16px;
    color: $subFontColor;
  }
  form{
    flex: 1;
    margin-left: 10px;
  }
  span{
    color: $subFontColor;
    font-size: 12px;
    text-align: right;
  }
}

.history_box{
  padding: 15px 15px 0;
  color: $subFontColor;
  width: 100%;
  span{
    font-size: 12px;
    display: block;
    margin-bottom: 10px;
  }
  li{
    line-height: 40px;
    font-weight: 600;
  }
}
.coin_list{
  width: 100%;
  li{
    padding: 10px 15px;
    p{
      font-weight: 600;
    }
    i{
      font-size: 18px;
      color: $subFontColor;
    }
  }
  li+div{
    display: none;
  }
}
</style>
