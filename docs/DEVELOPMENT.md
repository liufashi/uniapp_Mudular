# 后续开发流程

本文档描述**功能迭代阶段**的标准开发流程。环境搭建与基础规范见 [INIT.md](./INIT.md)。

---

## 1. 文档关系

| 文档 | 用途 |
|---|---|
| [INIT.md](./INIT.md) | 环境初始化、目录规范、编码约定 |
| **DEVELOPMENT.md**（本文） | 需求开发 → 测试 → 发布 的完整流程 |
| [ROADMAP.md](./ROADMAP.md) | **后续改造方向**（工程化、请求层、UI、多端专项） |
| [CHANGELOG.md](./CHANGELOG.md) | 版本变更记录 |

### 当前已实现（v1.2.0）

| 模块 | 路径 | 说明 |
|---|---|---|
| 网络请求 | `src/api/request.js` | `uni.request` 封装，loading / dedupe / abort |
| 请求拦截 | `src/api/interceptors.js` | Token 注入、401、错误提示、响应解析 |
| 文件上传 | `src/api/upload.js` | `uni.uploadFile` 封装 |
| 错误码 | `src/constants/errorCode.js` | 后端 code → 用户可读文案 |
| 会话管理 | `src/utils/session.js` | 401 清登录态并跳转登录页 |
| 登录拦截 | `src/utils/auth.js` | 需登录页面校验（演示页示例） |
| 用户接口 | `src/api/user.js` | `login`、`getHomeList`（Mock 分页） |
| 用户状态 | `src/store/` | Pinia，`App.vue` 启动时 hydrate |
| 分页列表 | `src/composables/usePagedList.js` | 下拉刷新 / 上拉加载复用 |
| 首页列表 | `pages/index/` | Mock 分页列表 |
| 登录 | `pages/login/` | Mock 账号 `demo` / `123456`，支持 redirect |
| 我的 | `pages/mine/` | 登录态展示、退出 |
| tabBar | `pages.json` | 首页 / 我的 |
| 公共组件 | `src/components/` | EmptyState、ErrorState、Header |
| 设计变量 | `src/styles/variables.scss` | 颜色 / 间距 / 圆角 |

环境变量：按 Vite 规则分档加载（详见 `.env.example`）

| 文件 | 用途 | 何时加载 |
|---|---|---|
| `.env.development` | 本地开发 API、Mock 开关 | `npm run dev:*` |
| `.env.staging` | 预发布 / 测试 API | `npm run build:*:staging` |
| `.env.production` | 生产 API | `npm run build:*` |
| `.env.local` | 个人本地覆盖（不提交） | 始终（优先级最高） |

- `VITE_APP_ENV` — 环境标识：development / staging / production
- `VITE_USE_MOCK=true` — 全局 Mock 模式（development 默认开启）
- `VITE_MOCK_USER` / `VITE_MOCK_HOME` — 按模块 Mock（可选，覆盖全局）
- `VITE_MP_WEIXIN_APPID=` — 微信小程序 appid（`npm run sync:mp-appid` 同步）

工具函数：`src/utils/env.js`（`getAppEnv`、`getApiBase`、`useMock` 等）

路径别名：`@/` 指向 `src/`（已在 `vite.config.js` 配置）

后续改造规划见 **[ROADMAP.md](./ROADMAP.md)**（工程化、请求层增强、UI 体验、多端专项、可选进阶）。

---

## 2. 总体流程

```
需求确认 → 建分支 → 开发 → 自测 → 提交 PR/合并 → 更新 CHANGELOG → 打版本（可选）→ 多端验证
```

---

## 3. 开始一个新功能

### 3.1 需求确认（开发前）

在开始写代码前，明确以下内容：

- [ ] 功能目标与验收标准
- [ ] 涉及平台：H5 / 微信小程序 / iOS / Android
- [ ] 是否涉及原生能力（相机、定位、支付等）
- [ ] 是否需要新增页面、接口、全局状态
- [ ] 是否影响 `manifest.json` 权限或配置

