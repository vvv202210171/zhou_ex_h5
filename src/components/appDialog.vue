<template>
  <van-popup v-model="dialogPopup" position="bottom" :close-on-click-overlay="false" class="model_popup" @click-overlay="changeDialog()">
    <div class="tip_box">
      <h3 v-if="title">{{ title }}</h3>
      <p v-if="text">{{ text }}</p>
      <slot name="dialogTmp" />
      <div class="model_popup_btn flex">
        <van-button @click="cancelAction()">{{ cancelText }}</van-button>
        <van-button @click="confirmAction()">{{ confirmText }}</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
import i18n from '@/i18n'
export default {
  name: 'AppDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: i18n.t('commonLang.lang3')
    },
    cancelText: {
      type: String,
      default: i18n.t('commonLang.lang1')
    },
    dialogPopup: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'dialogPopup',
    event: 'changeDialogPopup'
  },

  watch: {
    active() {
      setTimeout(() => {
        this.setLine()
      }, 0)
    }
  },

  mounted() {},

  methods: {
    changeDialog() {
      this.$emit('changeDialogPopup', false)
    },
    cancelAction() {
      this.changeDialog()
      this.$emit('cancelAction')
    },
    confirmAction() {
      this.$emit('confirmAction')
    }
  }
}
</script>

<style lang="scss" scoped>
.tip_box{
  padding: 30px 28px 28px;
  text-align: center;
  h3{
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }
  p{
    font-size: 13px;
    color: #7D7E86;
    margin-top: 10px;
    margin-bottom: 30px;
  }
}

</style>
