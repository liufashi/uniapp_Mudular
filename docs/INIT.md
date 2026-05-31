# 项目初始化与开发规范

本文档用于新成员上手。日常功能开发流程见 [DEVELOPMENT.md](./DEVELOPMENT.md)，App 打包见 [PACKAGING.md](./PACKAGING.md)，后续改造规划见 [ROADMAP.md](./ROADMAP.md)。

---

## 1. 项目简介

| 项 | 说明 |
|---|---|
| 项目名称 | uniapp_Mudular |
| 类型 | uni-app CLI 项目（Vue 3 + Vite） |
| 支持平台 | iOS、Android、微信小程序、H5 |
| 仓库 | https://github.com/liufashi/uniapp_Mudular |

---

## 2. 环境要求

### 2.1 必装工具

| 工具 | 推荐版本 | 说明 |
|---|---|---|
| Node.js | **18 LTS**（或 20 LTS） | 不要用 v22+ / v26，HBuilderX 兼容性差 |
| npm | 随 Node 自带 | 包管理 |
| Git | 最新稳定版 | 版本管理 |
| HBuilderX | 4.41+ | App 真机/模拟器运行（可选 CLI 纯命令行开发） |

### 2.2 Node.js 配置（macOS + nvm）

本项目使用 **nvm** 管理 Node，HBuilderX 4.41+ 会从 **bash 登录环境** 读取 Node 路径。

```bash
# 安装并切换 Node 18
nvm install 18
nvm alias default 18
nvm use 18

# 验证
node -v   # 应输出 v18.x.x
npm -v
```

若使用 HBuilderX，需确保 `~/.bash_profile` 包含 nvm 路径（已配置可跳过）：

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use default --silent 2>/dev/null
export PATH="$NVM_DIR/versions/node/v18.20.8/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
```

HBuilderX 内 **设置 → node.path** 建议指向：

```
~/.nvm/versions/node/v18.20.8/bin/node
```

---

## 3. 首次初始化

```bash
# 1. 克隆仓库
git clone https://github.com/liufashi/uniapp_Mudular.git
cd uniapp_Mudular

# 2. 切换 Node 版本
nvm use 18

# 3. 安装依赖
npm install

# 4. 验证编译（任选其一）
npm run dev:h5
npm run build:app-ios
```

### HBuilderX 打开项目

1. **文件 → 打开目录**，选择项目根目录（含 `package.json` 的目录）
2. 确认 `src/manifest.json` 中 `"vueVersion": "3"`
3. **运行 → 运行到手机或模拟器** 选择目标平台

> CLI 项目必须在根目录存在完整 `node_modules`，且包含 `@dcloudio/uni-app-plus` 等平台编译包。

---

## 4. 日常开发流程

```
拉代码 → 切分支 → 装依赖 → 本地开发 → 自测 → 提交 → 推送 → 合并
```

### 4.1 标准步骤

```bash
# 更新主分支
git checkout main
git pull origin main

# 新建功能分支（命名见第 8 节）
git checkout -b feat/xxx

# 如有 package.json 变更
npm install

# 启动对应平台开发
npm run dev:h5          # H5，浏览器调试最快
npm run dev:mp-weixin   # 微信小程序
npm run dev:app-ios     # iOS App

# 开发完成后编译验证
npm run build:mp-weixin
npm run build:app-ios
```

### 4.2 平台选择建议

| 场景 | 推荐 |
|---|---|
| 业务逻辑、UI 快速迭代 | H5（`npm run dev:h5`） |
| 小程序特有 API | 微信开发者工具 + `dev:mp-weixin` |
| 原生能力、推送、支付 | HBuilderX 运行到 App 真机/模拟器 |

---

## 5. 目录规范

```
uniapp_Mudular/
├── docs/                   # 项目文档
├── scripts/                # 构建/工具脚本
├── src/
│   ├── pages/              # 页面（按模块分子目录）
│   ├── components/         # 公共组件
│   ├── styles/             # 全局样式、变量
│   ├── static/             # 静态资源（图片、字体等，按需创建）
│   ├── utils/              # 工具函数（按需创建）
│   ├── api/                # 接口封装（按需创建）
│   ├── store/              # 状态管理（按需创建）
│   ├── App.vue
│   ├── main.js
│   ├── manifest.json       # 应用配置、各端权限
│   └── pages.json          # 页面路由、导航栏
├── .hbuilderx/             # HBuilderX 运行配置
├── index.html              # H5 入口
├── vite.config.js
└── package.json
```

### 新增页面 checklist

- [ ] 在 `src/pages/` 下创建页面目录和 `.vue` 文件
- [ ] 在 `src/pages.json` 注册路由
- [ ] 多端差异用条件编译处理
- [ ] 自测目标平台至少一种

### 新增组件 checklist

- [ ] 放 `src/components/`，文件名 **PascalCase**（如 `UserCard.vue`）
- [ ] 声明 `name`，props 写类型和默认值
- [ ] 样式默认 `scoped`，尺寸用 `rpx`

---

## 6. 编码规范

### 6.1 通用

- 使用 **Vue 3 Options API**（与现有代码一致；新模块如需 Composition API 需团队统一后再改）
- 缩进 **2 空格**，字符串优先单引号
- 禁止提交：`node_modules/`、`dist/`、`.env.local`、密钥文件

### 6.2 命名

| 类型 | 规范 | 示例 |
|---|---|---|
| 页面目录 | kebab-case | `pages/user-profile/` |
| 组件文件 | PascalCase | `Header.vue` |
| 变量/函数 | camelCase | `getUserInfo` |
| 常量 | UPPER_SNAKE | `API_BASE_URL` |
| CSS 类名 | kebab-case | `.user-card` |

### 6.3 多端差异（条件编译）

优先用条件编译，避免运行时 `if (uni.getSystemInfoSync().platform)` 判断平台。

```javascript
// #ifdef APP-PLUS
// App 专属逻辑
// #endif

