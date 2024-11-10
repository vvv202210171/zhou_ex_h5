<!-- 档位图 -->
<template>
  <div class="chart_box">
    <div class="chart_title">
      <!-- <em>买</em> -->
      <span>{{ $t('tradeLang.lang6') }}</span>
      <span>{{ $t('tradeLang.lang7') }}</span>
      <span>{{ $t('tradeLang.lang6') }}</span>
      <!-- <em>卖</em> -->
    </div>
    <div class="disc_chart_list">
      <ol class="disc_chart_left" :style="{'height':showAll?'auto':'3.2rem'}">
        <li v-for="(item,index) in buyList" :key="index" @click="setPrice('buy',item.price)">
          <!-- <em>{{index+1}}</em> -->
          <div>
            <i :style="{'width':item.width+'%'}" class="green_transparent" />
            <p class="flex_between">
              <span>{{ item.amount|mathFloor(params.amount_accuracy) }}</span>
              <span class="green_color">{{ item.price|mathFloor(params.price_accuracy) }}</span>
            </p>
          </div>
        </li>
        <li v-for="(n,index) in (5-buyList.length>0?5-buyList.length:0)" :key="index">
          <!-- <em>{{buyList.length+n}}</em> -->
          <div>
            <p class="flex_between">
              <span>--</span>
              <span class="green_color">--</span>
            </p>
          </div>
        </li>
      </ol>
      <ol class="disc_chart_right" :style="{'height':showAll?'auto':'3.2rem'}">
        <li v-for="(item,index) in sellList" :key="index" @click="setPrice('sell',item.price)">
          <div>
            <i :style="{'width':item.width+'%'}" class="red_transparent" />
            <p class="flex_between">
              <span class="red_color">{{ item.price|mathFloor(params.price_accuracy) }}</span>
              <span>{{ item.amount|mathFloor(params.amount_accuracy) }}</span>
            </p>
          </div>
          <!-- <em>{{index+1}}</em> -->
        </li>
        <li v-for="(n,index) in (5-sellList.length>0?5-sellList.length:0)" :key="index">
          <div>
            <p class="flex_between">
              <span class="red_color">--</span>
              <span>--</span>
            </p>
          </div>
          <!-- <em>{{sellList.length+n}}</em> -->
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    coinType: {
      type: String,
      default: 'trad'
    },
    params: {
      type: Object,
      default: {}
    },

    mapData: {
      type: Object,
      default: {}
    },

    showAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      buyList: [],
      sellList: []

    }
  },
  computed: {
    // 获取 store中的 币种 socket数据
    coinSocketData() {
      return this.$store.state.trade.coinSocketData
    },

    // 获取 store中的 合约 币种 socket数据
    contractSocketData() {
      return this.$store.state.trade.contractSocketData
    }
    // //获取 store中的 合约 币种 socket数据
    // aimsSocketData(){
    //   return this.$store.state.trade.aimsSocketData;
    // },
    // //获取 store中的 合约 币种 socket数据
    // cycleSocketData(){
    //   return this.$store.state.trade.cycleSocketData;
    // },
  },
  watch: {
    coinSocketData(data) {
      // 更新行情
      if (data.info && this.params.tradcoin && this.coinType == 'trad') {
        // 判断接收到的数据是否是当前币种数据
        if (data.info[0].tradcoin == this.params.tradcoin && data.info[0].maincoin == this.params.maincoin) {
          this.setData(data)
        }
      }
    },
    // 监听socket 数据  实时更新
    contractSocketData(data) {
      // 更新行情
      if (data.coninfo && this.params.tradcoin && this.coinType == 'contract') {
        if (data.coninfo[0].tradcoin == this.params.tradcoin && data.coninfo[0].maincoin == this.params.maincoin) {
          this.setData(data)
        }
      }
    }
  },
  created() {
    this.setData(this.mapData)
  },
  mounted() {},
  methods: {
    setData(mapData) {
      if (mapData.buy) {
        let buyTotal = 0
        mapData.buy.forEach(data => {
          buyTotal += (data.amount * data.price)
        })
        mapData.buy.forEach(data => {
          data.width = (data.amount * data.price * 800) / buyTotal
          if (data.width > 100) { data.width = 100 }
        })
        this.buyList = mapData.buy
      }

      if (mapData.sell) {
        let total = 0
        mapData.sell.forEach(data => {
          total += (data.amount * data.price)
        })
        mapData.sell.forEach(data => {
          data.width = (data.amount * data.price * 800) / total
          if (data.width > 100) { data.width = 100 }
        })
        this.sellList = mapData.sell
      }

      if (mapData.conbuy) {
        let buyTotal = 0
        mapData.conbuy.forEach(data => {
          buyTotal += (data.amount * data.price)
        })
        mapData.conbuy.forEach(data => {
          data.width = (data.amount * data.price * 800) / buyTotal
          if (data.width > 100) { data.width = 100 }
        })
        this.buyList = mapData.conbuy
      }

      if (mapData.consell) {
        let total = 0
        mapData.consell.forEach(data => {
          total += (data.amount * data.price)
        })
        mapData.consell.forEach(data => {
          data.width = (data.amount * data.price * 800) / total
          if (data.width > 100) { data.width = 100 }
        })
        this.sellList = mapData.consell
      }
    },
    setPrice(type, price) {
      const data = { type: type, price: price }
      this.$emit('setPrice', data)
    }
  }
}
</script>
<style lang='scss' scoped>
.chart_box{
  padding: 10px 15px;
  background-color: $blockColor;
}
.chart_title{
  display: flex;
  align-items: center;
  font-size: 10px;
  line-height: 24px;
  color: $subFontColor;
  em{
    flex: 1;
    max-width: 20px;
    &:last-child{
      text-align: right;
    }
  }
  span{
    flex: 1;
    display: block;
    &:nth-child(2){
      text-align: center
    }
    &:nth-child(3){
      text-align: right;
    }
  }
}
.disc_chart_list{
  display: flex;
  justify-content: space-between;
  color: $subFontColor;
  li{
    display: flex;
    align-items: center;
    line-height: 24px;
    height: 24px;
    font-size: 10px;
    em{
      flex: 1;
      max-width: 20px;
    }
    div{
      flex: 1;
      position: relative;
      height: 24px;
      p{
        position: absolute;
        width: 100%;
        box-sizing: border-box;
        span{
          white-space: nowrap;
        }
      }
      i{
        position: absolute;
        top: 0;
        height: 24px;
      }
    }
  }
  .disc_chart_left{
    flex: 1;
    max-width: calc((100vw - 30px)/2);
    height: 120px;
    overflow-y: auto;
    p{
      padding-right: 8px;
    }
    i{
      right: 0;
    }
  }
  .disc_chart_right{
    flex: 1;
    max-width: calc((100vw - 30px)/2);
    height: 120px;
    overflow-y: auto;
    em{
      text-align: right;
    }
    p{
      padding-left: 8px;
    }
    i{
      left: 0;
    }
  }
}
</style>
