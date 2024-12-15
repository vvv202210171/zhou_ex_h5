<template>
  <div>
    <nav-header title="算力中心" @clickRight="pushPath('/nodeRecord')">
      <span slot="headerRight" class="right_img"><img src="@img/home/icon_record.png" alt="" /></span>
    </nav-header>
    <div class="main_content">
      <div class="lock_top">
        <p>已释放算力</p>
        <h2>
          {{ nodeInfo.releaseAbility || "0.00"
          }}<span style="color: green; font-size: 14px; margin-left: 5px" @click="withDrawAbility">兑现</span>
          <i class="iconfont icon-arrow-right main_color" @click="pushPath('/withdrawRecord')" style="float: right;" />
        </h2>
        <ol class="flex">
          <li>
            <h4>
              {{ nodeInfo.nodeAbility }}
            </h4>
            <p>挖矿</p>
          </li>

          <li>
            <h4>{{ nodeInfo.shareAbility || "0" }}</h4>
            <p>分享</p>
          </li>
          <li>
            <h4>
              {{ nodeInfo.freeAbility }}
            </h4>
            <p>赠送</p>
          </li>
          <li>
            <h4>{{ nodeInfo.communityAbility || "0" }}</h4>
            <p>社区</p>
          </li>
          <li>
            <h4>{{ nodeInfo.nodePrice || "0" }}</h4>
            <p>节点</p>
          </li>
        </ol>
      </div>
      <ol v-for="item in nodes" :key="item.id" class="lock_box" @click="goConfirm(item)">
        <li class="flex_between">
          <h3 class="flex_center">
            <van-image width="80px" height="80px" :src="`${baseImgUrl}/${item.logo}`" fit="cover" alt="Example Image"
              style="margin-right: 6px" />{{ item.name || "--" }}
          </h3>
          <i class="iconfont icon-arrow-right main_color" />
        </li>
        <li class="flex">
          <div>
            <label class="flex main_color">
              <p>{{ item.gas }}</p>
              <em>%</em>
            </label>
            <span>每日释放比例</span>
          </div>
          <div>
            <em>{{ item.cycle }}{{ $t("homeLang.lang53") }}</em>
            <span style="color: green">{{ item.price }}USDT </span>
          </div>
          <div v-if="isDisable(item)">
            <span style="color: red">{{ $t("commonLang.disableLock") }}</span>
          </div>
        </li>
      </ol>
      <div v-if="!nodes.length && isload" class="no_data">
        <p class="icon_no_data" />
        <span>{{ $t("commonLang.lang5") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { nodes } from "@api/node";
import { Notify } from "vant";
export default {
  data() {
    return {
      isload: false,
      nodes: [],
    };
  },
  computed: {
    ...mapState({
      nodeInfo: (state) => state.node.nodeInfo,
      baseImgUrl: (state) => state.common.baseImgUrl,
    }),
  },
  created() {
    this.$store.dispatch("node/getNodeInfo");
    this.getnodes();
  },

  methods: {
    getnodes() {
      this.isload = false;
      nodes().then((res) => {
        this.isload = true;
        this.nodes = res.data
      });
    },
    isDisable(data) {
      return data.state === "disable";
    },
    withDrawAbility() {
      this.pushPath('/withdrawAbility')
    },
    goConfirm(data) {
      if (this.isDisable(data)) {
        Notify(this.$t("commonLang.disableLock"));
        return;
      }
      sessionStorage.setItem("nodeData", JSON.stringify(data));
      this.pushPath("/comfirmNode");
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
  pointer-events: none;
  /* 禁用点击事件 */
  opacity: 0.6;
  /* 设置半透明效果 */
  cursor: not-allowed;
  /* 显示禁用光标 */
  filter: grayscale(100%);
  /* 灰化处理（可选） */
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