### 3.2 创建分支

```bash
git checkout main
git pull origin main
git checkout -b feat/功能简述
```

分支命名参考 [INIT.md §8](./INIT.md#8-git-规范)。

### 3.3 开发顺序建议

```
1. 数据结构 / 接口定义（src/api/）
2. 页面骨架 + 路由注册（pages.json）
3. 业务逻辑 + UI
4. 多端差异处理（条件编译）
5. 样式适配
6. 自测
```

---

## 4. 功能开发 Checklist

### 4.1 新增页面

```bash
# 示例：新增 about 页面
src/pages/about/about.vue   # 创建页面
```

- [ ] 在 `src/pages.json` 注册路由
- [ ] 设置 `navigationBarTitleText`
- [ ] 页面内跳转使用 `uni.navigateTo` / `uni.redirectTo`
- [ ] 需要 tabBar 时同步修改 `pages.json` 的 `tabBar` 配置

### 4.2 新增公共组件

- [ ] 文件放 `src/components/`，PascalCase 命名
- [ ] props 声明类型与默认值
- [ ] 样式 `scoped`，避免全局污染
- [ ] 在页面中引入并验证

### 4.3 新增接口

建议在 `src/api/` 下按模块组织：

```
src/api/
├── index.js         # 统一导出
├── request.js       # uni.request 封装（showLoading / dedupe）
├── interceptors.js  # 请求/响应拦截
├── upload.js        # uni.uploadFile 封装
├── user.js          # 用户相关接口
└── ...
src/constants/
└── errorCode.js     # 后端错误码映射
```

- [ ] 基础 URL 从 `getApiBase()` 读取
- [ ] 统一错误处理（401、业务错误码、网络异常）
- [ ] 列表接口建议开启 `dedupe: true` 防重复请求
- [ ] 不在页面里直接写裸 `uni.request`

### 4.4 涉及多端差异

| 差异类型 | 处理方式 |
|---|---|
| UI 布局不同 | 条件编译 或 独立样式块 |
| API 不同 | `#ifdef MP-WEIXIN` 等分支 |
| 仅某端支持 | 条件编译 + 其他端降级提示 |
| App 原生能力 | `manifest.json` 配置权限 + App 端条件编译 |

---

## 5. 本地调试

### 5.1 按平台启动

| 平台 | 命令 | 调试工具 |
|---|---|---|
| H5 | `npm run dev:h5` | 浏览器 DevTools |
| 微信小程序 | `npm run dev:mp-weixin` | 微信开发者工具，导入 `dist/dev/mp-weixin` |
| iOS App | `npm run dev:app-ios` | HBuilderX → iOS 模拟器/真机 |
| Android App | `npm run dev:app-android` | HBuilderX → Android 模拟器/真机 |

### 5.2 自测最低要求

功能开发完成后，至少验证：

- [ ] **H5** 能正常访问、核心流程跑通
- [ ] 若改动涉及小程序，**微信开发者工具**验证
- [ ] 若改动涉及 App 原生能力，**HBuilderX 真机或模拟器**验证
- [ ] 无控制台报错、无白屏
- [ ] 页面跳转、返回逻辑正确

### 5.3 发行构建验证（合并前）

```bash
npm run build:h5
npm run build:mp-weixin    # 小程序改动时
npm run build:app-ios       # App 改动时
```

确认 `dist/build/` 下产物正常，无编译报错。

---

## 6. 提交与合并

### 6.1 提交前检查

- [ ] `git status` 无多余文件（`dist/`、`node_modules/` 不应出现）
- [ ] 移除调试代码、`console.log`、临时文案
- [ ] 提交信息符合规范（中文，见 INIT.md）

### 6.2 提交示例

```bash
git add .
git commit -m "$(cat <<'EOF'
feat: 新增关于我们页面

添加 about 页面及路由，支持 H5 与微信小程序展示。
EOF
)"
git push -u origin feat/功能简述
```

### 6.3 合并到 main

当前为个人/小团队仓库，可直接合并；若后续引入 Code Review：

1. 推送分支到远程
2. 创建 Pull Request
3. 自测通过后合并 `main`
4. 删除已合并的功能分支

```bash
git checkout main
git pull origin main
git merge feat/功能简述
git push origin main
```

---

## 7. 版本与变更记录

### 7.1 更新 CHANGELOG

每次合并有意义的功能或修复后，更新 [CHANGELOG.md](./CHANGELOG.md)：

```markdown
## [Unreleased]

### 新增
- 关于我们页面

### 修复
- iOS 导航栏高度适配
```

### 7.2 版本号规则

`src/manifest.json` 中：

- `versionName`：语义化版本，如 `1.1.0`
- `versionCode`：整数递增，如 `110`

| 变更类型 | versionName | versionCode |
|---|---|---|
| 小功能、修复 | 1.0.0 → 1.0.1 | +1 |
| 新模块 | 1.0.1 → 1.1.0 | +10 |
| 大版本 | 1.1.0 → 2.0.0 | +100 |

发版时在 CHANGELOG 中将 `[Unreleased]` 改为具体版本号与日期。

---

## 8. 多端发布流程

### 8.1 H5

```bash
npm run build:h5
# 产物：dist/build/h5/
# 部署到 Web 服务器或 CDN
```

### 8.2 微信小程序

```bash
npm run build:mp-weixin
# 产物：dist/build/mp-weixin/
# 微信开发者工具 → 上传 → 提交审核
```

注意：正式发布前在 `src/manifest.json` 的 `mp-weixin.appid` 填写正式 AppID。

### 8.3 App（iOS / Android）

```bash
npm run build:app
# 产物：dist/build/app/
```

1. HBuilderX 导入 `dist/build/app` 或使用云打包
2. 配置证书、签名
3. 提交 App Store / 应用市场上架

---

## 9. 开发记录模板

可在 CHANGELOG 或 Issue 中记录进行中的工作：

```markdown
## 进行中：用户登录模块

- **负责人**：
- **分支**：feat/user-login
- **目标平台**：H5、微信小程序
- **进度**：
  - [x] 登录页 UI
  - [x] 验证码接口对接
  - [ ] 微信授权登录
  - [ ] App 端测试
- **阻塞项**：无
- **预计完成**：
```

---

## 10. 常见开发场景速查

| 场景 | 操作 |
|---|---|
| 加新页面 | 建 `.vue` → 注册 `pages.json` → 自测 H5 |
| 调接口 | 建 `src/api/xxx.js` → 页面调用 → 处理 loading/错误 |
| 加全局样式 | 改 `src/styles/uni.scss` |
| 加 App 权限 | 改 `src/manifest.json` → App 端重编译 |
| 小程序配置 | `node scripts/generate-mp-config.js` |
| 升级 uni 依赖 | `npx @dcloudio/uvm@latest`，所有 `@dcloudio/*` 版本保持一致 |
| 编译报错缺模块 | `npm install`，确认 `@dcloudio/uni-app-plus` 等存在 |

---

## 11. 流程图

```
┌─────────────┐
│  需求确认    │
└──────┬──────┘
       ▼
┌─────────────┐
│  feat/ 分支  │
└──────┬──────┘
       ▼
┌─────────────┐     ┌──────────────┐
│  编码实现    │────▶│  H5 快速调试  │
└──────┬──────┘     └──────────────┘
       ▼
┌─────────────┐
│  多端自测    │（小程序 / App 按需）
└──────┬──────┘
       ▼
┌─────────────┐
│ build 验证   │
└──────┬──────┘
       ▼
┌─────────────┐
│ commit/push  │
└──────┬──────┘
       ▼
┌─────────────┐
│ 更新 CHANGELOG│
└──────┬──────┘
       ▼
┌─────────────┐
│  合并 main   │
└──────┬──────┘
       ▼
┌─────────────┐
│  多端发布    │（按平台）
└─────────────┘
```

---

**维护说明**：流程随项目成熟度调整，有重大变更请同步更新本文与 INIT.md。
