<template>
  <div class="my">
    <div class="my_top" ref="myTop">
      <div class="user_header flex_between">
        <p @click="goBack()">
          <img :src="require(`@img/common/my${them}_close.png`)" alt="" />
        </p>
        <div class="flex">
          <p @click="pushPath('/notice')">
            <img :src="require(`@img/my/icon${them}_notice.png`)" alt="" />
          </p>
          <p @click="pushPath('/setting')">
            <img :src="require(`@img/my/icon${them}_setting.png`)" alt="" />
          </p>
        </div>
      </div>
      <ol class="user_box van-hairline--bottom">
        <li
          v-if="!isLogin"
          class="flex_between"
          @click="$router.replace('/login')"
        >
          <van-image round :src="userHead" style="background-color: black" />
          <label>
            <p>{{ $t("accountLang.lang36") }}</p>
            <span>{{ $t("accountLang.lang37") }}</span>
          </label>
        </li>
        <li v-else class="flex_between">
          <van-image round :src="userHead" style="background-color: black" />
          <label class="text_hide">
            <p class="text_hide">
              {{ $t("accountLang.lang38")
              }}{{ userInfo.tel || userInfo.email || "--" }}
            </p>
            <span>UID:{{ userInfo.recomcode || "--" }}</span
            ><br />
            <span
              >{{ $t("accountLang.lang158") }}:{{ userInfo.reputation }}</span
            >
          </label>
        </li>
      </ol>
    </div>

    <ol class="my_menu">
      <li @click="pushPath('/idAuth')">
        <img src="@img/my/my_menu_1.png" alt="" />
        <p>{{ $t("accountLang.lang39") }}</p>
        <em class="main_color" v-if="userInfo.idcardstate == 'completed'">{{
          $t("accountLang.lang40")
        }}</em>
        <em class="main_color" v-if="userInfo.idcardstate == 'no'">{{
          $t("accountLang.lang41")
        }}</em>
        <em class="main_color" v-if="userInfo.idcardstate == 'review'">{{
          $t("accountLang.lang42")
        }}</em>
        <em class="main_color" v-if="userInfo.idcardstate == 'reject'">{{
          $t("accountLang.lang43")
        }}</em>
        <i class="iconfont icon-arrow-right"></i>
      </li>
      <li @click="pushPath('/securityCenter')">
        <img src="@img/my/my_menu_2.png" alt="" />
        <p>{{ $t("accountLang.lang52") }}</p>
        <i class="iconfont icon-arrow-right"></i>
      </li>
      <li @click="pushPath('/coinAddress')">
        <img src="@img/my/my_menu_4.png" alt="" />
        <p>{{ $t("tradeLang.lang97") }}</p>
        <i class="iconfont icon-arrow-right"></i>
      </li>
      <li @click="pushPath('/coninBankCard')">
        <img src="@img/my/my_menu_10.png" alt="" />
        <p>{{ $t("commonLang.lang35") }}</p>
        <i class="iconfont icon-arrow-right"></i>
      </li>
    </ol>
    <!-- <ol class="my_menu">
      <li @click="goAccountManagement()">
        <img src="@img/my/my_menu_7.png" alt="">
        <p>收款管理</p>
        <i class="iconfont icon-arrow-right"></i>
      </li>      
    </ol> -->
    <ol class="my_menu">
      <li @click="pushPath('/myTeam')">
        <img src="@img/my/my_menu_5.png" alt="" />
        <p>{{ $t("accountLang.lang86") }}</p>
        <i class="iconfont icon-arrow-right"></i>
      </li>
      <li @click="pushPath('/inviteFriends')">
        <img src="@img/my/my_menu_6.png" alt="" />
        <p>{{ $t("accountLang.lang95") }}</p>
        <i class="iconfont icon-arrow-right"></i>
      </li>
    </ol>
    <ol class="my_menu">
      <li @click="pushPath('/helpCenter')">
        <img src="@img/my/my_menu_8.png" alt="" />
        <p>{{ $t("accountLang.lang119") }}</p>
        <i class="iconfont icon-arrow-right"></i>
      </li>
      <li @click="pushPath('/aboutUs')">
        <img src="@img/my/my_menu_9.png" alt="" />
        <p>{{ $t("accountLang.lang138") }}</p>
        <i class="iconfont icon-arrow-right"></i>
      </li>
      <li @click="pushPath('/certificate')">
        <img src="@img/my/whitebook.png" alt="" />
        <p>{{ $t("accountLang.lang157") }}</p>
        <i class="iconfont icon-arrow-right"></i>
      </li>
      <li @click="pushPath('/apiKey')">
        <img src="@img/my/icon_exchange.png" alt="" />
        <p>APIKEY</p>
        <i class="iconfont icon-arrow-right"></i>
      </li>
    </ol>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { logout } from "@api/user";
export default {
  data() {
    return {
      userHead: require("@img/my/logo.png"),

      exitPopup: false,
      tipPopup: false,
      them: "",
    };
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.common.isLogin,
      userInfo: (state) => state.user.userInfo,
      // balanceData:state => state.user.balanceData,
    }),
  },
  created() {
    this.$store.dispatch("user/getUserInfo");
    // this.$store.dispatch('user/getMyBalance')
    this.them = "_" + window._config.them;
  },
  mounted() {
    this.$refs.myTop.style.paddingTop = `${this.$barHeight}px`;
  },

  methods: {
    exit() {
      logout().then((res) => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        this.$store.dispatch("common/updateLoginStatus", false);
        this.$router.replace("/login");
        //this.pushPath('/login');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.my_top {
  background: $mainColor;
  color: $bgColor;

  // height: 220px;
  .user_header {
    padding: 12px 15px;

    p {
      width: 20px;
      height: 20px;
    }

    div {
      p {
        margin-left: 10px;
      }
    }
  }

  .user_box {
    padding: 20px 15px;

    li {
      .van-image {
        flex: 1;
        max-width: 60px;
        min-width: 60px;
        width: 60px;
        height: 60px;
      }

      label {
        flex: 1;
        margin-left: 10px;

        p {
          font-size: 16px;
          font-weight: 600;
          margin: 5px 0 8px;
        }

        span {
          font-size: 12px;
        }
      }

      i {
        font-size: 16px;
        color: $subFontColor;
      }
    }
  }
}

.my_menu {
  margin: 8px 0;
  background-color: $blockColor;
  padding: 0 15px;

  li {
    padding: 15px 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba($bgColor, 0.6);

    &:last-child {
      border: none;
    }

    img {
      width: 20px;
    }

    p {
      flex: 1;
      margin-left: 10px;
      line-height: 20px;
    }

    i {
      margin-left: 5px;
      font-size: 16px;
      color: $subFontColor;
    }
  }
}

.exit_box {
  margin: 15px 12px;

  button {
    border: none;
    background-color: $blockColor;
    width: 100%;
    border-radius: 5px;
    color: $mainColor;
  }
}

.exit_popup_box {
  padding: 30px 20px 20px;
  text-align: center;

  p {
    font-size: 12px;
    color: $subFontColor;
    margin: 10px 0 30px;
  }
}
</style>