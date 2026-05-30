<template>
  <view class="empty-state">
    <text class="empty-state__text">{{ text }}</text>
    <text v-if="hint" class="empty-state__hint">{{ hint }}</text>
  </view>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    text: {
      type: String,
      default: '暂无数据'
    },
    hint: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.empty-state {
  text-align: center;
  padding: 80rpx $spacing-lg;
}

.empty-state__text {
  display: block;
  font-size: $font-size-md;
  color: $text-color-lighter;
}

.empty-state__hint {
  display: block;
  margin-top: $spacing-sm;
  font-size: $font-size-sm;
  color: $text-color-lighter;
}
</style>
