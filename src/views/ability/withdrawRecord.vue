<template>
  <div>
    <nav-header title="兑换记录" />
    <div class="main_content">
      <van-list v-model="loading" :finished="finished" @load="loadMore">
        <van-cell title="单元格" value="内容"  v-for="item in recordList"  :key="item">
          <div slot="title" class="flex">
            <img src="@img/home/icon_record.png" alt="" style="width: 30px;height: 30px;"
            />
            <div class="log">
              <h5>{{item.number}}算力</h5>
              <p>{{item.writedate}}</p>
            </div>
            
          </div>
          <div  > 
             <div class="log">
              <h5 :class="item.state">{{parseText(item.state )}}</h5>
              <p>{{ item.remark }}</p>
            </div></div>
        </van-cell>
      </van-list>
      <div v-show="isload && !recordList.length" class="no_data">
        <i class="icon_no_data" />
        <span>{{ $t("commonLang.lang5") }}</span>
      </div>
    </div>
    <van-overlay :show="payPopup" @click="payPopup = false">
      <div class="pay_popup" @click.stop>
        <passwordDialog
          v-model="payPass"
          @cancelAction="payPopup = false"
          @confirmAction="confirmPass"
        />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Toast, Dialog } from "vant";
import { withdrawLog } from "@api/node";
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
    parseText(v){
      if(v=='sending'){
        return "审核中";
      }
      if(v=='pass'){
        return "通过";
      }
      if(v=='reject'){
        return "拒绝";
      }
    },
    loadMore() {
      withdrawLog().then((res) => {
        this.recordList =res.data
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
        .catch(() => {});
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
.pass{
  color: green !important;
}
.sending{
  color: $subColor !important;
}
.reject{
  color: red !important;
}
</style>
