<template>
  <div ref="divklinechart" class="div_line_chart">
    <!--k线周期-->
    <ol ref="chartMenu" class="chart_menu">
      <li v-for="(item,index) in Period.Menu" :key="index" :class="{'menu_selected' : item.Name == Period.SelectedPeriod.Name}" @click="changePeriod(item)"><span>{{ item.Name }}</span></li>
      <li class="index_box" @click="showIndexOverlay=true;periodPopup = true">
        <span v-if="KlinePeriodFlag" class="main_color">{{ this.Period.SelectedPeriod.Name }}</span>
        <span v-if="!KlinePeriodFlag">{{ $t('tradeLang.lang14a') }}</span>
        <i class="iconfont icon-down" />
      </li>
      <li class="index_box" @click="showIndexOverlay=true;indexPopup = true"><span>{{ $t('tradeLang.lang14') }}</span><i class="iconfont icon-down" /></li>
    </ol>
    <div v-if="periodPopup" class="period_box">
      <p v-for="(item,index) in morePeriod" :key="index" :class="{'menu_selected' : KlinePeriodFlag == item.Min}" @click="changePeriod(item,item.Min);showIndexOverlay=false;periodPopup=false"> <span>{{ item.Name }}</span></p>
    </div>
    <div v-if="indexPopup" class="period_box">
      <p v-for="(item,index) in MainIndex.Content" :key="index" :class="{'menu_selected' : KlineIndexFlag == index}" @click="changeKlinIndex(item,index);showIndexOverlay=false;indexPopup=false"> <span>{{ item }}</span></p>
    </div>
    <van-overlay :show="showIndexOverlay" class-name="overlay_transparent" @click="showIndexOverlay = false;indexPopup=false;periodPopup=false" />

    <!-- k线图 -->
    <div v-show="KLine.IsShow" id="kline" ref="divkline" class="klineWrap" />
    <div v-show="Minute.IsShow" id="kline" ref="divkminute" class="klineWrap" />
  </div>
</template>

<script>
import { tradeKline } from '@api/exchange'
import { contractKline } from '@api/futures'
import { cycleKline } from '@api/cycle'

