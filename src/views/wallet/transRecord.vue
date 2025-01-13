<template>
  <div>
    <nav-header title="转账记录" />
    <div class="main_content">
      <van-list v-model="loading" :finished="finished" @load="loadMore">
        <van-cell v-for="item in recordList" :key="item">
          <div slot="title" class="flex">
            <img src="@img/bbai/with.png" alt="" style="width: 30px;height: 30px;"
              :class="{ rotate: item.title == 'in' }" />
            <div class="log">
              <h5>{{ item.tag }}</h5>
              <p>{{ item.writedate }}</p>
            </div>

          </div>
          <div>
            <div class="log">
              <h5>{{ parseText(item.number) }}</h5>
              <p :class="item.title">{{ parseText(item.title) }}</p>
            </div>
          </div>
        </van-cell>
      </van-list>
      <div v-show="isload && !recordList.length" class="no_data">
        <i class="icon_no_data" />
        <span>{{ $t("commonLang.lang5") }}</span>
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
import { mapState } from "vuex";
import { Toast, Dialog } from "vant";
import { transRecord } from "@api/wallet";
import passwordDialog from "@/components/passwordDialog.vue";
export default {
  components: { passwordDialog },
  data() {
    return {
      recordList: [],
      searchData: {
        page: 0,
        limit: 30,
      },
      isload: false,
      loading: false,
      finished: true,

      payPass: "",
      payPopup: false,
      id: "",
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  created() {
    this.getRecord();
  },
  methods: {
    getRecord() {
      this.isload = false;
      this.loadMore();
    },
    parseText(v) {
      if (v == 'in') {
        return "转入"
      }
      if (v == 'out') {
        return "转出"
      }

      return v;
    },
    loadMore() {
      transRecord().then((res) => {
        this.recordList = res.data
        this.finished = true
      });
    },

    showPayPopup(data) {
      Dialog.confirm({
        message: this.$t("homeLang.lang75"),
        confirmButtonText: this.$t("commonLang.lang9"),
        cancelButtonText: this.$t("commonLang.lang1"),
      })
        .then(() => {
          this.id = data.id;
          this.payPass = "";
          this.payPopup = true;
        })
        .catch(() => { });
    },

    confirmPass() {
      redeemOrder({
        id: this.id,
        tradPassword: this.payPass,
      }).then((res) => {
        Toast(res.msg);
        this.getRecord();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.rotate {
  transform: rotate(180deg);
}

.log {
  margin-left: 5px;



  p {
    font-size: 12px;
    color: $subFontColor;
    margin: 0;
  }

  h5 {
    font-size: 12px;
    color: green;
    margin: 0;
  }

}

.in {
  color: green !important;
}

.community {
  color: $subColor !important;
}

.out {
  color: red !important;
}
</style>