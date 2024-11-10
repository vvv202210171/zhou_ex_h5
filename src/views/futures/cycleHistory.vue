<template>
  <div>
    <nav-header :title="$t('tradeLang.lang271')" />
    <div class="main_content">
      <van-list v-model="loading" :finished="finished" @load="loadMore">
        <ol v-for="item in historyOrder" :key="item.autoid" class="position_box" @click="showDetailsPopup(item)">
          <li class="position_top flex_between">
            <h2>{{ item.tradcoin }}/{{ item.maincoin }}</h2>
            <i v-if="item.wdate">{{ item.wdate }}</i>
            <em v-if="item.type=='buy'" class="green_color">{{ $t('tradeLang.lang235') }}</em>
            <em v-if="item.type=='sell'" class="red_color">{{ $t('tradeLang.lang236') }}</em>
          </li>
          <li class="position_center flex_between">
            <div>
              <span>{{ $t('tradeLang.lang238') }}({{ item.maincoin }})</span>
              <p>{{ item.price||'--' }}</p>
              <span>{{ $t('tradeLang.lang245') }}</span>
              <p>{{ item.last_profit||'--' }}</p>
            </div>
            <div>

              <span>{{ $t('tradeLang.lang240') }}({{ item.paycoin }})</span>
              <p>{{ item.number||'--' }}</p>
              <span>{{ $t('tradeLang.lang241') }}</span>
              <p :class="[item.income>=0?'green_color':'red_color']">{{ item.income||'--' }}</p>
            </div>
            <div>
              <span>{{ $t('tradeLang.lang242') }}</span>
              <p>{{ item.lever }}s</p>
              <span>{{ $t('tradeLang.lang243') }}</span>
              <p>{{ item.gas||'--' }}</p>
            </div>
          </li>
          <li class="position_bottom">
            <div class="flex">
              <span>{{ $t('tradeLang.lang246') }}</span>
              <p>{{ item.closedate }}</p>
            </div>
          </li>
        </ol>
      </van-list>
      <div v-if="(!historyOrder.length)&&isload" class="no_data">
        <p class="icon_no_data" />
        <span>{{ $t('commonLang.lang6') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { historyPosition } from '@api/cycle'
export default {
  data() {
    return {
      historyOrder: [],
      searchData: {
        page: 1,
        limit: 15
      },
      isload: false,
      loading: false,
      finished: true
    }
  },

  created() {
    this.getHistoryPosition()
  },

  methods: {
    getHistoryPosition() {
      this.isload = false
      this.searchData.page = 0
      this.loadMore()
    },
    loadMore() {
      this.searchData.page += 1
      historyPosition(this.searchData).then(res => {
        this.isload = true
        this.loading = false
        if (res.data && res.data.length) {
          this.historyOrder = this.searchData.page == 1 ? res.data : [...this.historyOrder, ...res.data]
        } else {
          this.historyOrder = []
        }
        this.finished = res.count == this.historyOrder.length
      })
    },

    showDetailsPopup() {}
  }
}
</script>

<style lang="scss" scoped>
.position_box{
  padding: 12px 15px;
  border-bottom: 1px solid $bgColor;
  background-color: var(--main-box-bgColor);
  .position_top{
    line-height: 20px;
    margin-bottom: 10px;
    h2{
      font-size: 15px;
    }
    i{
      flex:1;
      text-align: right;
      font-size: 12px;
      margin-right: 10px;
      color: $subFontColor;
    }
  }
  .position_center{
    div{
      flex: 1;
      line-height: 22px;
      font-size: 12px;
      &:nth-child(2){
        text-align: center;
      }
      &:last-child{
        text-align: right;
      }
      span{
        color: $subFontColor;
      }
    }
  }
  .position_bottom{
    border-top: 1px solid rgba($lineColor,.3);
    margin-top: 8px;
    padding-top: 8px;
    line-height: 22px;
    font-size: 12px;
    span{
      color: $subFontColor;
    }
    p{
      margin-left: 10px;
    }

  }
  .position_btn{
    margin-top: 15px;
    button{
      flex: 1;
      background-color: rgba($mainColor,.2);
      color: $mainColor;
      padding: 5px 0;
      font-size: 13px;
      border-radius: 2px;
      &:first-child{
        margin-right: 15px;
      }
    }
  }
}
</style>
