<template>
  <div>
    <nav-header title="质押记录" />
    <div class="main_content">
      <van-list v-model="loading" :finished="finished" @load="loadMore">
        <ol v-for="item in recordList" :key="item.id" class="record_box">
          <li class="flex_between">
            <h3>{{ item.name }}</h3>
            <span v-if="item.state == 'enable'" class="main_color">{{ $t('homeLang.lang69') }}</span>
            <span v-if="item.state == 'success'">{{ $t('homeLang.lang70') }}</span>
            <span v-if="item.state == 'close'" class="sub_font">{{ $t('homeLang.lang71') }}</span>
          </li>
          <li class="flex_between">
            <em>{{ $t('homeLang.lang60') }}</em>
            <p>{{ item.payNumber || '0.00' }} {{ item.payCoin }}</p>
          </li>

          <li class="flex_between">
            <em>{{ $t('homeLang.lang73') }}</em>
            <p>{{ item.writedate | ts_local("yyyy/MM/dd hh:mm:ss") }}</p>
          </li>
          <li class="flex_between">
            <em>{{ $t('homeLang.lang74') }}</em>
            <p>{{ item.enddate | ts_local("yyyy/MM/dd hh:mm:ss") }}</p>
          </li>
          <li class="flex_between" v-if="item.state == 'enable'">
            <em>{{ $t('tradeLang.lang270') }}</em>
            <p class="green_color">{{ countdownMap[item.id] || '--:--:--' }}</p>
          </li>
          <li class="flex_between" v-else>
            <em>到期</em>
            <p class="red_color">已到期</p>
          </li>
          <li v-if="item.state == 'enable' && userInfo.minerState == 'enable'">
            <van-button type="primary" size="large" @click="showPayPopup(item)">{{ $t('commonLang.lang1')
              }}</van-button>
          </li>
        </ol>
      </van-list>
      <div v-show="isload && !recordList.length" class="no_data">
        <i class="icon_no_data" />
        <span>{{ $t('commonLang.lang5') }}</span>
      </div>
    </div>
    <van-overlay :show="payPopup" @click="payPopup = false">
      <div class="pay_popup" @click.stop>
        <passwordDialog v-model="payPass" @cancelAction="payPopup = false" @confirmAction="confirmPass" />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Toast, Dialog } from 'vant'
import { minOrder, redeemOrder } from '@api/miner'
import passwordDialog from '@/components/passwordDialog.vue'

export default {
  components: { passwordDialog },
  data() {
    return {
      recordList: [],
      searchData: {
        page: 0,
        limit: 30
      },
      isload: false,
      loading: false,
      finished: true,

      payPass: '',
      payPopup: false,
      id: '',
      countdownMap: {},
      countdownTimer: null,
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      getConfig: state => state.common.getConfig,
    })
  },
  created() {
    this.getRecord();
    this.startCountdownTimer();
  },
  beforeDestroy() {
    this.clearCountdownTimer();
  },
  methods: {
    clearCountdownTimer() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
      }
    },
    // 启动倒计时
    startCountdownTimer() {
      // 避免重复启动
      if (this.countdownTimer) return;
      this.countdownTimer = setInterval(() => {
        this.recordList.forEach(item => {
          this.$set(this.countdownMap, item.id, this.calculateCountdown(item));
        });
      }, 1000); // 每秒更新一次
    },
    //计算倒计时
    calculateCountdown(item) {
      if (item.state !== 'enable') {
        return
      }
      item.countdown = item.countdown - 1000;
      const diff = item.countdown;
      if (diff <= 0) return this.$t('commonLang.lang5'); // 已结束
      const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },

    // 获取记录并初始化倒计时
    getRecord() {
      this.isload = false;
      this.searchData.page = 0;
      this.loadMore();

    },

    loadMore() {
      this.searchData.page += 1;
      minOrder(this.searchData).then(res => {
        this.isload = true;
        this.loading = false;
        if (res.data && res.data.length) {
          this.recordList = this.searchData.page == 1 ? res.data : [...this.recordList, ...res.data];
        } else {
          this.recordList = [];
        }
        this.finished = res.count == this.recordList.length;
      });
    },
    showPayPopup(data) {
      Dialog.confirm({
        message: this.$t('homeLang.lang75'),
        confirmButtonText: this.$t('commonLang.lang9'),
        cancelButtonText: this.$t('commonLang.lang1')
      }).then(() => {
        this.id = data.id
        this.payPass = ''
        this.payPopup = true
      }).catch(() => { })
    },

    confirmPass() {
      redeemOrder({
        id: this.id,
        tradPassword: this.payPass
      }).then(res => {
        Toast(res.msg)
        this.getRecord()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.record_box {
  margin-bottom: 8px;
  padding: 0 15px 15px;
  background-color: $blockColor;

  li {
    line-height: 20px;
    margin-top: 12px;

    &:first-child {
      padding: 15px 0 12px;
      margin: 0;
      border-bottom: 1px solid $lineColor;
    }

    em {
      color: $subFontColor;
    }

    button {
      margin-top: 10px;
    }
  }
}
</style>
