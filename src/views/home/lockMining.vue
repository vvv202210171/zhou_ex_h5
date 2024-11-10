<template>
  <div>
    <nav-header
      :title="$t('homeLang.lang47')"
      @clickRight="pushPath('/lockRecord')"
    >
      <span slot="headerRight" class="right_img"
        ><img src="@img/home/icon_record.png" alt=""
      /></span>
    </nav-header>
    <div class="main_content">
      <div class="lock_top">
        <p>{{ $t("homeLang.lang48") }}(USDT)</p>
        <h2>{{ minerCount.totalPayNumber || "0.00" }}</h2>
        <ol class="flex">
          <li>
            <h4>{{ minerCount.totalTodayIncome || "0.00" }}</h4>
            <p>{{ $t("homeLang.lang49") }}</p>
          </li>
          <li>
            <h4>{{ minerCount.totalIncome || "0.00" }}</h4>
            <p>{{ $t("homeLang.lang50") }}</p>
          </li>
          <li>
            <h4>{{ minerCount.count || "0" }}</h4>
            <p>{{ $t("homeLang.lang51") }}</p>
          </li>
        </ol>
      </div>
      <ol
        v-for="item in minerList"
        :key="item.id"
        class="lock_box"
        @click="goConfirm(item)"
      >
        <li class="flex_between">
          <h3 class="flex_center">
            <van-image
              width="80px"
              height="80px"
              :src="`${baseImgUrl}/${item.id}`"
              fit="cover"
              alt="Example Image"
              style="margin-right: 6px"
            />{{ item.name || "--" }}
          </h3>
          <i class="iconfont icon-arrow-right main_color" />
        </li>
        <li class="flex">
          <div>
            <label class="flex main_color"
              ><p>{{ item.gas }}</p>
              <em>%</em></label
            >
            <span>{{ $t("homeLang.lang52") }}</span>
          </div>
          <div>
            <em>{{ item.cycle }}{{ $t("homeLang.lang53") }}</em>
            <span>{{ item.minNumber }} - {{ item.maxNumber }}</span>
          </div>
          <div v-if="isDisable(item)">
            <span style="color: red">{{ $t("commonLang.disableLock") }}</span>
          </div>
        </li>
      </ol>
      <div v-if="!minerList.length && isload" class="no_data">
        <p class="icon_no_data" />
        <span>{{ $t("commonLang.lang5") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { minManage } from "@api/miner";
import { Notify } from "vant";
export default {
  data() {
    return {
      isload: false,
      minerList: [],
    };
  },
  computed: {
    ...mapState({
      minerCount: (state) => state.miner.minerCount,
      baseImgUrl: (state) => state.common.baseImgUrl,
    }),
  },
  created() {
    this.$store.dispatch("miner/getMinerInfo");
    this.getMinerList();
  },

  methods: {
    getMinerList() {
      this.isload = false;
      minManage().then((res) => {
        this.isload = true;
        this.minerList = res.data;
      });
    },
    isDisable(data) {
      return data.state === "disable";
    },
    goConfirm(data) {
      if (this.isDisable(data)) {
        Notify(this.$t("commonLang.disableLock"));
        return;
      }
      sessionStorage.setItem("minerData", JSON.stringify(data));
      this.pushPath("/comfirmLock");
    },
  },
};
</script>

<style lang="scss" scoped>
.right_img {
  width: 20px;
}
.lock_top {
  padding: 10px 15px;
  p {
    font-size: 12px;
    color: $subFontColor;
  }
  h2 {
    margin-top: 10px;
    font-size: 24px;
    line-height: 28px;
  }
  ol {
    margin-top: 15px;
    li {
      flex: 1;
      h4 {
        line-height: 26px;
        margin-bottom: 5px;
      }
      &:last-child {
        max-width: 25%;
      }
    }
  }
}
.disabled {
  pointer-events: none; /* 禁用点击事件 */
  opacity: 0.6; /* 设置半透明效果 */
  cursor: not-allowed; /* 显示禁用光标 */
  filter: grayscale(100%); /* 灰化处理（可选） */
}
.lock_box {
  margin: 5px 15px 15px;
  background: $blockColor;
  padding: 0 12px;
  border-radius: 4px;
  li {
    &:first-child {
      padding: 12px 0 10px;
      border-bottom: 1px solid rgba($lineColor, 0.5);
      i {
        font-size: 14px;
      }
    }
    &:last-child {
      padding: 12px 0;
      div {
        flex: 1;
        line-height: 20px;
        p {
          font-size: 16px;
          font-weight: 600;
        }
        span {
          display: block;
          color: $subFontColor;
          font-size: 12px;
          margin-top: 5px;
        }
      }
    }
  }
}
</style>
