# 后续改造方向

本文档记录**基础框架完善**的后续规划，供版本迭代时按需选取。  
当前基线版本：**v1.2.0**（已实现项见 [DEVELOPMENT.md §1](./DEVELOPMENT.md#1-文档关系)）。

状态说明：`✅ 已完成` · `⬜ 待做` · `🔶 可选`

---

## 一、v1.2.0 已落地（基线）

以下能力已在 v1.2.0 实现，后续迭代在此基础上扩展：

| 项 | 状态 | 说明 |
|---|---|---|
| 登录拦截 + 401 联动 | ✅ | `src/utils/auth.js`、`src/utils/session.js` |
| App 启动 hydrate | ✅ | `App.vue` onLaunch |
| 分页列表复用 | ✅ | `src/composables/usePagedList.js` |
| 空态 / 错误态组件 | ✅ | `EmptyState.vue`、`ErrorState.vue` |
| 设计变量 | ✅ | `src/styles/variables.scss` |
| 路径别名 `@/` | ✅ | `vite.config.js` |
| 版本号对齐 | ✅ | `package.json` / `manifest.json` 均为 1.2.0 |
| tabBar 图标脚本 | ✅ | `npm run generate:tab-icons` |
| 微信 appid 同步 | ✅ | `npm run sync:mp-appid` |

---

## 二、工程化与规范（团队协作向）

| 项 | 状态 | 说明 |
|---|---|---|
| ESLint + Prettier | ⬜ | 统一 Vue/JS 风格，减少 PR 格式争议 |
| 路径别名 `@/` | ✅ | 已在 `vite.config.js` 配置 `@` → `src/` |
| 环境分档 | ✅ | `.env.development` / `.env.staging` / `.env.production` |
| 版本号对齐 | ✅ | 发版时同步 `package.json`、`manifest.json`、`CHANGELOG.md` |
| Git hooks | ⬜ | `husky` + `lint-staged`，提交前自动 lint |

**建议优先级：** 环境分档 → ESLint/Prettier → Git hooks

**环境分档（已实现）：**

```bash
.env.development    # npm run dev:*        → api.dev.example.com, MOCK=true
.env.staging        # npm run build:*:staging → api.staging.example.com
.env.production     # npm run build:*      → api.example.com, MOCK=false
.env.local          # 个人覆盖（gitignore）
```

---

## 三、请求层增强（接后端前准备好）

目标目录结构：

```
src/api/
├── request.js       # uni.request 封装（loading / dedupe / abort）
├── interceptors.js  # 请求/响应拦截
├── upload.js        # uni.uploadFile 封装
├── user.js
└── index.js         # 统一导出
```

| 项 | 状态 | 说明 |
|---|---|---|
| 请求 loading | ✅ | `showLoading` / `loadingText` 参数 |
| 请求取消 / 防重复 | ✅ | `dedupe`、`requestKey`、`abortRequest()` |
| 上传封装 | ✅ | `src/api/upload.js`（`uploadAvatar` 示例） |
| 错误码映射 | ✅ | `src/constants/errorCode.js` |
| Mock 开关细化 | ✅ | `useMockModule('user'|'home')` + `VITE_MOCK_*` |
| 拦截器拆分 | ✅ | `src/api/interceptors.js` |

**Mock 细化 env 示例：**

```bash
VITE_MOCK_USER=true
VITE_MOCK_HOME=false
```

---

## 四、UI / 体验基础

| 项 | 状态 | 说明 |
|---|---|---|
| 设计变量 | ✅ | `src/styles/variables.scss`（主色、间距、圆角） |
| 空态 / 错误态组件 | ✅ | `EmptyState.vue`、`ErrorState.vue` |
| 安全区适配 | ⬜ | 底部 tabBar + iPhone 刘海，统一 `safe-area-inset` 工具类 |
| UI 组件库 | 🔶 | [uni-ui](https://uniapp.dcloud.net.cn/component/uniui/uni-ui.html) 或 uView Plus，表单/弹窗/加载更快 |
| 骨架屏 | ⬜ | 首页首屏 loading 换成 skeleton，体验更稳 |

**安全区工具类示例（待加）：**

```scss
// src/styles/safe-area.scss
.safe-bottom {
  padding-bottom: calc(#{$spacing-sm} + env(safe-area-inset-bottom));
}
```

---

## 五、小程序 / App 专项

| 平台 | 状态 | 待完善 |
|---|---|---|
| 微信小程序 | ⬜ | 隐私协议弹窗、用户信息授权流程、分享 `onShareAppMessage` 模板 |
| H5 | 🔶 | 微信内打开时的 OAuth（若需要）；`manifest.h5.router` 是否改 `history`（部署到子路径时） |
| App | ⬜ | 启动页、更新检查、推送占位、权限申请说明文案 |
| 条件编译示例 | ⬜ | 在 demo 页或 docs 放 `#ifdef MP-WEIXIN` 示例，方便后续复制 |

**微信小程序 appid：** 在 `.env.local` 填写 `VITE_MP_WEIXIN_APPID`，运行 `npm run sync:mp-appid` 同步到 `manifest.json`。

---

## 六、可选进阶（业务起来后再加）

| 项 | 状态 | 说明 |
|---|---|---|
| 分包加载 | 🔶 | 页面多了以后在 `pages.json` 配 `subPackages` |
| 日志上报 | 🔶 | `src/utils/logger.js`，生产环境错误上报 Sentry/自建 |
| 国际化 i18n | 🔶 | 有多语言需求再上 `@dcloudio/uni-i18n` |
| 单元测试 | 🔶 | Vitest + 对 `request.js`、`buildMockList` 等纯函数测 |
| CI | ⬜ | GitHub Actions 跑 `build:h5` + `build:mp-weixin`，防编译回归 |

**CI 最小示例（待加 `.github/workflows/build.yml`）：**

```yaml
# push / PR 时执行
npm ci
npm run build:h5
npm run build:mp-weixin
```

---

## 七、建议版本规划

| 版本 | 主题 | 主要项 |
|---|---|---|
| **v1.3.0** | 工程化 | ESLint/Prettier、~~环境分档~~、Git hooks、CI |
| **v1.4.0** | ~~请求层~~ | loading、上传、错误码、Mock 细化、拦截器 |
| **v1.5.0** | 体验 | 安全区、骨架屏、（可选）uni-ui |
| **v2.0.0** | 平台专项 | 小程序隐私/分享、App 启动更新、分包 |

以上版本号为建议，实际按业务优先级调整。

---

## 八、选取改造项时的 Checklist

开始某一项前，确认：

- [ ] 是否影响多端（H5 / 小程序 / App）
- [ ] 是否需要更新 `.env.example` 与文档
- [ ] 合并后是否更新 [CHANGELOG.md](./CHANGELOG.md)
- [ ] 是否需要在 [DEVELOPMENT.md](./DEVELOPMENT.md) §1「当前已实现」同步状态

---

**维护说明**：完成某项后，将本文对应条目改为 ✅，并在 CHANGELOG 中记录；重大架构变更同步更新 DEVELOPMENT.md。
