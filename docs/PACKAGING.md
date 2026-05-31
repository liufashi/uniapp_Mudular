# App 打包指南（APK / IPA）

本文说明 **uniapp_Mudular** 如何生成可安装的 **Android APK** 与 **iOS IPA**。

> CLI 项目**不能**直接在 Xcode / Android Studio 打开仓库编译；需先 CLI 编译资源，再用 **HBuilderX 云打包**（或离线 SDK）生成安装包。

---

## 1. 打包流程总览

```
npm run build:app          # CLI 编译发行资源
       ↓
HBuilderX 打开项目根目录
       ↓
发行 → 原生 App - 云打包
       ↓
下载 APK / IPA → 安装到手机
```

| 阶段 | 工具 | 产物 |
|---|---|---|
| 编译资源 | `npm run build:app` | `dist/build/app/`（前端资源，非安装包） |
| 生成安装包 | HBuilderX 云打包 | `.apk` / `.ipa` |

---

## 2. 前置条件

| 项 | 说明 |
|---|---|
| Node.js | **18 LTS**（`nvm use 18`） |
| 依赖 | `npm install` |
| HBuilderX | 4.41+，[下载地址](https://www.dcloud.io/hbuilderx.html) |
| DCloud 账号 | 云打包需登录 [dev.dcloud.net.cn](https://dev.dcloud.net.cn/) |

### 2.1 Android APK 额外要求

| 场景 | 证书 |
|---|---|
| **快速测试** | 使用 **DCloud 公用测试证书**（仅测试，不可上架） |
| **正式发行** | 自有 `.keystore`（见 §5.1） |

### 2.2 iOS IPA 额外要求

| 场景 | 要求 |
|---|---|
| **真机调试（不打 IPA）** | Mac + Xcode + **运行到 iOS 基座**（见 §6） |
| **Ad Hoc 内测 IPA** | Apple 开发者账号 + 证书 + 描述文件 + 设备 UDID |
| **TestFlight / 上架** | 付费开发者账号（$99/年） |

---

## 3. 两种 AppID 别搞混 ⚠️

| 类型 | 字段位置 | 格式 | 用途 |
|---|---|---|---|
| **DCloud AppID** | `manifest.json` 根节点 `"appid"` | `__UNI__xxxxxxx` | **云打包必用**，在 HBuilderX / 开发者中心申请 |
| **微信小程序 AppID** | `manifest.json` → `mp-weixin.appid` | `wx...` | 仅微信小程序，与云打包 App 无关 |

当前项目：

| 项 | 值 | 状态 |
|---|---|---|
| DCloud AppID | `__UNI__uniappMudular` | ⚠️ **占位符，云打包会报错，需重新获取** |
| 微信 AppID | `wx3df8fe4fe3029c86` | ✅ 已配置 |

### 获取有效 DCloud AppID（云打包前必做）

1. HBuilderX 用 **1007922322@qq.com** 登录（与云打包同一账号）
2. 打开 `src/manifest.json` → 切换到 **「基础配置」可视化界面**
3. 找到 **应用标识（AppID）** → 点击 **「重新获取」**
4. 按提示在 [开发者中心](https://dev.dcloud.net.cn/) 创建/绑定应用
5. 保存后 `appid` 会变成类似 `__UNI__A1B2C3D` 的真实 ID
6. **重新提交云打包**

CLI 项目若可视化界面不好用，也可在 [dev.dcloud.net.cn](https://dev.dcloud.net.cn/) → **我的应用 → 创建应用**，再把生成的 AppID 手动写入 `manifest.json` 根节点 `"appid"`。

---

## 4. manifest 打包配置（本项目）

以下字段已在 `src/manifest.json` 中配置，云打包前请确认：

| 字段 | 当前值 | 说明 |
|---|---|---|
| `appid` | `__UNI__uniappMudular` | DCloud 应用标识，云打包关联用 |
| `versionName` | 与 `package.json` 对齐 | 用户可见版本号 |
| `versionCode` | 整数递增 | Android 版本码 |
| `app-plus.distribute.android.packagename` | `com.uniapp.mudular` | Android 包名，上架后不可改 |
| `app-plus.distribute.ios.bundleid` | `com.uniapp.mudular` | iOS Bundle ID，与苹果后台一致 |

> 上架前请将包名 / Bundle ID 改为你公司/个人正式域名反写格式，并在 HBuilderX **manifest 可视化界面** 补充应用图标、启动图。

---

## 5. 第一步：CLI 编译发行资源

```bash
cd /path/to/uniapp_Mudular
nvm use 18
npm install

# 全平台 App 资源
npm run build:app

# 或分平台
npm run build:app-android
npm run build:app-ios
```

成功后在 `dist/build/` 下生成 App 资源（**不是** APK/IPA）。

---

## 6. 第二步：HBuilderX 云打包

### 6.1 打开项目

1. HBuilderX → **文件 → 打开目录**
2. 选择项目**根目录**（含 `src/manifest.json`、`package.json`）
3. 确认 HBuilderX **设置 → node.path** 指向 Node 18

### 6.2 打 Android APK

1. 菜单：**发行 → 原生 App - 云打包**
2. 勾选 **Android（apk）**
3. 证书选择：
   - 测试：**使用 DCloud 公用证书**
   - 正式：上传 keystore，填写别名与密码
4. 点击 **打包**，等待完成
5. [开发者中心](https://dev.dcloud.net.cn/) → 应用管理 → 下载 **.apk**

**安装到手机：**

- 将 APK 传到 Android 手机
- 设置中允许「安装未知来源应用」
- 点击 APK 安装

### 6.3 打 iOS IPA

1. **发行 → 原生 App - 云打包**
2. 勾选 **iOS（ipa）**
3. 填写 / 上传：
   - **Bundle ID**（与 manifest 中 `bundleid` 一致）
   - **私钥证书**（.p12）及密码
   - **描述文件**（.mobileprovision）
4. 选择打包类型：
   - **ad hoc**：指定设备内测
   - **app-store**：提交 App Store
5. 打包完成后下载 **.ipa**

**IPA 安装方式：**

| 方式 | 适用 |
|---|---|
| **TestFlight** | 团队测试，需付费开发者账号 |
| **Ad Hoc + 工具** | 蒲公英、fir.im 等内测平台 |
| **Xcode / Apple Configurator** | 数据线安装到已注册 UDID 的设备 |

---

## 7. 开发阶段：不打安装包，直接真机调试

日常开发推荐 **基座调试**，无需每次云打包：

```
HBuilderX → 运行 → 运行到手机或模拟器
  → 运行到 Android App 基座
  → 运行到 iOS App 基座
```

| 平台 | 要求 |
|---|---|
| Android | USB 调试、安装 HBuilder 调试基座 |
| iOS | Mac + Xcode + 数据线 + Apple ID |

CLI 可先执行 `npm run dev:app-android` 或 `npm run dev:app-ios` 生成开发资源。

---

## 8. 自建 Android 签名（正式 APK）

```bash
keytool -genkey -v -keystore uniapp-mudular.keystore \
  -alias uniapp_mudular -keyalg RSA -keysize 2048 -validity 10000
```

- **keystore 文件与密码务必备份**，丢失无法更新同一应用
- 云打包时上传该 keystore，不要提交到 Git

建议本地保存路径（已在 `.gitignore` 忽略）：

```
项目外安全目录/uniapp-mudular.keystore
```

---

## 9. iOS 证书简要说明

1. 登录 [Apple Developer](https://developer.apple.com/)
2. **Certificates** 创建 iOS Distribution / Development 证书
3. **Identifiers** 注册与 `bundleid` 一致的 App ID
4. **Devices** 登记测试机 UDID（Ad Hoc 需要）
5. **Profiles** 生成描述文件并下载
6. 导出 .p12 私钥，在云打包表单中上传

> AppSecret、.p12 密码、keystore 密码等**不要**写入仓库或 `.env` 提交文件。

---

## 10. 常见问题

### Q: 报错「需重新验证手机号后才能继续打包」

**原因：** DCloud 账号未完成或手机号验证过期。

**处理：**

1. 打开 [https://dev.dcloud.net.cn/pages/user/info](https://dev.dcloud.net.cn/pages/user/info)
2. 登录 `1007922322@qq.com`
3. 按页面提示 **重新验证手机号**
4. 验证通过后 **重新提交云打包**

---

### Q: 报错「manifest.json 中的 AppID 无效」

**原因：** 根节点 `"appid": "__UNI__uniappMudular"` 是占位符，不是开发者中心注册的真实 DCloud AppID。

**处理：** 见本文 **§3 获取有效 DCloud AppID**。

---

### Q: Warning「Android 包名尚未在开发者中心录入」

**原因：** `com.uniapp.mudular` 还未在 DCloud 应用详情里登记。

**处理（二选一）：**

1. **继续打包** — 会自动添加为 Android 测试包名（测试够用）
2. **手动添加** — [开发者中心](https://dev.dcloud.net.cn/) → 你的应用 → **应用详情 → 各平台信息** → 添加 Android 包名

---

### Q: Warning「Android 公共测试证书仅用于测试」

**说明：** 选 DCloud 公用证书时的正常提示，**内测 OK**，正式上架需自有 keystore。

---

### Q: Warning「缺少隐私政策相关配置」

**说明：** 上架**国内应用市场**才必须配置隐私弹窗、权限说明等；仅自己安装测试 **可忽略**。

参考：[如何解决](https://uniapp.dcloud.net.cn/tutorial/app-privacy-android.html)

---

### Q: CLI 能直接输出 APK / IPA 吗？

不能。`npm run build:app*` 只编译 **www 资源**，安装包必须经 HBuilderX 云打包或离线 SDK。

### Q: 云打包排队 / 失败

- 检查 manifest 图标、包名是否填写完整
- 查看 HBuilderX 控制台错误日志
- Node 版本是否为 18，依赖是否完整

### Q: Android 安装提示「应用未安装」

- 包名与已装版本冲突时先卸载旧包
- 目标系统版本过低（本项目 `minSdkVersion: 21`，Android 5.0+）

### Q: iOS 提示「不受信任的开发者」

iPhone：**设置 → 通用 → VPN 与设备管理** → 信任开发者证书。

### Q: 能否在 Xcode 里直接打开本项目？

不能。仓库无 `.xcodeproj`；云打包产物或离线 SDK 才会生成原生工程。

---

## 11. 命令速查

```bash
# 开发
npm run dev:app-android
npm run dev:app-ios

# 发行资源（云打包前必跑）
npm run build:app
npm run build:app-android
npm run build:app-ios

# 其他端
npm run build:h5
npm run build:mp-weixin
npm run sync:mp-appid
```

---

**相关文档：**

- [INIT.md](./INIT.md) — 环境与 HBuilderX 配置
- [DEVELOPMENT.md](./DEVELOPMENT.md) — 日常开发与发布流程
- [uni-app 云打包官方说明](https://uniapp.dcloud.net.cn/tutorial/app-publish.html)
