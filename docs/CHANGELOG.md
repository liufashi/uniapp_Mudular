# 变更日志

本文件记录项目版本变更。格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)。

## [Unreleased]

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

[Unreleased]: https://github.com/liufashi/uniapp_Mudular/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/liufashi/uniapp_Mudular/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/liufashi/uniapp_Mudular/releases/tag/v1.0.0
