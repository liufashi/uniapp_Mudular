# uniapp_Mudular

基于 uni-app 框架的多端开发项目，支持 iOS、Android、微信小程序、H5 等平台。

> **文档索引**
> - [docs/INIT.md](./docs/INIT.md) — 环境初始化、目录规范、编码约定
> - [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) — 后续功能开发流程
> - [docs/ROADMAP.md](./docs/ROADMAP.md) — **后续改造方向**（工程化 / 请求层 / UI / 多端）
> - [docs/CHANGELOG.md](./docs/CHANGELOG.md) — 版本变更记录

## 技术栈

- uni-app (Vue 3 + Vite)
- Vue.js 3
- Pinia
- SCSS

## 环境配置

项目按 **development / staging / production** 三档加载环境变量（Vite 标准）：

| 环境 | 文件 | 命令示例 |
|---|---|---|
| 开发 | `.env.development` | `npm run dev:h5` |
| 预发布 | `.env.staging` | `npm run build:h5:staging` |
| 生产 | `.env.production` | `npm run build:h5` |

个人本地覆盖（不提交 Git）：创建 `.env.local`

```bash
# 查看变量说明
cat .env.example

# 本地覆盖示例（可选）
# echo 'VITE_API_BASE=http://192.168.1.100:3000' >> .env.local
```

## 编译命令

```bash
# 安装依赖
npm install

# 微信小程序
npm run dev:mp-weixin    # 开发模式
npm run build:mp-weixin  # 发行模式

# H5
npm run dev:h5           # 开发模式
npm run build:h5        # 发行模式

# App（iOS + Android）
npm run dev:app          # 开发模式
npm run build:app        # 发行模式

# Android 单独编译
npm run dev:app-android
npm run build:app-android

# iOS 单独编译
npm run dev:app-ios
npm run build:app-ios
```

## 项目结构

```
uniapp_Mudular/
├── docs/                   # 项目文档
├── scripts/                # 工具脚本
├── src/
│   ├── api/                # 接口封装（request.js、user.js）
│   ├── store/              # Pinia 状态（用户登录）
│   ├── utils/              # 工具函数（env 等）
│   ├── pages/              # 页面（index、mine、login、demo）
│   ├── components/         # 公共组件
│   ├── static/             # 静态资源（tabBar 图标等）
│   ├── styles/             # 全局样式
│   ├── App.vue
│   ├── main.js
│   ├── manifest.json
│   └── pages.json          # 路由 + tabBar
├── .env.example            # 环境变量模板
├── .hbuilderx/             # HBuilderX 运行配置
├── index.html
├── vite.config.js
└── package.json
```

## 当前功能（v1.2.0）

- 首页分页列表（Mock，下拉刷新 + 上拉加载）
- 登录 / 我的（Pinia 状态，Mock 登录：`demo` / `123456`）
- 登录拦截 + 401 自动跳转登录
- tabBar：首页、我的（81×81 图标，可 `npm run generate:tab-icons` 重新生成）

## 多端差异处理

使用条件编译处理平台差异：

```javascript
// #ifdef APP-PLUS
// 仅 App 端编译
// #endif

// #ifdef MP-WEIXIN
// 仅微信小程序编译
// #endif

// #ifndef H5
// 非 H5 端编译
// #endif
```

```css
/* #ifdef APP-PLUS */
.body { padding-top: 100px; }
/* #endif */
```

## 学习资源

- [uni-app 官方文档](https://uniapp.dcloud.io/)
- [uni-app 中文网](https://uniapp.dcloud.net.cn/)