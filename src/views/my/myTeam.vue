<template>
  <div>
    <nav-header :title="$t('accountLang.lang86')" />
    <div class="main_content block_bg">
      <ol class="team_top flex">
        <li>
          <h3>{{invitedData.indirect_people||0}}</h3>
          <span>{{$t('accountLang.lang87')}}</span>
        </li>
        <li>
          <h3>{{invitedData.direct_people||0}}</h3>
          <span>{{$t('accountLang.lang88')}}</span>
        </li>
      </ol>
      <div class="title_box">{{$t('accountLang.lang89')}}</div>
      <van-list v-model="loading" :finished="finished" @load="loadMore">
        <ol class="record_box">
          <li class="flex_between" v-for="item in recordList" :key="item.member">
            <p>{{item.member}}</p>
            <em class="sub_font">{{item.wdate}}</em>
          </li>
        </ol>
      </van-list>
      <div class="no_data" v-show="isload&&recordList.length==0">
        <i class="icon_no_data"></i>
        <span>{{$t('commonLang.lang4')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {getMyTeam} from "@api/user"
export default {
  data(){
    return{
      recordList:[],
      searchData:{
        page:0,
        limit:30
      },
      isload:false,
      loading: false,
      finished: true,
    }
  },
  computed: {
    ...mapState({
      invitedData:state => state.user.invitedData,
      headerHeight:state => state.common.headerHeight,
    }),
  },

  created(){
    this.$store.dispatch('user/getInvitedData')
    this.getTeamRecord();
  },

  mounted(){
    this.teamTab = this.$refs.teamTab;
    setTimeout(()=>{
      this.isSticky = true;
    },500)
  },

  methods:{
    getTeamRecord(){
      this.isload = false;
      this.searchData.page = 0;
      this.loadMore()
    },
    loadMore(){
      this.searchData.page+=1;
      getMyTeam(this.searchData).then(res=>{
        this.isload = true;
        this.loading = false;
        if(res.data&&res.data.length){
          this.recordList = this.searchData.page==1?res.data:[...this.recordList,...res.data]
        }else{
          this.recordList = [];
        }
        this.finished = res.count == this.recordList.length;
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.title_box{
  padding: 20px 15px 10px;
  font-size: 15px;
  font-weight: 600;
}
.team_top{
  background: $mainColor;
  color: $bgColor;
  margin: 12px 15px;
  padding: 20px 15px;
  border-radius: 4px;
  li{
    flex: 1;
    &:last-child{
      text-align: right;
    }
    h3{
      font-size: 18px;
      margin-bottom: 5px;
      line-height: 22px;
    }
    span{
      font-size: 12px;
      line-height: 20px;
    }
  }
  i{
    flex: 1;
    min-width: 1px;
    max-width: 1px;
    background-color: rgba($bgColor,.08);
    height: 40px;
  }
}
.tr_box{
  background-color: $bgColor;
  padding: 8px 15px 5px;
  line-height: 20px;
  font-size: 12px;
  color: $subFontColor;
}
.record_box{
  padding: 0 15px;
  line-height: 20px;
  li{
    padding: 15px 0 12px;
    border-bottom: 1px solid $bgColor;
    div{
      margin-bottom: 4px;
    }
  }
}
</style>