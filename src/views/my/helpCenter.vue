<!-- 帮助中心 -->
<template>
  <div>
    <nav-header :title="$t('accountLang.lang119')">
      <span
        slot="headerRight"
        class="iconfont icon-record"
        @click="showRecord()"
      />
    </nav-header>
    <div class="main_content help_center">
      <!-- <div class="top_img">
        <h3>{{$t('accountLang.lang120')}}</h3>
        <p>{{$t('accountLang.lang121')}}</p>
      </div> -->
      <ul class="help_box">
        <li
          v-for="(item, index) in helpList"
          :key="index"
          @click="showHelpDetails(item, index)"
        >
          <div>
            <span>{{ item.title }}</span>
          </div>
          <em class="iconfont icon-arrow-right" />
        </li>
      </ul>
      <div v-if="!helpList.length" class="no_data">
        <p class="icon_no_data" />
        <span>{{ $t("commonLang.lang4") }}</span>
      </div>
    </div>
    <div class="footer_btn van-hairline--top">
      <van-button type="primary" size="large" @click="showFeedback()">{{
        $t("accountLang.lang123")
      }}</van-button>
    </div>

    <van-popup
      v-model="questionPopup"
      class="right_popup"
      position="right"
      close-on-popstate
      overlay-class="block_bg"
    >
      <nav-header :title="$t('accountLang.lang122')" />
      <div class="main_content question_box">
        <h3>{{ helpData.title }}</h3>
        <pre v-html="helpData.reply" />
      </div>
    </van-popup>

    <van-popup
      v-model="feedbackPopup"
      class="right_popup"
      position="right"
      close-on-popstate
      overlay-class="block_bg"
    >
      <nav-header :title="$t('accountLang.lang123')" />
      <div class="main_content feedback_box">
        <div class="input_box">
          <div class="title_box">{{ $t("accountLang.lang124") }}</div>
          <div class="title_input">
            <input
              v-model.trim="title"
              v-input-line
              type="text"
              :placeholder="$t('accountLang.lang125')"
            />
          </div>
        </div>
        <div class="input_box">
          <div class="title_box">{{ $t("accountLang.lang126") }}</div>

          <van-field
            v-model="context"
            rows="6"
            autosize
            type="textarea"
            maxlength="200"
            :placeholder="$t('accountLang.lang127')"
            show-word-limit
          />

          <div class="upload_box">
            <van-uploader
              v-model="fileList"
              max-count="4"
              upload-icon="plus"
              :max-size="5 * 1024 * 1024"
              accept="image/*"
              multiple
              @oversize="onOversize"
            />
          </div>
        </div>
        <div class="footer_btn van-hairline--top">
          <van-button type="primary" size="large" @click="pushFeedback()">{{
            $t("commonLang.lang2")
          }}</van-button>
        </div>
      </div>
    </van-popup>

    <van-popup
      v-model="recordPopup"
      class="right_popup"
      position="right"
      close-on-popstate
      overlay-class="block_bg"
    >
      <nav-header :title="$t('accountLang.lang128')" />
      <div class="main_content">
        <ol>
          <li
            v-for="item in feedbackList"
            :key="item.createTime"
            class="feedback_list"
          >
            <label class="flex_between">
              <span>{{ item.wdate }}</span>
              <span class="sub_color">{{ item.state | status }}</span>
            </label>
            <div class="word_box">{{ item.quest }}</div>
            <div v-if="item.imgArr.length > 1" class="imgs_box">
              <van-image
                v-for="(img, index) in item.imgArr"
                :key="`img${index}`"
                fit="cover"
                :src="`${baseImgUrl}/${img}`"
                @click.stop="showBigImg(item.imgArr, index)"
              />
            </div>
            <div
              v-if="item.imgArr.length == 1"
              class="img_box"
              @click.stop="showBigImg(item.imgArr, 0)"
            >
              <img :src="`${baseImgUrl}/${item.imgArr[0]}`" />
            </div>
            <div class="reply_box main_color">
              <em>{{ $t("accountLang.lang129") }}</em
              >{{ item.reply || $t("accountLang.lang130") }}
            </div>
          </li>
        </ol>
        <div
          v-show="feedbackIsload && feedbackList.length == 0"
          class="no_data"
        >
          <i class="icon_no_data" />
          <span>{{ $t("accountLang.lang131") }}</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Toast, ImagePreview } from "vant";
