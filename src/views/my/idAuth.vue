<template>
  <div>
    <nav-header :title="$t('accountLang.lang39')" />
    <div>
      <div
        v-if="userInfo.idcardstate == 'no' || userInfo.idcardstate == 'reject'"
      >
        <p class="id_auth_title">{{ $t("accountLang.lang44") }}</p>
        <ol class="input_box">
          <li>
            <span>{{ $t("accountLang.lang45") }}</span>
            <input
              type="text"
              v-model="trueName"
              :placeholder="$t('accountLang.lang46')"
            />
          </li>
          <li>
            <span>{{ $t("accountLang.lang47") }}</span>
            <input
              type="text"
              v-model="idCard"
              :placeholder="$t('accountLang.lang48')"
            />
          </li>
        </ol>
        <p class="id_auth_title">{{ $t("accountLang.lang49") }}</p>
        <div class="upload_box flex">
          <van-uploader
            upload-icon="photo"
            v-model="imgArr"
            :max-count="1"
            multiple
            :max-size="5 * 1024 * 1024"
            accept="image/*"
            @oversize="onOversize"
          />
          <van-uploader
            upload-icon="photo"
            v-model="imgArr1"
            :max-count="1"
            multiple
            :max-size="5 * 1024 * 1024"
            accept="image/*"
            @oversize="onOversize"
          />
        </div>
        <div class="id_auth_btn">
          <van-button type="primary" size="large" @click="confirmSubmit()">{{
            $t("commonLang.lang2")
          }}</van-button>
        </div>
        <div class="id_auth_tip">
          <span>{{ $t("commonLang.lang17") }}</span>
        </div>
      </div>

      <div class="id_auth_audit" v-if="userInfo.idcardstate == 'review'">
        <div class="id_auth_top">
          <p><img src="@img/my/id_auth_audit.png" alt="" /></p>
          <span>{{ $t("accountLang.lang42") }}...</span>
        </div>
        <div class="img_perview">
          <van-image
            v-if="zm"
            :src="`${baseImgUrl}/${zm}`"
            style="width: 100px; height: 100px"
            @click="imgPerview(`${baseImgUrl}/${zm}`)"
            fit="fill"
          >
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
          <van-image
            v-if="fm"
            :src="`${baseImgUrl}/${fm}`"
            style="width: 100px; height: 100px"
            fit="fill"
            @click="imgPerview(`${baseImgUrl}/${fm}`)"
          >
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
        </div>
      </div>

      <div class="id_auth_audit" v-if="userInfo.idcardstate == 'completed'">
        <div class="id_auth_top">
          <p><img src="@img/my/id_auth_pass.png" alt="" /></p>
          <span>{{ $t("accountLang.lang50") }}</span>
        </div>
        <p class="id_auth_title">{{ $t("accountLang.lang44") }}</p>
        <ol class="id_auth_info">
          <li class="flex van-hairline--bottom">
            <span>{{ $t("accountLang.lang45") }}</span>
            <p>{{ userInfo.username }}</p>
          </li>
          <li class="flex">
            <span>{{ $t("accountLang.lang47") }}</span>
            <p>{{ userInfo.idcard }}</p>
          </li>
        </ol>

        <div class="img_perview">
          <van-image
            v-if="zm"
            :src="`${baseImgUrl}/${zm}`"
            style="width: 100px; height: 100px"
            @click="imgPerview(`${baseImgUrl}/${zm}`)"
            fit="fill"
          >
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
          <van-image
            v-if="fm"
            :src="`${baseImgUrl}/${fm}`"
            style="width: 100px; height: 100px"
            fit="fill"
            @click="imgPerview(`${baseImgUrl}/${fm}`)"
          >
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import $upload from "@/assets/js/upload";
import { mapState } from "vuex";
import { editRealName } from "@api/user";
import { ImagePreview } from "vant";
export default {
  data() {
    return {
      trueName: "",
      idCard: "",
      imgArr: [],
      imgArr1: [],
      zm: "",
      fm: "",
      sc: "",
    };
  },
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      baseImgUrl: (state) => state.common.baseImgUrl,
    }),
  },
  watch: {
    userInfo(val) {
      if (val.idcardstate == "review" || val.idcardstate == "completed") {
        this.zm =
          this.$store.state.user.userInfo.zm !== "--"
            ? this.$store.state.user.userInfo.zm
            : "";
        this.fm =
          this.$store.state.user.userInfo.fm !== "--"
            ? this.$store.state.user.userInfo.fm
            : "";
      }
    },
  },
  created() {
    if (
      this.$store.state.user.userInfo.idcardstate == "review" ||
      this.$store.state.user.userInfo.idcardstate == "completed"
    ) {
      this.zm =
        this.$store.state.user.userInfo.zm !== "--"
          ? this.$store.state.user.userInfo.zm
          : "";
      this.fm =
        this.$store.state.user.userInfo.fm !== "--"
          ? this.$store.state.user.userInfo.fm
          : "";
    }
  },
  methods: {
    imgPerview(url) {
      ImagePreview([url]);
    },
    onOversize() {
      Toast(this.$t("accountLang.lang135"));
    },
    confirmSubmit() {
      if (!this.trueName) {
        Toast(this.$t("accountLang.lang46"));
        return;
      }
      if (!this.idCard) {
        Toast(this.$t("accountLang.lang48"));
        return;
      }
      if (this.imgArr.length != 1) {
        Toast(this.$t("accountLang.lang51"));
        return;
      }
      if (this.imgArr1.length != 1) {
        Toast(this.$t("accountLang.lang51"));
        return;
      }
      $upload.uploadImg(this.imgArr[0].file).then((url1) => {
        $upload.uploadImg(this.imgArr1[0].file).then((url2) => {
          editRealName({
            username: this.trueName,
            idCard: this.idCard,
            zm: url1,
            fm: url2,
            sc: "",
          }).then((res) => {
            this.$store.dispatch("user/getUserInfo");
          });
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.id_auth_title {
  line-height: 20px;
  font-size: 13px;
  color: $subFontColor;
  padding: 15px 15px 12px;
}
.input_box {
  background-color: var(--inputBox-bgColor);
  li {
    padding: 15px 12px;
    display: flex;
    align-items: center;
    position: relative;
    line-height: 20px;
    &:first-child::after {
      position: absolute;
      content: "";
      left: 92px;
      bottom: 0;
      width: calc(100% - 104px);
      height: 1px;
      background-color: $lineColor;
    }
    span {
      flex: 1;
      max-width: 80px;
    }
    input {
      flex: 1;
    }
  }
}

.upload_box {
  padding: 15px 12px;
  background-color: $blockColor;
}
.id_auth_tip {
  padding: 15px 12px;
  background-color: $blockColor;
  p {
    line-height: 20px;
    font-size: 12px;
    color: $subFontColor;
    em {
      color: $mainColor;
    }
  }
  ol {
    padding-top: 10px;
    li {
      flex: 1;
      max-width: calc((100% - 30px) / 4);
      text-align: center;
      span {
        margin-top: 3px;
        display: block;
        color: $subFontColor;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
}

.id_auth_btn {
  margin: 30px 15px 10px;
}

.id_auth_tip {
  height: 10vh;
}

.id_auth_top {
  // background-color: $blockColor;
  padding: 10px 0 50px;
  text-align: center;
  p {
    width: 20%;
    margin: 50px auto 20px;
  }
  span {
    font-size: 20px;
    font-weight: 600;
  }
}
.id_auth_info {
  background-color: $blockColor;
  padding: 5px 15px;
  margin: 0 15px;
  border-radius: 5px;
  li {
    padding: 12px 0;
    span {
      flex: 1;
      max-width: 80px;
      color: $subFontColor;
    }
  }
}
.img_perview {
  margin-top: 20px;
  padding: 10px 0;
  display: flex;
  justify-content: space-evenly;
  background-color: $blockColor;
}
</style>