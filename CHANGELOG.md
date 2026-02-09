# 🎯 问题解决历程

## 遇到的问题和解决方案

### 问题 1: `webRequest blocking` 权限错误 ❌

**错误信息：**
```
You do not have permission to use blocking webRequest listeners
```

**原因：**
- Chrome Manifest V3 禁止普通扩展使用 `webRequest` 的 `blocking` 模式
- 只有企业强制安装的扩展才能使用

**解决方案：** ✅
- 改用 `webNavigation.onBeforeNavigate` API
- 在导航开始时拦截并重定向

---

### 问题 2: 本地文件无法显示内容 ❌

**现象：**
- 扩展可以拦截本地 PDF 文件
- 但 PDF.js 查看器无法显示内容

**原因：**
- Chrome 扩展默认无法访问 `file://` 协议的资源
- 需要用户手动授予"允许访问文件网址"权限

**解决方案：** ✅
- 在 `manifest.json` 中添加 `"file:///*"` 到 `host_permissions`
- 创建 `viewer-wrapper.html` 通过 fetch API 读取文件内容
- 将文件内容转换为 blob URL 后传递给 PDF.js
- **用户必须手动启用"允许访问文件网址"权限**

---

### 问题 3: CSP 内联脚本错误 ❌

**错误信息：**
```
Executing inline script violates the following Content Security Policy directive 'script-src 'self''
```

**原因：**
- Chrome 扩展的内容安全策略禁止内联 JavaScript
- `<script>` 标签内的代码会被阻止执行

**解决方案：** ✅
- 将内联 JavaScript 提取到单独的文件 `viewer-wrapper.js`
- 在 HTML 中使用 `<script src="viewer-wrapper.js"></script>`
- 将脚本文件添加到 `web_accessible_resources`

---

### 问题 4: PDF.js 跨域安全检查 ❌

**错误信息：**
```
Error: file origin does not match viewer's
```

**原因：**
- PDF.js 有安全检查，不允许加载不同源的文件
- 直接传递远程 URL 会触发这个错误

**解决方案：** ✅
- 将文件内容转换为 blob URL（blob URL 是同源的）
- 本地文件：直接 fetch
- 远程文件：通过 background script 代理

---

### 问题 5: CORS 限制 + PDF.js Origin 检查 ❌

**错误信息：**
```
1. Access to fetch at 'https://...' has been blocked by CORS policy
2. Error: file origin does not match viewer's
```

**原因：**
1. 远程网站没有设置 `Access-Control-Allow-Origin` 头
2. PDF.js 内部有 origin 验证，拒绝加载不同源的文件

**最终解决方案：** ✅
- **直接修改 PDF.js 源码**
- 在 `pdfjs/web/viewer.mjs` 的 `validateFileURL` 函数开始处直接返回
- 完全禁用 origin 验证
- 这样 PDF.js 可以尝试加载任何 URL
- 对于本地文件，提供文件选择器让用户手动选择

---

### 问题 6: 本地文件访问限制 ❌

**错误信息：**
```
Not allowed to load local resource: file:///...
```

**原因：**
- 即使启用"允许访问文件网址"，扩展仍无法直接 fetch file:// URL
- Chrome 的安全策略严格限制

**最终解决方案：** ✅
- 显示文件选择器 `<input type="file">`
- 用户手动选择 PDF 文件
- 使用 FileReader API 读取文件内容
- 转换为 blob URL 后传递给 PDF.js
- **100% 可靠，不受任何限制**

---

## 最终架构

```
用户打开 PDF 文件/链接
         ↓
webNavigation.onBeforeNavigate 拦截
         ↓
重定向到 viewer-wrapper.html
         ↓
viewer-wrapper.js 判断文件类型：
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
        PDF.js 加载（已禁用 origin 检查）
         ↓
显示 PDF 内容 ✅
```

---

## 关键要点

1. **Manifest V3 限制**
   - 不能使用 `webRequest blocking`
   - 必须使用 `webNavigation` 拦截

2. **本地文件访问**
   - 无法直接 fetch file:// URL
   - 使用文件选择器 + FileReader API 解决

3. **CSP 限制**
   - 不能使用内联 JavaScript
   - 必须使用外部脚本文件

4. **PDF.js 安全检查**
   - 原本会拒绝不同 origin 的文件
   - 修改源码禁用 validateFileURL 检查

5. **CORS 限制**
   - 即使 background script 也受 CORS 限制
   - 通过禁用 PDF.js 的 origin 检查解决
   - PDF.js 会尝试加载，成功与否取决于服务器

---

## 文件列表

| 文件 | 说明 |
|------|------|
| `manifest.json` | 扩展配置，声明权限和资源 |
| `background.js` | 后台脚本，拦截 PDF 请求 |
| `content.js` | 内容脚本，检测 PDF Content-Type |
| `viewer-wrapper.html` | 包装页面 |
| `viewer-wrapper.js` | 加载逻辑，处理文件转 blob URL |
| `pdfjs/` | PDF.js 查看器 |
| `README.md` | 完整文档 |
| `SETUP.md` | 快速设置指南 |
| `test.html` | 测试页面 |

---

## 使用说明

### 安装步骤

1. 在 `chrome://extensions/` 加载扩展
2. **启用"允许访问文件网址"** ⚠️ 必须！
3. 刷新扩展

### 测试步骤

- **本地文件**：拖入浏览器窗口
- **远程文件**：访问 PDF 链接或打开 `test.html`

---

## 已知限制

1. 本地 PDF 需要用户手动选择文件（无法自动打开）
2. 远程 PDF 取决于服务器配置（某些有防护措施的网站可能仍然无法加载）
3. 无法 100% 拦截所有 PDF（Chrome 内置查看器可能优先）
4. iframe 嵌入的 PDF 较难拦截

**但这已经是 Manifest V3 下最可行且最可靠的方案！** ✅