import { mapState } from 'vuex'
import HQChart from 'hqchart'
import { getKlineOption, getKMinuteOption, getPeriodMenu, getMorePeriod } from './klineOptions'
var JSCommon = HQChart.Chart
// 去除插件console
HQChart.Chart.JSConsole.Chart.Log = () => { }
HQChart.Chart.JSConsole.Complier.Log = () => { }
export default {
  name: 'BitKLine',
  props: [
    'coinData', // 当前币种数据
    'coinType', // 交易类型
    'DefaultPairName', // 代码
    'DefaultfloatPrecision', // 小数位数
    'DefaultPeriod' // 周期
  ],

  computed: {
    ...mapState({
      contractSocketData: state => state.trade.contractSocketData,
      coinSocketData: state => state.trade.coinSocketData,
      cycleSocketData: state => state.trade.cycleSocketData
    })
  },
  watch: {
    // 监听socket 数据  实时更新
    contractSocketData(data) {
      // 更新行情
      if (data.coninfo && this.DefaultPairName && this.coinType == 'contract') {
        if (`${data.coninfo.tradcoin}/${data.coninfo.maincoin}` == this.DefaultPairName) {
          this.setNewKlineData(data)
        }
      }
    },
    // 监听socket 数据  实时更新
    coinSocketData(data) {
      // 更新行情
      if (data.info && this.DefaultPairName && this.coinType == 'trad') {
        if (`${data.info.tradcoin}/${data.info.maincoin}` == this.DefaultPairName) {
          this.setNewKlineData(data)
        }
      }
    },

    // 监听socket 数据  实时更新
    cycleSocketData(data) {
      // 更新行情
      if (data.cycleinfo && this.DefaultPairName && this.coinType == 'cycle') {
        if (`${data.cycleinfo.tradcoin}/${data.cycleinfo.maincoin}` == this.DefaultPairName) {
          this.setNewKlineData(data)
        }
      }
    }

  },

  data() {
    return {
      Symbol: 'BTC/USDT.BIT',
      Name: '',
      FloatPrecision: 2, // 品种的小数位数

      // 标识历史全量数据有没有加载完成
      isHistoryLoad: false,

      MainIndex: { Title: this.$t('tradeLang.lang14'), Content: ['MA', 'BOLL', 'BBI', 'MIKE', 'PBX', 'ENE'] }, // 主图指标
      showIndexOverlay: false,
      indexPopup: false,
      KlineIndexFlag: 0,

      periodPopup: false,
      morePeriod: getMorePeriod(),
      KlinePeriodFlag: '',

      // K线
      KLine: {
        JSChart: null,
        Option: getKlineOption(),
        IsShow: true
      },

      // 分时 (使用K线面积图来做分时图)
      Minute: {
        JSChart: null,
        Option: getKMinuteOption(),
        IsShow: false
      },

      // 周期菜单
      Period: {
        Menu: getPeriodMenu(),
        SelectedPeriod: getPeriodMenu()[1] // 当前选中
      },

      // 指标菜单
      // Index: {
      //   Menu: getIndexMenu(), //菜单项
      //   SelectedPeriod: getIndexMenu()[1],
      //   IsShow: true
      // }
      //刷新k线的倒计时
      refreshTimeOut:null,
      them : ""
    }
  },
  created() {
    // 设置商品名
    if (this.DefaultPairName) {
      this.Symbol = `${this.DefaultPairName}.BIT`
      this.Name = this.DefaultPairName
    }

    // 设置价格小数位数
    if (this.DefaultfloatPrecision) {
      this.FloatPrecision = parseInt(this.DefaultfloatPrecision)
    }

    // 设置默认 period
    if (this.DefaultPeriod) {
      const selectedPeriod = this.Period.Menu.filter((data) => (data.Period == this.DefaultPeriod && data.Type != -1))
      selectedPeriod.length && (this.Period.SelectedPeriod = selectedPeriod[0])
    }

    this.them = window._config.them == "dark" ? "#191C24" : "#ffffff"
  },

  mounted() {
    this.setKilneColor()
    this.resize()
    this.createKLine()
    JSCommon.JSChart.GetResource().FrameLogo.Text=null;
  },

  methods: {
    //k线设置个倒计时刷新
    refreshKline(){
      if(this.refreshTimeOut){
        clearTimeout(this.refreshTimeOut);
      }
      let _this = this
      this.refreshTimeOut = setTimeout(()=>{
          if (_this.KLine.JSChart) {
            _this.KLine.JSChart.StopAutoUpdate();    //停止定时器
            _this.KLine.JSChart=null;  //清空实例
          }
          while (_this.$refs.divkline.hasChildNodes()) {
            _this.$refs.divkline.removeChild(_this.$refs.divkline.lastChild);
          }
        _this.createKLine();
      },1000 * 60)
    },
    setKilneColor() {
      // K线颜色配置 配置颜色  https://blog.csdn.net/jones2000/article/details/90286933
      const resource = JSCommon.JSChart.GetResource()
      // resource.FrameLogo.Text=null;

      resource.DownBarColor = 'rgb(214,53,91)'// 需改刻度的输出字体
      resource.UpBarColor = 'rgb(50,182,139)'
      resource.DownTextColor = 'rgb(214,53,91)'
      resource.UpTextColor = 'rgb(50,182,139)'

      resource.DefaultTextColor = '#D5DFED' // 默认字体颜色
      resource.UnchagneBarColor = '#D5DFED' // 平盘字体颜色
      // resource.CorssCursorBGColor='rgba(60,75,97,.8)';
      // resource.CorssCursorTextColor='#666';
      resource.FrameBorderPen = 'rgba(240,240,240,.5)' // 边框
      resource.FrameSplitPen = 'rgba(240,240,240,.5)' // 分割线
      resource.FrameTitleBGColor = 'rgba(255,255,255,1)' // 标题栏背景色
      resource.Frame.XBottomOffset = 15

      // resource.TooltipPaint.BorderColor = "rgba(0, 0, 0,.2)";
      resource.TooltipPaint.DateTimeColor = '#666'
      resource.TooltipPaint.VolColor = '#666'
      // 新加配置-颜色rgba(23,26,31,0.01)  黑色
      resource.FrameBorderPen = 'rgba(236,236,236,0.1)', // 边框
      resource.FrameSplitPen = 'rgba(34,38,54,0.8)', // 分割线
      resource.FrameSplitTextColor = 'rgb(131,140,151)', // 刻度文字颜色
      // resource.FrameSplitTextFont= 18*1 +"px 微软雅黑",        //坐标刻度文字字体
      // resource.FrameSplitTextFont= 12*GetDevicePixelRatio() +"px 微软雅黑",        //坐标刻度文字字体
      resource.FrameTitleBGColor = this.them, // 标题栏背景色
      resource.DefaultTextColor = 'rgb(123,146,208)',
      resource.CorssCursorBGColor = 'rgb(43,54,69)', // 十字光标背景
      resource.KLine.MaxMin = { Font: 20 * 1 + 'px 微软雅黑', Color: 'rgb(130,139,150)' }, // K线最大最小值显示
      resource.UnchagneBarColor = 'rgb(228,228,228)'// 平盘的颜色
      resource.UnchagneTextColor = 'rgb(130,139,150)'
    },
    // //动态调整kline 显示大小
    resize() {
      var divKLineChart = this.$refs.divklinechart
      var height = divKLineChart.offsetHeight
      var width = divKLineChart.offsetWidth
      var divPeriod = this.$refs.chartMenu

      // 分钟图
      var klineHeight = height - divPeriod.offsetHeight - 4 // 总的高度减去其他控件高度就是图形高度
      var divKLine = this.$refs.divkline
      divKLine.style.width = width + 'px'
      divKLine.style.height = klineHeight + 'px'
      if (this.KLine.JSChart) this.KLine.JSChart.OnSize()

      // 分时图
      var divKMinute = this.$refs.divkminute
      var kMinuteHeight = height - divPeriod.offsetHeight - 4 // 总的高度减去其他控件高度就是图形高度
      divKMinute.style.width = width + 'px'
      divKMinute.style.height = kMinuteHeight + 'px'
      if (this.Minute.JSChart) this.Minute.JSChart.OnSize()
    },

    // 切换周期
    changePeriod(item, flag) {
      this.KlinePeriodFlag = flag || ''
      if (this.Period.SelectedPeriod.Period == item.Period && this.Period.SelectedPeriod.Type == item.Type) { return }
      const lastPeriod = this.Period.SelectedPeriod.Period
      const lastType = this.Period.SelectedPeriod.Type
      this.Period.SelectedPeriod = item
      this.isHistoryLoad = false
      if (item.Period == '4' && item.Type == '-1') { // 分时图
        if (!this.Minute.JSChart) { this.createMinute() } else {
          this.Minute.JSChart.ChangeSymbol(this.Symbol, this.Minute.Option)
        }
        // this.Index.IsShow = false;//不显示指标选项
        this.KLine.IsShow = false
        this.Minute.IsShow = true
      } else {
        if (this.KLine.JSChart) {
          this.KLine.JSChart.ChangePeriod(item.Period)
          if (lastPeriod == '4' && lastType == '-1') {
            this.KLine.JSChart.ChangeSymbol(this.Symbol, this.KLine.Option)
          }
        } else { this.createKLine() }

        // this.Index.IsShow = false;//不显示指标选项
        this.KLine.IsShow = true
        this.Minute.IsShow = false
      }
      // 通知父组件
      this.$emit('periodData', item)
      //重置k线刷新倒计时
      this.refreshKline()
    },

    changeKlinIndex(indexItem, flag) { // 修改k线指标
      this.KlineIndexFlag = flag
      var indexName = indexItem
      if (this.KLine.JSChart) this.KLine.JSChart.ChangeIndex(1, indexName)
    },

    // 创建K线
    createKLine() {
      if (this.KLine.JSChart) return
      JSCommon.MARKET_SUFFIX_NAME.GetBITDecimal = symbol => {
        return this.FloatPrecision
      } // 不同品种虚拟币，使用不同小数位数
      var divKLine = this.$refs.divkline
      this.KLine.JSChart = JSCommon.JSChart.Init(divKLine)
      this.KLine.Option.KLine.Period = this.Period.SelectedPeriod.Period
      this.KLine.Option.Symbol = this.Symbol
      this.KLine.Option.NetworkFilter = (data, callback) => {
        this.NetworkFilter(data, callback)
      } // 网络请求回调函数
      this.KLine.JSChart.SetOption(this.KLine.Option)
      //重置k线刷新倒计时
      this.refreshKline()
    },

    // 创建分时图
    createMinute() {
      if (this.Minute.JSChart) return
      JSCommon.MARKET_SUFFIX_NAME.GetBITDecimal = symbol => {
        return this.FloatPrecision
      } // 不同品种虚拟币，使用不同小数位数
      var divKLine = this.$refs.divkminute
      this.Minute.JSChart = JSCommon.JSChart.Init(divKLine)
      this.Minute.Option.Symbol = this.Symbol
      this.Minute.Option.NetworkFilter = (data, callback) => {
        this.MinuteNetworkFilter(data, callback)
      } // 网络请求回调函数
      this.Minute.JSChart.SetOption(this.Minute.Option)
    },

    // 内置网络请求监听 分时图 第3方数据替换接口
    MinuteNetworkFilter(data, callback) {
      switch (data.Name) {
        case 'KLineChartContainer::ReqeustHistoryMinuteData': // 分钟全量数据下载
          this.ReqeustHistoryMinuteData(data, callback, { PageSize: 40 })
          break
        // case "KLineChartContainer::RequestMinuteRealtimeData": //分钟实时数据更新
        //   this.RequestMinuteRealtimeData(data, callback);
        //   break;
      }
    },

    // 内置网络请求监听 k线图 第3方数据替换接口
    NetworkFilter(data, callback) {
      switch (data.Name) {
        case 'KLineChartContainer::ReqeustHistoryMinuteData': // 分钟全量数据下载
          this.ReqeustHistoryMinuteData(data, callback, { PageSize: 40 })
          break
        case 'KLineChartContainer::RequestHistoryData': // 日线全量数据下载
          this.RequestHistoryData(data, callback, { PageSize: 40 })
          break
        // case "KLineChartContainer::RequestMinuteRealtimeData": //分钟实时数据更新
        //   this.RequestMinuteRealtimeData(data, callback);
        //   break;
        // case "KLineChartContainer::RequestRealtimeData": //日线实时数据更新
        //   this.RequestRealtimeData(data, callback);
        //   break;
      }
    },

    setNewKlineData(data) {
      if (this.isHistoryLoad) {
        if (data.kline && (data.kline.mine == this.Period.SelectedPeriod.Min) && (this.Period.SelectedPeriod.Period == 4 && this.Period.SelectedPeriod.Type == -1)) {
          var stockItem = this.JsonToHQChartMinuteHistoryData(data.kline)
          var hqChartData = { code: 0, data: stockItem }
          hqChartData.symbol = this.Symbol
          hqChartData.name = this.Name
          hqChartData.ver = 2
          this.Minute.JSChart.JSChartContainer.RecvMinuteRealtimeData(hqChartData)
        } else if (data.kline && (data.kline.mine == this.Period.SelectedPeriod.Min) && (this.Period.SelectedPeriod.Type == 0)) {
          var stockItem = this.JsonToHQChartMinuteHistoryData(data.kline)
          var hqChartData = { code: 0, data: stockItem }
          hqChartData.symbol = this.Symbol
          hqChartData.name = this.Name
          hqChartData.ver = 2
          this.KLine.JSChart.JSChartContainer.RecvMinuteRealtimeData(hqChartData)
        } else if (data.kline && (data.kline.mine == this.Period.SelectedPeriod.Min) && (this.Period.SelectedPeriod.Type != 0)) {
          var stockItem = this.JsonToHQChartRealtimeData(data.kline)
          var hqChartData = { code: 0, stock: [stockItem] }
          hqChartData.symbol = this.Symbol
          hqChartData.name = this.Name
          this.KLine.JSChart.JSChartContainer.RecvRealtimeData(hqChartData)
        }
      }
    },

    ReqeustHistoryMinuteData(data, callback, option) { // 第3方分钟线历史数据请求
      data.PreventDefault = true
      const type = this.Period.SelectedPeriod.Type
      const min = this.Period.SelectedPeriod.Min

      const params = {
        pairname: this.DefaultPairName,
        type: type, mine: min, count: 300, date: 0
      }
      if (this.coinType == 'trad') {
        tradeKline(params).then(res => {
          this.RecvMinuteHistoryData(res, callback, { Name: this.Name, Symbol: this.Symbol, Chart: data.Self }, option)
          this.isHistoryLoad = true
        })
      } else if (this.coinType == 'contract') {
        contractKline(params).then(res => {
          this.RecvMinuteHistoryData(res, callback, { Name: this.Name, Symbol: this.Symbol, Chart: data.Self }, option)
          this.isHistoryLoad = true
        })
      } else if (this.coinType == 'cycle') {
        cycleKline(params).then(res => {
          this.RecvMinuteHistoryData(res, callback, { Name: this.Name, Symbol: this.Symbol, Chart: data.Self }, option)
          this.isHistoryLoad = true
        })
      }
    },

    RecvMinuteHistoryData(recvData, callback, stockData, option) {
      var klineData = this.JsonToHQChartMinuteHistoryData(recvData)

      var hqChartData = { code: 0, data: klineData }
      hqChartData.symbol = stockData.Symbol
      hqChartData.name = stockData.Name
      stockData.Chart.PageSize = option.PageSize // 设置一屏显示数据个数
      callback(hqChartData)
    },

    RequestHistoryData(data, callback) { // 第3方日线历史数据请求
      data.PreventDefault = true
      const type = this.Period.SelectedPeriod.Type; const min = this.Period.SelectedPeriod.Min; const count = 300
      const params = {
        pairname: this.DefaultPairName,
        type: type,
        mine: min,
        count: count,
        date: 0
      }
      if (this.coinType == 'trad') {
        tradeKline(params).then(res => {
          this.RecvHistoryData(res, callback, { Name: this.Name, Symbol: this.Symbol, Chart: data.Self })
          this.isHistoryLoad = true
        })
      } else if (this.coinType == 'contract') {
        contractKline(params).then(res => {
          this.RecvHistoryData(res, callback, { Name: this.Name, Symbol: this.Symbol, Chart: data.Self })
          this.isHistoryLoad = true
        })
      } else if (this.coinType == 'cycle') {
        cycleKline(params).then(res => {
          this.RecvHistoryData(res, callback, { Name: this.Name, Symbol: this.Symbol, Chart: data.Self })
          this.isHistoryLoad = true
        })
      }
    },

    RecvHistoryData(recvData, callback, stockData) {
      var klineData = this.JsonToHQChartHistoryData(recvData)

      var hqChartData = { code: 0, data: klineData }
      hqChartData.symbol = stockData.Symbol
      hqChartData.name = stockData.Name
      stockData.Chart.PageSize = 30 // 设置一屏显示数据个数
      callback(hqChartData)
    },

    RecvMinuteRealtimeData(recvData, callback, stockData) {
      var klineData = this.JsonToHQChartMinuteHistoryData(recvData)

      var hqChartData = { code: 0, data: klineData, ver: 2.0 } // 数字货币使用ver2.0数据格式
      hqChartData.symbol = stockData.Symbol
      hqChartData.name = stockData.Name
      callback(hqChartData)
    },

    RecvRealtimeData(recvData, callback, stockData) {
      var stockItem = this.JsonToHQChartRealtimeData(recvData)
      var hqChartData = { code: 0, stock: [stockItem] }
      hqChartData.symbol = stockData.Symbol
      hqChartData.name = stockData.Name
      callback(hqChartData)
    },

    JsonToHQChartMinuteHistoryData(recvData) { // 分钟（历史/最新）数据转化为hqchart数据格式
      var data = recvData.data.series
      var yClose = null
      var klineData = []
      for (var i in data) {
        var item = data[i]
        var aryItem = item.split('|')
        var date = parseInt(aryItem[0] / 1000000)
        var time = parseInt(aryItem[0] % 1000000)
        var open = parseFloat(aryItem[1])
        var high = parseFloat(aryItem[2])
        var low = parseFloat(aryItem[3])
        var close = parseFloat(aryItem[4])
        var vol = parseFloat(aryItem[5])
        klineData.push([date, yClose, open, high, low, close, vol, null, time])
        // console.log(close);
        yClose = close
      }
      return klineData
    },

    JsonToHQChartHistoryData(recvData) { // 日线历史数据转化为hqchart数据格式
      var data = recvData.data.series
      var yClose = null
      var klineData = []
      for (var i in data) {
        var item = data[i]
        var aryItem = item.split('|')
        var date = parseInt(aryItem[0] / 1000000)
        var open = parseFloat(aryItem[1])
        var high = parseFloat(aryItem[2])
        var low = parseFloat(aryItem[3])
        var close = parseFloat(aryItem[4])
        var vol = parseFloat(aryItem[5])
        klineData.push([date, yClose, open, high, low, close, vol, null])

        yClose = close
      }
      return klineData
    },

    JsonToHQChartRealtimeData(recvData) { // 日线最新数据转化为hqchart数据格式
      var stockData = {}
      if (recvData.data.series.length == 0) {
        return
      }
      var data = recvData.data.series
      var yClose = null
      for (var i in data) {
        var item = data[i]
        var aryItem = item.split('|')
        stockData.date = parseInt(aryItem[0] / 1000000)
        stockData.open = parseFloat(aryItem[1])
        stockData.high = parseFloat(aryItem[2])
        stockData.low = parseFloat(aryItem[3])
        stockData.price = parseFloat(aryItem[4]) // 收盘价
        stockData.vol = parseFloat(aryItem[5])
        stockData.yclose = yClose
        stockData.amount = null
        stockData.time = null
        stockData.symbol = this.Symbol
        stockData.name = this.Name

        yClose = stockData.price
      }
      return stockData
    }
  },
  destroyed() {
    if(this.refreshTimeOut){
      clearTimeout(this.refreshTimeOut);
    }
  }
}

