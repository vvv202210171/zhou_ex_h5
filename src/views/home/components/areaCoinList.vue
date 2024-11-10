<template>
  <div class="area_coin_list">
    <ol class="list_header">
      <li>{{ $t('tradeLang.lang3') }}</li>
      <li>{{ $t('tradeLang.lang4') }}</li>
      <!-- <li class="li_center">{{$t('tradeLang.lang5')}}</li> -->
      <li v-if="type!='amount'" class="li_center">{{ $t('tradeLang.lang5') }}</li>
      <li v-else class="li_center">{{ $t('tradeLang.lang274') }}</li>
    </ol>
    <ul v-for="(item,index) in coinList" :key="index" class="list_box" @click="goDetails(item)">
      <li>
        <p>{{ item.tradcoin }} <i> /{{ item.maincoin }}</i></p>
        <label>24H {{ item.volume }}</label>
      </li>
      <li>
        <span>{{ item.price }}</span>
        <label>≈ {{ rateData.symbol }}{{ (item.price*rateData.price)|mathFloor(item.price_accuracy) }}</label>
      </li>
      <li v-if="type!='amount'"><section :class="[item.rise>=0?'rise_green':'rise_red','text_hide']"><em v-if="item.rise>0">+</em>{{ item.rise }}%</section></li>
      <li v-else><div>{{ item.volume }}</div></li>
    </ul>
    <div class="no_data">
      <p class="icon_no_data" />
      <span>{{ $t('commonLang.lang4') }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      rateData: state => state.wallet.rateData
    })
  },
  props: [
    'type',
    'coinList'
  ],
  methods: {
    goDetails(data) {
      sessionStorage.setItem('marketDetails', JSON.stringify(data))
      const type = this.type == 'contract' ? 'contract' : 'trad'
      this.pushPath('/marketDetails/' + type)
    }
  }
}
</script>

<style lang='scss' scoped>
.area_coin_list{
  min-height: 300px;
}
.list_header{
  display: flex;
  align-items: center;
  padding: 10px 15px 5px;
  font-size: 10px;
  color: $subFontColor;
  li{
    flex: 1;
    &:nth-child(3){
      text-align: right;
      max-width: 80px;
    }
  }
  .li_center{
    text-align: center!important;
  }
}
.list_box{
  padding: 10px 15px;
  display: flex;
  align-items: center;
  font-weight: 600;
  border-bottom: 1px solid var(--list-border-color);
  li{
    flex: 1;
    line-height: 20px;
    &:nth-child(3){
      text-align: right;
      max-width: 85px;
    }
    p{
      display: flex;
      align-items: center;
      img{
        width: 20px;
        margin-right: 5px;
      }
      i{
        margin-left: 2px;
        font-size: 10px;
        line-height: 12px;
        font-weight: normal;
      }
    }
    label{
      display: block;
      font-size: 10px;
      color: $subFontColor;
      font-weight: normal;
    }
    section{
      font-weight: normal;
      flex: 1;
      height: 35px;
      line-height: 36px;
      width: 85px;
      border-radius: 5px;
      text-align: center;
    }
    div{
      font-weight: 600;
      flex: 1;
      max-width: 85px;
      line-height: 20px;
      padding: 5px 0;
      font-size: 12px;
      color: $mainColor;
      // background-color: rgba($mainColor,.02);
      border-radius: 4px;
      text-align: center;
    }
  }
  &+div{
    display: none;
  }
}

.rise_red{
  background-color: rgba($redColor,.1);
  color: $redColor;
}
.rise_green{
  background-color: rgba($greenColor,.1);
  color: $greenColor;
}
</style>
