<template>
  <div>
    <nav-header :title="$t('homeLang.lang28')" />
    <div class="main_content">
      <ol v-for="item in noticeList" :key="item.autoid" class="notice_box" @click="showNoticePopup(item)">
        <li class="notice_title text_hide_two">{{ item.title }}</li>
        <li class="notice_date">{{ item.wdate | ts_local('yyyy/MM/dd hh:mm') }}</li>
      </ol>
      <div v-if="!noticeList.length" class="no_data">
        <p class="icon_no_data" />
        <span>{{ $t('homeLang.lang29') }}</span>
      </div>
    </div>

    <van-popup v-model="noticePopup" class="right_popup" position="right" close-on-popstate overlay-class="block_bg">
      <nav-header :title="$t('homeLang.lang30')" />
      <div class="main_content notice_details">
        <h3>{{ noticeData.title }}</h3>
        <p>{{ noticeData.wdate }}</p>
        <pre v-html="noticeData.reply" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      noticePopup: false,
      noticeData: {}
    }
  },
  computed: {
    ...mapState({
      noticeList: state => state.common.noticeList
    })
  },
  created() {
    this.$store.dispatch('common/getNotice')
  },

  methods: {
    showNoticePopup(data) {
      this.noticeData = data
      this.pushState('?noticePopup')
      this.noticePopup = true
    }
  }
}
</script>

<style lang="scss" scoped>
.notice_box{
  margin: 0 15px;
  padding: 18px 0 10px;
  border-bottom: 1px solid var(--list-border-color);
  .notice_top{
    margin-bottom: 16px;
    p{
      border-radius: 0 30px 30px 30px;
      height: 25px;
      line-height: 25px;
      padding: 0 10px;
      background-color: $subColor;
      color: $fontColor;
    }
    span{
      font-size: 12px;
      color: $subFontColor;
    }
  }
  .notice_title{
    margin-bottom: 5px;
    font-size: 15px;
    font-weight: 600;
  }
  .notice_date{
    color: $subFontColor;
    line-height: 18px;
    font-size: 12px;
  }
}

.notice_details{
  padding: 0 15px 12px;
  box-sizing: border-box;
  h3 {
    padding: 15px 0 10px;
  }
  p {
    color: $subFontColor;
    font-size: 12px;
    line-height: 21px;
    margin-bottom: 10px;
  }
  pre{
    width: 100%;
    word-wrap: break-word;
    word-break: normal;
    font-size: 12px;
    line-height: 21px;
  }
}
</style>