import { onlineList, addOnline } from "@api/user";
import $upload from "@/assets/js/upload";
import i18n from "@/i18n";
export default {
  components: {},
  data() {
    return {
      questionPopup: false,
      helpData: {},

      feedbackPopup: false,
      title: "",
      context: "",
      fileList: [],
      isRelease: false,

      recordPopup: false,
      feedbackList: [],
      feedbackIsload: false,
    };
  },
  computed: {
    ...mapState({
      helpList: (state) => state.common.helpList,
      baseImgUrl: (state) => state.common.baseImgUrl,
    }),
  },
  filters: {
    status(val) {
      if (val == "sending") {
        return i18n.t("accountLang.lang132");
      } else if (val == "already") {
        return i18n.t("accountLang.lang133");
      } else if (val == "close") {
        return i18n.t("accountLang.lang134");
      }
    },
  },
  created() {
    this.$store.dispatch("common/getHelpList");
  },
  mounted() {},
  methods: {
    showHelpDetails(item) {
      this.helpData = item;
      this.pushState("?questionPopup");
      this.questionPopup = true;
    },

    showFeedback() {
      this.title = "";
      this.context = "";
      this.pushState("?feedbackPopup");
      this.feedbackPopup = true;
    },
    onOversize() {
      Toast(this.$t("accountLang.lang135"));
    },
    pushFeedback() {
      if (!this.title) {
        Toast(this.$t("accountLang.lang125"));
        return;
      }
      if (!this.context) {
        Toast(this.$t("accountLang.lang136"));
        return;
      } else if (this.context.length < 10 || this.context.length > 200) {
        Toast(this.$t("accountLang.lang137"));
        return;
      }
      if (this.isRelease) {
        return;
      }
      this.isRelease = true;
      this.$store.dispatch("common/showLoading", true);
      this.addRequest();
    },
    async addRequest() {
      const awaitFuc = [];
      for (let index = 0; index < this.fileList.length; index++) {
        awaitFuc[index] = await $upload.uploadImg(this.fileList[index].file);
      }

      addOnline({
        title: this.title,
        quest: this.context,
        images: awaitFuc.join(","),
      }).then((res) => {
        setTimeout(() => {
          this.isRelease = false;
        }, 2000);
        this.context = "";
        this.title = "";
        this.fileList = [];
        Toast(res.msg);
        this.goBack();
      });
    },

    showRecord() {
      this.feedbackIsload = false;
      this.getFeedbackList();
      this.pushState("?recordPopup");
      this.recordPopup = true;
    },
    getFeedbackList() {
      onlineList().then((res) => {
        this.feedbackIsload = true;
        res.data.forEach((data) => {
          data.imgArr = data.images ? data.images.split(",") : [];
        });
        this.feedbackList = res.data;
      });
    },

    showBigImg(imgs, index) {
      let arr = [];
      imgs.map((item) => {
        arr.push(`${this.baseImgUrl}/${item}`);
      });
      ImagePreview({
        images: [...arr],
        startPosition: index,
        loop: false,
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.icon-record {
  font-size: 18px;
  color: var(--icon-color);
}
.help_center {
  bottom: 64px;
  pre {
    padding: 15px;
  }
}
.top_img {
  margin: 8px 15px;
  height: 100px;
  background: url(../../assets/img/my/help_bg.png) no-repeat;
  background-size: 100% 100%;
  padding: 20px;
  color: $fontColor;
  p {
    line-height: 20px;
    margin-top: 10px;
    color: rgba($fontColor, 0.8);
  }
}
.help_box {
  li {
    padding: 15px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $lineColor;
    div {
      flex: 1;
      line-height: 20px;
    }
    em {
      text-align: right;
      font-size: 15px;
      max-width: 20px;
      flex: 1;
      color: $subFontColor;
    }
  }
}
.question_box {
  background-color: $blockColor;
  padding: 0 15px;
  box-sizing: border-box;
  h3 {
    padding: 10px 0;
    margin-bottom: 10px;
  }
  pre {
    width: 100%;
    word-wrap: break-word;
    word-break: normal;
    user-select: text;
    white-space: pre-wrap;
  }
}

.footer_btn {
  background-color: $bgColor;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 10px 12px;
}

.feedback_box {
  bottom: 64px;
  .input_box {
    padding: 0 15px;
    .title_box {
      line-height: 44px;
      font-size: 15px;
      font-weight: 600;
      margin-top: 10px;
    }
    .title_input {
      // box-shadow: 0px 4px 24px 0px rgba(153, 153, 153, 0.1);
      border: 1px solid $lineColor;
      line-height: 21px;
      padding: 10px;
      border-radius: 4px;
    }
    ::v-deep.van-field {
      border: 1px solid rgba($lineColor, 0.5);
      // box-shadow: 0px 4px 24px 0px rgba(153, 153, 153, 0.1);
      border-radius: 4px;
    }
  }
}

.feedback_list {
  margin-top: 10px;
  background-color: $blockColor;
  padding: 0 15px 15px;
  border-bottom: 1px solid var(--list-border-color);
  label {
    line-height: 36px;
    span {
      &:nth-child(2) {
        color: $mainColor;
      }
    }
  }
  .word_box {
    line-height: 21px;
  }
  .reply_box {
    margin-top: 15px;
    background-color: $bgColor;
    color: $mainColor;
    padding: 5px 10px;
    line-height: 21px;
    border-radius: 4px;
    font-size: 12px;
  }

  .imgs_box {
    overflow: hidden;
    margin-top: 5px;
    .van-image {
      float: left;
      width: calc((100vw - 45px) / 4);
      height: calc((100vw - 45px) / 4);
      overflow: hidden;
      margin-top: 5px;
      margin-right: 5px;
      &:nth-of-type(3n) {
        margin-right: 0;
      }
    }
  }
  .img_box {
    margin-top: 5px;
    img {
      max-width: 70%;
      min-width: 110px;
      min-height: 110px;
      max-height: 230px;
      -o-object-fit: cover;
      object-fit: cover;
    }
  }
}

.upload_box {
  margin: 15px 0;
  padding: 15px;
  height: 105px;
  border: 1px dashed $lineColor;
  border-radius: 10px;
  ::v-deep.van-uploader__upload {
    width: calc((100vw - 92px) / 4);
    height: calc((100vw - 92px) / 4);
    margin: 0 10px 0 0;
    &:last-child {
      margin: 0;
    }
  }
  ::v-deep.van-uploader__preview {
    margin: 0 10px 0 0;
    &:last-child {
      margin: 0;
    }
  }
  ::v-deep.van-uploader__preview-image {
    width: calc((100vw - 92px) / 4);
    height: calc((100vw - 92px) / 4);
  }
}
</style>
