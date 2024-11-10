<template>
  <div>
    <nav-header :title="$t('accountLang.lang52')" />
    <div class="main_content main_bg">
      <ol class="menu_box">
        <li class="flex_between" @click="pushPath('/modifyLoginPass')">
          <p>{{$t('accountLang.lang53')}}</p>
          <label class="flex"><span>{{$t('accountLang.lang55')}}</span><i class="iconfont icon-arrow-right"></i></label>
        </li>
        <li class="flex_between" @click="pushPath('/modifyPayPass')">
          <p>{{$t('accountLang.lang54')}}</p>
          <label class="flex">
            <span v-if="userInfo.tradpasswordstate!='true'">{{$t('accountLang.lang56')}}</span>
            <span v-else>{{$t('accountLang.lang55')}}</span>
            <i class="iconfont icon-arrow-right"></i>
          </label>
        </li>
      </ol>

      <ol class="menu_box">
        <li class="flex_between" @click="pushPath('/bindPhone')">
          <p>{{$t('accountLang.lang5')}}</p>
          <label class="flex">
            <span>{{userInfo.tel||$t('accountLang.lang73')}}</span>
            <i class="iconfont icon-arrow-right"></i>
          </label>
        </li>
        <li class="flex_between" @click="pushPath('/bindEmail')">
          <p>{{$t('accountLang.lang7')}}</p>
          <label class="flex">
            <span>{{userInfo.email||$t('accountLang.lang73')}}</span>
            <i class="iconfont icon-arrow-right"></i>
          </label>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      userInfo:state => state.user.userInfo
    }),
  },
}
</script>

<style lang="scss" scoped>
.menu_box{
  background-color: var(--inputBox-bgColor);
  margin-top: 10px;
  padding: 0 12px;
  li{
    padding: 15px 0;
    line-height: 20px;
    border-bottom: 1px solid $bgColor;
    &:last-child{
      border-bottom: none;
    }
    label{
      color: $subFontColor;
    }
    i{
      font-size: 14px;
      margin-left: 5px;
    }
  }
}
</style>