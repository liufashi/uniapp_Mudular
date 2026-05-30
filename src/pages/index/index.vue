<template>
  <view class="page">
    <view class="hero">
      <text class="title">首页列表</text>
      <text class="subtitle">下拉刷新 · 上拉或点击加载更多</text>
      <!-- #ifdef H5 -->
      <text class="action-link" @tap="handleRefresh">点击刷新</text>
      <!-- #endif -->
    </view>

    <view v-if="loading && !list.length" class="state">加载中...</view>
    <view v-else-if="error && !list.length" class="state error" @tap="reload">
      {{ error }}，点击重试
    </view>
    <view v-else class="list">
      <view v-for="item in list" :key="item.id" class="card">
        <text class="card-title">{{ item.title }}</text>
        <text class="card-desc">{{ item.desc }}</text>
      </view>

      <view class="footer" @tap="loadMore">
        <text v-if="loadingMore" class="footer-text">加载中...</text>
        <text v-else-if="finished" class="footer-text">没有更多了</text>
        <text v-else class="footer-text footer-link">上拉或点击加载更多</text>
      </view>

      <view v-if="!finished" class="load-sentinel" />
    </view>
  </view>
</template>

<script>
import { getHomeList } from '../../api/user'

const PAGE_SIZE = 5

export default {
  data() {
    return {
      list: [],
      page: 1,
      loading: false,
      loadingMore: false,
      finished: false,
      error: ''
    }
  },
  onLoad() {
    this.reload()
  },
  onReady() {
    this.setupLoadObserver()
  },
  onUnload() {
    this.teardownLoadObserver()
  },
  onPullDownRefresh() {
    this.handleRefresh()
  },
  onReachBottom() {
    this.loadMore()
  },
  methods: {
    async reload() {
      this.page = 1
      this.finished = false
      this.error = ''
      await this.fetchList({ reset: true })
    },
    async handleRefresh() {
      if (this.loading || this.loadingMore) return
      try {
        await this.reload()
        uni.showToast({ title: '已刷新', icon: 'none', duration: 1200 })
      } finally {
        uni.stopPullDownRefresh()
      }
    },
    async loadMore() {
      if (this.loading || this.loadingMore || this.finished) return
      this.page += 1
      await this.fetchList({ reset: false })
    },
    async fetchList({ reset }) {
      if (reset) {
        this.loading = true
      } else {
        this.loadingMore = true
      }

      try {
        const data = await getHomeList({
          page: this.page,
          pageSize: PAGE_SIZE
        })
        const nextList = data.list || []
        this.list = reset ? nextList : this.list.concat(nextList)
        this.finished = data.hasMore === false || nextList.length === 0
        if (reset) {
          this.error = ''
        }
        await this.$nextTick()
        this.tryFillScreen()
        this.setupLoadObserver()
      } catch (error) {
        if (!reset) {
          this.page -= 1
        }
        const message = error.message || '加载失败'
        if (reset) {
          this.error = message
        } else {
          uni.showToast({ title: message, icon: 'none' })
        }
      } finally {
        this.loading = false
        this.loadingMore = false
      }
    },
    setupLoadObserver() {
      if (this.finished || this.loading || this.loadingMore) return

      this.teardownLoadObserver()
      this._loadObserver = uni.createIntersectionObserver(this, {
        observeAll: false
      })
      this._loadObserver
        .relativeToViewport({ bottom: 80 })
        .observe('.load-sentinel', (res) => {
          if (res.intersectionRatio > 0) {
            this.loadMore()
          }
        })
    },
    teardownLoadObserver() {
      if (this._loadObserver) {
        this._loadObserver.disconnect()
        this._loadObserver = null
      }
    },
    tryFillScreen() {
      if (this.finished || this.loading || this.loadingMore) return

      const query = uni.createSelectorQuery().in(this)
      query.select('.page').boundingClientRect()
      query.exec((res) => {
        const pageRect = res[0]
        if (!pageRect) return
        const { windowHeight } = uni.getSystemInfoSync()
        if (pageRect.height <= windowHeight + 20) {
          this.loadMore()
        }
      })
    }
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  background: #f8f8f8;
  box-sizing: border-box;
}

.hero {
  padding: 24rpx 24rpx 16rpx;
  box-sizing: border-box;
}

.title {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.subtitle {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.action-link {
  display: inline-block;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #007aff;
}

.state {
  text-align: center;
  padding: 80rpx 0;
  color: #999;
  font-size: 28rpx;
}

.state.error {
  color: #ff3b30;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx;
}

.card-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.card-desc {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.footer {
  padding: 32rpx 0 16rpx;
  text-align: center;
}

.footer-text {
  font-size: 24rpx;
  color: #999;
}

.footer-link {
  color: #007aff;
}

.load-sentinel {
  height: 2px;
}
</style>
