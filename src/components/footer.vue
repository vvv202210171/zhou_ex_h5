<template>
  <div class="footer_nav">
    <ol class="flex">
      <li :class="[{'active':active==0}]" @click="active=0">
        <div>
          <van-icon size="30px" name="home-o" />
          <p>Home</p>
        </div>
      </li>
      <li :class="[{'active':active==1}]" @click="active=1">
        <div>
          <van-icon size="30px" name="home-o" />
          <p>Home</p>
        </div>
      </li>
      <li :class="[{'active':active==2}]" @click="active=2">
        <div>
          <van-icon size="30px" name="home-o" />
          <p>Home</p>
        </div>
      </li>
      <li :class="[{'active':active==3}]" @click="active=3">
        <div>
          <van-icon size="30px" name="home-o" />
          <p>Home</p>
        </div>
      </li>
      <li :class="[{'active':active==4}]" @click="active=4">
        <div>
          <van-icon size="30px" name="home-o" />
          <p>Home</p>
        </div>
      </li>
      <div class="footer_indicator" :style="'transform:translateX('+active*20+'vw);'" />
    </ol>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.footer_nav{
  position: fixed;
  bottom: 0;
  left: 0;
  height: 50px;
  width: 100%;
  background: #fff;
  // border-radius: 10px 10px 0 0;
  li{
    flex: 1;
    text-align: center;
    z-index: 2;
    div{
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      font-weight: 500;
      i{
        position: relative;
        display: block;
        line-height: 50px;
        text-align: center;
        transition: .3s;
        color: $blockColor;
      }
      p{
        position: absolute;
        transition: .3s;
        opacity: 0;
        font-size: 13px;
        transform: translateY(20px);
        color: $blockColor;
      }
    }
    &.active{
      i{
        transform: translateY(-23px);
        color: #fff;
      }
      p{
        opacity: 1;
        transform: translateY(12px);
      }
    }
  }

  .footer_indicator{
    position: absolute;
    top: -50%;
    margin-left: calc(10% - 25px);
    width: 50px;
    height: 50px;
    background-color: $mainColor;
    border-radius: 50%;
    border: 4px solid $bgColor;
    transition: .3s;
    z-index: 1;
    &::before{
      content: "";
      position: absolute;
      width: 22px;
      height: 22px;
      left: -21.5px;
      top: 50%;
      background-color: transparent;
      border-top-right-radius: 20px;
      box-shadow: 0.5px -10px 0 0 $bgColor;
    }
    &::after{
      content: "";
      position: absolute;
      width: 22px;
      height: 22px;
      right: -21.5px;
      top: 50%;
      background-color: #fff;
      border-top-left-radius: 20px;
      box-shadow: -0.5px -10px 0 0 $bgColor;
    }
  }
}
</style>
