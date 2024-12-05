<template>
  <div class="home">
    <div ref="homeTop" class="home_top">
      <div class="home_nav flex">
        <p @click="pushPath('/my')">
          <img src="@img/home/icon_user.png" alt="" />
        </p>
        <div class="search_box text_hide" @click="pushPath('/coinSearch')">
          <img src="@img/home/icon_search.png" alt="" />
          <span class="text_hide">{{ $t("homeLang.lang31") }}</span>
        </div>
        <a @click="showOnlineService()" v-show="serviceUrl.KF_ADDRESS_H5 !== ''">
          <img src="@img/home/icon_service.png" alt="" />
        </a>
      </div>
    </div>
    <div class="main_content quotation_details">
      <div ref="homeBox">
        <!-- <van-swipe :autoplay="5000" :duration="1000" class="banner_box">
          <van-swipe-item v-for="(image, index) in bannerList" :key="index">
            <div class="banner_img">
              <img :src="getBannerImgUrl(image.banner)" />
            </div>
          </van-swipe-item>
        </van-swipe> -->

        <div class="bg-top">
          <div class="bg-top1">
            <div class="bg-top-left">
              <h2>
                <p>欢迎来到</p>
                <p>BBAI</p>
              </h2>
              <p>
              <h3>陪你探索无限未来</h3>
              <span>安全&nbsp;/&nbsp;便捷&nbsp;/&nbsp;创新&nbsp;/&nbsp;未来</span>
              </p>
            </div>
            <div class="flex">
              <img :src="require('../../assets/img/bbai/Frame.png').default" alt="" width="125" height="125" />
            </div>
          </div>
          <div style="margin-top: 20px;" v-if="!isLogin">
            <van-button type="danger" size="large" round hairline @click="pushPath('login')">
              登陆/注册</van-button>
          </div>
          <div>
            <ul style="margin-top: 20px;" v-if="isLogin" class="flex ul ">
              <li class="userinfo" @click="pushPath('coinRecharge')">
                <img src="@img/bbai/in.png" alt="" width="50" height="50" />
                <span>充值</span>
              </li>
              <li class="userinfo" @click="pushPath('coinWithdraw')">
                <img src="@img/bbai/out.png" alt="" width="50" height="50" />
                <span>提现</span>
              </li>
              <li class="userinfo" @click="pushPath('inviteFriends')">
                <img src="@img/bbai/share.png" alt="" width="50" height="50" />
                <span>分享好友</span>
              </li>
              <li class="userinfo" @click="pushPath('securityCenter')">
                <img src="@img/bbai/security.png" alt="" width="50" height="50" />
                <span>安全中心</span>
              </li>
            </ul>

          </div>
          <div style="margin-top: 20px;" class="lock flex">
            <div class="lock-left" @click="pushPath('ability')">
              <div>
                <h3>BBAI全新上线</h3>
                <span style="color: red;">100USDT</span>
              </div>
              <img :src="require('../../assets/img/bbai/image7.png').default" alt="" width="125" height="125" />
            </div>
            <div class="lock-right">
              <div class="lock-right-top" @click="pushPath('lockMining')">
                <h3>挖矿中心</h3>
                <van-image fit="cover" :src="require('../../assets/img/bbai/image8.png').default" height="125px" />
              </div>
              <div class="lock-right-bt">

                <p class="lock-right-bt-text">
                  <span>理财</span>
                  <em>闲钱中心</em>
                </p>
                <van-image fit="cover" :src="require('../../assets/img/bbai/image9.png').default"
                  class="lock-right-bt-img" />
              </div>
            </div>
          </div>
        </div>
        <div class="home_notice">
          <label><img src="@img/home/icon_notice.png" alt="" srcset="" /></label>
          <div class="notice_box">
            <van-swipe :autoplay="5000" :duration="1000" :show-indicators="false" vertical style="height: 0.8rem">
              <van-swipe-item v-for="item in noticeList" :key="item.id" style="height: 0.8rem">
                <span style="height: 0.8rem" class="text_hide" @click="showNoticePopup(item)">{{ item.title }}</span>
              </van-swipe-item>
            </van-swipe>
          </div>
          <i class="iconfont icon-arrow-right" @click="pushPath('/notice')" />
        </div>

        <ol class="coin_box">
          <li v-for="item in overviewList" :key="item.tradcoin" @click="goDetails(item)">
            <div class="box_item">
              <p>{{ item.tradcoin }}/{{ item.maincoin }}</p>
              <h2 :class="[
                item.rise >= 0 ? 'green_color' : 'red_color',
                'text_hide',
              ]">
                {{ item.price }}
              </h2>
              <i :class="[
                item.rise >= 0 ? 'green_color' : 'red_color',
                'text_hide',
              ]"><em v-if="item.rise > 0">+</em>{{ item.rise }}%</i>
              <span class="text_hide">≈{{ rateData.symbol
                }}{{ (item.price * rateData.price) | mathFloor(2) }}</span>
            </div>
          </li>
        </ol>

        <!-- <div class="sub_banner" @click="pushPath('/inviteFriends')">
          <img v-if="$i18n.locale=='TW'" src="@img/home/invite_banner_cn.png" alt="">
          <img v-if="$i18n.locale=='EN'" src="@img/home/invite_banner_en.png" alt="">
          <img v-if="$i18n.locale=='JP'" src="@img/home/invite_banner_jp.png" alt="">
          <img v-if="$i18n.locale=='KO'" src="@img/home/invite_banner_ko.png" alt="">
        </div> -->
        <!-- <div class="sub_banner" @click="pushPath('/ability')">
          <h3>{{ $t("homeLang.lang32") }}</h3>
          <p>{{ $t("homeLang.lang33") }}</p>
        </div> -->
      </div>

      <div class="coin_list">
        <ol class="area_box">
          <li :class="[{ font_active: areaType == 'amount' }, 'tab_default']" @click="changeType('amount', 0)">
            {{ $t("homeLang.lang34") }}
          </li>
          <li :class="[{ font_active: areaType == 'rise' }, 'tab_default']" @click="changeType('rise', 1)">
            {{ $t("homeLang.lang35") }}
          </li>
          <li :class="[{ font_active: areaType == 'fall' }, 'tab_default']" @click="changeType('fall', 2)">
            {{ $t("homeLang.lang36") }}
          </li>
        </ol>
        <van-swipe class="listscroll" ref="areaSwipe" :show-indicators="false" :loop="false" @change="changeAreaType">
          <van-swipe-item key="amount">
            <areaCoinList type="amount" :coin-list="volList" />
          </van-swipe-item>
          <van-swipe-item key="rise">
            <areaCoinList type="rise" :coin-list="riseList" />
          </van-swipe-item>
          <van-swipe-item key="fall">
            <areaCoinList type="fall" :coin-list="fallList" />
          </van-swipe-item>
        </van-swipe>
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
import areaCoinList from "./components/areaCoinList.vue";
import { mapState } from "vuex";
import { tradeOverview, tradeSymbols } from "@api/exchange";
export default {
  components: { areaCoinList },
  data() {
    return {
      // bannerList:[
      //   {banner:require('@img/home/home_banner.png')},
      //   {banner:require('@img/home/home_banner.png')},
      //   {banner:require('@img/home/home_banner.png')},
      // ],
      // noticeList:[
      //   {title:'关于交易所相关问题,欢迎咨询来电',wdate:'2020-10-23 12:12:13'},
      //   {title:'关于交易所相关问题,欢迎咨询来电',wdate:'2020-10-23 12:12:13'},
      //   {title:'关于交易所相关问题,欢迎咨询来电',wdate:'2020-10-23 12:12:13'},
      // ],
      noticePopup: false,
      noticeData: {},

      overviewList: [],
      areaType: "amount",
      riseList: [],
      fallList: [],
      volList: [],
      coinList: [],

      isHidePanel: false,
    };
  },
  computed: {
    ...mapState({
      bannerList: (state) => state.common.bannerList,
      noticeList: (state) => state.common.noticeList,
      marketSocketData: (state) => state.trade.marketSocketData,
      rateData: (state) => state.wallet.rateData,
      serviceUrl: (state) => state.common.getConfig,
      baseImgUrl: (state) => state.common.baseImgUrl,
      isLogin: (state) => state.common.isLogin,
    }),
  },
  watch: {
    // 监听socket 数据  实时更新
    marketSocketData() {
      this.initMarket();
    },
  },
  beforeDestroy() {
    this.isHidePanel = false;
  },

  created() {
    this.$store.dispatch("common/showFooter", true);
    this.$store.dispatch("common/updateSelectedFooter", 0);
    this.$store.dispatch("common/getBanner");
    this.$store.dispatch("common/getNotice");

    this.initMarket();
  },
  mounted() {
    // const homeTop = this.$refs.homeTop
    // homeTop.style.paddingTop = `${this.$barHeight}px`
    // this.$refs.homeBox.style.marginTop = `${homeTop.clientHeight}px`
  },

  methods: {
    //app读取banner图需要拼接服务器地址
    getBannerImgUrl(url) {
      return `${this.baseImgUrl}/${url}`;
    },
    changeAreaType(index) {
      this.areaType = ["amount", "rise", "fall"][index];
    },
    changeType(item, index) {
      this.areaType = item;
      this.$refs.areaSwipe.swipeTo(index);
      this.$refs.areaSwipe.resize();
    },
    showNoticePopup(data) {
      this.noticeData = data;
      this.pushState("?noticePopup");
      this.noticePopup = true;
    },

    initMarket() {
      if (this.marketSocketData && this.marketSocketData.symbols) {
        // 更新主要币种数据
        this.overviewList = this.marketSocketData.overview;
        // 更新行情
        if (this.marketSocketData.symbols) {
          this.processData(this.marketSocketData.symbols);
        }
      } else {
        this.getOverview();
        this.getExchangeSymbols();
      }
    },

    getOverview() {
      tradeOverview().then((res) => {
        this.overviewList = res.data;
      });
    },
    getExchangeSymbols() {
      tradeSymbols().then((res) => {
        this.processData(res.data);
      });
    },

    // 加工行情数据
    processData(item) {
      // this.coinList = item;
      this.riseList = [];
      this.fallList = [];
      this.volList = [];
      this.coinList = [];
      if (!item) {
        return;
      }
      this.riseList = item.filter((data) => data.rise >= 0);
      this.fallList = item.filter((data) => data.rise < 0);

      this.riseList.sort(this.$utils.compareRise("rise"));
      this.fallList.sort(this.$utils.compareRise("rise", "up"));
      this.volList = [...item];
      this.volList.sort(this.$utils.compareRise("volume"));
      if (this.areaType == "rise") {
        this.coinList = [...this.riseList];
      } else if (this.areaType == "fall") {
        this.coinList = [...this.fallList];
      } else if (this.areaType == "amount") {
        this.coinList = [...this.volList];
      }
    },

    goDetails(data) {
      sessionStorage.setItem("marketDetails", JSON.stringify(data));
      this.pushPath("/marketDetails/trad");
    },
    showOnlineService() {
      //06客户的客服链接是外部加载形式，但是app无法跳转外部 所以区别处理，跳内部浏览器页面去加载
      if (window.cordova || location.search.indexOf("isapp") !== -1) {
        this.$router.push("/browser");
      } else {
        window.open(this.serviceUrl.KF_ADDRESS_H5);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  bottom: 50px;
  height: auto;

  .bg-top {
    background-image: url("../../assets/img/bbai/bg_home_BBAI.png");
    margin: 0px 10px 10px 10px;
    padding: 10px 15px;

    .ul {
      justify-content: space-around;

      .userinfo {
        display: flex;
        flex-direction: column;
        align-items: center;

        span {
          font-size: 12px;
          color: $subFontColor;
          margin-top: 6px;
        }
      }
    }

    .lock {
      justify-content: space-between;
      align-items: flex-start;
      height: 200px;

      .lock-left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        border: 0.5px solid #ccc;
        padding: 5px;
        border-radius: 10px;
        flex: 1;
      }

      .lock-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        border-radius: 10px;
        flex: 1;
        margin-left: 10px;

        .lock-right-top {
          height: 60%;
          border: 0.5px solid #ccc;
          padding: 5px;
          border-radius: 10px;
          margin-bottom: 5px;
        }

        .lock-right-bt {
          height: 40%;
          border: 0.5px solid #ccc;
          padding: 5px;
          border-radius: 10px;
          display: flex;
          justify-content: space-between;
          position: relative;

          .lock-right-bt-img {
            position: absolute;
            right: 10px;
            height: 60px;
          }

          .lock-right-bt-text {

            font-size: 14px;
            position: absolute;
            bottom: 5px;
            left: 8px;

            em {
              display: block;
              font-size: 10px;
              margin-top: 3px;
              color: $subFontColor;
            }
          }
        }
      }
    }


    .bg-top1 {
      justify-content: space-between;
      display: flex;

      .bg-top-left {
        display: flex;
        flex-direction: column;
        align-items: baseline;
        justify-content: space-between;

        h2 {
          margin-bottom: 30px;
          font-size: 18px;

          p {
            margin-bottom: 10px
          }

          ;
        }

        h3 {
          font-size: 14px;
          margin-bottom: 10px;
        }

        span {
          font-size: 10px;
          color: $subFontColor;
        }
      }
    }
  }

}

.home_top {
  background: $bgColor;
  position: relative;
  //z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
}

.home_nav {
  padding: 7px 12px;
  height: 44px;

  p {
    flex: 1;
    max-width: 30px;
    height: 30px;
  }

  a {
    flex: 1;
    max-width: 20px;
    height: 20px;
  }

  .search_box {
    flex: 1;
    display: flex;
    align-items: center;
    height: 30px;
    border-radius: 40px;
    padding: 6px 10px;
    margin: 0 20px;
    background: var(--top-searchBox-bgColor);

    img {
      flex: 1;
      max-width: 18px;
    }

    span {
      margin-left: 5px;
      font-size: 12px;
      color: $subFontColor;
    }
  }
}

.banner_box {
  height: 130px;

  .banner_img {
    padding: 8px 15px 0;

    img {
      border-radius: 5px;
      overflow: hidden;
    }
  }
}

.home_notice {
  display: flex;
  padding: 10px 15px;
  align-items: center;
  background-color: var(--top-searchBox-bgColor);
  border-radius: 50px;
  margin: 0px 10px 10px 10px;

  label {
    flex: 1;
    max-width: 20px;
    font-size: 0;
  }

  .notice_box {
    width: 100%;
    height: 30px;
    line-height: 32px;
    letter-spacing: 1px;
    margin-left: 10px;
    overflow: hidden;
    flex: 1;

    span {
      display: block;
      font-size: 13px;
      // color: $subFontColor;
    }
  }

  i {
    font-size: 14px;
    padding-left: 10px;
  }
}

.coin_box {
  overflow-x: auto;
  overflow-y: hidden;
  display: block;
  white-space: nowrap;
  height: 125px;

  //background-color: $blockColor;
  li {
    line-height: 20px;
    display: inline-block;
    width: calc(100% / 3);
    text-align: center;
    padding: 0px 10px;
    box-sizing: border-box;

    .box_item {
      background-color: var(--home-coinBox-bgColor);
      padding: 10px 0px;
      border-radius: 8px;

      p {
        margin-bottom: 8px;
        font-weight: 600;
      }

      h2 {
        font-size: 16px;
      }

      i {
        display: block;
        font-size: 12px;
        margin: 2px 0;
      }

      span {
        color: $subFontColor;
        display: block;
        margin-top: 2px;
        font-size: 12px;
      }
    }
  }
}

.sub_banner {
  margin: 8px 0;
  padding: 25px 20px;
  height: 100px;
  overflow: hidden;
  background: url(../../assets/img/home/miner_img.png) no-repeat;
  background-size: 175px 100%;
  background-position: 175px 0;
  background-color: var(--home-subBanner-bgColor);
  border-radius: 8px;
  margin: 0px 10px;

  h3 {
    font-size: 20px;
    line-height: 26px;
    margin-bottom: 10px;
  }
}

.coin_list {
  background: $blockColor;

  .coin_title {
    padding: 10px 15px;
    font-size: 16px;
    font-weight: 600;
  }

  .area_box {
    display: flex;
    align-items: center;
    padding-left: 15px;
    // padding-top: 15px;
    line-height: 24px;
    border-bottom: 1px solid $lineColor;

    li {
      // flex: 1;
      // max-width: 5em;
      margin-right: 20px;
      font-size: 15px;
      font-weight: 600;
      position: relative;
      padding: 12px 0 10px;
      // text-align: center;
      color: $subFontColor;
    }

    .font_active {
      color: $mainColor !important;

      &::after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        background-color: $mainColor;
        height: 1px;
      }
    }
  }

  ::v-deep .van-swipe-item {
    max-height: calc(100vh - 250px);
    overflow-y: auto;
  }
}

.notice_details {
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

  pre {
    width: 100%;
    word-wrap: break-word;
    word-break: normal;
    font-size: 12px;
    line-height: 21px;
  }
}

.listscroll ::v-deep .van-swipe-item {
  max-height: none;
  overflow: none;
}
</style>
