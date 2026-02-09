# ⚠️ 重要说明 - Manifest V3 的限制

## 当前状态

经过多次尝试，我们遇到了 Chrome Manifest V3 的根本性限制：

### 已尝试的方案

1. ❌ **webRequest blocking** - Manifest V3 完全禁止
2. ❌ **declarativeNetRequest** - 无法动态传递 URL 参数
3. ❌ **Background script fetch** - 仍然受 CORS 限制（即使在 Service Worker 中）
4. ❌ **Direct fetch in page** - 受 CORS 限制
5. ❌ **本地文件直接访问** - 即使启用"允许访问文件网址"，仍然被阻止

### 根本问题

**Manifest V3 的 Service Worker 环境与传统 background page 不同：**
- Service Worker 仍然受 CORS 策略限制
- 无法使用 XMLHttpRequest（只能用 fetch）
- fetch API 在扩展中也受 CORS 限制

## 当前最简方案

直接将 URL 传递给 PDF.js，让它自己尝试加载：
- ✅ 对于**同源**或**允许 CORS** 的 PDF 可以正常工作
- ❌ 对于**不允许 CORS** 的 PDF（如 arxiv.org）无法加载
- ❌ 对于**本地文件**，Chrome 安全策略阻止访问

## 可行的替代方案

### 方案 A：用户手动上传（推荐）

添加一个文件选择器，让用户上传 PDF：

```html
<input type="file" accept=".pdf" onchange="loadFile(this.files[0])">
```

**优点：**
- ✅ 绕过所有 CORS 和文件访问限制
- ✅ 100% 可靠
- ✅ 用户可以打开任何本地 PDF

**缺点：**
- ❌ 需要用户手动操作
- ❌ 无法自动拦截 PDF 链接

### 方案 B：使用 Native Messaging

通过 Native Messaging 调用本地程序：

**优点：**
- ✅ 可以绕过所有浏览器限制
- ✅ 可以访问本地文件系统

**缺点：**
- ❌ 需要用户安装额外的本地程序
- ❌ 复杂度高

### 方案 C：使用代理服务器

架设一个代理服务器来转发 PDF 请求：

**优点：**
- ✅ 可以绕过 CORS 限制

**缺点：**
- ❌ 需要维护服务器
- ❌ 隐私问题
- ❌ 需要网络连接

### 方案 D：降级到 Manifest V2

使用 Manifest V2（仍然支持到 2024 年）：

**优点：**
- ✅ 可以使用 `webRequest blocking`
- ✅ 可以完美拦截所有 PDF

**缺点：**
- ❌ Chrome 将来会停止支持
- ❌ 无法发布到 Chrome Web Store（新扩展）

## 建议

### 对于您的使用场景

如果您主要是：

1. **打开本地 PDF** → 建议添加文件上传功能（方案 A）
2. **拦截网页 PDF 链接** → 当前方案已经是最好的了（仅限支持 CORS 的网站）
3. **需要完美兼容** → 考虑 Native Messaging（方案 B）或 Manifest V2（方案 D）

### 最简单的解决方案

**添加文件上传功能：**

我可以修改 `viewer-wrapper.html`，添加一个文件选择器，让用户可以手动选择并打开任何 PDF 文件（包括本地文件）。这样：
- ✅ 本地文件可以正常打开
- ✅ 不受任何 CORS 限制
- ❌ 但无法自动拦截

您想要我实现这个方案吗？

## Chrome 扩展开发的现实

Chrome Manifest V3 的设计目标是提高安全性和隐私性，但也带来了很多限制：
- 扩展的能力被大幅削弱
- 很多在 V2 中可行的方案在 V3 中不再可行
- 开发者需要在功能和限制之间做权衡

这不是您的代码问题，而是 Chrome 平台的限制。