</script>

<style lang="scss">
.div_line_chart{
  // margin: 5px 0;
  height: 350px;
  background-color: $bgColor;
  // margin-bottom: 10px;
  .chart_menu{
    background-color: $blockColor;
    line-height: 20px;
    padding: 0 15px;
    // border-bottom: 1px solid rgba($lineColor,.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    li{
      display: inline-block;
      text-align: center;
      font-size: 13px;
      color: $subFontColor;
      span{
        display: inline-block;
        padding: 8px 0;
      }
    }
    .menu_selected{
      position: relative;
      color: $mainColor;
      &::before{
        content: "";
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        height: 1px;
        background-color: $mainColor;
      }
    }
  }
  .index_box{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    i{
      font-size: 12px;
      margin-left: 2px;
    }
  }
  .overlay_transparent{
    background:transparent;
  }
  .period_box{
    position: absolute;
    color: $fontColor;
    background-color: $blockColor;
    z-index: 1000;
    left: 0;
    width: 100vw;
    line-height: 32px;
    overflow: hidden;
    padding-bottom: 10px;
    p{
      float: left;
      width: calc((100vw - 60px)/5);
      text-align: center;
      background-color: $bgColor;
      margin: 10px 0 0 10px;
    }
    .menu_selected{
      color: $mainColor;
    }
  }
}

.klineWrap {
  float: left;
  position: relative;
  overflow: hidden;
}
.kLineTabs .tabsTitle {
  padding-left: 2%;
}
.kLineTabs .tabsTitle span {
  font-size: 12px;
  width: 16%;
}

</style>
