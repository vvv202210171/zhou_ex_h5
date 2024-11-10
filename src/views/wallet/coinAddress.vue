<template>
  <div>
    <nav-header :title="$t('tradeLang.lang97')">
      <span slot="headerRight" class="iconfont icon-add" @click="showAddPopup()" />
    </nav-header>
    <div class="main_content">
      <ol v-for="item in addressList" :key="item.autoid" class="address_box">
        <li class="flex_between van-hairline--bottom">
          <h3>{{ item.coin }} <em>({{ item.title }})</em></h3>
          <span class="iconfont icon-delete" @click="delAddress(item)" />
        </li>
        <li>
          <p>{{ item.address }}</p>
        </li>
      </ol>
      <div v-if="(!addressList.length)&&isload" class="no_address">
        <img src="@img/my/address_icon.png" alt="">
        <p>{{ $t('tradeLang.lang98') }}</p>
        <van-button @click="showAddPopup()">{{ $t('tradeLang.lang75') }}</van-button>
      </div>
    </div>

    <van-popup v-model="addPopup" class="right_popup" position="right" close-on-popstate overlay-class="block_bg">
      <nav-header :title="$t('tradeLang.lang99')" />
      <div class="main_content">
        <div class="choose_box flex_between" @click="coinSheet=true">
          <h3>{{ $t('tradeLang.lang85') }}</h3>
          <label class="flex">
            <span>{{ coinData.name }}</span>
            <i class="iconfont icon-arrow-right" />
          </label>
        </div>
        <ol class="input_box block_bg">
          <li>
            <p>{{ $t('tradeLang.lang100') }}</p>
            <div class="input_div flex">
              <input v-model.trim="address" v-input-line type="text" :placeholder="$t('tradeLang.lang101')">
              <!-- <i class="iconfont icon-scan"></i> -->
            </div>
          </li>
          <li>
            <p>{{ $t('tradeLang.lang102') }}</p>
            <div class="input_div flex">
              <input v-model.trim="remark" v-input-line type="text" :placeholder="$t('tradeLang.lang103')">
            </div>
          </li>
        </ol>
        <div class="submit_btn">
          <van-button type="primary" size="large" :disabled="!(remark&&address)" @click="addAddress()">{{ $t('commonLang.lang2') }}</van-button>
        </div>
      </div>
    </van-popup>
    <van-action-sheet v-model="coinSheet" :actions="coinList" :cancel-text="$t('commonLang.lang1')" @select="onSelectCoin" />

  </div>
</template>

<script>
import { toAddressList, addToAddress, removeToAddress } from '@api/wallet'
import { Toast, Dialog } from 'vant'
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      coinData: {},
      coinSheet: false,

      isload: false,
      addressList: [],

      addPopup: false,
      remark: '',
      address: ''
    }
  },
  computed: {
    ...mapGetters({
      coinList: 'withdrawCoinList'
    })
  },
  watch: {
    coinList(data) {
      this.initData(data)
    }
  },
  created() {
    this.$store.dispatch('wallet/getRechargeCoins')
    this.initData(this.coinList)
    this.getAddress()
  },

  methods: {
    initData(data) {
      if (data && data.length) {
        this.coinData = data[0]
      }
    },
    onSelectCoin(data) {
      this.coinData = data
      this.coinSheet = false
    },
    getAddress() {
      this.isload = false
      toAddressList().then(res => {
        this.isload = true
        this.addressList = res.data
      })
    },
    showAddPopup() {
      this.address = ''
      this.remark = ''
      this.pushState('?addPopup')
      this.addPopup = true
    },

    addAddress() {
      addToAddress({
        address: this.address,
        coin: this.coinData.name,
        title: this.remark,
        tag: ''
      }).then(res => {
        Toast(res.msg)
        this.goBack()
        this.getAddress()
      })
    },

    delAddress(data) {
      Dialog.confirm({
        message: this.$t('tradeLang.lang104'),
        confirmButtonText: this.$t('commonLang.lang9'),
        cancelButtonText: this.$t('commonLang.lang1')
      }).then(() => {
        removeToAddress({ id: data.autoid }).then(res => {
          Toast(res.msg)
          this.getAddress()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-add{
  color: var(--icon-color);
}
.address_box{
  margin: 12px;
  padding: 0 12px;
  border-radius: 4px;
  box-shadow: 0px 1px 6px 0px rgba($subBlockColor, 0.16);
  background-color: $blockColor;
  li{
    padding: 12px 0 10px;
    line-height: 20px;
    em{
      color: $subFontColor;
      font-size: 12px;
    }
  }
}
.no_address{
  margin-top: 20vh;
  text-align: center;
  img{
    width: 150px;
    height: 150px;
  }
  p{
    margin: 15px 0;
    color: $subFontColor;
  }
  button{
    padding: 4px 20px;
    line-height: 32px;
    height: 32px;
    border-radius: 50px;
    border: 1px solid $mainColor;
    color: $mainColor;
    background-color: transparent;
  }
}
.choose_box{
  background-color: $blockColor;
  border-bottom: 8px solid $bgColor;
  padding: 12px 15px;
  i{
    font-size: 14px;
    color: $subFontColor;
    margin-left: 5px;
  }
}
.input_box{
  padding: 20px 15px;
  li{
    margin-bottom: 20px;
  }
  p{
    font-size: 12px;
    margin-bottom: 12px;
  }
  .input_div{
    height: 48px;
    padding: 14px 12px 14px 0;
    border: 1px solid $lineColor;
    border-radius: 2px;
    label{
      flex: 1;
      max-width: 70px;
      border-right: 1px solid $lineColor;
      em{
        font-size: 12px;
        margin-left: 3px;
      }
    }
    input{
      flex: 1;
      padding-left: 12px;
      line-height: 20px;
    }
    i{
      font-size: 16px;
      color: $subFontColor;
    }
  }
}
.submit_btn{
  margin: 20px 12px;
}
</style>