// #ifdef MP-WEIXIN
// 微信小程序专属
// #endif

// #ifndef H5
// 非 H5 端
// #endif
```

```scss
/* #ifdef APP-PLUS */
.header { padding-top: var(--status-bar-height); }
/* #endif */
```

### 6.4 样式

- 全局变量放 `src/styles/uni.scss`
- 布局尺寸用 **rpx**，H5 可配合 `px` 微调
- 组件内样式加 `scoped`，避免污染

### 6.5 接口与配置

- 环境变量分档（已配置，见 `.env.example`）：

| 文件 | 用途 |
|---|---|
| `.env.development` | 本地开发（`npm run dev:*`） |
| `.env.staging` | 预发布构建（`npm run build:*:staging`） |
| `.env.production` | 生产构建（`npm run build:*`） |
| `.env.local` | 个人覆盖，**不提交 Git** |

```bash
# .env.local 示例（覆盖开发环境 API）
VITE_API_BASE=http://192.168.1.100:3000
VITE_MP_WEIXIN_APPID=wx1234567890
```

- 代码中读取：`src/utils/env.js`（`getApiBase()`、`useMock()`、`getAppEnv()`）
- 接口统一放 `src/api/`，不要在页面里散落 `uni.request`

---

## 7. 常用命令

```bash
# 依赖
npm install

# 开发
npm run dev:h5
npm run dev:mp-weixin
npm run dev:app
npm run dev:app-ios
npm run dev:app-android

# 发行构建
npm run build:h5
npm run build:mp-weixin
npm run build:app
npm run build:app-ios
npm run build:app-android

# 小程序辅助脚本（生成 project.config 等）
node scripts/generate-mp-config.js
```

构建产物目录：

| 命令 | 输出 |
|---|---|
| `dev:*` | `dist/dev/` |
| `build:*` | `dist/build/` |

---

## 8. Git 规范

### 8.1 分支命名

| 前缀 | 用途 | 示例 |
|---|---|---|
| `feat/` | 新功能 | `feat/user-login` |
| `fix/` | 修复 | `fix/ios-navbar` |
| `refactor/` | 重构 | `refactor/api-layer` |
| `docs/` | 文档 | `docs/init-guide` |
| `chore/` | 构建/依赖 | `chore/upgrade-deps` |

### 8.2 提交信息（中文）

格式：

```
<类型>: <简要说明>

<可选详细说明>
```

示例：

```
feat: 新增用户登录页

支持手机号验证码登录，兼容 H5 与微信小程序。
```

```
fix: 修复 iOS 模拟器编译缺少依赖的问题
```

类型：`feat` | `fix` | `docs` | `style` | `refactor` | `chore`

### 8.3 合并前检查

- [ ] 本地编译通过（改动涉及的平台）
- [ ] 无调试代码、`console.log` 堆积
- [ ] 无敏感信息
- [ ] 提交信息清晰

---

## 9. 常见问题

### Q: HBuilderX 报「node_modules 缺少编译器模块」

确认 `package.json` 已包含 `@dcloudio/uni-app-plus` 等依赖，执行：

```bash
npm install
```

### Q: HBuilderX 报「请先安装并配置 Node.js 环境变量」

1. 确认 `~/.bash_profile` 已配置 nvm Node 路径
2. HBuilderX 设置中填写 `node.path`
3. 完全退出 HBuilderX 后重开

验证：

```bash
env -i HOME="$HOME" USER="$USER" bash --login -c "node -v && npm -v"
```

### Q: `manifest.json` 中 vueVersion 被改成 2

必须保持 `"vueVersion": "3"`，否则 Vue3 CLI 项目编译失败。

### Q: 升级 @dcloudio 依赖

所有 `@dcloudio/*` 版本号必须保持一致，建议：

```bash
npx @dcloudio/uvm@latest
```

---

## 10. 参考链接

- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [Vue 3 文档](https://cn.vuejs.org/)
- [HBuilderX 环境变量配置](https://hx.dcloud.net.cn/Tutorial/configureEnvironmentVariables)
- [条件编译](https://uniapp.dcloud.net.cn/tutorial/platform.html)

---

**文档维护**：规范随项目演进更新，有重大变更请同步修改本文并通知团队。
