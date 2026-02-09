# PDF 查看器 Chrome 扩展

## ✨ 功能特性

### 核心功能
- 🎯 自动拦截并使用自定义 PDF.js 查看器打开 PDF 文件
- 📁 支持本地文件（file://）和远程文件（http/https）
- 🌐 已禁用跨域检查，可加载任何来源的 PDF

### 🆕 自定义功能
- 🌙 **夜间模式**：护眼深色主题，长时间阅读更舒适，一键切换日间/夜间模式

---

## 问题原因

您遇到的错误是：
```
You do not have permission to use blocking webRequest listeners
```

这是因为 Chrome Manifest V3 **不再允许**普通扩展使用 `webRequest` API 的 `blocking` 模式。这个权限只对企业强制安装的扩展开放。

## 解决方案

现在使用 **webNavigation.onBeforeNavigate** + **Content Script** + **Wrapper 页面** 的组合方案：

1. `webNavigation.onBeforeNavigate` - 在导航开始时拦截 .pdf URL
2. `content.js` - 检测 Content-Type 为 application/pdf 的页面
3. `viewer-wrapper.html` - 处理本地文件（file://）和远程文件的加载

### 工作原理

- 当用户点击 .pdf 链接时，`onBeforeNavigate` 会捕获并重定向到 wrapper 页面
- **本地文件（file://）**：wrapper 通过 fetch API 读取文件内容，转换为 blob URL 后传递给 PDF.js
- **远程文件（http/https）**：wrapper 直接将 URL 传递给 PDF.js
- 对于没有 .pdf 扩展名但 Content-Type 是 PDF 的页面，content script 会检测并通知 background script

## 如何安装和测试

1. **启用文件访问权限** ⚠️ **重要！**
   - 打开 Chrome，访问 `chrome://extensions/`
   - 找到 "My Custom PDF Viewer" 扩展
   - 点击"详细信息"
   - **向下滚动，启用"允许访问文件网址"**
   - 这样扩展才能打开本地 PDF 文件

2. **重新加载扩展**
   - 在 `chrome://extensions/` 中
   - 开启右上角的"开发者模式"
   - 点击扩展卡片上的"刷新"按钮 🔄

3. **测试本地文件**
   - 将任意 PDF 文件拖入 Chrome 浏览器窗口
   - 或通过菜单 "文件 → 打开文件" 选择 PDF
   - 应该会自动使用自定义查看器打开

4. **测试远程文件**
   - 访问任何 .pdf 链接，例如：
     - https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf
     - https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf
   - 应该会自动使用自定义的 PDF.js 查看器打开
   - 或者打开项目中的 `test.html` 进行测试

5. **测试夜间模式**
   - 在 PDF 查看器右上角找到 🌙 按钮
   - 点击切换夜间/日间模式
   - 观察界面颜色变化

6. **查看控制台**
   - 访问 `chrome://extensions/`
   - 找到您的扩展，点击"Service Worker"
   - 应该能看到 "PDF Extension Installed" 和重定向日志

---

## 🌙 使用夜间模式

### 在 PDF 查看器中
打开任意 PDF 后，在右上角工具栏可以看到夜间模式按钮：

```
[打印] [下载] | [🌙 夜间模式] | [工具]
```

**夜间模式按钮** 🌙/☀️
- 点击切换深色/浅色主题
- 自动保存偏好设置
- 再次打开 PDF 时会记住你的选择
- 图标会随模式切换：🌙（日间） ↔ ☀️（夜间）

### 夜间模式特点
- 深色背景保护眼睛
- PDF 内容颜色自动反转
- 工具栏和侧边栏统一深色主题
- 适合长时间阅读


## 架构说明

```
PDF URL 请求
    ↓
webNavigation.onBeforeNavigate 拦截
    ↓
重定向到 viewer-wrapper.html
    ↓
    ├─ 本地文件 (file://)
    │   ↓
    │   显示文件选择器
    │   ↓
    │   用户选择文件
    │   ↓
    │   FileReader 读取 → blob URL
    │   ↓
    │   传递给 PDF.js
    │
    └─ 远程文件 (http/https)
        ↓
        直接传递 URL 给 PDF.js
        ↓
        PDF.js 加载（已禁用跨域检查）
    ↓
显示 PDF 内容
```

**关键技术点：**
1. 本地文件通过 FileReader API 读取（绕过 file:// 访问限制）
2. 远程文件直接传递 URL
3. 已修改 PDF.js 禁用 origin 验证（允许跨域加载）

## 局限性

### 本方案的限制：

1. **需要手动启用文件访问**：用户必须在扩展设置中启用"允许访问文件网址"
2. **时机问题**：`onBeforeNavigate` 触发时，Chrome 可能已经决定使用内置 PDF 查看器
3. **Content-Type 检测不完美**：某些服务器返回的 PDF 没有正确的 Content-Type
4. **CORS 限制**：某些跨域 PDF 可能无法加载

### 为什么不能用其他方案？

- ❌ `webRequest blocking` - Manifest V3 不允许
- ❌ `declarativeNetRequest` - 无法动态传递 URL 参数
- ✅ **当前方案** - 虽不完美，但是 Manifest V3 下最可行的方案

## 故障排除

### 本地 PDF 无法打开？

1. ✅ 确认已在 `chrome://extensions/` 中启用"允许访问文件网址"
2. ✅ 检查扩展是否已启用
3. ✅ 刷新扩展（点击刷新按钮）
4. ✅ 查看 Service Worker 控制台是否有错误

### 远程 PDF 无法打开？

1. 检查网络连接
2. 查看浏览器控制台是否有错误
3. 某些网站可能有特殊的防护措施（如 Cloudflare、防盗链等）

**注意**：已修改 PDF.js 禁用了 origin 验证，大多数远程 PDF 都能正常加载。

### PDF 被 Chrome 内置查看器打开？

这是已知限制。Chrome 可能在某些情况下优先使用内置查看器。解决方法：
1. 右键点击 PDF 链接
2. 选择"在新标签页中打开链接"
3. 或者复制链接，手动在地址栏粘贴

## 文件说明

- `manifest.json` - 扩展配置文件
- `background.js` - 后台服务脚本，负责拦截和重定向
- `content.js` - 内容脚本，检测 PDF Content-Type
- `viewer-wrapper.html` - 包装页面，提供文件选择器
- `viewer-wrapper.js` - 加载逻辑，处理本地/远程文件
- `pdfjs/` - PDF.js 查看器资源（已修改，禁用 origin 检查）
  - `pdfjs/web/custom-buttons.js` - 夜间模式功能逻辑
  - `pdfjs/web/custom-buttons.css` - 夜间模式样式
- `README.md` - 完整文档
- `SETUP.md` - 快速设置指南
- `LIMITATIONS.md` - 技术限制说明
- `test.html` - 测试页面

## 技术细节

### 关键修改

**`pdfjs/web/viewer.mjs`** (第 18523-18540 行)
```javascript
var validateFileURL = function (file) {
  // 禁用跨域检查 - 允许加载任何 URL
  return;
  // ... 原有的验证代码已被跳过
};
```

这样修改后，PDF.js 可以加载任何 URL 的 PDF，不受同源策略限制。
- `test.html` - 测试页面（包含多个 PDF 链接）



