<template>
  <div>
    <nav-header title="API" />
    <div class="main_content">
      <div class="my_invite_info">
        <ol>
          <li>
            <p>apikey</p>
            <div>
              <span class="text_hide">{{ openapi.apikey }}</span>
              <button
                class="copy_btn"
                :aria-label="openapi.apikey"
                @click="$utils.promote()"
              >
                {{ $t("commonLang.lang6") }}
              </button>
            </div>
          </li>
          <li>
            <p>SECRET</p>
            <div>
              <span class="text_hide">{{ openapi.secret }}</span>
              <button
                class="copy_btn"
                :aria-label="openapi.secret"
                @click="$utils.promote()"
              >
                {{ $t("commonLang.lang6") }}
              </button>
            </div>
          </li>
          <li>
            <div style="padding-left: 0">
              <button style="max-width: 100%" @click="updateApi">
                {{ openapi.apikey ? "重新生成" : "生成" }}
              </button>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import { getOpenApi, crtOpenApi } from "@api/common";
export default {
  data() {
    return {
      openapi: { apikey: "", secret: "" },
    };
  },
  created() {
    this.initData();
  },

  methods: {
    async initData() {
      const ret = await getOpenApi();
      if (ret.code == 200 && ret.data) {
        this.openapi = ret.data;
      }
    },
    updateApi() {
      crtOpenApi().then((r) => {
        if (r.code == 200) {
          this.openapi = r.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.qr_box {
  text-align: center;
  padding: 20px 0;
  .qr_img {
    margin: 0 auto;
    width: 200px;
    height: 200px;
    border-radius: 10px;
    overflow: hidden;
    img {
      width: 200px;
      height: 200px;
      vertical-align: inherit;
      margin: 0;
    }
  }
  button {
    margin-top: 30px;
    line-height: 32px;
    height: 32px;
  }
}
.my_invite_info {
  padding: 15px;
  li {
    margin-bottom: 25px;
    p {
      font-weight: 600;
      margin-bottom: 15px;
    }
    div {
      flex: 1;
      // border: 1px solid $lineColor;
      box-shadow: inset 0 0 0 1px $subBlockColor;
      display: flex;
      align-items: center;
      padding-left: 15px;
      border-radius: 4px;
      overflow: hidden;
      span {
        flex: 1;
        line-height: 20px;
        padding-right: 10px;
      }
      button {
        flex: 1;
        max-width: 100px;
        line-height: 44px;
        background-color: $mainColor;
        color: $bgColor;
      }
    }
  }
}
</style>