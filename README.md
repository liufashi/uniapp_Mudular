# uniapp_Mudular

基于 uni-app 框架的多端开发项目，支持 iOS、Android、微信小程序、H5 等平台。

## 技术栈

- uni-app (Vue 3 + Vite)
- Vue.js 3
- SCSS

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
├── src/
│   ├── pages/              # 页面目录
│   │   ├── index/          # 首页
│   │   └── demo/           # 演示页
│   ├── components/         # 公共组件
│   ├── styles/             # 全局样式
│   ├── App.vue            # 应用入口
│   ├── main.js            # 主入口
│   ├── manifest.json      # 应用配置（多端差异）
│   └── pages.json         # 路由配置
├── index.html             # H5 入口
├── vite.config.js
└── package.json
```

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