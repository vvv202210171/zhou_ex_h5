
<template>
  <div>
    <div :id="id" class="drift_box" :style="{'top':top+'px'}" @touchstart="dragStart" @touchmove="dragMove" @touchend="dragEnd">
      <ol>
        <li class="text_hide first_box">
          <p>{{ data.tradcoin }}/{{ data.maincoin }}</p>
          <i>·</i>
          <span v-if="data.type=='buy'" class="green_color">{{ $t('tradeLang.lang235') }}</span>
          <span v-if="data.type=='sell'" class="red_color">{{ $t('tradeLang.lang236') }}</span>
          <i>·</i>
          <span v-if="data.type=='buy'&&Number(nowPrice)>Number(data.price)" class="green_color">{{ $t('tradeLang.lang266') }}</span>
          <span v-if="data.type=='buy'&&Number(nowPrice)<=Number(data.price)" class="red_color">{{ $t('tradeLang.lang267') }}</span>
          <span v-if="data.type=='sell'&&Number(nowPrice)<Number(data.price)" class="green_color">{{ $t('tradeLang.lang266') }}</span>
          <span v-if="data.type=='sell'&&Number(nowPrice)>=Number(data.price)" class="red_color">{{ $t('tradeLang.lang267') }}</span>
        </li>
        <li class="text_hide">{{ $t('tradeLang.lang268') }}{{ data.price }}</li>
        <li class="text_hide">{{ $t('tradeLang.lang269') }}{{ data.number }}{{ data.paycoin }}</li>
        <li v-if="time !== null">{{ $t('tradeLang.lang270') }}<van-count-down ref="countDown" :time="time" :auto-start="true" format="ss" @change="refreshData" @finish="finish" /><em class="main_color">s</em></li>
      </ol>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import {systemTime} from "@api/common";
export default {
  name: 'Drift',
  directives: {
    drag(el, bindings) {
      el.onmousedown = function(e) {
        var disx = e.pageX - el.offsetLeft
        var disy = e.pageY - el.offsetTop
        document.onmousemove = function(e) {
          el.style.left = e.pageX - disx + 'px'
          el.style.top = e.pageY - disx + 'px'
        }
        document.onmouseup = function() {
          document.onmousemove = document.onmouseup = null
        }
      }
    }
  },
  props: [
    'nowPrice',
    'id',
    'top',
    'data',
    'offsetTime'
  ],
  data() {
    return {
      isdrag: true,
      tempX: '',
      x: '',
      tempY: '',
      y: '',
      time: null
    }
  },
  watch: {
  },
  created() {
    this.setCountDown()
  },
  methods: {
    setCountDown() {
        this.time = (Number(+this.data.wdate) + Number(+this.data.lever) * 1000) - Number(this.data.serverTime)
    },
    toTop() {
      let top = document.documentElement.scrollTop || document.body.scrollTop
      // 实现滚动效果
      const timeTop = setInterval(() => {
        document.body.scrollTop = document.documentElement.scrollTop = top -= 50
        if (top <= 0) {
          clearInterval(timeTop)
        }
      }, 10)
    },
    // 触摸开始（手指放在触摸屏上）
    dragStart: function(e) {
      this.isdrag = true
      this.tempX = parseInt($(`#${this.id}`).css('left') + 0)
      this.tempY = parseInt($(`#${this.id}`).css('top') + 0)
      this.x = e.touches[0].pageX
      this.y = e.touches[0].pageY
    },
    // 拖动（手指在触摸屏上移动）
    dragMove: function(e) {
      if (this.isdrag) {
        var curX = this.tempX + e.touches[0].pageX - this.x
        var curY = this.tempY + e.touches[0].pageY - this.y
        // 边界判断
        curX = curX < 0 ? 0 : curX
        curY = curY < 0 ? 0 : curY
        curX = curX < document.documentElement.clientWidth - $(`#${this.id}`)[0].clientWidth ? curX : document.documentElement.clientWidth - $(`#${this.id}`)[0].clientWidth
        curY = curY < document.documentElement.clientHeight - $(`#${this.id}`)[0].clientHeight ? curY : document.documentElement.clientHeight - $(`#${this.id}`)[0].clientHeight
        $(`#${this.id}`).css({ 'left': curX, 'top': curY })

        // 禁止浏览器默认事件
        e.preventDefault()
      }
    },
    // 拖动结束
    dragEnd: function() {
      this.isdrag = false
    },

    refreshData(time) {
      if (time.seconds == 1) {
        setTimeout(() => {
          this.$emit('refreshData')
        }, 1000)
      }
    },
    finish() {
      console.log('结束了')
      $(`#${this.id}`).remove()
      this.$emit('dragNotice', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .drift_box {
    width: 200px;
    background: rgba(0,0,0,.7);
    border: 1Px solid rgba(0,0,0, 0.3);
    color: $fontColor;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 15px;
    height: 120px;
    padding: 15px 10px;
    z-index: 155;
    li{
      line-height: 22px;
    }
    .van-count-down{
      display: inline-block;
      color: $mainColor;
    }

    .first_box{
      display: flex;
      i{
        margin: 0 5px;
      }
    }
  }
</style>
