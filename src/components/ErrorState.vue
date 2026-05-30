<template>
  <view class="error-state" @tap="$emit('retry')">
    <text class="error-state__text">{{ message }}</text>
    <text v-if="showRetry" class="error-state__action">{{ retryText }}</text>
  </view>
</template>

<script>
export default {
  name: 'ErrorState',
  props: {
    message: {
      type: String,
      default: '加载失败'
    },
    showRetry: {
      type: Boolean,
      default: true
    },
    retryText: {
      type: String,
      default: '点击重试'
    }
  },
  emits: ['retry']
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.error-state {
  text-align: center;
  padding: 80rpx $spacing-lg;
}

.error-state__text {
  display: block;
  font-size: $font-size-md;
  color: $error-color;
}

.error-state__action {
  display: block;
  margin-top: $spacing-sm;
  font-size: $font-size-sm;
  color: $primary-color;
}
</style>
