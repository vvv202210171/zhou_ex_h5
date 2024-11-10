<template>
  <div>
    <nav-header :title="$t('accountLang.lang138')" />
    <div class="main_content">
      <div class="logo_box">
        <img src="@img/my/logo.png" alt="">
        <h3 class="main_color">{{$t('accountLang.lang139')}}</h3>
        <span class="sub_font">version:1.{{appVersion}}</span>
      </div>

      <ol class="about_info">
        <li>
          <!-- <h3>{{$t('accountLang.lang138')}}</h3> -->
          <p>{{$t('accountLang.lang153')}}</p>
        </li>
        <li>
          <!-- <h3>{{$t('accountLang.lang154')}}</h3> -->
          <p>{{$t('accountLang.lang155')}}</p>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
export default {
  computed: {
    ...mapState({
      usInfo:state => state.common.usInfo
    }),
  },
  created(){
    this.$store.dispatch('common/getUsInfo')
  },
}
</script>

<style lang="scss" scoped>
.logo_box{
  padding: 70px 0 50px;
  text-align: center;
  img{
    width: 60px;
    margin: auto;
  }
  h3{
    margin: 10px 0;
  }
}
.about_info{
  padding: 0 15px;
  li{
    margin-bottom: 15px;
    h3{
      text-align: center;
    }
    p{
      margin-top: 10px;
      color: $subFontColor;
      line-height: 20px;
      text-indent: 2em;
    }
  }
}
</style>