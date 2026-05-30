# 变更日志

本文件记录项目版本变更。格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)。

## [Unreleased]

---

## [1.2.0] - 2026-05-30

### 新增
- 登录拦截 `src/utils/auth.js` + 需登录页面配置 `src/config/auth.js`
- 401 会话过期处理 `src/utils/session.js`（与 Pinia 联动并跳转登录）
- 分页列表 composable `src/composables/usePagedList.js`
- 空态 / 错误态组件 `EmptyState.vue`、`ErrorState.vue`
- 设计变量 `src/styles/variables.scss`
- 路径别名 `@/` → `src/`
- 微信 appid 同步脚本 `scripts/sync-mp-appid.js`
- tabBar 图标生成脚本 `scripts/generate-tab-icons.js`

### 变更
- `App.vue` 启动时统一 `hydrate` 登录态
- 首页重构为 `usePagedList` + 公共状态组件
- 登录页支持 `redirect` 回跳；演示页需登录访问
- 版本号统一为 1.2.0（package.json / manifest.json）

---

## [1.1.0] - 2026-05-30

### 新增
- 网络请求层 `src/api/request.js`（Token、统一错误处理）
- Pinia 用户状态 `src/store/`
- 登录页、我的页、首页列表（Mock 数据）
- tabBar 双 Tab 导航（首页 / 我的）
- `.env.example` 环境变量模板

### 变更
- 首页改造为可下拉刷新的列表模块
- README 补充当前目录结构与 Mock 开发说明

---

## [1.0.0] - 2026-05-30

### 新增
- uni-app Vue3 + Vite 多端项目骨架
- 首页、演示页基础页面
- Header 公共组件
- 支持 iOS、Android、微信小程序、H5 编译命令

[Unreleased]: https://github.com/liufashi/uniapp_Mudular/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/liufashi/uniapp_Mudular/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/liufashi/uniapp_Mudular/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/liufashi/uniapp_Mudular/releases/tag/v1.0.0
